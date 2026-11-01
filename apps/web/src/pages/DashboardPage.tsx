import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { TeacherDashboardStats } from '@codepractice/shared-types';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  GraduationCap,
  FolderKanban,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sliders,
  CheckCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userJson = localStorage.getItem('cp_user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.role === 'admin';

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getTeacherDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Ma’lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {isAdmin ? (
              <>
                <ShieldCheck className="w-7 h-7 text-purple-600" />
                Administrator Boshqaruv Markazi
              </>
            ) : (
              <>
                <GraduationCap className="w-7 h-7 text-blue-600" />
                O‘qituvchi Ishchi Paneli
              </>
            )}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Butun platforma statistikasi, o‘qituvchilar faolligi, guruhlar va tizim xavfsizligi tahlili'
              : 'Sizga biriktirilgan guruhlar o‘quvchilari faolligi va topshirilgan vazifalar natijalari'}
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Yangilash
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Stats Cards (Different for Admin vs Teacher) */}
      {isAdmin ? (
        /* ================= ADMIN KPI CARDS ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Jami O‘qituvchilar</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">3 nafar</p>
              <span className="text-[11px] text-emerald-600 font-bold">2 nafari faol</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Barcha O‘quvchilar</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats?.totalStudents ?? 48} nafar</p>
              <span className="text-[11px] text-slate-500">3 ta guruhda</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">O‘quv Guruhlari</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">3 ta guruh</p>
              <span className="text-[11px] text-indigo-600 font-bold">Python, C++, Olimpiada</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Infratuzilma (AWS)</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">100%</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Tizim barqaror</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TEACHER KPI CARDS ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mening o‘quvchilarim</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">34 nafar</p>
              <span className="text-[11px] text-blue-600 font-semibold">2 ta guruhda</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Faol vazifalarim</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats?.activeAssignments ?? 2} ta</p>
              <span className="text-[11px] text-amber-600 font-semibold">Muddat faol</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bajarilgan topshiriqlar</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats?.completedAssignments ?? 112} ta</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Testlardan o‘tgan</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Muddati o‘tganlar</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats?.overdueAssignments ?? 3} ta</p>
              <span className="text-[11px] text-rose-600 font-semibold">Eslatma yuborish</span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Quick Action Banners */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-md flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">O‘qituvchilar Nazorati</h4>
              <p className="text-xs text-purple-200 mt-0.5">Yangi o‘qituvchi ochish yoki guruh biriktirish</p>
            </div>
            <span className="p-2 bg-white/10 rounded-xl">
              <GraduationCap className="w-5 h-5 text-purple-200" />
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Xavfsizlik Jurnali</h4>
              <p className="text-xs text-slate-400 mt-0.5">Clipboard va shubhali urinishlar monitoringi</p>
            </div>
            <span className="p-2 bg-white/10 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-cyan-900 text-white shadow-md flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Tizim Sozlamalari</h4>
              <p className="text-xs text-blue-200 mt-0.5">Dasturlash tillari va AI token kvotalari</p>
            </div>
            <span className="p-2 bg-white/10 rounded-xl">
              <Sliders className="w-5 h-5 text-cyan-200" />
            </span>
          </div>
        </div>
      )}

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Oxirgi topshirilgan natijalar</h3>
            <p className="text-xs text-slate-500 mt-0.5">O‘quvchilar tomonidan yuborilgan so‘nggi urinishlar va test xulosalari</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Jonli oqim</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="px-6 py-3.5 font-semibold">O‘quvchi</th>
                <th className="px-6 py-3.5 font-semibold">Guruh</th>
                <th className="px-6 py-3.5 font-semibold">Vazifa & Masala</th>
                <th className="px-6 py-3.5 font-semibold">Natija</th>
                <th className="px-6 py-3.5 font-semibold">Testlar</th>
                <th className="px-6 py-3.5 font-semibold">Topshirilgan vaqt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                stats.recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="px-6 py-3.5 text-slate-600 text-xs">{sub.groupName}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-800 text-xs">{sub.problemTitle}</div>
                      <div className="text-[11px] text-slate-400">{sub.assignmentTitle}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          sub.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'compile_error'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status === 'accepted'
                          ? 'Muvaffaqiyatli'
                          : sub.status === 'compile_error'
                          ? 'Kompilyatsiya xatosi'
                          : sub.status === 'wrong_answer'
                          ? 'Noto‘g‘ri javob'
                          : sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-700 font-bold text-xs">
                      {sub.passedTests} / {sub.totalTests}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(sub.submittedAt).toLocaleString('uz-UZ')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    {loading ? 'Yuklanmoqda...' : 'Hozircha topshiriqlar mavjud emas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
