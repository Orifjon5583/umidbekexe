import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { SecurityLogItem, INITIAL_SECURITY_LOGS } from '../services/mockData';
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  User,
  Globe,
  RefreshCw,
} from 'lucide-react';

export const SecurityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLogItem[]>(INITIAL_SECURITY_LOGS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'danger' | 'warning' | 'info' | 'success'>('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getSecurityLogs();
      setLogs(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' ? true : log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 sm:w-7 h-6 sm:h-7 text-purple-600 flex-shrink-0" />
            Faollik jurnali va Xavfsizlik hodisalari (TZ 2.1)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Foydalanuvchilar kirishi, clipboard cheklovlarini buzish urinishlari va tizim audit qaydlari
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="h-10 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition w-full sm:w-auto justify-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Jurnalni yangilash
        </button>
      </div>

      {/* KPI Cards (2x2 on Mobile, 4 cols on Tablet & Desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Anti-Cheat hodisalari</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">
              {logs.filter((l) => l.eventType === 'clipboard_violation' || l.eventType === 'window_blur').length} ta
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Sandbox & Shubhali</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">
              {logs.filter((l) => l.eventType === 'failed_login' || l.eventType === 'sandbox_violation').length} ta
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Muvaffaqiyatli seanslar</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">
              {logs.filter((l) => l.eventType === 'login_success').length} ta
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Jami qaydlar</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">
              {logs.length} ta
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Foydalanuvchi, IP yoki hodisa bo‘yicha qidirish..."
            className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xs font-semibold text-slate-500">Hodisa darajasi:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:border-purple-600 flex-1 sm:flex-initial"
          >
            <option value="all">Barchasi ({logs.length})</option>
            <option value="danger">Xavfli (Qizil)</option>
            <option value="warning">Ogohlantirish (Sariq)</option>
            <option value="info">Ma’lumot (Ko‘k)</option>
            <option value="success">Muvaffaqiyatli (Yashil)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Hodisalar ro‘yxati</h3>
          <span className="text-xs text-slate-400">Filtrlangan: {filteredLogs.length} ta</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider whitespace-nowrap">
                <th className="px-4 sm:px-6 py-3 sm:py-3.5 font-semibold">Vaqt</th>
                <th className="px-4 sm:px-6 py-3 sm:py-3.5 font-semibold">Foydalanuvchi & Rol</th>
                <th className="px-4 sm:px-6 py-3 sm:py-3.5 font-semibold">Hodisa turi</th>
                <th className="px-4 sm:px-6 py-3 sm:py-3.5 font-semibold">Tafsilotlar</th>
                <th className="px-4 sm:px-6 py-3 sm:py-3.5 font-semibold">IP Manzil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 whitespace-nowrap">
              {filteredLogs.map((log) => {
                const badgeClass =
                  log.severity === 'danger'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : log.severity === 'warning'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : log.severity === 'success'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {log.timestamp}
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900 text-xs">{log.user}</div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {log.role}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
                        {log.eventType === 'clipboard_violation'
                          ? 'Clipboard cheklovi'
                          : log.eventType === 'window_blur'
                          ? 'Oynadan chiqish (Alt+Tab)'
                          : log.eventType === 'sandbox_violation'
                          ? 'Sandbox qoidabuzarligi'
                          : log.eventType === 'login_success'
                          ? 'Tizimga kirish'
                          : log.eventType === 'failed_login'
                          ? 'Xato kirish'
                          : log.eventType === 'assignment_create'
                          ? 'Vazifa e’loni'
                          : 'Sozlama o‘zgardi'}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-xs text-slate-700 max-w-md">
                      {log.details}
                    </td>

                    <td className="px-6 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {log.ip}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Mos keluvchi xavfsizlik qaydlari topilmadi.
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
