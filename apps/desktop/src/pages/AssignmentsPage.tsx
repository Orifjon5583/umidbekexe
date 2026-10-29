import React, { useState } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import {
  CheckSquare,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  Code,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Flame,
} from 'lucide-react';

interface Props {
  onSelectAssignment: (assignmentId: string) => void;
  onNavigateTab: (tab: any) => void;
  onRequestExit: () => void;
}

export const AssignmentsPage: React.FC<Props> = ({
  onSelectAssignment,
  onNavigateTab,
  onRequestExit,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'new' | 'in_progress' | 'completed' | 'expired'>('all');

  const assignments = [
    {
      id: 'assign-1',
      title: '1-topshiriq: Chiziqli algoritmlar va Arifmetik amallar',
      description: 'Ikki son yig‘indisini hisoblash, qoldiqli bo‘lish va oddiy formulalar bilan ishlash mashqlari.',
      status: 'in_progress' as const,
      statusLabel: 'Jarayonda',
      difficulty: 'Oson',
      allowedLanguages: ['Python', 'C++'],
      dueDate: 'Ertaga, 23:59',
      problemsCount: 4,
      solvedCount: 2,
      score: 50,
      maxScore: 100,
    },
    {
      id: 'assign-2',
      title: '2-topshiriq: Tarmoqlanuvchi shartli konstruksiyalar',
      description: 'if-else va switch-case shart operatorlari orqali masalalarni yechish va mantiqiy tekshiruvlar.',
      status: 'new' as const,
      statusLabel: 'Yangi',
      difficulty: 'O‘rta',
      allowedLanguages: ['Python', 'C++'],
      dueDate: '3 kundan keyin',
      problemsCount: 5,
      solvedCount: 0,
      score: 0,
      maxScore: 100,
    },
    {
      id: 'assign-3',
      title: '3-topshiriq: Takrorlanuvchi sikl operatorlari',
      description: 'for va while sikllari, faktorial hisoblash, karra jadvali va ketma-ketliklar bilan ishlash.',
      status: 'completed' as const,
      statusLabel: 'Bajarilgan',
      difficulty: 'O‘rta',
      allowedLanguages: ['Python', 'C++'],
      dueDate: 'Yakunlangan',
      problemsCount: 3,
      solvedCount: 3,
      score: 100,
      maxScore: 100,
    },
    {
      id: 'assign-4',
      title: '4-topshiriq: Massivlar va ro‘yxatlar ustida amallar',
      description: 'Bir o‘lchamli massiv elementlarini tartiblash, qidiruv va maksimal/minimal qiymatlarni aniqlash.',
      status: 'new' as const,
      statusLabel: 'Yangi',
      difficulty: 'Qiyin',
      allowedLanguages: ['Python', 'C++'],
      dueDate: '10 kundan keyin',
      problemsCount: 4,
      solvedCount: 0,
      score: 0,
      maxScore: 100,
    },
  ];

  const filtered = assignments.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
        breadcrumb="Topshiriqlar ro‘yxati"
        onRequestExit={onRequestExit}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="assignments"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Sarlavha va filtrlar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
                <CheckSquare className="w-6 h-6 text-blue-500" />
                <span>O‘quv topshiriqlari va uy vazifalari</span>
              </h1>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                O‘qituvchingiz tomonidan biriktirilgan faol va kelgusi dasturlash topshiriqlari
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono px-3 py-1.5 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-white/10 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700 shadow-xs'
              }`}>
                Jami: <strong className="text-blue-500 font-bold">{assignments.length} ta vazifa</strong>
              </span>
            </div>
          </div>

          {/* Qidiruv va Filtr teglari */}
          <div
            className={`p-3 rounded-2xl border flex flex-col md:flex-row items-center gap-3 ${
              theme === 'dark'
                ? 'glass-card-dark border-white/10'
                : 'glass-card-light border-slate-200 shadow-sm'
            }`}
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Topshiriq nomi yoki tavsifi bo‘yicha qidiring..."
                style={{
                  color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  WebkitTextFillColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                }}
                className={`w-full h-9 pl-9 pr-4 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition ${
                  theme === 'dark'
                    ? 'bg-[#0A0F1E] border-white/10 placeholder-slate-500'
                    : 'bg-slate-100 border-slate-300 placeholder-slate-400 focus:bg-white'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'in_progress', label: 'Jarayonda' },
                { id: 'new', label: 'Yangi' },
                { id: 'completed', label: 'Bajarilgan' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedStatus(btn.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedStatus === btn.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topshiriqlar ro‘yxati kartochkalari */}
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all duration-200 group hover:shadow-xl ${
                  theme === 'dark'
                    ? 'glass-card-dark border-white/10 hover:border-blue-500/40'
                    : 'glass-card-light border-slate-200 hover:border-blue-500/50 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                          item.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'in_progress'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.statusLabel}
                      </span>

                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        Qiyinlik: <strong className="font-semibold text-slate-200 dark:text-slate-100">{item.difficulty}</strong>
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Muddati: <strong className={item.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>{item.dueDate}</strong></span>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold tracking-tight group-hover:text-blue-400 transition">
                      {item.title}
                    </h3>

                    <p className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                        <Code className="w-3.5 h-3.5 text-blue-400" />
                        <span>Ruxsat etilgan: {item.allowedLanguages.join(', ')}</span>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item.solvedCount} / {item.problemsCount} masala yechildi</span>
                      </div>
                    </div>
                  </div>

                  {/* O'ng tomon: Boshlash/Ochish tugmasi */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">To‘plangan ball</div>
                      <div className="text-lg font-black font-mono text-blue-500">
                        {item.score} / {item.maxScore}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectAssignment(item.id)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>{item.status === 'completed' ? 'Ko‘rib chiqish' : 'Vazifani boshlash'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
