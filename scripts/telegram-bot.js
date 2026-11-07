/**
 * Mintera LMS — Rasmiy Telegram Bot Xizmati
 * 
 * Ushbu skript Telegram Bot API bilan doimiy aloqada bo'lib (Long-Polling),
 * foydalanuvchilar va o'quv guruhlariga /start, /id, /help buyruqlari bo'yicha
 * javob qaytaradi hamda guruhlarga avtomatik hisobotlar yuboradi.
 * Shuningdek, botni Telegram guruhlariga 1 bosish bilan qo'shish (Add to Group)
 * imkoniyatini taqdim etadi.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. .env faylidan TOKEN ni o'qish
function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        // Qo'shtirnoqlarni olib tashlash ("..." yoki '...')
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const HTTP_PORT = 4005;
let currentBotUsername = (process.env.TELEGRAM_BOT_USERNAME || 'MinteraAi_bot').replace('@', '').trim();
let currentBotId = 0;

// Ulangan guruhlarni saqlash tizimi (Persistent Cache)
const GROUPS_FILE = path.resolve(__dirname, '..', 'data', 'telegram-groups.json');

function loadKnownGroups() {
  try {
    if (fs.existsSync(GROUPS_FILE)) {
      const raw = fs.readFileSync(GROUPS_FILE, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return new Map(list.map((g) => [String(g.id), g]));
      }
    }
  } catch (err) {
    console.warn('[Telegram Bot] Guruhlar faylini o‘qishda eslatma:', err.message);
  }
  return new Map();
}

const knownGroups = loadKnownGroups();

function saveKnownGroups() {
  try {
    const dir = path.dirname(GROUPS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(Array.from(knownGroups.values()), null, 2), 'utf-8');
  } catch (err) {
    console.error('[Telegram Bot] Guruhlarni saqlash xatosi:', err.message);
  }
}

function registerGroup(chatId, title, type = 'group') {
  if (!chatId) return;
  const idStr = String(chatId);
  const existing = knownGroups.get(idStr) || {};
  const groupObj = {
    id: idStr,
    title: title || existing.title || 'O‘quv Guruhi',
    type: type || existing.type || 'group',
    updatedAt: new Date().toISOString(),
    addedAt: existing.addedAt || new Date().toISOString(),
  };
  knownGroups.set(idStr, groupObj);
  saveKnownGroups();
  console.log(`[Telegram Bot] 📌 Guruh ro‘yxatga olindi: "${groupObj.title}" (${idStr})`);
}

// Telegram API so'rov yuborish yordamchisi
function telegramRequest(method, payload = {}) {
  const currentToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(payload);
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${currentToken}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
      },
      timeout: 35000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.ok) {
            console.error(`[Telegram API Xatosi] ${method}: [${parsed.error_code}] ${parsed.description}`);
          }
          resolve(parsed);
        } catch (err) {
          reject(new Error(`JSON Parse xatosi: ${data.slice(0, 100)}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Telegram API Timeout'));
    });

    req.write(bodyStr);
    req.end();
  });
}

// Xabar yuborish (Smart Candidate Retry bilan)
async function sendMessage(chatId, text, options = {}) {
  const rawChat = String(chatId || '').trim();
  const candidates = [rawChat];

  if (/^\d+$/.test(rawChat)) {
    if (rawChat.startsWith('100')) {
      candidates.push(`-${rawChat}`);
    } else {
      candidates.push(`-100${rawChat}`);
      candidates.push(`-${rawChat}`);
    }
  } else if (rawChat.startsWith('-') && !rawChat.startsWith('-100')) {
    candidates.push(`-100${rawChat.slice(1)}`);
  }

  let lastRes = null;
  for (const cId of candidates) {
    try {
      let res = await telegramRequest('sendMessage', {
        chat_id: cId,
        text: text,
        parse_mode: 'HTML',
        ...options,
      });

      if (res && res.ok) {
        return res;
      }

      // Agar HTML yoki URL xatosi tufayli rad etilgan bo'lsa, oddiy matn sifatida sinash
      if (
        res &&
        !res.ok &&
        res.description &&
        (res.description.includes("can't parse entities") || res.description.includes('BUTTON_URL_INVALID'))
      ) {
        const plainText = text.replace(/<[^>]*>/g, '');
        const plainRes = await telegramRequest('sendMessage', {
          chat_id: cId,
          text: plainText,
        });
        if (plainRes && plainRes.ok) return plainRes;
      }
      lastRes = res;
    } catch (err) {
      console.error(`[Telegram Bot] Xabar yuborishda xatolik (${cId}):`, err.message);
    }
  }
  return lastRes;
}

// Inline Callback queryga javob qaytarish
async function answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
  try {
    await telegramRequest('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: text,
      show_alert: showAlert,
    });
  } catch (err) {
    console.error('[Telegram Bot] Callback query xatosi:', err.message);
  }
}

// Xabarlarni qayta ishlash
async function handleUpdate(update) {
  let webUrl = (process.env.WEB_APP_URL || '').trim();
  if (!webUrl || webUrl.includes('localhost') || webUrl.includes('127.0.0.1')) {
    webUrl = 'https://mintera.orifdev.uz';
  }
  const addToGroupUrl = `https://t.me/${currentBotUsername}?startgroup=admin`;

  // 0. Bot guruhga a'zo qilinganda yoki adminlik berilganda (my_chat_member)
  if (update.my_chat_member) {
    const mcm = update.my_chat_member;
    const chatId = mcm.chat.id;
    const chatTitle = mcm.chat.title || 'O‘quv Guruhi';
    const newStatus = mcm.new_chat_member?.status;
    const isGroup = mcm.chat.type === 'group' || mcm.chat.type === 'supergroup' || mcm.chat.type === 'channel';

    console.log(`[Telegram Bot] A'zolik yangilanishi: "${chatTitle}" (${chatId}) -> ${newStatus}`);

    if (isGroup && (newStatus === 'member' || newStatus === 'administrator')) {
      registerGroup(chatId, chatTitle, mcm.chat.type);

      await sendMessage(
        chatId,
        `🎉 <b>Assalomu alaykum!</b>\n\n` +
        `<b>Mintera Ta'lim Platformasi Boti</b> «<b>${chatTitle}</b>» guruhiga muvaffaqiyatli ulandi! 🚀\n\n` +
        `🏢 <b>Guruh nomi:</b> <code>${chatTitle}</code>\n` +
        `🆔 <b>Ushbu guruhning Chat ID si:</b>\n<code>${chatId}</code>\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `💡 <b>O‘qituvchi va Administratorlar uchun yo‘riqnoma:</b>\n` +
        `1️⃣ Yuqoridagi Chat ID ni bosing (nusxalanadi);\n` +
        `2️⃣ <a href="${webUrl}/groups">Mintera Platformasi</a>dagi <b>«Guruhlar»</b> bo‘limiga kiring;\n` +
        `3️⃣ Tegishli guruh tahririda <b>Telegram Chat ID</b> maydoniga joylang;\n` +
        `4️⃣ Botga guruhda <b>Administrator</b> huquqini bering.\n\n` +
        `✅ Shundan so‘ng o‘quvchilar test yechganda natijalar, yangi topshiriqlar va hisobotlar avtomatik shu guruhga yetkaziladi!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📋 Chat ID ni nusxalash', callback_data: `copy_id_${chatId}` },
              ],
              [
                { text: '🌐 Mintera Guruhlar Bo‘limi', url: `${webUrl}/groups` },
              ],
            ],
          },
        }
      );
      return;
    }
  }

  // 1. Matnli xabarlar
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
    const text = (msg.text || '').trim();
    const fromUser = msg.from || {};
    const userName = fromUser.first_name || fromUser.username || 'Foydalanuvchi';
    const chatTitle = msg.chat.title || 'O‘quv Guruhi';

    if (isGroup) {
      registerGroup(chatId, chatTitle, msg.chat.type);
    }

    console.log(`[Telegram Bot] Yangi xabar: "${text}" from ${userName} (chat: ${chatId})`);

    // Guruhga yangi a'zo qo'shilganda (bot qo'shilganda)
    if (msg.new_chat_members && msg.new_chat_members.length > 0) {
      const isMeAdded = msg.new_chat_members.some(
        (m) => m.id === currentBotId || m.username === currentBotUsername || (m.is_bot && m.username?.toLowerCase().includes('mintera'))
      );
      if (isMeAdded) {
        registerGroup(chatId, chatTitle, msg.chat.type);
        await sendMessage(
          chatId,
          `🎉 <b>Assalomu alaykum!</b>\n\n` +
          `<b>Mintera Ta'lim Platformasi Boti</b> «<b>${chatTitle}</b>» guruhiga muvaffaqiyatli qo‘shildi! 🚀\n\n` +
          `🏢 <b>Guruh nomi:</b> <code>${chatTitle}</code>\n` +
          `🆔 <b>Ushbu guruhning Chat ID si:</b>\n<code>${chatId}</code>\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `💡 <b>O‘qituvchi va Administratorlar uchun:</b>\n` +
          `1️⃣ Yuqoridagi Chat ID ni bosing (nusxalanadi);\n` +
          `2️⃣ <a href="${webUrl}/groups">Mintera Guruhlar Bo‘limi</a>ga kirib, guruh sozlamasiga shu ID ni kiriting;\n` +
          `3️⃣ Botga guruhda <b>Administrator</b> huquqini bering.\n\n` +
          `Shundan so‘ng hisobotlar va test natijalari avtomatik shu yerda ko‘rinadi!`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '📋 Chat ID ni nusxalash', callback_data: `copy_id_${chatId}` },
                ],
                [
                  { text: '🌐 Mintera Platformasi', url: `${webUrl}/groups` },
                ],
              ],
            },
          }
        );
        return;
      }
    }

    // /start buyrug'i
    if (text.startsWith('/start')) {
      if (isGroup) {
        await sendMessage(
          chatId,
          `👥 <b>Mintera Guruh Boti Muvaffaqiyatli Ulandi!</b>\n\n` +
          `🏢 <b>Guruh nomi:</b> <code>${chatTitle}</code>\n` +
          `🆔 <b>Ushbu guruhning Chat ID si:</b>\n<code>${chatId}</code>\n\n` +
          `<i>(Ushbu ID ni Mintera boshqaruv panelidagi "Guruhlar" bo‘limida tegishli guruhga kiriting).</i>`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '📋 ID ni nusxalash', callback_data: `copy_id_${chatId}` },
                ],
                [
                  { text: '🌐 Mintera Platformasi', url: `${webUrl}/groups` },
                ],
              ],
            },
          }
        );
      } else {
        // Shaxsiy chatda /start
        await sendMessage(
          chatId,
          `👋 <b>Assalomu alaykum, ${userName}!</b>\n\n` +
          `<b>Mintera Ta'lim Platformasi</b>ning rasmiy botiga xush kelibsiz! 🚀\n\n` +
          `Ushbu bot orqali o‘quv markazlari va dasturlash guruhlariga test natijalari, hisobotlar hamda dars eslatmalari avtomatik yetkazib beriladi.\n\n` +
          `📌 <b>Sizning shaxsiy Telegram ID:</b> <code>${chatId}</code>\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `👥 <b>BOTNI O‘QUV GURUHIGA ULASH:</b>\n` +
          `1️⃣ Pastdagi <b>«➕ Botni Guruhga Qo‘shish»</b> tugmasini bosing;\n` +
          `2️⃣ O‘quv guruhingizni tanlang va botni qo‘shing;\n` +
          `3️⃣ Bot guruhda o‘z <b>Chat ID</b> raqamini chiqaradi;\n` +
          `4️⃣ Shu ID ni <a href="${webUrl}/groups">Mintera platformasi</a>dagi "Guruhlar" bo‘limiga kiriting!`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '➕ Botni Guruhga Qo‘shish', url: addToGroupUrl },
                ],
                [
                  { text: '🌐 Mintera Platformasi', url: webUrl },
                ],
                [
                  { text: '📋 Mening ID raqamim', callback_data: `my_id_${chatId}` },
                  { text: 'ℹ️ Yordam', callback_data: 'help_info' },
                ],
              ],
            },
          }
        );
      }
      return;
    }

    // /id, /chatid, /group_id buyruqlari
    if (text.startsWith('/id') || text.startsWith('/chatid') || text.startsWith('/group_id')) {
      if (isGroup) {
        await sendMessage(
          chatId,
          `🆔 <b>Guruh Chat ID ma'lumoti:</b>\n\n` +
          `🏢 <b>Guruh:</b> <code>${chatTitle}</code>\n` +
          `📌 <b>Chat ID:</b> <code>${chatId}</code>\n` +
          `Chat turi: <i>${msg.chat.type}</i>\n\n` +
          `<i>Mintera panelida ushbu Chat ID ni kiritib, hisobotlarni shu yerga qabul qilishingiz mumkin.</i>`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '📋 ID ni nusxalash', callback_data: `copy_id_${chatId}` },
                ],
              ],
            },
          }
        );
      } else {
        await sendMessage(
          chatId,
          `🆔 <b>Sizning shaxsiy Telegram ID:</b>\n<code>${chatId}</code>\n\n` +
          `💡 <i>Agar o‘quv guruhi ID sini bilmoqchi bo‘lsangiz, botni o‘quv guruhingizga qo‘shing va guruh ichida <code>/id</code> deb yozing.</i>`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '➕ Botni Guruhga Qo‘shish', url: addToGroupUrl },
                ],
              ],
            },
          }
        );
      }
      return;
    }

    // /help buyrug'i
    if (text.startsWith('/help')) {
      await sendMessage(
        chatId,
        `ℹ️ <b>Mintera Boti — Yordam va Qo‘llanma</b>\n\n` +
        `Mavjud buyruqlar:\n` +
        `🔹 <code>/start</code> — Botni ishga tushirish va asosiy menyu\n` +
        `🔹 <code>/id</code> — Chat yoki guruh ID sini aniqlash\n` +
        `🔹 <code>/status</code> — Botning platforma bilan aloqasini tekshirish\n` +
        `🔹 <code>/help</code> — Yordam ma'lumotlari\n\n` +
        `➕ <b>Botni guruhga ulash uchun:</b> pastdagi tugmani bosing va guruhingizni tanlang.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '➕ Botni Guruhga Qo‘shish', url: addToGroupUrl },
              ],
            ],
          },
        }
      );
      return;
    }

    // /status buyrug'i
    if (text.startsWith('/status')) {
      await sendMessage(
        chatId,
        `✅ <b>Mintera Bot Tizimi Faol!</b>\n\n` +
        `⏱ <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}\n` +
        `🤖 <b>Bot nomi:</b> @${currentBotUsername}\n` +
        `👥 <b>Ulangan guruhlar soni:</b> ${knownGroups.size} ta\n` +
        `📡 <b>Aloqa:</b> 100% Barqaror\n` +
        `🏢 <b>Platforma:</b> Mintera LMS v2.4 (Active)`
      );
      return;
    }
  }

  // 2. Callback querylar (Tugmalar bosilganda)
  if (update.callback_query) {
    const cb = update.callback_query;
    const data = cb.data || '';
    const chatId = cb.message?.chat?.id;

    if (data.startsWith('copy_id_') || data.startsWith('my_id_')) {
      const targetId = data.replace('copy_id_', '').replace('my_id_', '') || chatId;
      await answerCallbackQuery(cb.id, `ID: ${targetId}`, true);
      await sendMessage(chatId, `📌 <b>Chat ID:</b> <code>${targetId}</code>\n<i>(Nusxalash uchun ID ustiga bosing)</i>`);
    } else if (data === 'help_info') {
      await answerCallbackQuery(cb.id, 'Qo‘llanma');
      await sendMessage(
        chatId,
        `📖 <b>Tezkor Yo‘riqnoma:</b>\n\n` +
        `1. «➕ Botni Guruhga Qo‘shish» tugmasini bosing;\n` +
        `2. Guruhingizni tanlang va botga Admin huquqini bering;\n` +
        `3. Bot guruhga yozgan Chat ID ni nusxalang;\n` +
        `4. Mintera saytida «Guruhlar» bo‘limiga kiriting;\n` +
        `5. O‘qituvchi hisobot yuborganda natijalar avtomatik shu yerda ko‘rinadi!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '➕ Botni Guruhga Qo‘shish', url: addToGroupUrl },
              ],
            ],
          },
        }
      );
    } else {
      await answerCallbackQuery(cb.id);
    }
  }
}

// Long-polling tsikli
let lastUpdateId = 0;
let isPolling = false;

async function pollUpdates() {
  if (isPolling) return;
  isPolling = true;

  try {
    const res = await telegramRequest('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 25,
      allowed_updates: ['message', 'callback_query', 'my_chat_member', 'chat_member'],
    });

    if (res && res.ok && Array.isArray(res.result)) {
      for (const update of res.result) {
        lastUpdateId = Math.max(lastUpdateId, update.update_id);
        try {
          await handleUpdate(update);
        } catch (updateErr) {
          console.error('[Telegram Bot] Update qayta ishlashda xatolik:', updateErr.message);
        }
      }
    } else if (res && !res.ok) {
      console.error(`[Telegram Bot] Polling xatosi: ${res.description || JSON.stringify(res)}`);
      if (res.error_code === 401 || res.error_code === 404) {
        isPolling = false;
        setTimeout(checkAndPoll, 10000);
        return;
      }
    }
  } catch (err) {
    // Tarmoq xatosi bo'lsa qisqa tanaffus
    await new Promise((r) => setTimeout(r, 3000));
  } finally {
    isPolling = false;
    // Darhol keyingi so'rovni yuborish
    setImmediate(pollUpdates);
  }
}

// Mahalliy HTTP Server (Web frontenddan to'g'ridan-to'g'ri xabar jo'natish va guruhlar ro'yxatini olish uchun)
const server = http.createServer(async (req, res) => {
  // CORS sarlavhalari
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  if (url === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      bot: currentBotUsername,
      botId: currentBotId,
      online: true,
      addToGroupUrl: `https://t.me/${currentBotUsername}?startgroup=admin`,
      groupsCount: knownGroups.size,
    }));
    return;
  }

  if (url === '/api/groups' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      groups: Array.from(knownGroups.values()),
      count: knownGroups.size,
    }));
    return;
  }

  if (url === '/api/send-message' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { chatId, text } = payload;
        if (!chatId || !text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'chatId va text maydonlari shart' }));
          return;
        }

        const telegramRes = await sendMessage(chatId, text);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(telegramRes || { ok: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // O'quvchi topshiriq topshirganda FAQAT o'z guruhiga xabar yuborish (Strict Group Isolation)
  if (url === '/api/student-submission' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { studentName, groupName, telegramChatId, problemTitle, status, passedTests, totalTests } = payload;

        if (!telegramChatId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'telegramChatId talab qilinadi' }));
          return;
        }

        const isAccepted = status === 'accepted';
        const icon = isAccepted ? '🏆' : '⚠️';
        const statusText = isAccepted ? 'Muvaffaqiyatli topshirildi (100%)' : 'Xatolik aniqlandi';

        const text =
          `${icon} <b>YANGI TOPSHIRIQ NATIJASI</b>\n\n` +
          `👤 <b>O‘quvchi:</b> ${studentName || 'O‘quvchi'}\n` +
          `🏢 <b>Guruh:</b> <code>${groupName || 'O‘quv Guruhi'}</code>\n` +
          `📝 <b>Masala:</b> ${problemTitle || 'Topshiriq'}\n` +
          `📊 <b>Testlar:</b> ${passedTests || 0} / ${totalTests || 0} ta o‘tdi\n` +
          `📌 <b>Holat:</b> ${statusText}\n` +
          `⏱ <b>Vaqt:</b> ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}\n\n` +
          `<i>🔒 Ushbu xabar FAQAT «${groupName || 'ushbu guruh'}» uchun yuborildi (boshqa guruhlarga yuborilmaydi).</i>`;

        const telegramRes = await sendMessage(telegramChatId, text);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(telegramRes || { ok: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Web paneldan kelgan yangi Telegram Bot Tokenni qabul qilish va .env faylga saqlash
  if (url === '/api/set-token' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { token } = payload;
        const cleanToken = (token || '').trim();

        if (!cleanToken) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Telegram Bot Token talab qilinadi!' }));
          return;
        }

        // 1. Yangi tokenni Telegram API (getMe) orqali tekshirish
        const verifyRes = await new Promise((resolve) => {
          const reqTlg = https.request(
            {
              hostname: 'api.telegram.org',
              port: 443,
              path: `/bot${cleanToken}/getMe`,
              method: 'GET',
              timeout: 10000,
            },
            (r) => {
              let d = '';
              r.on('data', (chk) => (d += chk));
              r.on('end', () => {
                try {
                  resolve(JSON.parse(d));
                } catch {
                  resolve({ ok: false, description: 'Telegram javobini tahlil qilib bo‘lmadi' });
                }
              });
            }
          );
          reqTlg.on('error', (err) => resolve({ ok: false, description: err.message }));
          reqTlg.end();
        });

        if (!verifyRes || !verifyRes.ok) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              ok: false,
              error: `Telegram xatosi: ${verifyRes?.description || 'Token noto‘g‘ri yoki yaroqsiz!'}`,
            })
          );
          return;
        }

        const botInfo = verifyRes.result;
        currentBotUsername = (botInfo.username || '').replace('@', '').trim();
        currentBotId = botInfo.id;
        process.env.TELEGRAM_BOT_TOKEN = cleanToken;
        process.env.TELEGRAM_BOT_USERNAME = currentBotUsername;

        // 2. .env fayliga saqlash
        try {
          const envPath = path.resolve(__dirname, '..', '.env');
          let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
          if (envContent.includes('TELEGRAM_BOT_TOKEN=')) {
            envContent = envContent.replace(/TELEGRAM_BOT_TOKEN=.*/g, `TELEGRAM_BOT_TOKEN=${cleanToken}`);
          } else {
            envContent += `\nTELEGRAM_BOT_TOKEN=${cleanToken}\n`;
          }

          if (currentBotUsername) {
            if (envContent.includes('TELEGRAM_BOT_USERNAME=')) {
              envContent = envContent.replace(/TELEGRAM_BOT_USERNAME=.*/g, `TELEGRAM_BOT_USERNAME=${currentBotUsername}`);
            } else {
              envContent += `\nTELEGRAM_BOT_USERNAME=${currentBotUsername}\n`;
            }
          }

          fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');
          console.log(`[Telegram Bot] 🔑 Yangi token .env ga saqlandi! Bot: "${botInfo.first_name}" (@${currentBotUsername})`);
        } catch (envErr) {
          console.warn('[Telegram Bot] .env yozishda eslatma:', envErr.message);
        }

        // 3. Pollingni qayta boshlash
        isPolling = false;
        setImmediate(pollUpdates);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            ok: true,
            bot: currentBotUsername,
            botName: botInfo.first_name,
            botId: currentBotId,
            message: `Bot muvaffaqiyatli saqlandi va ulandi: @${currentBotUsername}`,
          })
        );
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Botni ishga tushirish
async function startBot() {
  // HTTP serverni har doim ko'tarish
  server.listen(HTTP_PORT, '127.0.0.1', () => {
    console.log(`[Telegram Bot HTTP Server] http://127.0.0.1:${HTTP_PORT} da tinglanmoqda`);
  });

  async function checkAndPoll() {
    loadEnv();
    const currentToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    if (!currentToken || currentToken.length < 20 || currentToken.includes('1234567890:ABCdef')) {
      console.log('[Telegram Bot] Kutilmoqda: .env fayliga haqiqiy TELEGRAM_BOT_TOKEN kiritilishini kutyapti...');
      setTimeout(checkAndPoll, 10000);
      return;
    }

    try {
      const me = await telegramRequest('getMe');
      if (!me.ok) {
        console.log(`[Telegram Bot] Diqqat: Token yaroqsiz (${me.description}). Yangi tokenni .env fayliga yozing.`);
        setTimeout(checkAndPoll, 10000);
        return;
      }
      currentBotUsername = me.result.username || currentBotUsername;
      currentBotId = me.result.id;
      console.log(`[Telegram Bot] ✅ Muvaffaqiyatli ulandi! Bot: "${me.result.first_name}" (@${currentBotUsername})`);
      console.log(`[Telegram Bot] 👥 Guruhga qo‘shish havolasi: https://t.me/${currentBotUsername}?startgroup=admin`);
      console.log('[Telegram Bot] 🚀 Xabarlarni qabul qilish (Long Polling) boshlandi...');
      pollUpdates();
    } catch (err) {
      console.log('[Telegram Bot] Ulanish xatosi:', err.message);
      setTimeout(checkAndPoll, 10000);
    }
  }

  checkAndPoll();
}

startBot();
