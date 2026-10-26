import React, { useState, useEffect } from 'react';
import { TitleBar } from '../components/TitleBar';
import { Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onProceed: () => void;
  onRequestExit?: () => void;
}

export const GuidePage: React.FC<Props> = ({ onProceed, onRequestExit }) => {
  const { theme } = useTheme();
  const [secondsRemaining, setSecondsRemaining] = useState(5);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const rules = [
    'Berilgan dasturlash vazifalarini mustaqil ravishda o‘z kodingiz bilan bajaring.',
    'AI Murabbiydan algoritm mantig‘i, nazariy tushuntirish va maslahat olishingiz mumkin.',
    'AI tayyor yechimni to‘liq ko‘chirib berish uchun emas, masalani tushunishingizga yo‘naltirilgan.',
    'Yozilgan kodingiz har 2.5 soniyada avtomatik ravishda serverga saqlab boriladi.',
    'Ilovadan chiqish uchun o‘qituvchi tomonidan belgilangan ruxsat kodi (4826) talab qilinishi mumkin.',
  ];

  const formattedTimer = `00:${secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}`;

  return (
    <div
      className={`h-screen w-screen flex flex-col select-none overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-800'
      }`}
    >
      <TitleBar title="CodePractice — O‘quvchi qo‘llanmasi" onExitRequest={onRequestExit} />

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div
          className={`w-full max-w-2xl rounded-3xl p-8 border shadow-2xl transition-all ${
            theme === 'dark'
              ? 'glass-panel-dark border-white/10 glow-border-blue'
              : 'glass-panel-light border-slate-200'
          }`}
        >
          {/* Header */}
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platforma standartlari</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Amaliyot va ishlash qoidalari
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vazifalarni boshlashdan avval dasturlash muhiti, avtomatlashtirilgan test tekshiruvi va axloqiy mezonlar bilan diqqat bilan tanishib chiqing.
            </p>
          </div>

          {/* 5 Rules */}
          <div className="space-y-3 mb-8">
            {rules.map((ruleText, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-start gap-3.5 transition ${
                  theme === 'dark'
                    ? 'bg-slate-900/40 border-white/5 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  {idx + 1}
                </div>
                <p className="text-xs leading-relaxed pt-0.5 font-medium">
                  {ruleText}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-5 border-t border-white/10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{secondsRemaining > 0 ? `Qolgan vaqt: ${formattedTimer}` : 'Tanishib chiqildi'}</span>
            </div>

            <button
              onClick={onProceed}
              disabled={secondsRemaining > 0}
              className="px-6 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <span>Davom etish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
