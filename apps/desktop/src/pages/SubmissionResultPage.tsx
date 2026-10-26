import React from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2, Clock, Award, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

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
  const { theme } = useTheme();

  return (
    <div
      className={`h-screen w-screen flex flex-col select-none overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-800'
      }`}
    >
      <TitleBar title="CodePractice — Topshirish natijasi" onExitRequest={onRequestExit} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="dashboard"
          onNavigate={(tab) => {
            if (tab === 'dashboard') onBackToDashboard();
            else onNavigateTab(tab);
          }}
          onRequestExit={onRequestExit}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader
            studentName="Aliyev Asliddin"
            breadcrumb="Topshirish natijasi"
            onRequestExit={onRequestExit}
          />

          <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            {/* Result Card */}
            <div
              className={`w-full max-w-lg rounded-3xl p-8 border shadow-2xl text-center space-y-6 transition-all ${
                theme === 'dark'
                  ? 'glass-panel-dark border-white/10 glow-border-emerald'
                  : 'glass-panel-light border-slate-200 shadow-xl'
              }`}
            >
              {/* Header: Emerald Check Badge */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    Tabriklaymiz!
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Topshiriq testlari to‘liq muvaffaqiyatli tekshirildi
                  </p>
                </div>
              </div>

              {/* Stats Box */}
              <div
                className={`p-5 rounded-2xl border grid grid-cols-2 gap-4 ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border-white/5'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="border-r border-white/10 pr-4">
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">
                    5 / 5
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    To‘g‘ri testlar
                  </div>
                </div>

                <div className="pl-4">
                  <div className="text-3xl font-extrabold font-mono text-blue-400">
                    100 ball
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    To‘plangan ball
                  </div>
                </div>
              </div>

              {/* Status & Time */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-slate-400">Holat:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 font-mono">
                    ACCEPTED (Qabul qilindi)
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sarflangan vaqt: <b className="text-slate-200">18 ms</b></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onBackToDashboard}
                  className={`flex-1 h-11 rounded-xl text-xs font-semibold border transition active:scale-95 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  Bosh sahifaga qaytish
                </button>

                <button
                  onClick={onReviewCode || onBackToDashboard}
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Kodni ko‘rish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
