import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { TeacherDashboardStats } from '@codepractice/shared-types';
import { Users, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-8">
      {/* Page Title & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Umumiy ko‘rsatkichlar</h2>
          <p className="text-sm text-slate-500 mt-1">O‘quvchilar faolligi va topshirilgan vazifalar holati</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Yangilash
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Jami o‘quvchilar</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.totalStudents ?? 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Faol vazifalar</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.activeAssignments ?? 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Bajarilgan vazifalar</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.completedAssignments ?? 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Muddati o‘tgan</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.overdueAssignments ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Oxirgi topshirilgan natijalar</h3>
          <p className="text-xs text-slate-500 mt-0.5">O‘quvchilar tomonidan yuborilgan so‘nggi urinishlar</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="px-6 py-3 font-medium">O‘quvchi</th>
                <th className="px-6 py-3 font-medium">Guruh</th>
                <th className="px-6 py-3 font-medium">Vazifa & Masala</th>
                <th className="px-6 py-3 font-medium">Holat</th>
                <th className="px-6 py-3 font-medium">Testlar</th>
                <th className="px-6 py-3 font-medium">Vaqt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                stats.recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{sub.studentName}</td>
                    <td className="px-6 py-3.5 text-slate-600">{sub.groupName}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-slate-800">{sub.problemTitle}</div>
                      <div className="text-xs text-slate-500">{sub.assignmentTitle}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'compile_error'
                            ? 'bg-red-100 text-red-800'
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
                    <td className="px-6 py-3.5 text-slate-700 font-medium">
                      {sub.passedTests} / {sub.totalTests}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">
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
