import React from 'react';
import { CheckSquare, FileText, Code2, Cpu } from 'lucide-react';

interface Props {
  currentTab: 'dashboard' | 'assignment_details' | 'code_editor';
  onNavigate: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
}

export const Sidebar: React.FC<Props> = ({ currentTab, onNavigate }) => {
  return (
    <aside className="w-52 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 select-none p-3.5">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Asosiy navigatsiya
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Vazifalarim</span>
            </button>

            <button
              onClick={() => onNavigate('assignment_details')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentTab === 'assignment_details'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Vazifa tafsilotlari</span>
            </button>

            <button
              onClick={() => onNavigate('code_editor')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                currentTab === 'code_editor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Kod muharriri</span>
            </button>
          </nav>
        </div>

        {/* Runtime & Compiler Status */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Muhit va kompilyator
          </p>
          <div className="space-y-2 text-xs px-2 font-mono">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-sans">Python</span>
              <span className="text-slate-800 font-semibold">v3.11.4</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-sans">GCC C++</span>
              <span className="text-slate-800 font-semibold">v20 (std)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-sans">Test muhiti</span>
              <span className="text-emerald-600 font-semibold font-sans">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* RAM Resource Monitor Bar */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mb-1.5">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-400" />
            RAM:
          </span>
          <span className="font-mono text-slate-700">342 MB / 2048 MB</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '16%' }} />
        </div>
      </div>
    </aside>
  );
};
