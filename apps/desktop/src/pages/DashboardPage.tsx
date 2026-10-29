import React, { useState } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import {
  Code2,
  ArrowRight,
  Flame,
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
} from 'lucide-react';

interface Props {
  onSelectAssignment: (assignmentId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
  onShowGuide: () => void;
  onRequestExit: () => void;
  onViewResults: () => void;
}

export const DashboardPage: React.FC<Props> = ({
  onSelectAssignment,
  onNavigateTab,
  onRequestExit,
  onViewResults,
}) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const stats = [
    {
      title: 'Kunlik seriya',
      value: '5 kun',
      sub: 'Ketma-ket amaliyot 🔥',
      icon: Flame,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Jami to‘plangan ball',
      value: '1,240 XP',
      sub: 'Guruhda 2-o‘rin 🏆',
      icon: Trophy,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Yechilgan masalalar',
      value: '18 / 24',
      sub: '75% umumiy natija ⚡',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'O‘rtacha aniqlik',
      value: '94.8%',
      sub: 'Birinchi urinishda ✨',
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  const assignments = [
    {
      id: 'assign-1',
      lang: 'Python 3.12',
      langBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      title: 'Python asoslari: Sikllar va shart operatorlari',
      problemsCount: '5 ta masala',
      deadline: 'Topshirish: 10-May, 23:59',
      progress: 60,
      status: 'in_progress',
      statusText: 'Bajarilmoqda',
      statusBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      btnText: 'Davom etish',
      btnGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20',
      action: () => onSelectAssignment('assign-1'),
    },
    {
      id: 'assign-2',
      lang: 'C++20 (GCC)',
      langBadge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'C++ Boshlang‘ich: Ko‘rsatkichlar va massivlar',
      problemsCount: '4 ta masala',
      deadline: 'Topshirish: 15-May, 23:59',
      progress: 0,
      status: 'new',
      statusText: 'Yangi vazifa',
      statusBadge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      btnText: 'Boshlash',
      btnGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/20',
      action: () => onSelectAssignment('assign-2'),
    },
    {
      id: 'assign-3',
      lang: 'Python 3.12',
      langBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      title: 'Algoritmlar: Qidiruv va saralash algoritmlari',
      problemsCount: '6 ta masala',
      deadline: 'Bajarildi (100 ball)',
      progress: 100,
      status: 'completed',
      statusText: 'Yakunlangan',
      statusBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      btnText: 'Natijalarni ko‘rish',
      btnGradient: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10',
      action: onViewResults,
    },
    {
      id: 'assign-4',
      lang: 'C++20 (GCC)',
      langBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      title: 'Ma’lumotlar tuzilmalari: Stack va Queue',
      problemsCount: '5 ta masala',
      deadline: 'Muddati yaqinlashmoqda',
      progress: 20,
      status: 'in_progress',
      statusText: 'Muddatli',
      statusBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      btnText: 'Topshiriqqa o‘tish',
      btnGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20',
      action: () => onSelectAssignment('assign-4'),
    },
  ];

  const filtered = assignments.filter((a) => {
    if (activeFilter === 'in_progress') return a.status === 'in_progress';
    if (activeFilter === 'completed') return a.status === 'completed';
    return true;
  });

  return (
    <div
      className={`h-screen w-screen flex flex-col select-none overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-800'
      }`}
    >
      <TitleBar title="CodePractice — O‘quvchi boshqaruv paneli" onExitRequest={onRequestExit} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="dashboard"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader
            studentName="Aliyev Asliddin"
            grade="9-A sinf"
            breadcrumb="Boshqaruv paneli"
            onRequestExit={onRequestExit}
          />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            {/* Top Stat Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((st, i) => {
                const Icon = st.icon;
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-3xl border transition-all duration-200 hover:-translate-y-0.5 ${
                      theme === 'dark'
                        ? 'glass-card-dark border-white/5 hover:border-white/10 shadow-lg'
                        : 'glass-card-light border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {st.title}
                      </span>
                      <div className={`p-1.5 rounded-xl border ${st.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-xl font-extrabold tracking-tight font-mono">
                      {st.value}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {st.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Featured Action Banner */}
            <div
              className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900/70 border-blue-500/20 shadow-xl'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
              }`}
            >
              <div className="space-y-1.5 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>KUNLIK AMALIYOT MASHQI</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  1. Ikki sonni yig'indisi (Python 3.12 & C++)
                </h3>
                <p className="text-xs text-slate-300">
                  Matematik amallarni bajarish va test holatlarini tekshirish laboratoriyasi.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('code_editor')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95 cursor-pointer z-10 flex-shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Muharrirni ochish</span>
              </button>
            </div>

            {/* Assignments Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  Mening vazifalarim
                </h2>
                <p className="text-xs text-slate-400">
                  O‘qituvchi tomonidan biriktirilgan amaliy laboratoriya ishlari
                </p>
              </div>

              {/* Filter Tabs */}
              <div
                className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
                  theme === 'dark'
                    ? 'bg-[#090D1A] border-white/5 text-slate-400'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'hover:text-white'
                  }`}
                >
                  Barchasi ({assignments.length})
                </button>
                <button
                  onClick={() => setActiveFilter('in_progress')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeFilter === 'in_progress'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'hover:text-white'
                  }`}
                >
                  Bajarilmoqda
                </button>
                <button
                  onClick={() => setActiveFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeFilter === 'completed'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'hover:text-white'
                  }`}
                >
                  Bajarildi
                </button>
              </div>
            </div>

            {/* Assignment Cards List */}
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all duration-200 hover:border-blue-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    theme === 'dark'
                      ? 'glass-card-dark border-white/5 hover:bg-slate-900/60 shadow-lg'
                      : 'glass-card-light border-slate-200 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.langBadge}`}
                      >
                        {item.lang}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.statusBadge}`}
                      >
                        {item.statusText}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.problemsCount}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold tracking-tight">
                      {item.title}
                    </h4>

                    {/* Progress Bar & Deadline */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <div className="flex-1 max-w-xs flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-300">
                          {item.progress}%
                        </span>
                      </div>

                      <span className="text-[11px] flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {item.deadline}
                      </span>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={item.action}
                      className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer ${item.btnGradient}`}
                    >
                      <span>{item.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
