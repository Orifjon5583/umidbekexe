import React, { useState } from 'react';
import { desktopApiClient } from '../services/api';
import { TitleBar } from '../components/TitleBar';
import { Eye, EyeOff } from 'lucide-react';

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
        setError('Ushbu ilova faqat o‘quvchilar uchun mo‘ljallangan.');
        setLoading(false);
        return;
      }

      localStorage.setItem('cp_student_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError('Login yoki parol noto‘g‘ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#070D1E] text-white select-none overflow-hidden font-sans relative">
      {/* 1. TitleBar */}
      <TitleBar title="CodePractice - Kirish" />

      {/* Background Mountain/Wave Silhouette at bottom matching Design 1 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1528] via-[#080E1E] to-[#040813] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Split Layout matching Image 1: Left Brand Showcase, Right Login Card */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Brand Area (Item 1 on Poster) */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-28 h-28 rounded-3xl bg-[#0F1E36] border border-blue-500/20 shadow-2xl flex items-center justify-center mb-6 p-4">
              <img
                src="/icon.png"
                alt="CodePractice Logo"
                style={{ width: '84px', height: '84px', objectFit: 'contain' }}
              />
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              CodePractice
            </h1>
            <p className="text-sm tracking-widest text-blue-400 font-medium uppercase">
              Learn • Practice • Grow
            </p>
          </div>

          {/* Right Login Card (Item 1 on Poster) */}
          <div className="w-full max-w-[380px] bg-[#0E1A30]/90 backdrop-blur-md rounded-2xl p-8 border border-blue-900/40 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight text-center">
              Tizimga kirish
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Login
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Login kiriting"
                  className="w-full h-11 px-3.5 bg-[#091122] border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Parol
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parol kiriting"
                    className="w-full h-11 pl-3.5 pr-10 bg-[#091122] border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
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

              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#091122] border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-300 font-medium">Meni eslab qol</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#2563EB] hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition duration-150 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Tekshirilmoqda...' : 'Kirish'}
              </button>

              {/* Error Message matching Poster Item 1 */}
              {error && (
                <p className="text-xs text-red-400 text-center font-medium pt-1">
                  {error}
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
