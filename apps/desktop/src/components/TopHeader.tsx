import React from 'react';
import { LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  studentName?: string;
  grade?: string;
  breadcrumb?: string;
  onRequestExit: () => void;
}

export const TopHeader: React.FC<Props> = ({
  studentName = 'Aliyev Asliddin',
  grade = '9-A sinf',
  breadcrumb = 'Bosh sahifa',
  onRequestExit,
}) => {
  const { theme } = useTheme();

  return (
    <header
      className={`h-12 px-6 flex items-center justify-between flex-shrink-0 select-none z-10 border-b transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#060913]/90 backdrop-blur-md border-white/5 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>CodePractice</span>
        <span className="text-slate-400">/</span>
        <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{breadcrumb}</span>
      </div>

      {/* Right Controls: Live status, Student profile, Exit button */}
      <div className="flex items-center gap-3">
        {/* Live Server Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Server faol</span>
        </div>

        {/* Student Avatar Pill */}
        <div
          className={`flex items-center gap-2.5 px-3 py-1 rounded-full border text-xs shadow-xs ${
            theme === 'dark'
              ? 'bg-[#0E1528] border-white/10 text-slate-200'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
            {studentName.charAt(0)}
          </div>
          <span className="font-semibold text-xs">{studentName}</span>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">({grade})</span>
        </div>

        {/* Exit Button */}
        <button
          onClick={onRequestExit}
          className="h-7 px-2.5 rounded-lg border border-slate-700/50 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          title="Ilovadan chiqish"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Chiqish</span>
        </button>
      </div>
    </header>
  );
};
