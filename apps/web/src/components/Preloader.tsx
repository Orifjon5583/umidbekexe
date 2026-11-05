import React, { useEffect, useState } from 'react';
import { Terminal, Shield, Cpu } from 'lucide-react';

interface PreloaderProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish, minDurationMs = 3800 }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [statusText, setStatusText] = useState('Mintera tizimi ishga tushirilmoqda...');

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish?.();
    }, 400);
  };

  useEffect(() => {
    const startTime = Date.now();

    // Dinamik status xabarlari (3-5 soniya oralig'ida maromida almashadi)
    const statusTimeout1 = setTimeout(() => {
      setStatusText('Kodni tekshirish va tahlil qilish muhiti yuklanmoqda...');
    }, 1000);

    const statusTimeout2 = setTimeout(() => {
      setStatusText('Anti-Cheat va Sandbox xavfsizlik modullari faollashtirilmoqda...');
    }, 2000);

    const statusTimeout3 = setTimeout(() => {
      setStatusText('Barcha modullar tayyor! Tizim ochilmoqda...');
    }, 3100);

    // Progress foizini sokin va bir maromda oshirish (~3.8 soniya)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minDurationMs - elapsed);

          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              onFinish?.();
            }, 600); // silliq yo'qolish (fade-out)
          }, remaining + 250);

          return 100;
        }

        // 3-5 soniya uchun maromli, mayin qadamlar
        let step = 2;
        if (prev < 30) {
          step = Math.floor(Math.random() * 2) + 2; // 2 - 3%
        } else if (prev < 65) {
          step = Math.floor(Math.random() * 3) + 2; // 2 - 4%
        } else if (prev < 90) {
          step = Math.floor(Math.random() * 2) + 2; // 2 - 3%
        } else {
          step = 1; // 1%
        }

        return Math.min(prev + step, 100);
      });
    }, 75);

    return () => {
      clearInterval(interval);
      clearTimeout(statusTimeout1);
      clearTimeout(statusTimeout2);
      clearTimeout(statusTimeout3);
    };
  }, [minDurationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070D1E] text-white select-none transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* O'tkazib yuborish tugmasi */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition cursor-pointer backdrop-blur-xs flex items-center gap-1.5 shadow-sm"
        title="Yuklanishni darhol o‘tkazib yuborish"
      >
        <span>O‘tkazib yuborish</span>
        <span className="text-blue-400">→</span>
      </button>
      {/* Orqa fon atmosferik nuri */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-amber-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Markaziy kontent */}
      <div className="relative flex flex-col items-center gap-6 px-6 text-center z-10 max-w-sm">
        {/* Logo qutisi */}
        <div className="relative group">
          {/* Pulsatsiyalanuvchi doira nuri */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-600 to-amber-500 opacity-60 blur-md animate-pulse" />
          
          <div className="relative w-20 h-20 rounded-2xl bg-[#091128] border border-blue-500/40 flex items-center justify-center p-3 shadow-2xl shadow-blue-600/30">
            <img
              src="/icon.png"
              alt="Mintera Logo"
              className="w-full h-full object-contain filter drop-shadow-md animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* Brand nomi */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              Min<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400">tera</span>
            </span>
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400/90 px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/60">
            CodePractice Platform
          </span>
        </div>

        {/* Progress chizig'i va foiz */}
        <div className="w-64 sm:w-72 flex flex-col items-center gap-2.5 pt-2">
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800/90 overflow-hidden p-[1px] border border-slate-700/50 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Pastki status va foiz */}
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="text-slate-300 truncate max-w-[190px] text-left">
              {statusText}
            </span>
            <span className="text-amber-400 font-bold ml-2">
              {progress}%
            </span>
          </div>
        </div>

        {/* Kichik xavfsizlik va tezlik ikonchalari */}
        <div className="flex items-center gap-4 pt-4 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400/80" />
            <span>Anti-Cheat</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-blue-400/80" />
            <span>Native Engine</span>
          </span>
        </div>
      </div>
    </div>
  );
};
