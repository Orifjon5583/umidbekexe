import React from 'react';
import { Minus, Square, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  title?: string;
  onExitRequest?: () => void;
}

export const TitleBar: React.FC<Props> = ({
  title = "CodePractice — Dasturlash Laboratoriyasi",
  onExitRequest,
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleMinimize = () => {
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      try {
        import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
          getCurrentWindow().minimize();
        });
      } catch {}
    }
  };

  const handleMaximize = () => {
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      try {
        import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
          getCurrentWindow().toggleMaximize();
        });
      } catch {}
    }
  };

  const handleClose = () => {
    if (onExitRequest) {
      onExitRequest();
    } else if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      try {
        import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
          getCurrentWindow().close();
        });
      } catch {}
    }
  };

  return (
    <div
      data-tauri-drag-region
      className={`h-8 flex items-center justify-between px-3 select-none flex-shrink-0 text-xs font-medium z-50 border-b transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#05070E] text-slate-300 border-white/10'
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {/* Title & Official Brand Pill */}
      <div className="flex items-center gap-2.5 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
            CodePractice
          </span>
        </div>

        <span className="text-slate-400">•</span>

        <span className={`font-medium tracking-tight text-[11px] truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          {title}
        </span>
      </div>

      {/* Right Controls: Theme Switcher & Windows Controls */}
      <div className="flex items-center gap-1 -mr-3 h-full">
        {/* Quick Theme Switcher */}
        <button
          onClick={toggleTheme}
          className={`h-6 px-2 mr-2 rounded-md flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700/60'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
          title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-slate-300">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3 h-3 text-indigo-600" />
              <span className="text-[10px] text-slate-600">Dark</span>
            </>
          )}
        </button>

        {/* Windows 11 Control Buttons */}
        <button
          onClick={handleMinimize}
          className={`h-full px-3 transition flex items-center justify-center ${
            theme === 'dark'
              ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
          title="Kichraytirish"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleMaximize}
          className={`h-full px-3 transition flex items-center justify-center ${
            theme === 'dark'
              ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
          title="Kattalashtirish"
        >
          <Square className="w-3 h-3 stroke-[1.5]" />
        </button>

        <button
          onClick={handleClose}
          className="h-full px-3.5 hover:bg-red-600 text-slate-400 hover:text-white transition flex items-center justify-center"
          title="Yopish (PIN kod talab qilinadi)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
