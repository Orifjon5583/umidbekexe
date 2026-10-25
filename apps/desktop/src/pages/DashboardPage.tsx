import React, { useState } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import {
  Search,
  Clock,
  Code2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Play,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Info,
  Lock,
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
  onShowGuide,
  onRequestExit,
  onViewResults,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockCards = [
    {
      id: 'assign-1',
      lang: 'Python 3.10',
      status: 'in_progress',
      statusText: 'Bajarilmoqda',
      deadline: 'Bugun, 23:59 gacha',
      title: 'Python asoslari: For va While sikllari bilan ishlash',
      subtitle: '5 ta masala (3 tasi bajarildi) • Laboratoriya #4',
      progressLabel: 'Jarayon ko‘rsatkichi',
      percentage: 68,
      progressColor: 'bg-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700',
      footerLeft: 'Oxirgi tahrir: 45 daqiqa oldin',
      buttonText: 'Davom etish',
      buttonAction: 'continue',
    },
    {
      id: 'assign-2',
      lang: 'C++ 20',
      status: 'new',
      statusText: 'Yangi',
      deadline: '28-Aprel, 18:00 gacha',
      title: 'C++ Massivlar va Ko‘rsatkichlar (Pointers)',
      subtitle: '4 ta masala • Xotira bilan ishlash',
      progressLabel: 'Boshlanmagan',
      percentage: 0,
      progressColor: 'bg-slate-300',
      badgeBg: 'bg-slate-100 text-slate-700',
      footerLeft: 'Kutilayotgan vaqt: 60 daq',
      buttonText: 'Boshlash',
      buttonAction: 'start',
    },
    {
      id: 'assign-3',
      lang: 'Python 3.10',
      status: 'completed',
      statusText: 'Bajarildi',
      deadline: 'Topshirildi: Kecha, 16:30',
      title: 'Python: Satrlar va String metodlari amaliyoti',
      subtitle: '6 ta masala (6 tasi bajarildi) • 100/100 ball',
      progressLabel: 'Barcha testlar muvaffaqiyatli topshirildi',
      percentage: 100,
      progressColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      footerLeft: 'Baholandi: A+',
      buttonText: 'Natijani ko‘rish',
      buttonAction: 'results',
    },
    {
      id: 'assign-4',
      lang: 'C++ 20',
      status: 'overdue',
      statusText: 'Muddati o‘tgan',
      deadline: 'Muddati o‘tgan: 22-Aprel',
      title: 'C++ Funksiyalar va Rekursiya',
      subtitle: '3 ta masala • Topshirish yopilgan',
      progressLabel: 'Muddat tugadi (Yechim qabul qilinmaydi)',
      percentage: 0,
      progressColor: 'bg-red-400',
      badgeBg: 'bg-red-50 text-red-700',
      footerLeft: 'Qayta urinish: Ruxsat berilmagan',
      buttonText: 'Ko‘rish',
      buttonAction: 'view',
    },
  ];

  const filteredCards = mockCards.filter((card) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'in_progress'
        ? card.status === 'in_progress'
        : activeFilter === 'completed'
        ? card.status === 'completed'
        : card.status === 'overdue';

    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800 select-none overflow-hidden font-sans">
      <TitleBar onExitRequest={onRequestExit} />
      <TopHeader studentName="Azizbek Rahimov" grade="9-A sinf" onRequestExit={onRequestExit} />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar currentTab="dashboard" onNavigate={onNavigateTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Title & Stats Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mening vazifalarim</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Xush kelibsiz, <b>Azizbek</b>! Sizda 3 ta faol vazifa mavjud.
              </p>
            </div>

            {/* Stat Pills */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                4 Jami
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                1 Tugallangan
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                1 Kechikkan
              </span>
            </div>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Barchasi (4)
              </button>
              <button
                onClick={() => setActiveFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFilter === 'in_progress'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bajarilmoqda (2)
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFilter === 'completed'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bajarildi (1)
              </button>
              <button
                onClick={() => setActiveFilter('overdue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFilter === 'overdue'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Muddati o‘tgan (1)
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Vazifalar bo‘yicha qidiruv..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Cards 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top tags row */}
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        &lt;&gt; {card.lang}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${card.badgeBg}`}>
                        ● {card.statusText}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {card.deadline}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{card.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{card.subtitle}</p>

                  {/* Progress bar with percentage */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mb-1">
                      <span>{card.progressLabel}</span>
                      <span className="font-bold text-slate-800">{card.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-1.5 rounded-full ${card.progressColor}`} style={{ width: `${card.percentage}%` }} />
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">{card.footerLeft}</span>

                  <button
                    onClick={() => {
                      if (card.buttonAction === 'results') {
                        onViewResults();
                      } else {
                        onSelectAssignment(card.id);
                      }
                    }}
                    className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs ${
                      card.buttonAction === 'continue'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : card.buttonAction === 'start'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : card.buttonAction === 'results'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    <span>{card.buttonText}</span>
                    {card.buttonAction === 'continue' || card.buttonAction === 'start' ? (
                      <ArrowRight className="w-3.5 h-3.5" />
                    ) : null}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Notification Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Yangi topshiriqlar bo‘yicha bildirishnoma</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  O‘qituvchi tomonidan yangi dars topshiriqlari biriktirilganda bu yerda avtomatik aks etadi. Agar ro‘yxat bo‘sh qolsa: «Hozircha sizga vazifa berilmagan» axborot holati ishga tushadi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onShowGuide}
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                Qoidalarni o‘qish
              </button>
              <button
                onClick={() => window.location.reload()}
                className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Yangilash
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
