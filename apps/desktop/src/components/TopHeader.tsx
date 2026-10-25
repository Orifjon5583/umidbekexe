import React from 'react';
import { User, LogOut } from 'lucide-react';

interface Props {
  studentName?: string;
  grade?: string;
  breadcrumb?: string;
  onRequestExit: () => void;
}

export const TopHeader: React.FC<Props> = ({
  studentName = 'Azizbek Rahimov',
  grade = '9-A sinf',
  breadcrumb = 'Amaliyot > Python & C++ Laboratoriyasi',
  onRequestExit,
}) => {
  return (
    <header className="h-12 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between flex-shrink-0 select-none z-10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/icon.png"
            alt="CodePractice"
            className="w-7 h-7 rounded-lg object-contain shadow-xs border border-slate-200/60"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex items-center gap-1 font-bold text-sm tracking-tight leading-none">
            <span className="text-slate-900 font-extrabold tracking-tight">Code</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-extrabold">
              Practice
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-semibold ml-1 border border-blue-100">
              v2.4
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        <div className="text-xs text-slate-500 font-medium">
          {breadcrumb}
        </div>
      </div>

      {/* Student Profile & Exit */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800">{studentName}</span>
          <span className="text-[10px] text-slate-400 font-medium">{grade}</span>
        </div>

        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center text-xs font-bold shadow-xs">
          <User className="w-3.5 h-3.5" />
        </div>

        <button
          onClick={onRequestExit}
          className="h-8 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Chiqish</span>
        </button>
      </div>
    </header>
  );
};
