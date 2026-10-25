import React, { useState } from 'react';
import { apiClient } from '../services/api';
import { Eye, EyeOff, Lock, User, AlertCircle, LogIn } from 'lucide-react';

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
      setError(err.message || 'Kirishda xatolik yuz berdi. Login yoki parolni tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl mx-auto mb-3 shadow">
            CP
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CodePractice</h1>
          <p className="text-sm text-slate-500 mt-1">O‘qituvchi boshqaruv paneliga kirish</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Login (Foydalanuvchi nomi)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="teacher1"
                className="w-full pl-10 pr-3 py-2.5 h-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Parol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 h-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 select-none">Meni eslab qol</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="text-sm">Kirilmoqda...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Kirish</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-center text-slate-400">
          CodePractice v1.0 • O‘qituvchi va Talabalar platformasi
        </div>
      </div>
    </div>
  );
};
