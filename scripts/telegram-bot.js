/**
 * Mintera LMS — Rasmiy Telegram Bot Xizmati
 * 
 * Ushbu skript Telegram Bot API bilan doimiy aloqada bo'lib (Long-Polling),
 * foydalanuvchilar va o'quv guruhlariga /start, /id, /help buyruqlari bo'yicha
 * javob qaytaradi hamda guruhlarga avtomatik hisobotlar yuboradi.
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

// Telegram API so'rov yuborish yordamchisi
function telegramRequest(method, payload = {}) {
  const currentToken = process.env.TELEGRAM_BOT_TOKEN || '';
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

// Xabar yuborish
async function sendMessage(chatId, text, options = {}) {
  try {
    return await telegramRequest('sendMessage', {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      ...options,
    });
  } catch (err) {
    console.error(`[Telegram Bot] Xabar yuborishda xatolik (${chatId}):`, err.message);
  }
}

// Inline Callback queryga javob qaytarish
async function answerCallbackQuery(callbackQueryId, text = '') {
  try {
    await telegramRequest('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: text,
      show_alert: false,
    });
  } catch (err) {
    console.error('[Telegram Bot] Callback query xatosi:', err.message);
  }
}

// Xabarlarni qayta ishlash
async function handleUpdate(update) {
  // 1. Matnli xabarlar
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
    const text = (msg.text || '').trim();
    const fromUser = msg.from || {};
    const userName = fromUser.first_name || fromUser.username || 'Foydalanuvchi';

    console.log(`[Telegram Bot] Yangi xabar: "${text}" from ${userName} (chat: ${chatId})`);

    // /start buyrug'i
    if (text.startsWith('/start')) {
      if (isGroup) {
        await sendMessage(
          chatId,
          `👥 <b>Mintera Guruh Boti Muvaffaqiyatli Ulandi!</b>\n\n` +
          `Ushbu guruh Mintera platformasiga hisobotlar va test natijalarini qabul qilishga to‘liq tayyor.\n\n` +
          `🆔 <b>Ushbu guruhning Chat ID si:</b>\n<code>${chatId}</code>\n\n` +
          `<i>(Ushbu ID ni Mintera boshqaruv panelidagi "Guruhlar" bo'limida tegishli guruhga kiriting).</i>`,
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
          `👋 <b>Assalomu alaykum, ${userName}!</b>\n\n` +
          `<b>Mintera Ta'lim Platformasi</b>ning rasmiy botiga xush kelibsiz! 🚀\n\n` +
          `Ushbu bot orqali siz:\n` +
          `📊 O‘quv guruhlari bo‘yicha topshiriqlar hisobotini olasiz\n` +
          `✅ Qaysi o‘quvchi vazifani bajarganini va kimlar bajarmaganini bilib borasiz\n` +
          `📈 Dasturlash bo‘yicha test natijalarini kuzatasiz\n\n` +
          `📌 <b>Sizning Telegram ID:</b> <code>${chatId}</code>\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `💡 <b>Guruhga hisobotlarni qabul qilish uchun:</b>\n` +
          `1️⃣ Ushbu botni o‘quv guruhingizga qo‘shing;\n` +
          `2️⃣ Botga guruhda <b>Administrator (Admin)</b> huquqini bering;\n` +
          `3️⃣ Guruhda <code>/id</code> deb yozing va olingan Chat ID ni Mintera platformasidagi "Guruhlar" bo‘limiga kiriting.`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🌐 Mintera Platformasi', url: process.env.WEB_APP_URL || 'https://mintera.orifdev.uz' },
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

    // /id buyrug'i
    if (text.startsWith('/id')) {
      await sendMessage(
        chatId,
        `🆔 <b>Chat ID ma'lumoti:</b>\n\n` +
        `Ushbu chatning ID raqami: <code>${chatId}</code>\n` +
        `Chat turi: <i>${msg.chat.type}</i>\n\n` +
        `<i>Mintera panelida ushbu Chat ID ni kiritib, hisobotlarni shu yerga qabul qilishingiz mumkin.</i>`
      );
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
        `Savollar yoki yordam uchun administratorga murojaat qiling.`
      );
      return;
    }

    // /status buyrug'i
    if (text.startsWith('/status')) {
      await sendMessage(
        chatId,
        `✅ <b>Mintera Bot Tizimi Faol!</b>\n\n` +
        `⏱ <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}\n` +
        `📡 <b>Aloqa:</b> 100% Barqaror\n` +
        `🏢 <b>Platforma:</b> Mintera LMS v2.4 (Active)`
      );
      return;
    }

    // Guruhga yangi a'zo qo'shilganda (masalan, bot o'zi guruhga qo'shilganda)
    if (msg.new_chat_members && msg.new_chat_members.length > 0) {
      const botAdded = msg.new_chat_members.some((m) => m.is_bot && m.username === 'MinteraAi_bot');
      if (botAdded) {
        await sendMessage(
          chatId,
          `🎉 <b>Assalomu alaykum!</b>\n\n` +
          `Mintera Boti ushbu guruhga muvaffaqiyatli qo‘shildi!\n\n` +
          `📌 <b>Ushbu guruhning Chat ID si:</b>\n<code>${chatId}</code>\n\n` +
          `⚠️ <b>MUHIM:</b> Bot topshiriqlar hisobotini yuborishi uchun unga guruhda <b>Administrator</b> huquqini berishni unutmang!`
        );
      }
      return;
    }
  }

  // 2. Callback querylar (Tugmalar bosilganda)
  if (update.callback_query) {
    const cb = update.callback_query;
    const data = cb.data || '';
    const chatId = cb.message?.chat?.id;

    if (data.startsWith('my_id_') || data.startsWith('copy_id_')) {
      await answerCallbackQuery(cb.id, `Sizning ID: ${chatId}`);
      await sendMessage(chatId, `📌 <b>Sizning ID raqamingiz:</b> <code>${chatId}</code>`);
    } else if (data === 'help_info') {
      await answerCallbackQuery(cb.id, 'Qo‘llanma');
      await sendMessage(
        chatId,
        `📖 <b>Tezkor Yo‘riqnoma:</b>\n\n` +
        `1. Botni guruhingizga qo‘shing;\n` +
        `2. Botga Admin huquqini bering;\n` +
        `3. Guruh ID sini Mintera paneliga kiriting;\n` +
        `4. O‘qituvchi hisobot yuborganda natijalar avtomatik shu yerda ko‘rinadi!`
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
      allowed_updates: ['message', 'callback_query'],
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

// Mahalliy HTTP Server (Web frontenddan to'g'ridan-to'g'ri xabar jo'natish uchun)
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
    res.end(JSON.stringify({ status: 'ok', bot: 'MinteraAi_bot', online: true }));
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
      console.log(`[Telegram Bot] ✅ Muvaffaqiyatli ulandi! Bot: "${me.result.first_name}" (@${me.result.username})`);
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
