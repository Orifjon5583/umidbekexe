import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { Group, GroupWithMembers, User } from '@codepractice/shared-types';
import {
  Plus,
  Users,
  UserPlus,
  Trash2,
  X,
  ChevronRight,
  UserMinus,
  Edit2,
  KeyRound,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FolderEdit,
} from 'lucide-react';

export const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<GroupWithMembers | null>(null);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Group Create / Edit Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<'create' | 'edit'>('create');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupNameInput, setGroupNameInput] = useState('');

  // Add Student Modal (New vs Existing)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [addStudentTab, setAddStudentTab] = useState<'create' | 'existing'>('create');
  const [selectedExistingStudentId, setSelectedExistingStudentId] = useState('');

  // New Student Form Fields
  const [newStudentFullName, setNewStudentFullName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('Talaba123!');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Edit Student Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<User | null>(null);
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [showUpdatedPassword, setShowUpdatedPassword] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getTeacherGroups();
      setGroups(data);
      if (data.length > 0 && !selectedGroup) {
        const details = await apiClient.getGroupDetails(data[0].id);
        setSelectedGroup(details);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const users = await apiClient.getAdminUsers();
      setAllStudents(users.filter((u) => u.role === 'student'));
    } catch {}
  };

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, []);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSelectGroup = async (group: Group) => {
    try {
      const details = await apiClient.getGroupDetails(group.id);
      setSelectedGroup(details);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Group Modal: Open Create
  const handleOpenCreateGroup = () => {
    setGroupModalMode('create');
    setEditingGroupId(null);
    setGroupNameInput('');
    setIsGroupModalOpen(true);
  };

  // Group Modal: Open Edit Name
  const handleOpenEditGroup = (g: Group, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setGroupModalMode('edit');
    setEditingGroupId(g.id);
    setGroupNameInput(g.name);
    setIsGroupModalOpen(true);
  };

  // Submit Group (Create or Edit Name)
  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupNameInput.trim()) return;

    try {
      if (groupModalMode === 'create') {
        const created = await apiClient.createGroup(groupNameInput.trim());
        setIsGroupModalOpen(false);
        setGroupNameInput('');
        await fetchGroups();
        const details = await apiClient.getGroupDetails(created.id);
        setSelectedGroup(details);
        showToast(`"${created.name}" guruhi muvaffaqiyatli yaratildi!`);
      } else if (groupModalMode === 'edit' && editingGroupId) {
        const updated = await apiClient.updateGroupName(editingGroupId, groupNameInput.trim());
        setIsGroupModalOpen(false);
        setGroupNameInput('');
        await fetchGroups();
        if (selectedGroup?.id === editingGroupId) {
          const details = await apiClient.getGroupDetails(editingGroupId);
          setSelectedGroup(details);
        }
        showToast(`Guruh nomi "${updated.name}" ga o‘zgartirildi!`);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete Group
  const handleDeleteGroup = async (groupId: string, groupName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm(`Haqiqatan ham "${groupName}" guruhini butunlay o‘chirmoqchimisiz?`)) return;

    try {
      await apiClient.deleteGroup(groupId);
      showToast(`"${groupName}" guruhi o‘chirildi!`);
      const updatedList = groups.filter((g) => g.id !== groupId);
      setGroups(updatedList);
      if (selectedGroup?.id === groupId) {
        if (updatedList.length > 0) {
          const first = await apiClient.getGroupDetails(updatedList[0].id);
          setSelectedGroup(first);
        } else {
          setSelectedGroup(null);
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Open Add Student Modal
  const handleOpenAddStudent = () => {
    if (!selectedGroup) return;
    setAddStudentTab('create');
    setNewStudentFullName('');
    setNewStudentUsername('');
    setNewStudentPassword('Talaba123!');
    setSelectedExistingStudentId('');
    setIsAddStudentOpen(true);
  };

  // Generate random password helper
  const handleGenerateRandomPassword = (target: 'new' | 'edit') => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 9; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (target === 'new') {
      setNewStudentPassword(res);
    } else {
      setUpdatedPassword(res);
    }
  };

  // Submit Add Student (New or Existing)
  const handleSubmitAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      if (addStudentTab === 'create') {
        if (!newStudentFullName.trim() || !newStudentUsername.trim()) {
          setError('Iltimos, o‘quvchi ism-familiyasi va loginini to‘liq kiriting.');
          return;
        }

        const newStudent = await apiClient.createNewStudent({
          fullName: newStudentFullName.trim(),
          username: newStudentUsername.trim(),
          password: newStudentPassword.trim() || 'Talaba123!',
        });

        await apiClient.addStudentToGroup(selectedGroup.id, newStudent.id);
        showToast(`Yangi o‘quvchi ${newStudent.fullName} muvaffaqiyatli guruhga qo‘shildi!`);
      } else {
        if (!selectedExistingStudentId) {
          setError('Iltimos, biriktiriladigan o‘quvchini tanlang.');
          return;
        }

        await apiClient.addStudentToGroup(selectedGroup.id, selectedExistingStudentId);
        showToast('O‘quvchi muvaffaqiyatli guruhga biriktirildi!');
      }

      setIsAddStudentOpen(false);
      await fetchStudents();
      const updated = await apiClient.getGroupDetails(selectedGroup.id);
      setSelectedGroup(updated);
      await fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Remove Student From Group
  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!selectedGroup) return;
    if (!window.confirm(`Haqiqatan ham "${studentName}" o‘quvchisini ushbu guruhdan chiqarmoqchimisiz?`)) return;

    try {
      await apiClient.removeStudentFromGroup(selectedGroup.id, studentId);
      const updated = await apiClient.getGroupDetails(selectedGroup.id);
      setSelectedGroup(updated);
      await fetchGroups();
      showToast(`"${studentName}" guruhdan chiqarildi.`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Open Edit Password Modal
  const handleOpenPasswordModal = (student: User) => {
    setTargetStudent(student);
    setUpdatedPassword('Talaba2026!');
    setShowUpdatedPassword(false);
    setIsPasswordModalOpen(true);
  };

  // Save New Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent || !updatedPassword.trim()) return;

    try {
      await apiClient.updateStudentPassword(targetStudent.id, updatedPassword.trim());
      setIsPasswordModalOpen(false);
      showToast(`${targetStudent.fullName} o‘quvchisining paroli muvaffaqiyatli yangilandi!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-xs transition animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            O‘quv guruhlari va o‘quvchilar boshqaruvi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Guruhlar nomini tahrirlash, o‘quvchi qo‘shish, guruhdan chiqarish va o‘quvchi parollarini o‘zgartirish
          </p>
        </div>

        <button
          onClick={handleOpenCreateGroup}
          className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Yangi guruh ochish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Groups Table with Name Edit and Delete */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Mavjud guruhlar ro‘yxati</h3>
            <span className="text-xs text-slate-400">Jami: {groups.length} ta guruh</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3.5 font-semibold">Guruh nomi</th>
                  <th className="px-6 py-3.5 font-semibold">O‘quvchilar</th>
                  <th className="px-6 py-3.5 font-semibold">Faol vazifalar</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groups.map((g) => {
                  const isSelected = selectedGroup?.id === g.id;
                  return (
                    <tr
                      key={g.id}
                      onClick={() => handleSelectGroup(g)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition ${
                        isSelected ? 'bg-blue-50/60 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {g.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                          {g.studentCount ?? 0} nafar
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                          {g.activeAssignmentsCount ?? 0} ta
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleOpenEditGroup(g, e)}
                            title="Guruh nomini tahrirlash"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteGroup(g.id, g.name, e)}
                            title="Guruhni o‘chirish"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSelectGroup(g)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold inline-flex items-center gap-0.5 ml-1"
                          >
                            Ochish <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {groups.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      Hozircha guruhlar mavjud emas. Yuqoridagi "Yangi guruh ochish" tugmasini bosing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Selected Group Details & Student Management */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col h-[560px]">
          {selectedGroup ? (
            <>
              {/* Group Name & Student Add Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base truncate">{selectedGroup.name}</h3>
                    <button
                      onClick={() => handleOpenEditGroup(selectedGroup)}
                      title="Guruh nomini o‘zgartirish"
                      className="p-1 text-slate-400 hover:text-blue-600 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Guruhdagi o‘quvchilar soni: <strong>{selectedGroup.members.length} nafar</strong>
                  </p>
                </div>

                <button
                  onClick={handleOpenAddStudent}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition flex-shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  O‘quvchi qo‘shish
                </button>
              </div>

              {/* Members List with Password Edit & Remove Actions */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {selectedGroup.members.map((m) => (
                  <div
                    key={m.student.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/70 hover:bg-white transition"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-sm font-bold text-slate-800 truncate">{m.student.fullName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-slate-500 font-mono">
                          @{m.student.username}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                          O‘quvchi
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Edit Password Button */}
                      <button
                        onClick={() => handleOpenPasswordModal(m.student)}
                        title="O‘quvchi parolini o‘zgartirish"
                        className="p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition flex items-center gap-1 text-xs font-semibold"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span className="hidden sm:inline">Parol</span>
                      </button>

                      {/* Remove Student Button */}
                      <button
                        onClick={() => handleRemoveStudent(m.student.id, m.student.fullName)}
                        title="Guruhdan chiqarish"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedGroup.members.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center">
                    <UserPlus className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                    <p className="text-sm font-semibold">Guruhda o‘quvchilar yo‘q</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Yuqoridagi "O‘quvchi qo‘shish" tugmasini bosib yangi o‘quvchi kiriting.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
              <Users className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
              O‘quvchilar ro‘yxatini ko‘rish uchun chapdan guruhni tanlang
            </div>
          )}
        </div>
      </div>

      {/* Modal: Group Create or Edit Name */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FolderEdit className="w-5 h-5 text-blue-600" />
                {groupModalMode === 'create' ? 'Yangi guruh ochish' : 'Guruh nomini o‘zgartirish'}
              </h3>
              <button onClick={() => setIsGroupModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Guruh nomi
                </label>
                <input
                  type="text"
                  required
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  placeholder="Masalan: Guruh-104 (Java Dasturlash)"
                  className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tushunarli va guruh yo‘nalishini aks ettiruvchi nom kiriting.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20"
                >
                  {groupModalMode === 'create' ? 'Yaratish' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Student to Group (Create New Student OR Select Existing) */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Guruhga o‘quvchi qo‘shish
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tanlangan guruh: <strong>{selectedGroup?.name}</strong>
                </p>
              </div>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switcher: New Student vs Existing Student */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setAddStudentTab('create')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  addStudentTab === 'create'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Yangi o‘quvchi ro‘yxatga olish
              </button>
              <button
                type="button"
                onClick={() => setAddStudentTab('existing')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  addStudentTab === 'existing'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Mavjud o‘quvchilardan tanlash
              </button>
            </div>

            <form onSubmit={handleSubmitAddStudent} className="space-y-4">
              {addStudentTab === 'create' ? (
                /* Mode 1: Create New Student */
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      O‘quvchi ism va familiyasi
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentFullName}
                      onChange={(e) => setNewStudentFullName(e.target.value)}
                      placeholder="Masalan: Aliyev Jamshid"
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tizimga kirish logini (Username)
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudentUsername}
                      onChange={(e) => setNewStudentUsername(e.target.value)}
                      placeholder="Masalan: jamshid_a"
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Boshlang‘ich parol
                      </label>
                      <button
                        type="button"
                        onClick={() => handleGenerateRandomPassword('new')}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Parol generatsiya qilish
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newStudentPassword}
                        onChange={(e) => setNewStudentPassword(e.target.value)}
                        className="w-full h-10 pl-3 pr-10 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      O‘quvchi ushbu login va parol bilan Windows ilovasida tizimga kiradi.
                    </p>
                  </div>
                </div>
              ) : (
                /* Mode 2: Select from Existing Students */
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mavjud o‘quvchini tanlang
                  </label>
                  <select
                    value={selectedExistingStudentId}
                    onChange={(e) => setSelectedExistingStudentId(e.target.value)}
                    className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- O‘quvchini tanlang --</option>
                    {allStudents
                      .filter((s) => !selectedGroup?.members.some((m) => m.student.id === s.id))
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} (@{s.username})
                        </option>
                      ))}
                  </select>
                  {allStudents.filter((s) => !selectedGroup?.members.some((m) => m.student.id === s.id)).length === 0 && (
                    <p className="text-xs text-amber-600 mt-2">
                      Barcha mavjud o‘quvchilar ushbu guruhga qo‘shilgan. Yangi o‘quvchi yaratish tabidan foydalaning.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20"
                >
                  Guruhga qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student Password */}
      {isPasswordModalOpen && targetStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                O‘quvchi parolini o‘zgartirish
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Tanlangan o‘quvchi:</p>
                <p className="text-sm font-bold text-slate-900">{targetStudent.fullName}</p>
                <p className="text-xs text-slate-500 font-mono">Login: @{targetStudent.username}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Yangi parol</label>
                  <button
                    type="button"
                    onClick={() => handleGenerateRandomPassword('edit')}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Yangi parol generatsiya
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showUpdatedPassword ? 'text' : 'password'}
                    required
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    placeholder="Yangi parol kiriting"
                    className="w-full h-11 pl-3 pr-10 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUpdatedPassword(!showUpdatedPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showUpdatedPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  O‘quvchi paroli o‘zgargach, u desktop ilovada yangi parol orqali tizimga kiradi.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-600/20"
                >
                  Parolni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
