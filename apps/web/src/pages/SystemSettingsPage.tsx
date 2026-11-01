import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { SystemSettingsData, INITIAL_SYSTEM_SETTINGS } from '../services/mockData';
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
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsData>(INITIAL_SYSTEM_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    apiClient.getSystemSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

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

        {/* 2. Sun'iy Intellekt (AI) Murabbiy kvotalari */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Bot className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Sun'iy Intellekt (AI) Murabbiy Sozlamalari (TZ 1.1)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-800 mb-1">
                <input
                  type="checkbox"
                  checked={settings.aiMurabbiyEnabled}
                  onChange={(e) => setSettings({ ...settings, aiMurabbiyEnabled: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                AI Yordamchisini barcha o‘quvchilarga yoqish
              </label>
              <p className="text-xs text-slate-500 pl-6">
                AI o‘quvchiga kod va xatolarni tushuntiradi, lekin tayyor yechimni yozib bermaydi.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Har bir o‘quvchi uchun kunlik AI token kvotasi:
              </label>
              <input
                type="number"
                value={settings.aiMaxTokensPerStudent}
                onChange={(e) => setSettings({ ...settings, aiMaxTokensPerStudent: Number(e.target.value) })}
                className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Taxminan 40-50 ta yordamchi savol-javob uchun yetarli limit.
              </p>
            </div>
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
