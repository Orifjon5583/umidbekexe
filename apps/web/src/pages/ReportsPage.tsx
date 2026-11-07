import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { Group } from '@codepractice/shared-types';
import {
  Download,
  Filter,
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Send,
  Copy,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groupProgress, setGroupProgress] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Assignment selection for reporting
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');

  // Telegram Modal State
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [telegramChatIdInput, setTelegramChatIdInput] = useState('');
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

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
      if (data?.telegramChatId) {
        setTelegramChatIdInput(data.telegramChatId);
      } else {
        const found = groups.find((g) => g.id === groupId);
        setTelegramChatIdInput(found?.telegramChatId || '');
      }

      // First assignment default selection
      if (data?.students?.[0]?.assignments?.length > 0) {
        setSelectedAssignmentId(data.students[0].assignments[0].assignmentId);
      }
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

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Extract distinct assignments for this group
  const assignmentsList: { id: string; title: string; totalProblems: number }[] = [];
  if (groupProgress?.students) {
    for (const st of groupProgress.students) {
      for (const a of st.assignments) {
        if (!assignmentsList.some((item) => item.id === a.assignmentId)) {
          assignmentsList.push({
            id: a.assignmentId,
            title: a.assignmentTitle,
            totalProblems: a.totalProblems,
          });
        }
      }
    }
  }

  const activeAssignment =
    assignmentsList.find((a) => a.id === selectedAssignmentId) || assignmentsList[0];

  // Calculate student performance for the active assignment
  const currentStudentsList =
    groupProgress?.students?.map((st: any) => {
      const assData =
        st.assignments.find((a: any) => a.assignmentId === activeAssignment?.id) ||
        st.assignments[0];
      return {
        studentId: st.studentId,
        studentName: st.studentName,
        username: st.username,
        assignmentTitle: assData?.assignmentTitle || 'Topshiriq',
        completedProblems: assData?.completedProblems || 0,
        totalProblems: assData?.totalProblems || 2,
        progressPercentage: assData?.progressPercentage || 0,
        status: assData?.status || 'not_started',
      };
    }) || [];

  const completedStudents = currentStudentsList.filter(
    (s: any) => s.progressPercentage === 100,
  );
  const inProgressStudents = currentStudentsList.filter(
    (s: any) => s.progressPercentage > 0 && s.progressPercentage < 100,
  );
  const notStartedStudents = currentStudentsList.filter(
    (s: any) => s.progressPercentage === 0,
  );

  const averagePercentage =
    currentStudentsList.length > 0
      ? Math.round(
          currentStudentsList.reduce(
            (acc: number, s: any) => acc + s.progressPercentage,
            0,
          ) / currentStudentsList.length,
        )
      : 0;

  // Filter list by tab
  const filteredStudents =
    activeTab === 'completed'
      ? completedStudents
      : activeTab === 'in_progress'
      ? inProgressStudents
      : activeTab === 'not_started'
      ? notStartedStudents
      : currentStudentsList;

  // Generate formatted Telegram report message for this specific group
  const generateTelegramMessage = () => {
    const groupName = groupProgress?.groupName || 'Guruh';
    const assignmentTitle = activeAssignment?.title || 'Topshiriq';
    const today = new Date().toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    let text = `📊 MINTERA — GURUH HISOBOTI\n`;
    text += `👥 Guruh: ${groupName}\n`;
    text += `📚 Topshiriq: ${assignmentTitle}\n`;
    text += `📅 Sana: ${today}\n\n`;

    text += `✅ Topshiriqni to‘liq bajarganlar (${completedStudents.length} ta):\n`;
    if (completedStudents.length > 0) {
      completedStudents.forEach((s: any, idx: number) => {
        text += `${idx + 1}. ${s.studentName} — 100% (${s.completedProblems}/${s.totalProblems} masala) 🏆\n`;
      });
    } else {
      text += `(Hozircha hech kim to‘liq yakunlamagan)\n`;
    }

    text += `\n⏳ Jarayonda (${inProgressStudents.length} ta):\n`;
    if (inProgressStudents.length > 0) {
      inProgressStudents.forEach((s: any, idx: number) => {
        text += `${idx + 1}. ${s.studentName} — ${s.progressPercentage}% (${s.completedProblems}/${s.totalProblems} masala)\n`;
      });
    } else {
      text += `(Jarayonda bo‘lganlar yo‘q)\n`;
    }

    text += `\n❌ Hali topshirmaganlar (${notStartedStudents.length} ta):\n`;
    if (notStartedStudents.length > 0) {
      notStartedStudents.forEach((s: any, idx: number) => {
        text += `${idx + 1}. ${s.studentName} — 0% (Boshlanmagan)\n`;
      });
    } else {
      text += `(Barcha o‘quvchilar topshiriqni boshlagan!)\n`;
    }

    text += `\n📈 Guruh o‘zlashtirish ko‘rsatkichi: ${averagePercentage}%\n`;
    text += `🚀 Hurmatli o‘quvchilar, topshiriq muddatiga e’tibor bering!\n`;
    text += `🔒 Ushbu hisobot faqat «${groupName}» guruhiga tegishli.`;

    return text;
  };

  const handleOpenTelegramModal = () => {
    const currentG = groups.find((g) => g.id === selectedGroupId);
    setTelegramChatIdInput(
      currentG?.telegramChatId ||
        groupProgress?.telegramChatId ||
        (selectedGroupId === 'g-1'
          ? '-100192837482'
          : selectedGroupId === 'g-2'
          ? '-100183749201'
          : '-100174829103'),
    );
    setCopiedTelegram(false);
    setIsTelegramModalOpen(true);
  };

  const handleCopyTelegramMessage = () => {
    const text = generateTelegramMessage();
    navigator.clipboard.writeText(text);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2500);
  };

  const handleSendTelegramReport = async () => {
    if (!telegramChatIdInput.trim()) {
      alert('Iltimos, ushbu guruhning Telegram chat ID yoki havolasini kiriting!');
      return;
    }

    setIsSendingTelegram(true);
    try {
      const message = generateTelegramMessage();
      const res = await apiClient.sendTelegramGroupReport({
        groupId: selectedGroupId,
        groupName: groupProgress?.groupName || 'Guruh',
        telegramChatId: telegramChatIdInput.trim(),
        assignmentTitle: activeAssignment?.title || 'Topshiriq',
        messageText: message,
      });

      // Update stored group telegramChatId if changed
      await apiClient.updateGroupName(
        selectedGroupId,
        groupProgress?.groupName || 'Guruh',
        telegramChatIdInput.trim(),
      );

      setIsTelegramModalOpen(false);
      showToast(res.message);
    } catch (err: any) {
      alert('Telegramga yuborishda xatolik: ' + err.message);
    } finally {
      setIsSendingTelegram(false);
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const csvText = await apiClient.exportReportCsv(selectedGroupId || undefined);
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Mintera_Hisobot_${groupProgress?.groupName || 'Guruh'}_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV hisobot muvaffaqiyatli yuklab olindi!');
    } catch (err: any) {
      alert('Eksport qilishda xatolik: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 sm:h-7 h-6 sm:w-7 text-blue-600 flex-shrink-0" />
            Natijalar va Guruh Hisobotlari
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Har bir guruh o‘quvchilari natijalari va Telegram orqali xabar yuborish
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenTelegramModal}
            className="h-11 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-cyan-600/20 transition cursor-pointer flex-1 sm:flex-none justify-center"
            title="Ushbu guruhning Telegram chatiga natijalarni yuborish"
          >
            <Send className="w-4 h-4" />
            <span>Telegramga hisobot yuborish</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer flex-1 sm:flex-none justify-center"
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            <span>{exporting ? 'Eksport qilinmoqda...' : 'CSV Eksport'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar: Group Selector and Assignment Selector */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Group Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Guruh:</span>
          </div>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="h-10 px-3 border border-slate-300 rounded-xl text-sm bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          {groupProgress?.telegramChatId && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
              <Send className="w-3 h-3 text-cyan-500" />
              <span>{groupProgress.telegramChatId}</span>
            </span>
          )}
        </div>

        {/* Assignment Selector */}
        {assignmentsList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-slate-700 text-xs font-bold uppercase tracking-wider">
              Vazifa:
            </span>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="h-10 px-3 border border-slate-300 rounded-xl text-sm bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            >
              {assignmentsList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4 Performance Metric KPI Cards for Selected Group */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Students in Group */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jami o‘quvchilar
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {currentStudentsList.length}
              <span className="text-xs text-slate-400 font-normal ml-1">nafar</span>
            </div>
            <span className="text-[11px] text-blue-600 font-medium">Ushbu guruh a’zolari</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Completed (100%) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              To‘liq bajarganlar
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {completedStudents.length}
              <span className="text-xs text-slate-400 font-normal ml-1">nafar</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">100% topshirilgan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Jarayonda (Qisman)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {inProgressStudents.length}
              <span className="text-xs text-slate-400 font-normal ml-1">nafar</span>
            </div>
            <span className="text-[11px] text-amber-600 font-medium">1% – 99% oralig‘ida</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Not Started */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Topshirmaganlar
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
              {notStartedStudents.length}
              <span className="text-xs text-slate-400 font-normal ml-1">nafar</span>
            </div>
            <span className="text-[11px] text-rose-600 font-medium">0% boshlanmagan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Group Progress Table with Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header and Tabs */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {groupProgress?.groupName || 'Guruh'} — O‘quvchilar ro‘yxati
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tanlangan topshiriq: <strong>{activeAssignment?.title || 'Umumiy'}</strong>
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Barchasi ({currentStudentsList.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✅ Bajarganlar ({completedStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'in_progress'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏳ Jarayonda ({inProgressStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('not_started')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'not_started'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ❌ Bajarmagan ({notStartedStudents.length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="px-6 py-3.5 font-medium">#</th>
                <th className="px-6 py-3.5 font-medium">O‘quvchi</th>
                <th className="px-6 py-3.5 font-medium">Topshiriq</th>
                <th className="px-6 py-3.5 font-medium">Bajarilgan masalalar</th>
                <th className="px-6 py-3.5 font-medium">O‘zlashtirish foizi</th>
                <th className="px-6 py-3.5 font-medium text-right">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student: any, idx: number) => (
                  <tr key={student.studentId} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{student.studentName}</div>
                      <div className="text-xs text-slate-400 font-mono">@{student.username}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {student.assignmentTitle}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {student.completedProblems}
                      </span>{' '}
                      / {student.totalProblems} ta masala
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              student.progressPercentage === 100
                                ? 'bg-emerald-500'
                                : student.progressPercentage > 0
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${student.progressPercentage}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold font-mono ${
                            student.progressPercentage === 100
                              ? 'text-emerald-600'
                              : student.progressPercentage > 0
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {student.progressPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          student.progressPercentage === 100
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : student.progressPercentage > 0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {student.progressPercentage === 100 ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Bajarildi</span>
                          </>
                        ) : student.progressPercentage > 0 ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Jarayonda</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-rose-600" />
                            <span>Topshirmagan</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    {loading ? 'Hisobot yuklanmoqda...' : 'Ushbu toifada o‘quvchilar mavjud emas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TELEGRAM GROUP REPORT MODAL */}
      {isTelegramModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Telegram Guruhiga Hisobot Yuborish
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Guruh: <strong>{groupProgress?.groupName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTelegramModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telegram Destination Input */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
                <span>Guruh Telegram Chat ID yoki Havolasi</span>
                <span className="text-[11px] text-cyan-600 font-normal">Aynan shu guruhga ketadi</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={telegramChatIdInput}
                  onChange={(e) => setTelegramChatIdInput(e.target.value)}
                  placeholder="Masalan: -100192837482 yoki @mintera_guruh_101"
                  className="w-full h-11 pl-10 pr-3 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Send className="w-4 h-4 text-cyan-600 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Har bir guruhning o‘z Telegram guruhi bo‘ladi. Bot xabarni aynan shu ID bo‘yicha yuboradi.
              </p>
              <div className="mt-2.5 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2 text-[11px] text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-950 font-bold">Qat’iy guruh izolyatsiyasi:</strong>
                  Ushbu hisobot FAQAT tanlangan <strong>«{groupProgress?.groupName}»</strong> guruhiga yetkaziladi. Boshqa guruhlar (masalan: N2, N3) a’zolariga bu o‘quvchilar ma’lumoti yuborilmaydi!
                </div>
              </div>
            </div>

            {/* Live Message Preview (Styled like Telegram Message Bubble) */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Xabar ko‘rinishi (Jonli preview):</span>
                <button
                  type="button"
                  onClick={handleCopyTelegramMessage}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copiedTelegram ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Nusxa olindi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxa olish</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#0E1626] text-slate-100 p-4 rounded-2xl border border-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto select-all shadow-inner">
                {generateTelegramMessage()}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsTelegramModalOpen(false)}
                className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSendTelegramReport}
                disabled={isSendingTelegram}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSendingTelegram ? 'Yuborilmoqda...' : 'Telegram guruhiga yuborish 🚀'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
