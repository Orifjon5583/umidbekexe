import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  CheckCircle2,
  LogOut,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

const TOTAL_SESSION_SECONDS = 3600; // 1 soat (60 daqiqa)

export const ExitModal: React.FC<Props> = ({ isOpen, onClose, onConfirmExit }) => {
  const { theme } = useTheme();

  // 4 xonali PIN kod uchun alohida 4 ta katak
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(TOTAL_SESSION_SECONDS);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // 1 soatlik dars taymerini hisoblash va har soniya yangilash
  useEffect(() => {
    if (!isOpen) return;

    const calculateRemaining = () => {
      const loginTimeStr = localStorage.getItem('cp_login_timestamp');
      if (!loginTimeStr) {
        // Agar vaqt saqlanmagan bo'lsa, hozirgi vaqtdan 1 soat hisoblaymiz
        const now = Date.now();
        localStorage.setItem('cp_login_timestamp', String(now));
        return TOTAL_SESSION_SECONDS;
      }

      const loginTime = parseInt(loginTimeStr, 10);
      const elapsedSeconds = Math.floor((Date.now() - loginTime) / 1000);
      const rem = Math.max(0, TOTAL_SESSION_SECONDS - elapsedSeconds);
      return rem;
    };

    setRemainingSeconds(calculateRemaining());

    const timer = setInterval(() => {
      const rem = calculateRemaining();
      setRemainingSeconds(rem);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Modal ochilganda kataklarni tozalash va birinchi katakka fokus berish
  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '']);
      setError(null);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLockdownActive = remainingSeconds > 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const elapsedSeconds = TOTAL_SESSION_SECONDS - remainingSeconds;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / TOTAL_SESSION_SECONDS) * 100));

  const handleDigitChange = (index: number, value: string) => {
    // Faqat raqamlar
    const char = value.replace(/[^0-9]/g, '');

    if (!char) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      setError(null);
      return;
    }

    // Agar foydalanuvchi to'liq 4 xonali kodni birdan paste qilsa
    if (char.length >= 4) {
      const pasted = char.slice(0, 4).split('');
      setDigits(pasted);
      setError(null);
      inputRefs[3].current?.focus();
      validateAndConfirm(pasted.join(''));
      return;
    }

    const lastChar = char.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);
    setError(null);

    // Keyingi katakka o'tish
    if (index < 3 && lastChar) {
      inputRefs[index + 1].current?.focus();
    }

    // Agar 4 ta katak ham to'lsa, avtomatik tekshirish
    const fullPin = newDigits.join('');
    if (fullPin.length === 4 && !newDigits.includes('')) {
      validateAndConfirm(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter') {
      validateAndConfirm(digits.join(''));
    }
  };

  const validateAndConfirm = (pinValue: string) => {
    // Agar 1 soat o'tgan bo'lsa, PIN shart emas
    if (!isLockdownActive) {
      onConfirmExit();
      return;
    }

    const clean = pinValue.trim();
    const customTeacherPin = localStorage.getItem('cp_teacher_exit_pin') || '';

    // Qabul qilinadigan o'qituvchi kodlari: 4826, 2026 yoki sozlangan pin
    const validPins = ['4826', '2026'];
    if (customTeacherPin) validPins.push(customTeacherPin);

    if (validPins.includes(clean)) {
      onConfirmExit();
    } else {
      setError('Noto‘g‘ri PIN kod! O‘qituvchingizdan 4 xonali ruxsat kodini so‘rang.');
      setDigits(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  const handleFreeExit = () => {
    onConfirmExit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Card */}
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200 border transition-all relative ${
          theme === 'dark'
            ? 'glass-card-dark border-white/10 text-white shadow-blue-900/20'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-xl transition cursor-pointer ${
            theme === 'dark'
              ? 'text-slate-400 hover:text-white hover:bg-white/10'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title="Yopish"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Status */}
        {isLockdownActive ? (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25 ring-4 ring-amber-500/10 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                1 soatlik majburiy dars rejimi
              </span>
              <h3 className="text-xl font-extrabold tracking-tight mt-1.5">
                Ilovadan chiqish cheklangan
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Ilovaga kirganingizga hali 1 soat to‘lmadi. Muddatidan oldin chiqish uchun o‘qituvchi ruxsati (4 xonali PIN kod) talab etiladi.
              </p>
            </div>

            {/* Countdown Timer Card */}
            <div
              className={`p-3.5 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-[#0A0F24] border-white/10 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Qolgan vaqt:</span>
                </div>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {timeString}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-700/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5">
                <span>Dars boshlandi (0m)</span>
                <span>{progressPercent}% bajarildi</span>
                <span>To‘liq dars (60m)</span>
              </div>
            </div>

            {/* 4-digit PIN Code Input */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold px-1">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                  O‘qituvchi PIN kodini kiriting (4 ta raqam):
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`text-[11px] flex items-center gap-1 cursor-pointer transition ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Yashirish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ko‘rsatish</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Individual Digit Boxes */}
              <div className="flex justify-center gap-3">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type={showPassword ? 'text' : 'password'}
                    maxLength={idx === 0 ? 4 : 1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    style={{
                      color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                      WebkitTextFillColor: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                      caretColor: '#3B82F6',
                      backgroundColor: theme === 'dark' ? '#0E1738' : '#F1F5F9',
                    }}
                    className={`w-14 h-14 text-center font-mono text-2xl font-bold rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      error
                        ? 'border-rose-500 ring-2 ring-rose-500/30 animate-shake'
                        : digit
                        ? 'border-blue-500 shadow-md shadow-blue-500/20'
                        : theme === 'dark'
                        ? 'border-white/10 hover:border-white/20'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-rose-400 font-semibold flex items-center justify-center gap-1.5 pt-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => validateAndConfirm(digits.join(''))}
                disabled={digits.join('').length < 4}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>O‘qituvchi ruxsati bilan chiqish</span>
              </button>
              <button
                onClick={onClose}
                className={`h-11 px-4 rounded-xl font-semibold text-xs border transition active:scale-95 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                Darsga qaytish
              </button>
            </div>
          </div>
        ) : (
          /* 1 soat o'tgandan keyingi holat (Muvaffaqiyatli yakunlandi) */
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                1 soatlik dars yakunlandi
              </span>
              <h3 className="text-xl font-extrabold tracking-tight mt-1.5">
                Dars vaqti muvaffaqiyatli tugadi!
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Siz bugungi majburiy 1 soatlik o‘quv rejasini to‘liq bajardingiz. Endi ilovadan erkin chiqishingiz mumkin.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-2 ${
                theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mashg‘ulot davomiyligi: 60 daqiqa (100%)</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleFreeExit}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ilovadan chiqish (Tasdiqlash)</span>
              </button>
              <button
                onClick={onClose}
                className={`h-11 px-4 rounded-xl font-semibold text-xs border transition active:scale-95 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                Ilovada qolish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};