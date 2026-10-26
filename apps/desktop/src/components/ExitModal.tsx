import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitModal: React.FC<Props> = ({ isOpen, onClose, onConfirmExit }) => {
  const { theme } = useTheme();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Ruxsat kodi: 4826
    if (pin.trim() === '4826') {
      onConfirmExit();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Card */}
      <div
        className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 border transition-all ${
          theme === 'dark'
            ? 'glass-panel-dark border-white/10 glow-border-blue text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Blue Circle with Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold tracking-tight">
            Ilovadan chiqish
          </h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Chiqish uchun o‘qituvchi ruxsat kodini kiriting
          </p>
        </div>

        {/* Input with Show/Hide password toggle */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
                if (e.key === 'Escape') onClose();
              }}
              placeholder="Ruxsat kodini kiriting"
              className={`w-full h-11 pl-4 pr-11 text-center tracking-widest font-mono text-base font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition ${
                theme === 'dark'
                  ? 'bg-[#0E1528] border-white/10 text-white placeholder-slate-500 focus:border-blue-500'
                  : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1 cursor-pointer"
              title={showPassword ? 'Yashirish' : 'Ko‘rsatish'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Hint badge */}
          <div
            className={`text-[11px] rounded-xl py-1.5 px-3 flex items-center justify-center gap-1.5 border ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-white/5 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <span>Standart ruxsat kodi:</span>
            <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              4826
            </span>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-medium flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Noto‘g‘ri kod! Kod: 4826</span>
            </p>
          )}
        </div>

        {/* Action Buttons: Tasdiqlash & Bekor qilish */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleConfirm}
            className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition cursor-pointer"
          >
            Tasdiqlash
          </button>
          <button
            onClick={onClose}
            className={`flex-1 h-10 rounded-xl font-semibold text-xs border transition active:scale-95 cursor-pointer ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
};
