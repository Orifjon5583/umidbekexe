import React from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { CheckCircle2, Clock, Award, ArrowLeft, ArrowRight } from 'lucide-react';

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
  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] text-slate-800 select-none overflow-hidden font-sans">
      <TitleBar title="CodePractice - Topshirish natijasi" onExitRequest={onRequestExit} />

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

          <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
            {/* Result Card matching Poster Item 8 */}
            <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-8 shadow-lg text-center space-y-6">
              {/* Header: Green Check + Natija */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Natija
                </h1>
              </div>

              {/* Stats Box (8 / 10 Muvaffaqiyatli testlar, 10 Jami testlar) */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 grid grid-cols-2 gap-4">
                <div className="border-r border-slate-200 pr-4">
                  <div className="text-3xl font-extrabold text-emerald-600">8 / 10</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    Muvaffaqiyatli testlar
                  </div>
                </div>

                <div className="pl-4">
                  <div className="text-3xl font-extrabold text-slate-800">10</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    Jami testlar
                  </div>
                </div>
              </div>

              {/* Status & Time */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-slate-500">Holat:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    Qabul qilindi
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sarflangan vaqt: <b>0:45</b></span>
                </div>
              </div>

              {/* Action Buttons matching Poster Item 8 */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={onBackToDashboard}
                  className="flex-1 h-11 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs transition"
                >
                  Vazifalarga qaytish
                </button>

                <button
                  onClick={onReviewCode || onBackToDashboard}
                  className="flex-1 h-11 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-sm"
                >
                  Keyingi masala
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
