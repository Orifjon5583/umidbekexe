import React, { useState } from 'react';
import { desktopApiClient } from '../services/api';
import { TitleBar } from '../components/TitleBar';
import { useTheme } from '../context/ThemeContext';
import { Eye, EyeOff, User, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const { theme } = useTheme();
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
        setError('Ushbu ilova faqat o‘quvchilar uchun mo‘ljallangan.');
        setLoading(false);
        return;
      }

      localStorage.setItem('cp_student_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch {
      setError('Login yoki parol noto‘g‘ri kiritildi');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('student1');
    setPassword('Student123!');
  };

  return (
    <div
      className={`h-screen w-screen flex flex-col select-none overflow-hidden font-sans relative ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-800'
      }`}
    >
      <TitleBar title="CodePractice — Tizimga Kirish" />

      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-cyan-400/20 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Brand Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            {/* Logo Badge */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div
                className={`relative w-24 h-24 rounded-3xl p-4 flex items-center justify-center border shadow-2xl ${
                  theme === 'dark'
                    ? 'bg-[#0A0F1D]/80 border-white/10'
                    : 'bg-white border-slate-200'
                }`}
              >
                <img
                  src="/icon.png"
                  alt="CodePractice"
                  className="w-16 h-16 object-contain drop-shadow"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Next-Gen Coding Lab • v2.4</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CodePractice
              </h1>
              <p
                className={`text-xs mt-2 leading-relaxed max-w-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Windows 11 uchun mo‘ljallangan zamonaviy dasturlash laboratoriyasi. Python va C++ mashqlarini real vaqtda bajaring va natijalarni kuzating.
              </p>
            </div>

            {/* Quick feature pills */}
            <div className="flex flex-col gap-2 w-full max-w-sm text-xs">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                  theme === 'dark'
                    ? 'bg-slate-900/40 border-white/5 text-slate-300'
                    : 'bg-white/80 border-slate-200 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Lokal xavfsiz Sandbox muhiti</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                  theme === 'dark'
                    ? 'bg-slate-900/40 border-white/5 text-slate-300'
                    : 'bg-white/80 border-slate-200 text-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Sun'iy Intellekt (AI) murabbiy</span>
              </div>
            </div>
          </div>

          {/* Right Glassmorphism Form Card (7 cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              className={`w-full max-w-[420px] rounded-3xl p-8 border shadow-2xl transition-all duration-300 ${
                theme === 'dark'
                  ? 'glass-panel-dark border-white/10 glow-border-blue'
                  : 'glass-panel-light border-slate-200 shadow-slate-200/50'
              }`}
            >
              <div className="mb-6">
                <h2
                  className={`text-2xl font-bold tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Tizimga kirish
                </h2>
                <p
                  className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  O‘quvchi hisob ma’lumotlaringizni kiriting
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Foydalanuvchi nomi (Login)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masalan: student1"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition ${
                        theme === 'dark'
                          ? 'bg-[#090D1A] border-white/10 text-white placeholder-slate-500 focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1.5 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Parolni kiriting"
                      className={`w-full h-11 pl-10 pr-10 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition ${
                        theme === 'dark'
                          ? 'bg-[#090D1A] border-white/10 text-white placeholder-slate-500 focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                      Meni eslab qol
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="text-blue-500 hover:text-blue-400 font-semibold text-[11px] hover:underline"
                  >
                    Demo ma'lumotlar
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium text-center">
                    {error}
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Kirilmoqda...' : 'Tizimga kirish'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Credentials Footer */}
              <div
                className={`mt-6 pt-4 border-t text-[11px] text-center flex items-center justify-center gap-1.5 ${
                  theme === 'dark'
                    ? 'border-white/5 text-slate-500'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                <span>Standart hisob:</span>
                <span className="font-mono text-blue-400 font-semibold">student1</span>
                <span>/</span>
                <span className="font-mono text-blue-400 font-semibold">Student123!</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
