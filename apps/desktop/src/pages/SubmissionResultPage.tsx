import React from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import {
  CheckCircle2,
  Award,
  Clock,
  Cpu,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  FileText,
  Code2,
  Trophy,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface Props {
  onBackToDashboard: () => void;
  onNavigateTab: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
  onRequestExit: () => void;
  onReviewCode?: () => void;
}

export const SubmissionResultPage: React.FC<Props> = ({
  onBackToDashboard,
  onNavigateTab,
  onRequestExit,
  onReviewCode,
}) => {
  const problemsResults = [
    {
      num: '01',
      title: 'Massivdagi juft sonlar yig‘indisi',
      language: 'Python 3.11',
      testsPassed: '2/2',
      executionTime: '0.012s',
      memory: '14.2 MB',
      status: 'Qabul qilindi',
      points: '30 / 30',
    },
    {
      num: '02',
      title: 'Satr palindromligini ikki ko‘rsatkich bilan tekshirish',
      language: 'C++20 (GCC)',
      testsPassed: '2/2',
      executionTime: '0.004s',
      memory: '8.1 MB',
      status: 'Qabul qilindi',
      points: '35 / 35',
    },
    {
      num: '03',
      title: 'Fibonachchi sonini Dinamik Dasturlash (DP) orqali hisoblash',
      language: 'Python 3.11',
      testsPassed: '2/2',
      executionTime: '0.024s',
      memory: '18.4 MB',
      status: 'Qabul qilindi',
      points: '35 / 35',
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F3F4F6] text-slate-800 font-sans select-none overflow-hidden">
      {/* 1. Custom TitleBar */}
      <TitleBar title="CodePractice - Natijalar va Baholash (v2.4.0)" />

      {/* 2. Top Header */}
      <TopHeader
        breadcrumb="Modul #4 > Nazorat ishi > Yakuniy Natija"
        onRequestExit={onRequestExit}
      />

      {/* 3. Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab="dashboard"
          onNavigate={(item) => {
            if (item === 'dashboard') onBackToDashboard();
            else onNavigateTab(item);
          }}
        />

        {/* Center Content Scrollable */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Top Back & Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Vazifalar ro‘yxatiga qaytish</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Tekshiruv protokoli: #SUB-2026-9481</span>
            </div>
          </div>

          {/* Success Banner Hero */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wider text-white">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Avtomatik tekshiruv yakunlandi • QABUL QILINDI</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Vazifa muvaffaqiyatli topshirildi!
                </h1>
                <p className="text-emerald-100 text-xs max-w-xl leading-relaxed">
                  Barcha 3 ta masala va 6 ta avtomatik test holatlari xatosiz bajarildi.
                  Natijalar o‘qituvchi serveriga yuborildi va monitoring jurnaliga qayd etildi.
                </p>
              </div>

              {/* Big Score Badge */}
              <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
                <div className="text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                    To‘plangan ball
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight mt-0.5">
                    100<span className="text-2xl text-emerald-200">/100</span>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-white/20" />
                <div className="text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                    Baholash
                  </div>
                  <div className="text-3xl font-extrabold text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                    <span>A+</span>
                    <Sparkles className="w-5 h-5 inline text-amber-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Test natijalari</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">6 / 6 (100%)</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Barcha testlar o‘tdi</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Bajarilish holati</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">Qabul qilindi</div>
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Muddatida topshirildi</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Sarflangan vaqt</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">24m 15s</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Limit: 90 daqiqa</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">O‘rtacha resurs sarfi</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">0.04s • 18.4 MB</div>
                <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">Yuqori samaradorlik</div>
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left 2 cols: Problem Breakdown */}
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span>Masalalar bo‘yicha batafsil natijalar</span>
                  </h2>
                  <span className="text-[11px] text-slate-500 font-medium">3 ta masala</span>
                </div>

                <div className="divide-y divide-slate-100 mt-3">
                  {problemsResults.map((p) => (
                    <div key={p.num} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                          {p.num}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{p.title}</div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                              {p.language}
                            </span>
                            <span>Testlar: <b className="text-emerald-600">{p.testsPassed}</b></span>
                            <span>Vaqt: {p.executionTime}</span>
                            <span>RAM: {p.memory}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-600">{p.points}</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Quality & Static Audit */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Kod sifati va algoritmlar auditi</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                    Optimal yechim
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Vaqt murakkabligi</div>
                    <div className="text-base font-bold font-mono text-blue-600 mt-1">O(N)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Chiziqli optimal</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Xotira murakkabligi</div>
                    <div className="text-base font-bold font-mono text-purple-600 mt-1">O(1) qo‘shimcha</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Minimal iste'mol</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Siklomik murakkablik</div>
                    <div className="text-base font-bold font-mono text-emerald-600 mt-1">3 (A'lo)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Toza va ixcham kod</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right col: Class Ranking & Actions */}
            <div className="space-y-4">
              {/* Leaderboard Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Sinf reytingi (9-A)</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Jami 24 o‘quvchi</span>
                </div>

                <div className="space-y-2.5 mt-3 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-white font-bold text-[10px] flex items-center justify-center">
                        1
                      </span>
                      <span className="font-bold text-slate-800">Azizbek Rahimov (Siz)</span>
                    </div>
                    <span className="font-extrabold text-amber-700">100 ball</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                        2
                      </span>
                      <span className="text-slate-700">Jasur Mirzayev</span>
                    </div>
                    <span className="font-bold text-slate-700">95 ball</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                        3
                      </span>
                      <span className="text-slate-700">Madina Karimova</span>
                    </div>
                    <span className="font-bold text-slate-700">90 ball</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <button
                  onClick={onBackToDashboard}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <span>Keyingi topshiriqqa o‘tish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onReviewCode && (
                  <button
                    onClick={onReviewCode}
                    className="w-full h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Yozilgan kodni ko‘rish</span>
                  </button>
                )}

                <button
                  onClick={() => alert("Batafsil natijalar PDF hisoboti yuklab olindi (CodePractice-Report.pdf)")}
                  className="w-full h-9 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Batafsil hisobot (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
