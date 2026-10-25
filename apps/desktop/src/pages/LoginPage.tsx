import React, { useState } from 'react';
import { desktopApiClient } from '../services/api';
import { TitleBar } from '../components/TitleBar';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('student1');
  const [password, setPassword] = useState('Student123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await desktopApiClient.login({
        username: username.trim(),
        password,
        rememberMe,
      });

      if (res.user.role !== 'student') {
        setError(
          'Ushbu ilova faqat o‘quvchilar uchun mo‘ljallangan. O‘qituvchi va administratorlar Web-panelga kirishi lozim.'
        );
        setLoading(false);
        return;
      }

      localStorage.setItem('cp_student_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError('Kirishda xatolik yuz berdi!\nLogin yoki parol noto‘g‘ri kiritildi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="h-screen flex flex-col bg-[#070B14] text-slate-100 select-none overflow-hidden font-sans relative">
      {/* 1. Custom TitleBar */}
      <TitleBar title="CodePractice - Kirish va Identifikatsiya (v2.4.0)" />

      {/* Futuristic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-12 right-10 w-72 h-72 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto relative z-10">
        <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-200">
          {/* Official Logo Banner */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img
                src="/logo.png"
                alt="CodePractice — Code • Build • Improve"
                width="240"
                style={{ width: '240px', maxWidth: '240px', maxHeight: '110px', height: 'auto', objectFit: 'contain' }}
                className="mx-auto object-contain filter drop-shadow-[0_12px_24px_rgba(59,130,246,0.3)] transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
            <p className="text-[11px] font-mono tracking-widest text-cyan-400/80 mt-1 uppercase font-semibold">
              O‘quvchilar Desktop Laboratoriyasi
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#0F172A]/85 backdrop-blur-xl rounded-2xl shadow-2xl p-7 text-slate-100 border border-slate-700/60 shadow-blue-950/40 relative overflow-hidden">
            {/* Top subtle highlight line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Tizimga kirish</h2>
                <p className="text-xs text-slate-400">O‘quvchi hisobingiz orqali tizimga ulaning</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                Windows 11
              </span>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-red-300 text-xs shadow-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <div className="flex-1 whitespace-pre-line leading-relaxed font-medium">
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Foydalanuvchi logini
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Student ID</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="student1"
                    className="w-full pl-9 pr-3 py-2 h-10 bg-slate-900/90 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-xs font-medium text-white transition placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">Parol</label>
                  <button
                    type="button"
                    onClick={() => alert("Parolni tiklash uchun guruh o‘qituvchisiga murojaat qiling.")}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 h-10 bg-slate-900/90 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-xs font-medium text-white transition placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-cyan-400"
                  />
                  <span className="text-xs text-slate-300 font-medium">Eslab qolish</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Tekshirilmoqda...
                  </span>
                ) : (
                  <>
                    <span>Tizimga kirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Pill */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Tezkor test:
              </span>
              <button
                onClick={() => handleFillDemo('student1', 'Student123!')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-cyan-300 font-mono text-[10px] transition"
              >
                student1 / Student123!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Readiness Status Footer Bar */}
      <footer className="h-9 px-6 bg-[#05070D] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server: Aloqa o‘rnatildi</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Python 3.11 • GCC C++20 • Job Objects</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>CodePractice v2.4.0 Secure Client</span>
        </div>
      </footer>
    </div>
  );
};
