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
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData>(INITIAL_SYSTEM_SETTINGS);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.updateSystemSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3500);
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-7 h-7 text-purple-600" />
            Tizim va Platforma Sozlamalari
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Dasturlash tillari, AI kvotalari, xavfsizlik cheklovlari va AWS bulut infratuzilmasi boshqaruvi
          </p>
        </div>

        <button
          onClick={handleSave}
          className="h-11 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
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

        {/* 3. Lokal Ijro va Cheklovlar */}
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
      </form>
    </div>
  );
};
