import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  studentName?: string;
  grade?: string;
  breadcrumb?: string;
  onRequestExit?: () => void;
}

export const TopHeader: React.FC<Props> = ({
  studentName = 'Aliyev Asliddin',
  grade = '9-A sinf',
  breadcrumb = 'Bosh sahifa',
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`h-14 px-6 flex items-center justify-between flex-shrink-0 select-none z-10 border-b transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#070B18]/90 backdrop-blur-md border-blue-500/15 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2.5 text-xs font-semibold">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 animate-pulse" />
        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Mintera</span>
        <span className="text-slate-500">/</span>
        <span className={theme === 'dark' ? 'text-white' : 'text-slate-900 font-bold'}>{breadcrumb}</span>
      </div>

      {/* Right Controls: Theme Toggle, Server status, Student Profile (NO DUPLICATE EXIT) */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className={`h-8 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer border ${
            theme === 'dark'
              ? 'bg-[#0E1738] hover:bg-[#152352] text-amber-300 border-amber-500/20 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-xs'
          }`}
          title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] text-slate-200 font-medium">Yorug‘</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] text-slate-700 font-medium">Qorong‘i</span>
            </>
          )}
        </button>

        {/* Live Server Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Server faol</span>
        </div>

        {/* Student Avatar Pill (Mintera Royal Blue & Gold Accent) */}
        <div
          className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border text-xs shadow-sm transition-colors ${
            theme === 'dark'
              ? 'bg-[#0E1738] border-blue-500/25 text-slate-200'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-amber-500 p-[1.5px] shadow-sm flex items-center justify-center">
            <span className="w-full h-full rounded-full bg-[#0A1028] flex items-center justify-center text-amber-300 font-bold text-[11px]">
              {studentName.charAt(0)}
            </span>
          </div>
          <span className="font-bold text-xs text-slate-100">{studentName}</span>
          <span className="text-[10px] text-amber-400 font-mono font-semibold hidden md:inline">
            ({grade})
          </span>
        </div>
      </div>
    </header>
  );
};
