import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { Group, GroupWithMembers, User } from '@codepractice/shared-types';
import { Plus, Users, UserPlus, Trash2, X, ChevronRight, UserMinus } from 'lucide-react';

export const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<GroupWithMembers | null>(null);
  const [allStudents, setAllStudents] = useState<User[]>([]);

  // Modallar
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getTeacherGroups();
      setGroups(data);
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

  const handleSelectGroup = async (group: Group) => {
    try {
      const details = await apiClient.getGroupDetails(group.id);
      setSelectedGroup(details);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await apiClient.createGroup(newGroupName.trim());
      setNewGroupName('');
      setIsCreateOpen(false);
      await fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedGroup || !selectedStudentId) return;
    try {
      await apiClient.addStudentToGroup(selectedGroup.id, selectedStudentId);
      setIsAddStudentOpen(false);
      setSelectedStudentId('');
      const updated = await apiClient.getGroupDetails(selectedGroup.id);
      setSelectedGroup(updated);
      await fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedGroup) return;
    if (!window.confirm('Haqiqatan ham bu o‘quvchini guruhdan chiqarmoqchimisiz?')) return;
    try {
      await apiClient.removeStudentFromGroup(selectedGroup.id, studentId);
      const updated = await apiClient.getGroupDetails(selectedGroup.id);
      setSelectedGroup(updated);
      await fetchGroups();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">O‘quv guruhlari</h2>
          <p className="text-sm text-slate-500 mt-1">Guruhlar tuzish va o‘quvchilarni biriktirish</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yangi guruh ochish
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Mavjud guruhlar</h3>
          </div>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="px-6 py-3 font-medium">Guruh nomi</th>
                <th className="px-6 py-3 font-medium">O‘quvchilar soni</th>
                <th className="px-6 py-3 font-medium">Faol vazifalar</th>
                <th className="px-6 py-3 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {groups.map((g) => (
                <tr
                  key={g.id}
                  onClick={() => handleSelectGroup(g)}
                  className={`hover:bg-slate-50 cursor-pointer transition ${
                    selectedGroup?.id === g.id ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    {g.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{g.studentCount ?? 0} nafar</td>
                  <td className="px-6 py-4 text-slate-600">{g.activeAssignmentsCount ?? 0} ta</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                      Ko‘rish <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    Guruhlar mavjud emas. Yangi guruh yarating.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Group Details & Members */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col h-[520px]">
          {selectedGroup ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">{selectedGroup.name}</h3>
                  <p className="text-xs text-slate-500">Jami o‘quvchilar: {selectedGroup.members.length} ta</p>
                </div>
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Qo‘shish
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {selectedGroup.members.map((m) => (
                  <div
                    key={m.student.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/60"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{m.student.fullName}</p>
                      <p className="text-xs text-slate-400">@{m.student.username}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(m.student.id)}
                      title="Guruhdan chiqarish"
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedGroup.members.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-10">Ushbu guruhga o‘quvchilar biriktirilmagan</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
              <Users className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
              Tafsilotlarini ko‘rish uchun guruhni tanlang
            </div>
          )}
        </div>
      </div>

      {/* Modal: Yangi guruh yaratish */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Yangi o‘quv guruhi yaratish</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Guruh nomi</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Masalan: Guruh-102 (Algoritmlar)"
                  className="w-full h-11 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-10 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: O'quvchini guruhga qo'shish */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">O‘quvchini guruhga biriktirish</h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">O‘quvchini tanlang</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="h-10 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleAddStudent}
                  disabled={!selectedStudentId}
                  className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  Qo‘shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
