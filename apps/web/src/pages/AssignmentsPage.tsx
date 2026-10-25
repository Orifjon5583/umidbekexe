import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { Assignment, Group, Problem } from '@codepractice/shared-types';
import { Plus, CheckSquare, Calendar, Users, X, Clock, AlertCircle } from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [startsAt, setStartsAt] = useState(new Date().toISOString().slice(0, 16));
  const [dueAt, setDueAt] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assList, grpList, probList] = await Promise.all([
        apiClient.getTeacherAssignments(),
        apiClient.getTeacherGroups(),
        apiClient.getTeacherProblems(),
      ]);
      setAssignments(assList);
      setGroups(grpList);
      setProblems(probList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleProblem = (id: string) => {
    if (selectedProblemIds.includes(id)) {
      setSelectedProblemIds(selectedProblemIds.filter((p) => p !== id));
    } else {
      setSelectedProblemIds([...selectedProblemIds, id]);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!groupId) {
      setError('Iltimos, guruhni tanlang');
      return;
    }
    if (selectedProblemIds.length === 0) {
      setError('Kamida bitta masala tanlanishi kerak');
      return;
    }

    try {
      await apiClient.createAssignment({
        title,
        description,
        groupId,
        startsAt: new Date(startsAt).toISOString(),
        dueAt: new Date(dueAt).toISOString(),
        problemIds: selectedProblemIds,
      });

      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setSelectedProblemIds([]);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Vazifa yaratishda xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Uy vazifalari</h2>
          <p className="text-sm text-slate-500 mt-1">Guruhlarga topshiriqlar biriktirish va muddatlarini belgilash</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yangi vazifa tayinlash
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((a) => (
          <div key={a.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                  {a.groupName || 'Guruh'}
                </span>
                <span className="text-xs text-slate-400">
                  {a.problems?.length ?? 0} ta masala
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">{a.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{a.description || 'Izoh berilmagan'}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Boshlanadi: {new Date(a.startsAt).toLocaleDateString('uz-UZ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Muddati: {new Date(a.dueAt).toLocaleDateString('uz-UZ')}</span>
              </div>
            </div>
          </div>
        ))}
        {assignments.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm bg-white rounded-lg border border-slate-200">
            Hozircha vazifalar mavjud emas. Yangi vazifa yarating.
          </div>
        )}
      </div>

      {/* Modal: Yangi vazifa yaratish */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Yangi vazifa tayinlash</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Vazifa nomi</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: 2-hafta: Sikllar va massivlar"
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Izoh (O‘quvchilar uchun)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vazifa bo‘yicha qo‘shimcha ko‘rsatmalar..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Guruhni tanlang</label>
                <select
                  required
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Guruhni tanlang --</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.studentCount ?? 0} nafar o‘quvchi)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Boshlanish vaqti</label>
                  <input
                    type="datetime-local"
                    required
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Topshirish muddati (Deadline)</label>
                  <input
                    type="datetime-local"
                    required
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Problems selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Biriktiriladigan masalalar ({selectedProblemIds.length} ta tanlandi)
                </label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1.5 bg-slate-50">
                  {problems.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded bg-white border border-slate-100 hover:border-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProblemIds.includes(p.id)}
                        onChange={() => handleToggleProblem(p.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-slate-800 flex-1">{p.title}</span>
                      <span className="text-xs uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                        {p.language}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  Vazifani e’lon qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
