import React, { useState } from 'react';
import { apiClient } from '../services/api';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('teacher1');
  const [password, setPassword] = useState('Teacher123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.login({
        username: username.trim(),
        password,
        rememberMe,
      });

      if (res.user.role === 'student') {
        setError('O‘quvchilar uchun maxsus Windows desktop ilovasi mo‘ljallangan. Web-panel faqat o‘qituvchi va administratorlar uchun.');
        setLoading(false);
        return;
      }

      localStorage.setItem('cp_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login yoki parol noto‘g‘ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Brand with squircle icon and O'qituvchi paneli (Matching Poster Section 2 Item 1) */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="w-24 h-24 rounded-3xl bg-[#0F1E36] border border-blue-500/20 shadow-2xl flex items-center justify-center mb-6 p-4">
            <img
              src="/icon.png"
              alt="CodePractice"
              className="w-16 h-16 object-contain"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
            CodePractice
          </h1>
          <p className="text-sm tracking-wider text-blue-400 font-medium">
            O‘qituvchi paneli
          </p>
        </div>

        {/* Right: Login Card */}
        <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Tizimga kirish
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Login
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Login kiriting"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol kiriting"
                  className="w-full h-10 pl-3 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
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

            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 font-medium">Meni eslab qol</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Tekshirilmoqda...' : 'Kirish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
