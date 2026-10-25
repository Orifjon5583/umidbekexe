import React from 'react';
import { Home, FileCode, CheckSquare, BarChart2, Settings, LogOut } from 'lucide-react';

interface Props {
  currentTab: 'dashboard' | 'assignment_details' | 'code_editor';
  onNavigate: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
  onRequestExit?: () => void;
}

export const Sidebar: React.FC<Props> = ({ currentTab, onNavigate, onRequestExit }) => {
  return (
    <aside className="w-56 bg-[#0B1528] text-slate-300 flex flex-col justify-between flex-shrink-0 select-none p-4 border-r border-[#15233E]">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2 pt-1 pb-2 border-b border-slate-800/80">
          <img
            src="/icon.png"
            alt="CodePractice"
            className="w-7 h-7 rounded-lg object-contain"
            style={{ width: '28px', height: '28px' }}
          />
          <div className="flex items-center gap-1">
            <span className="font-bold text-base text-white tracking-tight">Code</span>
            <span className="font-bold text-base text-blue-500 tracking-tight">Practice</span>
          </div>
        </div>

        {/* Navigation Menu (From Design: Bosh sahifa, Vazifalar, Natijalar, Sozlamalar, Chiqish) */}
        <nav className="space-y-1.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              currentTab === 'dashboard'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Bosh sahifa</span>
          </button>

          <button
            onClick={() => onNavigate('assignment_details')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              currentTab === 'assignment_details'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Vazifalar</span>
          </button>

          <button
            onClick={() => onNavigate('code_editor')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              currentTab === 'code_editor'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Kod laboratoriyasi</span>
          </button>

          <button
            onClick={() => alert("Natijalar bo'limi: Barcha topshiriqlar bo'yicha baholash va ballar jurnali")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Natijalar</span>
          </button>

          <button
            onClick={() => alert("Sozlamalar: Monaco muharrir o'lchami, shrift va shaxsiy parametrlar")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Sozlamalar</span>
          </button>
        </nav>
      </div>

      {/* Logout / Exit at Bottom */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={onRequestExit}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
};
