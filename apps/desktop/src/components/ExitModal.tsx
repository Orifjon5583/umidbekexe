import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitModal: React.FC<Props> = ({ isOpen, onClose, onConfirmExit }) => {
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
        {/* Blue Circle with Lock Icon */}
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Ilovadan chiqish
          </h3>
          <p className="text-xs text-slate-600 mt-1">
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
              className="w-full h-11 pl-4 pr-11 text-center tracking-widest font-mono text-base font-bold text-slate-900 bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal placeholder:text-xs transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1"
              title={showPassword ? 'Yashirish' : 'Ko‘rsatish'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Hint badge */}
          <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 flex items-center justify-center gap-1.5">
            <span>Standart ruxsat kodi:</span>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              4826
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Noto‘g‘ri kod! Kod: 4826</span>
            </p>
          )}
        </div>

        {/* Action Buttons: Tasdiqlash & Bekor qilish */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleConfirm}
            className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs transition shadow-sm cursor-pointer"
          >
            Tasdiqlash
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 bg-slate-100 border border-slate-300 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
};
