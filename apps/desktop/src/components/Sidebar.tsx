import React from 'react';
import { Home, FileCode, CheckSquare, BarChart2, User, LogOut, Sparkles, Gift } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type DesktopNavTab = 'dashboard' | 'assignments' | 'assignment_details' | 'code_editor' | 'results' | 'rewards' | 'profile';

interface Props {
  currentTab: DesktopNavTab;
  onNavigate: (tab: DesktopNavTab) => void;
  onRequestExit?: () => void;
}

export const Sidebar: React.FC<Props> = ({ currentTab, onNavigate, onRequestExit }) => {
  const { theme } = useTheme();

  const mainNavItems = [
    {
      id: 'dashboard' as const,
      label: 'Bosh sahifa',
      icon: Home,
      badge: null,
    },
    {
      id: 'assignments' as const,
      label: 'Topshiriqlar',
      icon: CheckSquare,
      badge: '4 ta',
    },
    {
      id: 'code_editor' as const,
      label: 'Kod muharriri',
      icon: FileCode,
      badge: 'Faol',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'results' as const,
      label: 'Natijalar',
      icon: BarChart2,
      badge: null,
    },
    {
      id: 'rewards' as const,
      label: 'Sovg‘alar',
      icon: Gift,
      badge: 'Yangi 🔥',
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'profile' as const,
      label: 'Profil va muhit',
      icon: User,
      badge: null,
    },
  ];

  return (
    <aside
      className={`w-60 flex flex-col justify-between flex-shrink-0 select-none p-4 border-r transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#080C1A]/95 backdrop-blur-xl border-white/5 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-1 pb-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center p-1.5 shadow-md shadow-blue-500/20">
            <img
              src="/icon.png"
              alt="CodePractice"
              className="w-full h-full object-contain filter brightness-110"
            />
          </div>
          <div>
            <div className="flex items-center gap-1 font-extrabold text-sm tracking-tight">
              <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Code</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                Practice
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
              STUDENT EDITION
            </div>
          </div>
        </div>

        {/* Asosiy bo‘limlar ro‘yxati */}
        <nav className="space-y-1">
          <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Asosiy bo‘limlar
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor ||
                          (theme === 'dark'
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Status Card & Logout */}
      <div className="space-y-3 pt-3 border-t border-white/5">
        <div
          className={`p-3 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-blue-950/30 to-indigo-950/20 border-blue-500/20 text-slate-300'
              : 'bg-blue-50/70 border-blue-200/80 text-blue-950'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Murabbiy faol</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Kod va xatolarni tushuntirish uchun doimo yordamga tayyor.
          </p>
        </div>

        <button
          onClick={onRequestExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Ilovadan chiqish</span>
        </button>
      </div>
    </aside>
  );
};
