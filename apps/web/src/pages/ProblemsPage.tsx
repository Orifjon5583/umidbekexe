import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { Problem, ProgrammingLanguage, ProblemDifficulty } from '@codepractice/shared-types';
import { Plus, Search, Code2, Clock, Cpu, X, Check, EyeOff, Eye, FileText } from 'lucide-react';

export const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form holati
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    inputDescription: '',
    outputDescription: '',
    sampleInput: '',
    sampleOutput: '',
    language: 'python' as ProgrammingLanguage,
    difficulty: 'easy' as ProblemDifficulty,
    timeLimitMs: 2000,
    memoryLimitMb: 128,
  });

  // Test keyslar (10 tagacha)
  const [testCases, setTestCases] = useState<Array<{ inputData: string; expectedOutput: string; isHidden: boolean }>>([
    { inputData: '', expectedOutput: '', isHidden: false },
    { inputData: '', expectedOutput: '', isHidden: false },
    { inputData: '', expectedOutput: '', isHidden: true },
  ]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getTeacherProblems();
      setProblems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleAddTestCaseRow = () => {
    if (testCases.length >= 10) return;
    setTestCases([...testCases, { inputData: '', expectedOutput: '', isHidden: true }]);
  };

  const handleRemoveTestCaseRow = (idx: number) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  const handleTestCaseChange = (index: number, field: string, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validTests = testCases.filter((t) => t.inputData.trim() || t.expectedOutput.trim());
    if (validTests.length === 0) {
      setError('Kamida bitta test case kiritilishi shart');
      return;
    }

    try {
      await apiClient.createProblem({
        ...formData,
        testCases: validTests,
      } as any);

      setIsModalOpen(false);
      setFormData({
        title: '',
        statement: '',
        inputDescription: '',
        outputDescription: '',
        sampleInput: '',
        sampleOutput: '',
        language: 'python',
        difficulty: 'easy',
        timeLimitMs: 2000,
        memoryLimitMb: 128,
      });
      setTestCases([
        { inputData: '', expectedOutput: '', isHidden: false },
        { inputData: '', expectedOutput: '', isHidden: false },
        { inputData: '', expectedOutput: '', isHidden: true },
      ]);
      await fetchProblems();
    } catch (err: any) {
      setError(err.message || 'Masala yaratishda xatolik yuz berdi');
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchLang = langFilter === 'all' || p.language === langFilter;
    const matchDiff = diffFilter === 'all' || p.difficulty === diffFilter;
    return matchSearch && matchLang && matchDiff;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Masalalar banki</h2>
          <p className="text-sm text-slate-500 mt-1">Dasturlash topshiriqlari va avtomatik testlar boshqaruvi</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yangi masala yaratish
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Masala nomini qidirish..."
            className="w-full h-10 pl-10 pr-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Barcha tillar</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <select
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value)}
          className="h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Barcha qiyinlik darajalari</option>
          <option value="easy">Oson</option>
          <option value="medium">O‘rta</option>
          <option value="hard">Qiyin</option>
        </select>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="px-6 py-3 font-medium">Masala nomi</th>
              <th className="px-6 py-3 font-medium">Dasturlash tili</th>
              <th className="px-6 py-3 font-medium">Qiyinlik</th>
              <th className="px-6 py-3 font-medium">Limitlar</th>
              <th className="px-6 py-3 font-medium">Versiya</th>
              <th className="px-6 py-3 font-medium">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredProblems.map((prob) => (
              <tr key={prob.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{prob.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1 max-w-md">{prob.statement}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      prob.language === 'python'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {prob.language === 'python' ? 'Python' : 'C++'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prob.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prob.difficulty === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {prob.difficulty === 'easy'
                      ? 'Oson'
                      : prob.difficulty === 'medium'
                      ? 'O‘rta'
                      : 'Qiyin'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {prob.timeLimitMs} ms
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" /> {prob.memoryLimitMb} MB
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">v{prob.version}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                    Faol
                  </span>
                </td>
              </tr>
            ))}
            {filteredProblems.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Mos masalalar topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Yangi masala yaratish */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8 p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Yangi masala va testlar yaratish</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Masala nomi</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Masalan: Ikki son yig‘indisi"
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Dasturlash tili</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as ProgrammingLanguage })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Qiyinlik darajasi</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as ProblemDifficulty })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Oson</option>
                    <option value="medium">O‘rta</option>
                    <option value="hard">Qiyin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Vaqt chegarasi (ms)</label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={formData.timeLimitMs}
                    onChange={(e) => setFormData({ ...formData, timeLimitMs: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">RAM chegarasi (MB)</label>
                  <input
                    type="number"
                    min="16"
                    max="1024"
                    value={formData.memoryLimitMb}
                    onChange={(e) => setFormData({ ...formData, memoryLimitMb: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Masala sharti (Statement)</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.statement}
                    onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                    placeholder="Masalaning to‘liq shartini kiriting..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Namunaviy Input</label>
                  <textarea
                    rows={2}
                    value={formData.sampleInput}
                    onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                    placeholder="5 7"
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Namunaviy Output</label>
                  <textarea
                    rows={2}
                    value={formData.sampleOutput}
                    onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                    placeholder="12"
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              {/* Test Keyslar ro'yxati (10 tagacha) */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-slate-800">
                    Avtomatik testlar ({testCases.length} ta)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddTestCaseRow}
                    disabled={testCases.length >= 10}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium disabled:opacity-50"
                  >
                    + Test qo‘shish (max 10)
                  </button>
                </div>

                <div className="space-y-2">
                  {testCases.map((tc, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-xs font-bold text-slate-500 w-6">#{idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Input data"
                        value={tc.inputData}
                        onChange={(e) => handleTestCaseChange(idx, 'inputData', e.target.value)}
                        className="flex-1 h-9 px-2 text-xs font-mono border border-slate-300 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Expected output"
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                        className="flex-1 h-9 px-2 text-xs font-mono border border-slate-300 rounded bg-white"
                      />
                      <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) => handleTestCaseChange(idx, 'isHidden', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-blue-600"
                        />
                        <span>Yashirin</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCaseRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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
                  Masalani saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
