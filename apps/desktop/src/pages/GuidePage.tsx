import React, { useState, useEffect } from 'react';
import { TitleBar } from '../components/TitleBar';
import { Clock } from 'lucide-react';

interface Props {
  onProceed: () => void;
  onRequestExit?: () => void;
}

export const GuidePage: React.FC<Props> = ({ onProceed, onRequestExit }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(10);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const rules = [
    'Berilgan vazifalarni o‘z kuchingiz bilan bajaring.',
    'AI’dan tushuntirish va maslahat olish mumkin.',
    'AI tayyor yechimni berish uchun emas, tushunishga yordam berish uchun ishlatiladi.',
    'Kod avtomatik saqlanadi.',
    'Ilovadan chiqish uchun ruxsat talab qilinishi mumkin.',
  ];

  const formattedTimer = `00:${secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}`;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F3F4F6] text-slate-800 select-none overflow-hidden font-sans">
      {/* 1. Custom TitleBar */}
      <TitleBar title="CodePractice - Qo‘llanma" onExitRequest={onRequestExit} />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Header matching Poster Item 2 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Ishlash qoidalari
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Vazifalarni boshlashdan avval dasturlash muhiti, avtomatlashtirilgan tekshiruv va axloqiy mezonlar bilan diqqat bilan tanishib chiqing.
            </p>
          </div>

          {/* 5 Rules with clean blue circular numbers */}
          <div className="space-y-4 mb-8">
            {rules.map((ruleText, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed pt-0.5">
                  {ruleText}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Action Bar matching Poster Item 2 */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
            {/* Left Timer Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Qolgan vaqt: {formattedTimer}</span>
            </div>

            {/* Right Button */}
            <button
              onClick={onProceed}
              disabled={secondsRemaining > 0}
              className="px-6 h-10 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Davom etish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
