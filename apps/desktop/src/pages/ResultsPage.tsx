import React, { useState } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import {
  BarChart2,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Calendar,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Download,
  Filter,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: any) => void;
  onRequestExit: () => void;
  onOpenCodeEditor: (assignmentId: string, problemId: string) => void;
}

export const ResultsPage: React.FC<Props> = ({
  onNavigateTab,
  onRequestExit,
  onOpenCodeEditor,
}) => {
  const { theme } = useTheme();

  const attemptsHistory = [
    {
      id: 'sub-104',
      assignmentTitle: '1-topshiriq: Chiziqli algoritmlar',
      problemTitle: 'Masala #1: Ikki son yig‘indisi',
      language: 'Python 3.11',
      status: 'accepted',
      statusLabel: 'Qabul qilindi (Accepted)',
      score: 100,
      passedTests: 10,
      totalTests: 10,
      timeMs: 42,
      memoryMb: 12.4,
      date: 'Bugun, 15:45',
    },
    {
      id: 'sub-103',
      assignmentTitle: '1-topshiriq: Chiziqli algoritmlar',
      problemTitle: 'Masala #1: Ikki son yig‘indisi',
      language: 'Python 3.11',
      status: 'wrong_answer',
      statusLabel: 'Xato javob (Wrong Answer)',
      score: 80,
      passedTests: 8,
      totalTests: 10,
      timeMs: 38,
      memoryMb: 12.1,
      date: 'Bugun, 15:30',
    },
    {
      id: 'sub-102',
      assignmentTitle: '1-topshiriq: Chiziqli algoritmlar',
      problemTitle: 'Masala #2: Qoldiqli bo‘lish',
      language: 'C++ 17',
      status: 'accepted',
      statusLabel: 'Qabul qilindi (Accepted)',
      score: 100,
      passedTests: 10,
      totalTests: 10,
      timeMs: 18,
      memoryMb: 10.2,
      date: 'Kecha, 18:20',
    },
    {
      id: 'sub-101',
      assignmentTitle: '3-topshiriq: Takrorlanuvchi sikl operatorlari',
      problemTitle: 'Masala #1: Faktorial hisoblash',
      language: 'Python 3.11',
      status: 'accepted',
      statusLabel: 'Qabul qilindi (Accepted)',
      score: 100,
      passedTests: 10,
      totalTests: 10,
      timeMs: 45,
      memoryMb: 12.5,
      date: '25-oktabr, 11:15',
    },
  ];

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors duration-200 ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-900'
      }`}
    >
      <TitleBar />
      <TopHeader
        studentName="Aliyev Asliddin"
        grade="9-A sinf"
        breadcrumb="Natijalar jurnali"
        onRequestExit={onRequestExit}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="results"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Sarlavha va Umumiy Natijalar ko‘rsatkichlari */}
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <BarChart2 className="w-6 h-6 text-blue-500" />
              <span>O‘quv natijalari va tekshiruvlar tarixi</span>
            </h1>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Barcha topshirilgan kodlar, avtomatik test sinovlari va o‘qituvchi baholari
            </p>
          </div>

          {/* 4 ta KPI Vidjetlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>O‘rtacha natija</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-2 text-blue-500">95%</div>
              <div className="text-[11px] text-emerald-400 mt-1">A’lo darajadagi ko‘rsatkich</div>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Muvaffaqiyatli testlar</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-2 text-emerald-500">38 / 40</div>
              <div className="text-[11px] text-slate-400 mt-1">95% test holatlari o‘tdi</div>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Jami urinishlar</span>
                <RotateCcw className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-2 text-cyan-500">4 ta</div>
              <div className="text-[11px] text-slate-400 mt-1">Har bir masala uchun o‘rtacha 1.3</div>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>O‘rtacha tezlik</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-2 text-purple-500">35 ms</div>
              <div className="text-[11px] text-slate-400 mt-1">Vaqt chegarasidan ancha past</div>
            </div>
          </div>

          {/* Urinishlar jadvali */}
          <div
            className={`rounded-3xl border overflow-hidden ${
              theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
            }`}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">Oxirgi urinishlar va tekshiruvlar ro‘yxati</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Har bir urinish bo‘yicha 10 ta test natijasi qayd etilgan</p>
              </div>

              <span className={`text-[11px] font-mono px-3 py-1 rounded-xl border ${
                theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {attemptsHistory.length} ta yuborilgan kod
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                    <th className="py-3 px-5 font-semibold">Topshiriq va Masala</th>
                    <th className="py-3 px-4 font-semibold">Til</th>
                    <th className="py-3 px-4 font-semibold">Holati</th>
                    <th className="py-3 px-4 font-semibold">Testlar</th>
                    <th className="py-3 px-4 font-semibold">Ball</th>
                    <th className="py-3 px-4 font-semibold">Vaqt</th>
                    <th className="py-3 px-4 font-semibold">Sana</th>
                    <th className="py-3 px-5 text-right font-semibold">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {attemptsHistory.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition ${
                        theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-5 font-sans font-medium">
                        <div className="font-bold text-xs">{row.problemTitle}</div>
                        <div className="text-[10px] text-slate-400">{row.assignmentTitle}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-xs">{row.language}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            row.status === 'accepted'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {row.status === 'accepted' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{row.statusLabel}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-bold">
                        <span className={row.passedTests === row.totalTests ? 'text-emerald-400' : 'text-amber-400'}>
                          {row.passedTests}/{row.totalTests} o‘tdi
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-black text-blue-500">
                        {row.score}/100
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {row.timeMs} ms
                      </td>

                      <td className="py-3.5 px-4 text-xs font-sans text-slate-400">
                        {row.date}
                      </td>

                      <td className="py-3.5 px-5 text-right font-sans">
                        <button
                          onClick={() => onOpenCodeEditor('assign-1', 'prob-1')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold text-xs border border-blue-500/30 transition cursor-pointer"
                        >
                          Kodni ko‘rish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
