import React from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import {
  ArrowLeft,
  Play,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Cpu,
  FileCode,
  ShieldAlert,
  Award,
  ChevronRight,
  User,
  Quote,
} from 'lucide-react';

interface Props {
  assignmentId: string;
  onBack: () => void;
  onStartProblem: (problemId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
  onRequestExit: () => void;
}

export const AssignmentDetailsPage: React.FC<Props> = ({
  assignmentId,
  onBack,
  onStartProblem,
  onNavigateTab,
  onRequestExit,
}) => {
  const problems = [
    {
      id: 'prob-1',
      num: '01',
      title: 'Ro‘yxatdagi eng katta juft sonni topish',
      points: '40 / 40 ball',
      diff: 'O‘rtacha (Medium)',
      lang: 'Python 3.11',
      status: 'in_progress',
      statusText: 'Bajarilmoqda (2/3 o‘tgan)',
      badgeBg: 'bg-blue-50 text-blue-700',
      desc: 'Berilgan butun sonlar massividan eng katta juft qiymatni topuvchi va agar bunday son mavjud bo‘lmasa -1 qaytaruvchi funksiya yozing. O(N) vaqt murakkabligi talab etiladi.',
      limitText: 'Cheklov: 1.0 soniya • RAM: 256 MB',
      testText: '3 ta ochiq test, 2 ta yashirin test',
      btnText: 'Davom ettirish',
    },
    {
      id: 'prob-2',
      num: '02',
      title: 'Palindrom matnni tekshirish (Two Pointers)',
      points: '35 ball',
      diff: 'Oson (Easy)',
      lang: 'C++ 20',
      status: 'new',
      statusText: 'Boshlanmagan',
      badgeBg: 'bg-slate-100 text-slate-600',
      desc: 'Kiritilgan matn satrida barcha harf-raqam belgilarini qoldirib, registrdan qat’i nazar palindrom ekanligini ikki ko‘rsatkich (Two Pointers) yordamida tekshiring.',
      limitText: 'Cheklov: 0.5 soniya • RAM: 128 MB',
      testText: '2 ta ochiq test, 2 ta yashirin test',
      btnText: 'Masalaga o‘tish',
    },
    {
      id: 'prob-3',
      num: '03',
      title: 'Fibonachchi ketma-ketligida N-hadni hisoblash (DP)',
      points: '25 ball',
      diff: 'Qiyin (Hard)',
      lang: 'Python 3.11',
      status: 'new',
      statusText: 'Boshlanmagan',
      badgeBg: 'bg-slate-100 text-slate-600',
      desc: 'Katta sonlar uchun (N <= 10^5) Fibonachchi ketma-ketligining N-hadini hisoblash algoritmini dinamik dasturlash yoki matritsali darajaga ko‘tarish usuli orqali modul 10^9+7 bilan toping.',
      limitText: 'Cheklov: 1.0 soniya • RAM: 64 MB',
      testText: '1 ta ochiq test, 4 ta yashirin test',
      btnText: 'Masalaga o‘tish',
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800 select-none overflow-hidden font-sans">
      <TitleBar onExitRequest={onRequestExit} />
      <TopHeader
        studentName="Azizbek Rahimov"
        grade="9-A sinf"
        breadcrumb="Amaliyot > Python & C++ Laboratoriyasi > Vazifa tafsilotlari"
        onRequestExit={onRequestExit}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar currentTab="assignment_details" onNavigate={onNavigateTab} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Subheader Bar with Back button and Status Badge */}
          <div className="flex items-center justify-between text-xs pb-1">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga / Amaliyot &gt; Python &amp; C++ Laboratoriyasi &gt; Vazifa tafsilotlari</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Sinov rejimi: Nazorat ishi
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Muhit: Barqaror
              </span>
            </div>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Assignment Info & Problems */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Module Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-2">
                  <span className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    Modul #4 • Nazorat ishi
                  </span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono text-[11px]">&lt;&gt; Python 3.11 &amp; C++20</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                  Algoritmlar va Ma’lumotlar Tuzilmasi: 4-Laboratoriya ishi
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  Ushbu amaliy modul doirasida berilgan murakkab masalalarni yechish orqali algoritmlarni optimallashtirish, xotira sarfini me’yorda saqlash va vaqt murakkabligini tahlil qilish ko‘nikmalari baholanadi.
                </p>

                {/* Teacher Note Quote Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">O‘qituvchi bergan izoh:</span>
                      <span className="text-slate-500 text-[11px]">Alisher Qodirov</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed italic">
                      “Hurmatli o‘quvchilar! Mazkur amaliy mashg‘ulotda massivlar, qidiruv algoritmlari va vaqt murakkabligini optimallashtirish bo‘yicha berilgan masalalarni yechishingiz lozim. Kod yozishda xotira chegarasi (RAM 256MB) va bajarilish vaqti (maksimal 1.0s) hisobga olingan. Har bir yechim avtomatlashtirilgan testlardan o‘tkaziladi. AI yordamchisidan tushuntirish olishingiz mumkin, biroq tayyor kod berilmaydi. Omad!”
                    </p>
                  </div>
                </div>
              </div>

              {/* Problems List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs px-1">
                  <h3 className="font-bold text-slate-900 text-sm">Masalalar ro‘yxati (3 ta masala)</h3>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Avtomatik test tizimi
                  </span>
                </div>

                {problems.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition p-5 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {p.num}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span className="font-medium text-slate-600">{p.diff}</span>
                            <span>•</span>
                            <span className="font-mono">{p.lang}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.badgeBg}`}>
                              ● {p.statusText}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-bold text-slate-900 text-sm">{p.points}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 pl-10 mb-4 leading-relaxed">{p.desc}</p>

                    <div className="pt-3 border-t border-slate-100 pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="space-y-0.5 text-[11px]">
                        <div>{p.limitText}</div>
                        <div className="text-slate-400">{p.testText}</div>
                      </div>

                      <button
                        onClick={() => onStartProblem(p.id)}
                        className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition self-start sm:self-auto"
                      >
                        <span>{p.btnText}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Mini Metric Cards, Progress & Safety */}
            <div className="space-y-5">
              {/* 4 Mini Cards 2x2 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Jami masalalar</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">3 ta masala</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Ajratilgan vaqt</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">60 daqiqa</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Maksimal ball</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">100 ball</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Muddati</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">Bugun, 23:59</p>
                </div>
              </div>

              {/* Big Start Button */}
              <button
                onClick={() => onStartProblem('prob-1')}
                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Ishlashni boshlash</span>
              </button>
              <p className="text-[10px] text-center text-slate-400 -mt-2">
                Bosilganda ish oynasi to‘liq ekranda ochiladi
              </p>

              {/* Training Progress Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-900">Mashg‘ulot progressi</h4>
                  <span className="font-bold text-blue-600">40 / 100 ball</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <p className="text-base font-bold text-emerald-600">0</p>
                    <p className="text-[10px] text-slate-500 font-medium">Yechildi</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <p className="text-base font-bold text-blue-600">1</p>
                    <p className="text-[10px] text-slate-500 font-medium">Jarayonda</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <p className="text-base font-bold text-slate-400">2</p>
                    <p className="text-[10px] text-slate-500 font-medium">Kutilmoqda</p>
                  </div>
                </div>
              </div>

              {/* Rules checklist card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Muhit va Qoidalar</h4>
                <div className="space-y-2 text-slate-600 text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Avtomatik saqlanish faol</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Kompilyator versiyalari (Py3.11 &amp; GCC C++20)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Vaqt hisoblagich boshqarilmoqda</span>
                  </div>
                </div>
              </div>

              {/* Safety Exit Restriction Notice (Red card) */}
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 text-xs text-red-800 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-red-900 text-[11px] uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Chiqish xavfsizlik cheklovi</span>
                </div>
                <p className="text-[11px]">
                  Dars va nazorat ishi davomida ilovadan yoki to‘liq ekran rejimidan ruxsatsiz chiqish taqiqlanadi. Platformadan faqat o‘qituvchi PIN-kodi bilan chiqish mumkin. Barcha urinishlar log qilinadi.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
