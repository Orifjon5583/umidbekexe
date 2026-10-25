import React, { useState } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { Code2, ArrowRight } from 'lucide-react';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const assignments = [
    {
      id: 'assign-1',
      lang: 'Python',
      langColor: 'bg-blue-50 text-blue-600 border-blue-200',
      title: 'Python asoslari',
      problemsCount: '5 masala',
      deadline: 'Topshirish muddati: 2025-05-10',
      status: 'in_progress',
      statusText: 'Bajarilmoqda',
      statusColor: 'bg-blue-50 text-blue-600 border border-blue-200',
      btnText: 'Davom etish',
      btnColor: 'bg-[#2563EB] hover:bg-blue-700 text-white',
      action: () => onSelectAssignment('assign-1'),
    },
    {
      id: 'assign-2',
      lang: 'C++',
      langColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      title: 'C++ boshlang‘ich',
      problemsCount: '4 masala',
      deadline: 'Topshirish muddati: 2025-05-15',
      status: 'new',
      statusText: 'Yangi',
      statusColor: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      btnText: 'Boshlash',
      btnColor: 'bg-[#2563EB] hover:bg-blue-700 text-white',
      action: () => onSelectAssignment('assign-2'),
    },
    {
      id: 'assign-3',
      lang: 'Python',
      langColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: 'Algoritmlar',
      problemsCount: '6 masala',
      deadline: 'Topshirish muddati: 2025-05-20',
      status: 'completed',
      statusText: 'Bajarildi',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      btnText: 'Ko‘rish',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      action: onViewResults,
    },
    {
      id: 'assign-4',
      lang: 'C++',
      langColor: 'bg-rose-50 text-rose-600 border-rose-200',
      title: 'Ma’lumotlar tuzilmalari',
      problemsCount: '5 masala',
      deadline: 'Topshirish muddati: 2025-05-25',
      status: 'overdue',
      statusText: 'Muddati o‘tgan',
      statusColor: 'bg-red-50 text-red-600 border border-red-200',
      btnText: 'Davom etish',
      btnColor: 'bg-slate-700 hover:bg-slate-800 text-white',
      action: () => onSelectAssignment('assign-4'),
    },
  ];

  const filtered = assignments.filter((a) => {
    if (activeFilter === 'in_progress') return a.status === 'in_progress';
    if (activeFilter === 'completed') return a.status === 'completed';
    return true;
  });

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] text-slate-800 select-none overflow-hidden font-sans">
      {/* 1. Custom TitleBar */}
      <TitleBar title="CodePractice - Asosiy sahifa" onExitRequest={onRequestExit} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Dark Sidebar matching Poster Item 3 */}
        <Sidebar
          currentTab="dashboard"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        {/* Center Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header with Aliyev Asliddin profile */}
          <TopHeader
            studentName="Aliyev Asliddin"
            breadcrumb="Mening vazifalarim"
            onRequestExit={onRequestExit}
          />

          <main className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* Title & Filter Tabs (Item 3 on Poster) */}
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Mening vazifalarim
              </h1>

              {/* Tabs: Barchasi, Bajarilmoqda, Bajarildi */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeFilter === 'all'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Barchasi
                </button>
                <button
                  onClick={() => setActiveFilter('in_progress')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeFilter === 'in_progress'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Bajarilmoqda
                </button>
                <button
                  onClick={() => setActiveFilter('completed')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeFilter === 'completed'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Bajarildi
                </button>
              </div>
            </div>

            {/* Stacked Assignment Cards matching Poster Item 3 */}
            <div className="space-y-3.5">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between hover:border-blue-200 transition"
                >
                  {/* Left: Language icon + Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                      <Code2 className="w-5 h-5 text-blue-600 mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-600">{item.lang}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>{item.problemsCount}</span>
                        <span>•</span>
                        <span>{item.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status badge + Action Button */}
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-lg ${item.statusColor}`}>
                      {item.statusText}
                    </span>

                    <button
                      onClick={item.action}
                      className={`h-9 px-5 rounded-lg text-xs font-semibold transition shadow-xs ${item.btnColor}`}
                    >
                      {item.btnText}
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
