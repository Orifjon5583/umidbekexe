import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  title?: string;
  onExitRequest?: () => void;
}

export const TitleBar: React.FC<Props> = ({
  title = "Mintera — Dasturlash Laboratoriyasi",
  onExitRequest,
}) => {
  const { theme } = useTheme();

  // Check if running inside frameless Tauri window
  const isTauri = typeof window !== 'undefined' && Boolean((window as any).__TAURI_INTERNALS__);

  // If running in Edge App mode (which provides native Windows titlebar with -, □, X)
  // or a standard browser, hide duplicate in-page titlebar to prevent double headers.
  if (!isTauri) {
    return null;
  }

  const handleMinimize = () => {
    try {
      import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        getCurrentWindow().minimize();
      });
    } catch {}
  };

  const handleMaximize = () => {
    try {
      import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        getCurrentWindow().toggleMaximize();
      });
    } catch {}
  };

  const handleClose = () => {
    if (onExitRequest) {
      onExitRequest();
    } else {
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
          ? 'bg-[#070B18] text-slate-300 border-blue-500/10'
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {/* Brand Title Pill */}
      <div className="flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30">
          <img src="/icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
            Mintera
          </span>
        </div>

        <span className="text-slate-500">•</span>

        <span
          className={`font-medium tracking-tight text-[11px] truncate ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {title}
        </span>
      </div>

      {/* Windows Controls */}
      <div className="flex items-center gap-1 -mr-3 h-full">
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
          className="h-full px-3.5 hover:bg-red-600 text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer"
          title="Yopish"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
