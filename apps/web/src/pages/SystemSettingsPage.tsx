import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { SystemSettingsData, INITIAL_SYSTEM_SETTINGS } from '../services/mockData';
import { Group } from '@codepractice/shared-types';
import {
  Sliders,
  Save,
  Check,
  Cpu,
  Bot,
  Shield,
  Server,
  Code2,
  Clock,
  HardDrive,
  RefreshCw,
  Sparkles,
  Zap,
  Key,
  Layers,
  Users,
  AlertCircle,
  Send,
  Eye,
  EyeOff,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData>(INITIAL_SYSTEM_SETTINGS);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);
  const [showBotToken, setShowBotToken] = useState(false);
  const [testingBot, setTestingBot] = useState(false);
  const [botTestResult, setBotTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.getSystemSettings(),
      apiClient.getTeacherGroups(),
    ]).then(([s, gList]) => {
      setSettings(s);
      setGroups(gList);
      setLoading(false);
    });
  }, []);

  const handleToggleGroupAI = (groupName: string) => {
    const current = settings.aiAllowedGroups || [];
    const updated = current.includes(groupName)
      ? current.filter((g) => g !== groupName)
      : [...current, groupName];
    setSettings({ ...settings, aiAllowedGroups: updated });
  };

  const handleToggleGroupAIPlus = (groupName: string) => {
    const current = settings.aiPlusGroups || [];
    const updated = current.includes(groupName)
      ? current.filter((g) => g !== groupName)
      : [...current, groupName];
    setSettings({ ...settings, aiPlusGroups: updated });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await apiClient.updateSystemSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3500);
  };

  const handleSaveBot = async () => {
    const cleanToken = settings.telegramBotToken?.trim();
    if (!cleanToken) {
      setBotTestResult({ success: false, message: 'Iltimos, avval Telegram Bot Tokenni kiriting!' });
      return;
    }
    setTestingBot(true);
    setBotTestResult(null);
    try {
      // 1. Sozlamalarni barcha xotiralarda saqlash
      await apiClient.updateSystemSettings({
        ...settings,
        telegramBotToken: cleanToken,
        telegramBotUsername: settings.telegramBotUsername?.trim() || '',
      });
      // 2. Telegram API bilan tekshirish
      const res = await apiClient.testTelegramBotConnection(cleanToken);
      setBotTestResult(res);
      if (res.username) {
        setSettings((prev) => ({ ...prev, telegramBotUsername: res.username }));
      }
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 4000);
    } catch (err: any) {
      setBotTestResult({ success: false, message: err.message || 'Saqlashda xatolik yuz berdi' });
    } finally {
      setTestingBot(false);
    }
  };

  const handleTestBot = async () => {
    if (!settings.telegramBotToken?.trim()) {
      setBotTestResult({ success: false, message: 'Iltimos, avval Telegram Bot Tokenni kiriting!' });
      return;
    }
    setTestingBot(true);
    setBotTestResult(null);
    try {
      const res = await apiClient.testTelegramBotConnection(settings.telegramBotToken);
      setBotTestResult(res);
      if (res.username && !settings.telegramBotUsername) {
        setSettings({ ...settings, telegramBotUsername: res.username });
      }
    } catch (err: any) {
      setBotTestResult({ success: false, message: err.message || 'Xatolik yuz berdi' });
    } finally {
      setTestingBot(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast */}
      {savedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-xs transition animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Tizim sozlamalari muvaffaqiyatli saqlandi va barcha tugunlarda yangilandi!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 sm:w-7 h-6 sm:h-7 text-purple-600 flex-shrink-0" />
            Tizim va Platforma Sozlamalari
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dasturlash tillari, AI kvotalari, xavfsizlik cheklovlari va AWS bulut infratuzilmasi boshqaruvi
          </p>
        </div>

        <button
          onClick={handleSave}
          className="h-11 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition cursor-pointer w-full sm:w-auto justify-center"
        >
          <Save className="w-4 h-4 flex-shrink-0" />
          Sozlamalarni saqlash
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Dasturlash tillari va Kompilyatorlar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Code2 className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Dasturlash tillari va Kompilyatorlar (TZ 3.1 & 1.1)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border transition ${settings.pythonEnabled ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">Python 3.12</span>
                <input
                  type="checkbox"
                  checked={settings.pythonEnabled}
                  onChange={(e) => setSettings({ ...settings, pythonEnabled: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
              </div>
              <p className="text-xs text-slate-500">Asosiy amaliy dasturlash tili. O‘quvchi kompyuteridagi CPython runtime orqali ishlaydi.</p>
            </div>

            <div className={`p-4 rounded-xl border transition ${settings.cppEnabled ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">C++20 (GCC / MinGW)</span>
                <input
                  type="checkbox"
                  checked={settings.cppEnabled}
                  onChange={(e) => setSettings({ ...settings, cppEnabled: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
              </div>
              <p className="text-xs text-slate-500">Algoritmik va olimpiada masalalari uchun C++20 standarti.</p>
            </div>

            <div className={`p-4 rounded-xl border transition ${settings.javaEnabled ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">Java 21 (Rejalashtirilgan)</span>
                <input
                  type="checkbox"
                  checked={settings.javaEnabled}
                  onChange={(e) => setSettings({ ...settings, javaEnabled: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
              </div>
              <p className="text-xs text-slate-500">Keyingi bosqichda tizimni qayta yozmasdan qo‘shiladigan til (TZ 1.1).</p>
            </div>
          </div>
        </div>

        {/* 2. Sun'iy Intellekt (AI) & AI Plus Boshqaruvi */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  Sun'iy Intellekt (AI) Murabbiy va AI Plus Boshqaruvi
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                    Plus Versiya
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI modelini tanlash, kuchliroq AI Plus versiyasini taqsimlash va token cheklovlarini boshqarish
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiMurabbiyEnabled}
                onChange={(e) => setSettings({ ...settings, aiMurabbiyEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              <span className="ml-2.5 text-xs font-bold text-slate-800">
                {settings.aiMurabbiyEnabled ? 'AI Faol' : 'O‘chirilgan'}
              </span>
            </label>
          </div>

          {/* AI Model Selection Cards (Standard vs AI Plus) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              AI Modeli va Intellektual Quvvati:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Standard Model */}
              <div
                onClick={() => setSettings({ ...settings, aiModelTier: 'standard', aiModelName: 'Gemini 1.5 Flash (Standart)' })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  settings.aiModelTier === 'standard'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-500" /> Standart AI (Flash)
                    </span>
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Tezkor
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Boshlang‘ich sintaksis tekshiruvi va qisqa maslahatlar. Standart resurs sarfi va tezkor javoblar.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tavsiya etilgan kvota: 10,000 token</span>
                  {settings.aiModelTier === 'standard' && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                </div>
              </div>

              {/* AI Plus Model (Stronger) */}
              <div
                onClick={() => setSettings({ ...settings, aiModelTier: 'plus', aiModelName: 'Gemini 1.5 Pro • Next-Gen AI Plus' })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between relative overflow-hidden ${
                  settings.aiModelTier === 'plus'
                    ? 'border-purple-600 bg-gradient-to-br from-purple-50/70 to-indigo-50/50 ring-2 ring-purple-600/30'
                    : 'border-slate-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-purple-600 text-white text-[9px] font-extrabold px-3 py-0.5 rounded-bl-lg shadow-xs uppercase tracking-wider">
                  Kuchliroq (Pro)
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-extrabold text-slate-900 text-sm">
                      ✨ Mintera AI Plus (Gemini 1.5 Pro / GPT-4o)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Yuqori intellektual quvvat. Koddagi chuqur algoritmik xatoliklarni aniqlaydi, chekka holatlarni tushuntiradi, o‘quvchini bosqichma-bosqich o‘zbek tilida to‘g‘ri yechimga yo‘naltiradi.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-purple-100/60 flex items-center justify-between text-[11px]">
                  <span className="text-purple-700 font-semibold">Tavsiya etilgan kvota: 25,000+ token</span>
                  {settings.aiModelTier === 'plus' && (
                    <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Tanlangan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Token Limits and Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Har bir o‘quvchi uchun kunlik AI token kvotasi:
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={settings.aiMaxTokensPerStudent}
                  onChange={(e) => setSettings({ ...settings, aiMaxTokensPerStudent: Number(e.target.value) })}
                  className="w-full h-10 px-3 pr-16 border border-slate-300 rounded-xl text-sm font-bold text-purple-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">token</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * Token cheklovi doimiy saqlanadi. Limit yetgach so‘rovlar ertangi kunga qadar to‘xtatiladi.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kunlik maksimal so‘rovlar soni (har bir talaba):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={5}
                  value={settings.aiDailyRequestsLimit || 40}
                  onChange={(e) => setSettings({ ...settings, aiDailyRequestsLimit: Number(e.target.value) })}
                  className="w-full h-10 px-3 pr-16 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">so‘rov/kun</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * Kunlik chegaraga yetilganda o‘quvchiga cheklov xabari ko‘rinadi.
              </p>
            </div>
          </div>

          {/* Group-level AI Allocation (Admin ajratadi) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Guruhlar kesimida AI va AI Plus ruxsatini ajratish:
              </label>
              <span className="text-[11px] text-slate-500">
                Admin qaysi guruhga AI yoki kuchliroq AI Plus berishini belgilaydi
              </span>
            </div>

            <div className="space-y-2.5">
              {groups.map((g) => {
                const isAiAllowed = (settings.aiAllowedGroups || []).includes(g.name);
                const isPlusAllowed = (settings.aiPlusGroups || []).includes(g.name);

                return (
                  <div
                    key={g.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                        {g.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{g.name}</p>
                        <p className="text-xs text-slate-500">O‘quvchilar: {g.studentCount ?? 0} nafar</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {/* Toggle AI for this group */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={isAiAllowed}
                          onChange={() => handleToggleGroupAI(g.name)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span>AI Ruxsati</span>
                      </label>

                      {/* Toggle AI Plus for this group */}
                      <button
                        type="button"
                        onClick={() => handleToggleGroupAIPlus(g.name)}
                        disabled={!isAiAllowed}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                          isPlusAllowed && isAiAllowed
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-40'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isPlusAllowed && isAiAllowed ? '✨ AI Plus Faol' : 'Standart Model'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom API Key (Optional) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-600" />
              <label className="text-xs font-bold text-slate-800">
                Google Gemini API Kaliti (Ixtiyoriy):
              </label>
            </div>
            <input
              type="password"
              value={settings.aiCustomApiKey || ''}
              onChange={(e) => setSettings({ ...settings, aiCustomApiKey: e.target.value })}
              placeholder="AIzaSy... (bo‘sh qoldirilsa, tizimning rasmiy o‘rnatilgan modeli ishlaydi)"
              className="w-full h-10 px-3 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-[11px] text-slate-400">
              Ushbu kalit orqali markaz o‘zining maxsus Gemini 1.5 Pro kvotasini to‘g‘ridan-to‘g‘ri ulashi mumkin.
            </p>
          </div>
        </div>

        {/* 3. Telegram Bot Integratsiyasi */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm space-y-5 bg-gradient-to-b from-blue-50/20 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Telegram Bot Integratsiyasi</span>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Guruhlarga Hisobot
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  O‘quvchilar natijalari va topshiriq hisobotlarini avtomatik Telegram guruhlarga yuborish
                </p>
              </div>
            </div>

            {/* Holat Badge */}
            <div className="flex items-center gap-2">
              {settings.telegramBotToken?.trim() ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Faol: {settings.telegramBotUsername || 'Token saqlangan'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Token saqlanmagan</span>
                </span>
              )}
            </div>
          </div>

          {/* Test Result Toast/Banner */}
          {botTestResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition animate-fade-in ${
                botTestResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {botTestResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span className="flex-1">{botTestResult.message}</span>
            </div>
          )}

          {/* Bot Key Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  Telegram Bot API Token (Key):
                </span>
                <span className="text-[11px] text-slate-500 font-medium">@BotFather bergan kalit</span>
              </label>
              <div className="relative">
                <input
                  type={showBotToken ? 'text' : 'password'}
                  value={settings.telegramBotToken || ''}
                  onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                  placeholder="Masalan: 7123456789:AAHk_abcdef123456789..."
                  style={{ color: '#0F172A', backgroundColor: '#FFFFFF' }}
                  className="w-full h-11 px-3.5 pr-10 border-2 border-slate-300 rounded-xl text-xs font-mono bg-white text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowBotToken(!showBotToken)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showBotToken ? 'Yashirish' : 'Ko‘rsatish'}
                >
                  {showBotToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                * Ushbu token orqali bot guruhlarga xabarlar, test natijalari va hisobotlarni to‘g‘ridan-to‘g‘ri yuboradi.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  Bot Username:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Havola va o‘quvchilar uchun</span>
              </label>
              <input
                type="text"
                value={settings.telegramBotUsername || ''}
                onChange={(e) => setSettings({ ...settings, telegramBotUsername: e.target.value })}
                placeholder="@MinteraAi_bot yoki @sizning_botingiz"
                style={{ color: '#0F172A', backgroundColor: '#FFFFFF' }}
                className="w-full h-11 px-3.5 border-2 border-slate-300 rounded-xl text-xs font-mono bg-white text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                * O‘quvchilar va guruh a’zolari botni oson topishi va guruhga qo‘shishi uchun rasmiy nom.
              </p>
            </div>
          </div>

          {/* Dedicated Action Buttons for Telegram Card */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-blue-900">
              <span className="font-bold block text-blue-950 mb-0.5">Tokenni saqlash va tekshirish:</span>
              Bot kalitini kiritgach, uni saqlab, bir vaqtning o‘zida Telegram bilan aloqani faollashtiring.
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTestBot}
                disabled={testingBot}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingBot ? 'animate-spin' : ''}`} />
                <span>{testingBot ? 'Tekshirilmoqda...' : 'Faqat tekshirish'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveBot}
                disabled={testingBot}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Botni Saqlash va Faollashtirish</span>
              </button>
            </div>
          </div>

          {/* Step by step mini-guide */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Telegram Bot kalitini qanday olish va ulash mumkin? (Yo‘riqnoma)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 leading-relaxed">
              <li>
                Telegramda rasmiy <strong className="text-blue-600 font-semibold">@BotFather</strong> botiga kiring va <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">/newbot</code> deb yozing.
              </li>
              <li>
                Botingizga ixtiyoriy nom va oxiri <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">bot</code> bilan tugovchi username tanlang (masalan: <em>mintera_edu_bot</em>).
              </li>
              <li>
                BotFather bergan uzun <strong className="text-slate-800">HTTP API Token</strong>ni nusxalab, yuqoridagi <strong>«Telegram Bot API Token (Key)»</strong> maydoniga joylang va <strong>«Botni Saqlash va Faollashtirish»</strong> tugmasini bosing.
              </li>
              <li>
                Botingizni o‘quvchilar Telegram guruhiga qo‘shing va unga <strong className="text-slate-900">Administrator (Admin)</strong> huquqini bering, aks holda bot guruhga xabar yubora olmaydi.
              </li>
            </ol>
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="font-medium">Server integratsiyasi:</span>
              <span>Saqlash tugmasini bosganingizda token brauzerda ham, serverdagi <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">.env</code> faylida ham avtomatik saqlanadi.</span>
            </div>
          </div>
        </div>

        {/* 4. Lokal Ijro va Cheklovlar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Lokal Ijro va Resurs Cheklovlari (Runner Sandbox)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Standart vaqt chegarasi (Time Limit ms):
              </label>
              <input
                type="number"
                value={settings.defaultTimeLimitMs}
                onChange={(e) => setSettings({ ...settings, defaultTimeLimitMs: Number(e.target.value) })}
                className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                Xotira chegarasi (Memory Limit MB):
              </label>
              <input
                type="number"
                value={settings.defaultMemoryLimitMb}
                onChange={(e) => setSettings({ ...settings, defaultMemoryLimitMb: Number(e.target.value) })}
                className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* 4. Anti-cheat va Clipboard Nazorati */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Nazorat va Clipboard cheklovlari (TZ 4.2)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.strictClipboardBlock}
                onChange={(e) => setSettings({ ...settings, strictClipboardBlock: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <div>
                <p className="font-bold text-slate-900">Monaco muharririda qat’iy Clipboard (Copy/Paste) blokirovkasi</p>
                <p className="text-slate-500 mt-0.5">O‘quvchi tashqi kodni paste qila olmaydi, mustaqil yozishi ta’minlanadi.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireFullscreenMode}
                onChange={(e) => setSettings({ ...settings, requireFullscreenMode: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <div>
                <p className="font-bold text-slate-900">Topshiriqni boshlashda to‘liq ekran rejimi (Fullscreen)</p>
                <p className="text-slate-500 mt-0.5">Chalg‘ituvchi omillarni kamaytirish uchun toza fokus muhitini faollashtiradi.</p>
              </div>
            </label>
          </div>
        </div>

        {/* 5. Infratuzilma */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Server className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">Infratuzilma va Bulut (AWS)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Joylashtirish hududi:</span>
              <p className="font-bold text-slate-900 mt-0.5">{settings.serverRegion}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Zaxira nusxalash holati:</span>
              <p className="font-bold text-slate-900 mt-0.5">{settings.backupStatus}</p>
            </div>
          </div>
        </div>

        {/* Global Bottom Save Bar */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Save className="w-4 h-4 text-purple-600" />
              <span>Barcha tizim sozlamalarini saqlash</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Dasturlash tillari, Telegram Bot Tokeni, AI kvotalari va barcha yangilanishlarni tizimda tasdiqlash
            </p>
          </div>
          <button
            type="submit"
            onClick={handleSave}
            className="h-11 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4 flex-shrink-0" />
            <span>Sozlamalarni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};
