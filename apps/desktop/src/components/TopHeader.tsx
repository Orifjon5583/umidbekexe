import React from 'react';
import { User, LogOut } from 'lucide-react';

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
  return (
    <header className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 select-none z-10">
      {/* Breadcrumb / Title */}
      <div className="text-xs font-semibold text-slate-500">
        {breadcrumb}
      </div>

      {/* Student Profile Pill (Exact match to poster: Aliyev Asliddin) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
            A
          </div>
          <span className="font-semibold text-slate-800">{studentName}</span>
        </div>

        <button
          onClick={onRequestExit}
          className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-medium flex items-center gap-1.5 transition"
          title="Ilovadan chiqish"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Chiqish</span>
        </button>
      </div>
    </header>
  );
};
