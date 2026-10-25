import React, { useState, useEffect } from 'react';
import { TitleBar } from '../components/TitleBar';
import {
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  Bot,
  Save,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onProceed: () => void;
  onRequestExit?: () => void;
}

export const GuidePage: React.FC<Props> = ({ onProceed, onRequestExit }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(11);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const formattedTimer = `00:${secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}`;

  const rules = [
    {
      num: 1,
      badge: 'Halollik',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: '1. Berilgan vazifalarni o‘z kuchingiz bilan bajaring',
      desc: 'Algoritmlar mantiqiy fikrlashni shakllantirish uchun beriladi. Boshqa manbalardan yechimlarni to‘g‘ridan-to‘g‘ri ko‘chirib o‘tkazish (plagiat) tizim tomonidan qayd etiladi va baholashga ta’sir qiladi.',
    },
    {
      num: 2,
      badge: 'Tushuntirish',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: '2. AI’dan tushuntirish va maslahat olish mumkin',
      desc: 'Platforma ichidagi sun’iy intellekt xato sintaksisini yoki kompilyatsiya xabarlarini o‘zbek tilida sharhlab berishga tayyor. Noma’lum funksiyalar mohiyatini undan so‘rashingiz mumkin.',
    },
    {
      num: 3,
      badge: 'Qo‘llab-quvvatlash',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: '3. AI tayyor yechimni bermaydi, tushunishga ko‘maklashadi',
      desc: 'AI assistent to‘liq javob kodini taqdim etmaydi. U sizni to‘g‘ri yechimga yo‘naltiruvchi maslahatlar, algoritm sxemalari va test holatlarini ko‘rib chiqishga undaydi.',
    },
    {
      num: 4,
      badge: 'Auto-Save',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: '4. Kod avtomatik saqlanadi',
      desc: 'Har bir yozilgan qator va test sinovlari oniy tarzda serverda sinxronlanadi. Elektr ta’minoti yoki brauzer uzilishi sodir bo‘lsa ham, kodingiz yo‘qolmaydi va tiklanadi.',
    },
    {
      num: 5,
      badge: 'Xavfsizlik',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      title: '5. Ilovadan chiqish uchun ruxsat talab qilinishi mumkin',
      desc: 'Imtihon yoki nazorat tartibida ekranni o‘zboshimchalik bilan yopish taqiqlanadi. Sessiyani muddatidan oldin yakunlash uchun o‘qituvchi yoki mentoring maxsus kodi kerak bo‘ladi.',
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#0B132B] text-slate-100 select-none overflow-hidden font-sans">
      <TitleBar title="CodePractice - Kirish" onExitRequest={onRequestExit} />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-7 text-slate-800 border border-slate-200 flex flex-col md:flex-row gap-8">
          {/* Left Column: 5 Rules */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src="/icon.png"
                  alt="CodePractice"
                  width="24"
                  height="24"
                  style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', objectFit: 'contain' }}
                  className="rounded-md object-contain flex-shrink-0"
                />
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded tracking-wider uppercase border border-blue-100">
                  CodePractice v2.4.0 • Yo‘riqnoma va Mezonlar
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ishlash qoidalari</h2>
              <p className="text-xs text-slate-500 mt-1">
                Vazifalarni boshlashdan avval dasturlash muhiti, avtomatlashtirilgan tekshiruv va axloqiy mezonlar bilan diqqat bilan tanishib chiqing.
              </p>
            </div>

            <div className="space-y-3">
              {rules.map((r) => (
                <div
                  key={r.num}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-200 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-mono">
                        {r.num}
                      </span>
                      {r.title}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${r.badgeColor}`}>
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-7">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Timer & Readiness Card */}
          <div className="w-full md:w-80 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-50 to-blue-50/40 rounded-2xl border border-blue-100/80">
            <div>
              <div className="flex justify-center mb-4">
                <img
                  src="/logo.png"
                  alt="CodePractice"
                  width="140"
                  style={{ width: '140px', maxWidth: '140px', height: 'auto', maxHeight: '50px', objectFit: 'contain' }}
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                  Tanishtiruv Taymeri
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100/70 text-blue-700 rounded-full font-medium">
                  Faol nazorat
                </span>
              </div>

              {/* Digital Countdown Clock */}
              <div className="bg-white rounded-2xl border border-blue-200/80 p-5 text-center shadow-sm mb-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-medium">
                  O‘qish uchun qolgan vaqt:
                </p>
                <div className="text-4xl font-extrabold font-mono text-blue-600 tracking-tight">
                  {formattedTimer}
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">daqiqadan so‘ng ochiladi</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-slate-600 leading-relaxed mb-4">
                <p>
                  Belgilangan minimal o‘qish vaqti tugamaguncha <b>«Davom etish»</b> tugmasi faol bo‘lmaydi. Bu qoidalarni to‘liq o‘zlashtirishingiz uchun zarur.
                </p>
              </div>

              {/* System readiness statuses */}
              <div className="space-y-2 text-xs mb-5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Kompilyator holati:
                  </span>
                  <span className="font-semibold text-slate-800">GCC / Py3.11 Tayyor</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Bulutli saqlash:
                  </span>
                  <span className="font-semibold text-slate-800">Sinxronlangan</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-center text-slate-400 mb-2">
                Qoidalar bilan tanishib chiqilmoqda...
              </p>
              <button
                onClick={onProceed}
                disabled={secondsRemaining > 0}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Davom etish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[9px] text-center text-slate-400 mt-2">
                Darslik va amaliy laboratoriya muhitiga o‘ting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="h-9 px-6 bg-[#0B132B] border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>• Python 3.11.4 • C++20 (GCC 13.2)</span>
          <span>• Akademik halollik protokoli yoqilgan</span>
        </div>
        <div className="font-mono text-slate-500">CodePractice Sandbox v2.4</div>
      </div>
    </div>
  );
};
