import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { Group } from '@codepractice/shared-types';
import { Download, Filter, Search, BarChart3, AlertCircle, Cpu, Clock, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groupProgress, setGroupProgress] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getTeacherGroups().then((res) => {
      setGroups(res);
      if (res.length > 0) {
        setSelectedGroupId(res[0].id);
      }
    });
  }, []);

  const fetchGroupReport = async (groupId: string) => {
    if (!groupId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getGroupProgress(groupId);
      setGroupProgress(data);
    } catch (err: any) {
      setError(err.message || 'Hisobotni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupReport(selectedGroupId);
    }
  }, [selectedGroupId]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const csvText = await apiClient.exportReportCsv(selectedGroupId || undefined);
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CodePractice_Hisobot_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert('Eksport qilishda xatolik: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Natijalar va Hisobotlar</h2>
          <p className="text-sm text-slate-500 mt-1">O‘quvchilar progressi va topshiriqlar tahlili</p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={exporting}
          className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Eksport qilinmoqda...' : 'CSV Eksport qilish'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Filter className="w-4 h-4" />
          <span>Guruhni tanlang:</span>
        </div>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Group Progress Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">
            {groupProgress?.groupName || 'Guruh'} bo‘yicha o‘quvchilar progressi
          </h3>
          <span className="text-xs text-slate-400">
            * CPU, RAM va bajarilish ko‘rsatkichlari o‘quvchi kompyuteridagi lokal runner orqali qayd etiladi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="px-6 py-3 font-medium">O‘quvchi</th>
                <th className="px-6 py-3 font-medium">Vazifa</th>
                <th className="px-6 py-3 font-medium">Bajarilgan masalalar</th>
                <th className="px-6 py-3 font-medium">Bajarilish foizi</th>
                <th className="px-6 py-3 font-medium">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {groupProgress?.students && groupProgress.students.length > 0 ? (
                groupProgress.students.flatMap((student: any) =>
                  student.assignments.map((ass: any, aIdx: number) => (
                    <tr key={`${student.studentId}-${ass.assignmentId}`} className="hover:bg-slate-50 transition">
                      {aIdx === 0 ? (
                        <td
                          rowSpan={student.assignments.length}
                          className="px-6 py-3.5 font-medium text-slate-900 border-r border-slate-100 bg-white"
                        >
                          <div>{student.studentName}</div>
                          <div className="text-xs text-slate-400">@{student.username}</div>
                        </td>
                      ) : null}
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{ass.assignmentTitle}</td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {ass.completedProblems} / {ass.totalProblems} ta
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${ass.progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            {ass.progressPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            ass.progressPercentage === 100
                              ? 'bg-emerald-50 text-emerald-700'
                              : ass.progressPercentage > 0
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ass.progressPercentage === 100
                            ? 'Bajarildi'
                            : ass.progressPercentage > 0
                            ? 'Bajarilmoqda'
                            : 'Boshlanmagan'}
                        </span>
                      </td>
                    </tr>
                  )),
                )
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    {loading ? 'Yuklanmoqda...' : 'Ma’lumotlar mavjud emas'}
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
