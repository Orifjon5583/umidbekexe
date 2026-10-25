import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, ArrowLeft, Check, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitModal: React.FC<Props> = ({ isOpen, onClose, onConfirmExit }) => {
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAccessCode('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim();

    // Standart ruxsat PIN-kodi: 4826
    if (cleanCode === '4826') {
      onConfirmExit();
    } else {
      setError('Noto‘g‘ri kod kiritilganda ilovadan chiqish rad etiladi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="h-9 px-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-red-600 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Xavfsizlik protokoli: Chiqish tekshiruvi</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 text-slate-800">
          {/* Lock Icon Circle */}
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6 text-red-600" />
          </div>

          <div className="text-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Ilovadan chiqish</h3>
            <p className="text-xs text-slate-500 mt-0.5">Chiqish uchun o‘qituvchi ruxsat kodini kiriting</p>
          </div>

          {/* Diqqat Alert Box */}
          <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-[11px] text-amber-800 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <b className="font-semibold text-amber-900">Diqqat!</b> Ilovani yopish uchun dars o‘qituvchisi yoki xona ma’muridan maxsus bir martalik chiqish PIN-kodini olishingiz lozim.
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">O‘qituvchi ruxsat PIN-kodi</label>
                <span className="text-[10px] text-slate-400">4 ta raqam</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  maxLength={10}
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    setError(null);
                  }}
                  placeholder="Ruxsat kodi (PIN)"
                  className="w-full pl-9 pr-9 py-2 h-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs font-mono tracking-widest text-slate-800 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 font-medium">{error}</p>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Bekor qilish</span>
              </button>
              <button
                type="submit"
                className="flex-1 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tasdiqlash</span>
              </button>
            </div>
          </form>

          <p className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-center text-slate-400">
            Tezkor eslatma: <b>Esc</b> yoki <b>qwe</b> ketma-ketligi orqali yoqiladi.
          </p>
        </div>
      </div>
    </div>
  );
};
