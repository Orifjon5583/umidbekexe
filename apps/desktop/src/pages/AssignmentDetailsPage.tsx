import React from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { ArrowLeft, Play, Calendar, Clock, Code2 } from 'lucide-react';

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
  const problems = [
    {
      id: 'prob-1',
      num: '1',
      title: 'Salom dunyo',
      difficulty: 'Oson',
      diffBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      points: '10 ball',
      status: 'Bajarildi',
      statusBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'prob-2',
      num: '2',
      title: 'Ikki son yig‘indisi',
      difficulty: 'Oson',
      diffBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      points: '15 ball',
      status: 'Bajarilmoqda',
      statusBg: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'prob-3',
      num: '3',
      title: 'Katta sonni topish',
      difficulty: 'O‘rta',
      diffBg: 'bg-amber-50 text-amber-700 border-amber-200',
      points: '20 ball',
      status: 'Yangi',
      statusBg: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'prob-4',
      num: '4',
      title: 'Massiv tahlili',
      difficulty: 'O‘rta',
      diffBg: 'bg-amber-50 text-amber-700 border-amber-200',
      points: '25 ball',
      status: 'Yangi',
      statusBg: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'prob-5',
      num: '5',
      title: 'Fibonachchi',
      difficulty: 'Qiyin',
      diffBg: 'bg-rose-50 text-rose-700 border-rose-200',
      points: '30 ball',
      status: 'Yangi',
      statusBg: 'bg-slate-100 text-slate-600',
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] text-slate-800 select-none overflow-hidden font-sans">
      <TitleBar title="CodePractice - Vazifa haqida ma’lumot" onExitRequest={onRequestExit} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="assignment_details"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader
            studentName="Aliyev Asliddin"
            breadcrumb="Vazifa haqida ma’lumot"
            onRequestExit={onRequestExit}
          />

          <main className="flex-1 overflow-y-auto p-8 max-w-4xl space-y-6">
            {/* Back Button matching Item 4 */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ortga</span>
            </button>

            {/* Assignment Main Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Python asoslari
                </h1>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Bu vazifada siz Python dasturlash tilida asosiy masalalarni yechasiz. Masalalar matematik, qator va massivlar bilan bog‘liq.
                </p>
              </div>

              {/* Meta information row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Dasturlash tili:</span>
                  <span className="font-bold text-slate-800 mt-0.5 inline-flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-blue-600" />
                    Python
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Boshlanish sanasi:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    2025-05-05 10:00
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Topshirish muddati:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    2025-05-10 23:59
                  </span>
                </div>
              </div>

              {/* Problems List */}
              <div className="pt-2">
                <h2 className="text-sm font-bold text-slate-900 mb-3">
                  Masalalar ro‘yxati:
                </h2>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {problems.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onStartProblem(p.id)}
                      className="p-3.5 bg-white hover:bg-slate-50 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {p.num}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{p.title}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${p.diffBg}`}>
                          {p.difficulty}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{p.points}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${p.statusBg}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-3">
                <button
                  onClick={() => onStartProblem(problems[0].id)}
                  className="w-full h-11 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Ishlashni boshlash</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
