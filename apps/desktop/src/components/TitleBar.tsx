import React from 'react';
import { Minus, Square, X } from 'lucide-react';

interface Props {
  title?: string;
  onExitRequest?: () => void;
}

export const TitleBar: React.FC<Props> = ({
  title = "CodePractice - O‘quvchi ishchi stoli (v2.4.0)",
  onExitRequest,
}) => {
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
      className="h-8 bg-[#070B14] text-slate-300 flex items-center justify-between px-3 select-none flex-shrink-0 border-b border-slate-800/80 text-xs font-medium z-50"
    >
      {/* Title & Official Icon */}
      <div className="flex items-center gap-2 pointer-events-none">
        <img
          src="/icon.png"
          alt="CodePractice"
          className="w-4 h-4 rounded object-contain shadow-xs"
          onError={(e) => {
            // Fallback agar rasm yuklanmasa
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <span className="text-slate-300 font-mono tracking-tight text-[11px] font-medium">
          {title}
        </span>
      </div>

      {/* Windows 11 Controls */}
      <div className="flex items-center -mr-3 h-full">
        <button
          onClick={handleMinimize}
          className="h-full px-3 hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center"
          title="Kichraytirish"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full px-3 hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center"
          title="Kattalashtirish"
        >
          <Square className="w-3 h-3 stroke-[1.5]" />
        </button>
        <button
          onClick={handleClose}
          className="h-full px-3.5 hover:bg-red-600 text-slate-400 hover:text-white transition flex items-center justify-center"
          title="Yopish (O‘qituvchi PIN kodi talab qilinadi)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
