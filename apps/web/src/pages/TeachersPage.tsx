import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { TeacherRecord } from '../services/mockData';
import { Group } from '@codepractice/shared-types';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  UserX,
  UserCheck,
  KeyRound,
  X,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  Users,
  BookOpen,
} from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modallar
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [targetTeacherId, setTargetTeacherId] = useState<string | null>(null);

  // Form Fields
  const [formFullName, setFormFullName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Python va Algoritmlar');
  const [formPassword, setFormPassword] = useState('Teacher2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [formAssignedGroups, setFormAssignedGroups] = useState<string[]>([]);

  // Parol o'zgartirish modali
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedTeacherForPass, setSelectedTeacherForPass] = useState<TeacherRecord | null>(null);
  const [newPassword, setNewPassword] = useState('Teacher123!');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tList, gList] = await Promise.all([
        apiClient.getTeachers(),
        apiClient.getTeacherGroups(),
      ]);
      setTeachers(tList);
      setGroups(gList);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setTargetTeacherId(null);
    setFormFullName('');
    setFormUsername('');
    setFormEmail('');
    setFormSubject('Python va Algoritmlar');
    setFormPassword('Teacher2026!');
    setFormAssignedGroups([]);
    setShowModal(true);
  };

  const handleOpenEditModal = (t: TeacherRecord) => {
    setModalMode('edit');
    setTargetTeacherId(t.id);
    setFormFullName(t.fullName);
    setFormUsername(t.username);
    setFormEmail(t.email || '');
    setFormSubject(t.subject);
    setFormAssignedGroups(t.assignedGroups || []);
    setShowModal(true);
  };

  const handleToggleGroup = (groupName: string) => {
    if (formAssignedGroups.includes(groupName)) {
      setFormAssignedGroups(formAssignedGroups.filter((g) => g !== groupName));
    } else {
      setFormAssignedGroups([...formAssignedGroups, groupName]);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(res);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formUsername.trim()) return;

    if (modalMode === 'create') {
      const created = await apiClient.createTeacher({
        fullName: formFullName,
        username: formUsername,
        password: formPassword,
        subject: formSubject,
        assignedGroups: formAssignedGroups,
        email: formEmail,
      });
      setTeachers([created, ...teachers]);
      showToast(`O‘qituvchi ${created.fullName} muvaffaqiyatli ro‘yxatga olindi!`);
    } else if (modalMode === 'edit' && targetTeacherId) {
      const updated = await apiClient.updateTeacher(targetTeacherId, {
        fullName: formFullName,
        email: formEmail,
        subject: formSubject,
        assignedGroups: formAssignedGroups,
        studentCount: formAssignedGroups.length * 15,
      });
      setTeachers(teachers.map((t) => (t.id === targetTeacherId ? updated : t)));
      showToast(`O‘qituvchi ma’lumotlari yangilandi!`);
    }

    setShowModal(false);
  };

  const handleToggleStatus = async (id: string, name: string) => {
    const nextStatus = await apiClient.toggleTeacherStatus(id);
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, isActive: nextStatus } : t)));
    showToast(`${name} hisobi ${nextStatus ? 'faollashtirildi' : 'nofaol qilindi'}.`);
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (!window.confirm(`Haqiqatan ham o‘qituvchi "${name}" hisobini o‘chirmoqchimisiz?`)) return;
    await apiClient.deleteTeacher(id);
    setTeachers(teachers.filter((t) => t.id !== id));
    showToast(`O‘qituvchi "${name}" o‘chirildi.`);
  };

  const handleOpenPasswordModal = (teacher: TeacherRecord) => {
    setSelectedTeacherForPass(teacher);
    setNewPassword('Teacher2026!');
    setShowPasswordModal(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForPass || !newPassword.trim()) return;
    showToast(`${selectedTeacherForPass.fullName} uchun yangi parol saqlandi: ${newPassword}`);
    setShowPasswordModal(false);
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.username.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ? true : filterStatus === 'active' ? t.isActive : !t.isActive;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-xs transition animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-purple-600" />
            O‘qituvchilar hisoblarini boshqarish
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Platformadagi o‘qituvchilarni ro‘yxatga olish, guruhlarga biriktirish, parollarni yangilash va huquqlarni boshqarish
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="h-11 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Yangi o‘qituvchi qo‘shish
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, login yoki fan bo‘yicha qidirish..."
            className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Holat:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-purple-600"
          >
            <option value="all">Barchasi ({teachers.length})</option>
            <option value="active">Faollar ({teachers.filter((t) => t.isActive).length})</option>
            <option value="inactive">Nofaollar ({teachers.filter((t) => !t.isActive).length})</option>
          </select>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">O‘qituvchilar ro‘yxati</h3>
          <span className="text-xs text-slate-400">Jami: {filteredTeachers.length} nafar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="px-6 py-3.5 font-semibold">O‘qituvchi</th>
                <th className="px-6 py-3.5 font-semibold">Mutaxassislik / Fan</th>
                <th className="px-6 py-3.5 font-semibold">Biriktirilgan guruhlar</th>
                <th className="px-6 py-3.5 font-semibold">O‘quvchilar</th>
                <th className="px-6 py-3.5 font-semibold">Holat</th>
                <th className="px-6 py-3.5 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm shadow-xs">
                        {t.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{t.fullName}</p>
                        <p className="text-xs text-slate-500 font-mono">@{t.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {t.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {t.assignedGroups && t.assignedGroups.length > 0 ? (
                        t.assignedGroups.map((g, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {g}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Guruh biriktirilmagan</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-bold text-xs">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {t.studentCount || 0} nafar
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {t.isActive ? 'Faol' : 'Faolsizlantirilgan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenPasswordModal(t)}
                        title="Parolni yangilash"
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(t)}
                        title="Tahrirlash"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(t.id, t.fullName)}
                        title={t.isActive ? 'Faolsizlantirish' : 'Faollashtirish'}
                        className={`p-1.5 rounded-lg transition ${
                          t.isActive
                            ? 'text-rose-500 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {t.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(t.id, t.fullName)}
                        title="O‘chirish"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    O‘qituvchilar topilmadi. Yuqoridagi "Yangi o‘qituvchi qo‘shish" tugmasini bosing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Teacher */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                {modalMode === 'create' ? 'Yangi o‘qituvchi yaratish' : 'O‘qituvchini tahrirlash'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  O‘qituvchi ism va familiyasi
                </label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="Masalan: Rustam Zokirov"
                  className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Login (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="rustam_z"
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dars beradigan fani
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Python va Algoritmlar"
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {modalMode === 'create' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Boshlang‘ich parol</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Parol generatsiya qilish
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full h-10 pl-3 pr-10 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              )}

              {/* Biriktiriladigan guruhlar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Biriktiriladigan guruhlar (O‘qituvchi faqat shu guruhlarni boshqaradi):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {groups.map((g) => {
                    const checked = formAssignedGroups.includes(g.name);
                    return (
                      <label
                        key={g.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer transition border ${
                          checked
                            ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleGroup(g.name)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span className="truncate">{g.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md shadow-purple-600/20"
                >
                  {modalMode === 'create' ? 'Yaratish' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {showPasswordModal && selectedTeacherForPass && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                O‘qituvchi parolini yangilash
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <p className="text-xs text-purple-700 font-medium">O‘qituvchi:</p>
                <p className="text-sm font-bold text-slate-900">{selectedTeacherForPass.fullName}</p>
                <p className="text-xs text-slate-500 font-mono">@{selectedTeacherForPass.username}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Yangi parol</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 pl-3 pr-10 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-600/20"
                >
                  Parolni yangilash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
