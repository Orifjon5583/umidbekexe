import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitModal: React.FC<Props> = ({ isOpen, onClose, onConfirmExit }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Card matching Poster Item 7 */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Blue Circle with Lock Icon */}
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Ilovadan chiqish
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Chiqish uchun ruxsat kodini kiriting
          </p>
        </div>

        {/* Input */}
        <div>
          <input
            type="password"
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
            className="w-full h-11 px-4 text-center tracking-widest font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
          {error && (
            <p className="text-xs text-red-500 mt-1.5 font-medium">
              Noto‘g‘ri kod! O‘qituvchidan ruxsat kodini so‘rang (4826).
            </p>
          )}
        </div>

        {/* Buttons matching Poster Item 7: Tasdiqlash (Blue) & Bekor qilish (White) */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleConfirm}
            className="flex-1 h-10 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-xs"
          >
            Tasdiqlash
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
};
