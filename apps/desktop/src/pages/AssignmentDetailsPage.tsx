import React from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Play, Calendar, Clock, Code2, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface Props {
  assignmentId: string;
  onBack: () => void;
  onStartProblem: (problemId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
  onRequestExit: () => void;
}

export const AssignmentDetailsPage: React.FC<Props> = ({
  onBack,
  onStartProblem,
  onNavigateTab,
  onRequestExit,
}) => {
  const { theme } = useTheme();

  const problems = [
    {
      id: 'prob-1',
      num: '1',
      title: 'Ikki sonni yig\'indisi',
      difficulty: 'Oson',
      diffBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      points: '100 ball',
      status: 'Bajarilmoqda',
      statusBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      actionText: 'Kodni ochish',
      actionColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white',
    },
    {
      id: 'prob-2',
      num: '2',
      title: 'Ro‘yxatdagi eng katta juft son',
      difficulty: 'O‘rta',
      diffBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      points: '120 ball',
      status: 'Yangi',
      statusBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      actionText: 'Boshlash',
      actionColor: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10',
    },
    {
      id: 'prob-3',
      num: '3',
      title: 'Tub sonlarni aniqlash algoritmi',
      difficulty: 'O‘rta',
      diffBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      points: '150 ball',
      status: 'Yangi',
      statusBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      actionText: 'Boshlash',
      actionColor: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10',
    },
    {
      id: 'prob-4',
      num: '4',
      title: 'Massiv elementlarini aylantirish',
      difficulty: 'Qiyin',
      diffBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      points: '200 ball',
      status: 'Yangi',
      statusBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      actionText: 'Boshlash',
      actionColor: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10',
    },
  ];

  return (
    <div
      className={`h-screen w-screen flex flex-col select-none overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-800'
      }`}
    >
      <TitleBar title="CodePractice — Vazifa tafsilotlari" onExitRequest={onRequestExit} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="assignment_details"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader
            studentName="Aliyev Asliddin"
            grade="9-A sinf"
            breadcrumb="Vazifalar ro‘yxati"
            onRequestExit={onRequestExit}
          />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            {/* Top Back Navigation */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bosh sahifaga qaytish</span>
            </button>

            {/* Assignment Header Card */}
            <div
              className={`p-6 rounded-2xl border transition ${
                theme === 'dark'
                  ? 'glass-panel-dark border-white/10 shadow-xl'
                  : 'glass-panel-light border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Python 3.12 & C++
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">4 ta amaliy masala</span>
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight">
                    Algoritmlar va Ma’lumotlar tuzilmalari laboratoriyasi
                  </h1>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Ushbu bo‘limda berilgan masalalarni kompyuteringizdagi izolyatsiya qilingan ish muhitida bajarib tekshiring.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl border text-center ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-white/5'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-lg font-mono font-bold text-emerald-400">570</div>
                    <div className="text-[10px] text-slate-400">Jami ball</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problems List */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Topshiriq masalalari
              </h2>

              {problems.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-4 ${
                    theme === 'dark'
                      ? 'glass-panel-dark border-white/5 hover:border-blue-500/30 hover:bg-slate-900/50'
                      : 'glass-panel-light border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      #{p.num}
                    </div>

                    <div className="truncate space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight truncate">
                          {p.title}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.diffBg}`}>
                          {p.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-mono text-slate-300 font-semibold">{p.points}</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${p.statusBg}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartProblem(p.id)}
                    className={`h-8 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer flex-shrink-0 ${p.actionColor}`}
                  >
                    <span>{p.actionText}</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
