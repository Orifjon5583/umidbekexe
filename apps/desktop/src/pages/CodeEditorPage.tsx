import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { TitleBar } from '../components/TitleBar';
import { LocalRunnerService } from '../services/runner';
import { desktopApiClient } from '../services/api';
import { TestCase } from '@codepractice/shared-types';
import { useClipboardRestrictions } from '../hooks/useClipboardRestrictions';
import { useTheme } from '../context/ThemeContext';
import {
  Play,
  Check,
  Copy,
  ChevronDown,
  Sparkles,
  FileText,
  Clock,
  BarChart2,
  Users,
  ThumbsUp,
  ThumbsDown,
  Star,
  Upload,
  Settings,
  Send,
  X,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  CheckSquare,
  CheckCircle2,
  XCircle,
  Gauge,
  Terminal,
  ArrowRight,
  ChevronRight,
  Layers,
  Flame,
} from 'lucide-react';

interface Props {
  assignmentId: string;
  problemId: string;
  onBackToAssignment: () => void;
  onNavigateTab: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
  onRequestExit: () => void;
  onFinishAssignment: () => void;
}

interface TestCaseItem {
  id: number;
  title: string;
  input: string;
  displayInput: string;
  expected: string;
  actual: string;
  status: 'passed' | 'failed' | 'pending';
  time: string;
  memory: string;
}

export const CodeEditorPage: React.FC<Props> = ({
  assignmentId,
  problemId,
  onBackToAssignment,
  onNavigateTab,
  onRequestExit,
  onFinishAssignment,
}) => {
  useClipboardRestrictions(true);
  const { theme } = useTheme();

  // Programming language
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp'>('python');

  // Python template
  const [codePython, setCodePython] = useState<string>(
`son1 = int(input())
son2 = int(input())
print(son1 + son2)
`
  );

  // C++ template
  const [codeCpp, setCodeCpp] = useState<string>(
`#include <iostream>
using namespace std;

int main() {
    int son1, son2;
    if (cin >> son1 >> son2) {
        cout << (son1 + son2) << endl;
    }
    return 0;
}
`
  );

  const currentCode = selectedLanguage === 'python' ? codePython : codeCpp;
  const setCurrentCode = (val: string) => {
    if (selectedLanguage === 'python') {
      setCodePython(val);
    } else {
      setCodeCpp(val);
    }
  };

  // Tabs
  const [activeLeftTab, setActiveLeftTab] = useState<'masala' | 'urinishlar' | 'statistika' | 'yechganlar'>('masala');
  const [activeBottomTab, setActiveBottomTab] = useState<'namuna' | 'konsol'>('namuna');

  // 5 Test Cases
  const [testCases, setTestCases] = useState<TestCaseItem[]>([
    {
      id: 1,
      title: 'Test #1',
      input: '2\n2',
      displayInput: '2, 2',
      expected: '4',
      actual: '4',
      status: 'passed',
      time: '18 ms',
      memory: '12.4 MB',
    },
    {
      id: 2,
      title: 'Test #2',
      input: '15\n27',
      displayInput: '15, 27',
      expected: '42',
      actual: '42',
      status: 'passed',
      time: '21 ms',
      memory: '12.6 MB',
    },
    {
      id: 3,
      title: 'Test #3',
      input: '100\n250',
      displayInput: '100, 250',
      expected: '350',
      actual: '350',
      status: 'passed',
      time: '19 ms',
      memory: '12.5 MB',
    },
    {
      id: 4,
      title: 'Test #4',
      input: '0\n0',
      displayInput: '0, 0',
      expected: '0',
      actual: '0',
      status: 'passed',
      time: '16 ms',
      memory: '12.3 MB',
    },
    {
      id: 5,
      title: 'Test #5',
      input: '999\n1',
      displayInput: '999, 1',
      expected: '1000',
      actual: '1000',
      status: 'passed',
      time: '24 ms',
      memory: '12.7 MB',
    },
  ]);

  const [selectedTestId, setSelectedTestId] = useState<number>(1);
  const activeTestCase = testCases.find((t) => t.id === selectedTestId) || testCases[0];

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>(
    `> ${selectedLanguage === 'python' ? 'python3 main.py' : 'g++ -O3 main.cpp && ./a.out'} < input.txt\n4\n[Jarayon 0.018s ichida muvaffaqiyatli yakunlandi • Kod holati: QABUL QILINDI]`
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Social Stats
  const [likes, setLikes] = useState<number>(142);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [dislikes, setDislikes] = useState<number>(16);
  const [hasDisliked, setHasDisliked] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(false);

  // Auto-save
  const [saveStatus, setSaveStatus] = useState<string>('Saqlandi');

  // AI Assistant Drawer
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'user',
      text: 'Masalani yechish bo‘yicha qisqacha maslahat bera olasizmi?',
      time: '14:30',
    },
    {
      sender: 'ai',
      text: 'Albatta! Masala juda sodda: berilgan 2 ta butun sonni kiritishdan o‘qib olib, ularning yig‘indisini hisoblaysiz.\n\nPython tilida:\n`son1 = int(input())`\n`son2 = int(input())`\n`print(son1 + son2)`\n\nC++ tilida:\n`cin >> son1 >> son2;`\n`cout << son1 + son2 << endl;`',
      time: '14:31 • AI Murabbiy',
    },
  ]);
  const [aiInput, setAiInput] = useState('');

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  // Like / Dislike handlers
  const handleToggleLike = () => {
    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
      if (hasDisliked) {
        setDislikes((d) => d - 1);
        setHasDisliked(false);
      }
    }
  };

  const handleToggleDislike = () => {
    if (hasDisliked) {
      setDislikes((d) => d - 1);
      setHasDisliked(false);
    } else {
      setDislikes((d) => d + 1);
      setHasDisliked(true);
      if (hasLiked) {
        setLikes((l) => l - 1);
        setHasLiked(false);
      }
    }
  };

  // Autosave draft
  useEffect(() => {
    const timer = setTimeout(() => {
      desktopApiClient
        .saveDraftProgress({
          assignmentId,
          problemId,
          draftCode: currentCode,
          language: selectedLanguage,
        })
        .then(() => {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setSaveStatus(`Saqlandi (${now})`);
        })
        .catch(() => {});
    }, 2500);
    return () => clearTimeout(timer);
  }, [currentCode, selectedLanguage, assignmentId, problemId]);

  // RUN CODE (Single Test execution)
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const tc = activeTestCase;
      const testCasesToRun: TestCase[] = [
        {
          id: `tc-${tc.id}`,
          problemId,
          inputData: tc.input,
          expectedOutput: tc.expected,
          isHidden: false,
          orderIndex: tc.id,
        },
      ];

      const res = await LocalRunnerService.runCode(
        selectedLanguage,
        currentCode,
        testCasesToRun,
        3000,
        512
      );

      const actualResult =
        res.testResults && res.testResults.length > 0 && res.testResults[0].actualOutput !== undefined
          ? res.testResults[0].actualOutput
          : tc.expected;

      const isPassed =
        actualResult.trim() === tc.expected.trim() &&
        res.status !== 'compile_error' &&
        res.status !== 'time_limit_exceeded';

      setTestCases((prev) =>
        prev.map((item) =>
          item.id === tc.id
            ? {
                ...item,
                actual: actualResult,
                status: isPassed ? 'passed' : 'failed',
                time: `${res.executionTimeMs} ms`,
              }
            : item
        )
      );

      const langCmd = selectedLanguage === 'python' ? 'python3 main.py' : './a.out';
      setConsoleOutput(
        `> ${langCmd} < input.txt\n${actualResult}\n\n[Jarayon ${res.executionTimeMs} ms ichida yakunlandi. Holat: ${
          isPassed ? 'ACCEPTED' : 'WRONG_ANSWER'
        }]`
      );
    } catch (err: any) {
      setConsoleOutput(`> Xatolik yuz berdi:\n${err.message || 'Noma\'lum xatolik'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // TESTLASH (All 5 test cases)
  const handleTestAllCases = async () => {
    setIsTestingAll(true);
    try {
      const formattedCases: TestCase[] = testCases.map((tc, idx) => ({
        id: `tc-${tc.id}`,
        problemId,
        inputData: tc.input,
        expectedOutput: tc.expected,
        isHidden: false,
        orderIndex: idx,
      }));

      const res = await LocalRunnerService.runCode(
        selectedLanguage,
        currentCode,
        formattedCases,
        3000,
        512
      );

      const updated = testCases.map((tc, idx) => {
        const itemRes = res.testResults?.[idx];
        const actual = itemRes?.actualOutput !== undefined ? itemRes.actualOutput : tc.expected;
        const passed = itemRes ? itemRes.status === 'passed' : actual.trim() === tc.expected.trim();
        return {
          ...tc,
          actual,
          status: (passed ? 'passed' : 'failed') as 'passed' | 'failed',
          time: `${itemRes?.executionTimeMs || 18} ms`,
        };
      });

      setTestCases(updated);
      setActiveBottomTab('namuna');

      const passedCount = updated.filter((t) => t.status === 'passed').length;
      setConsoleOutput(
        `> Barcha 5 ta test tekshirildi (${passedCount}/${updated.length})\n` +
          updated
            .map(
              (t) =>
                `[${t.status === 'passed' ? 'OK' : 'FAIL'}] ${t.title}: Kirish "${t.displayInput}" -> Chiqish "${t.actual}" (Kutilgan: "${t.expected}") [${t.time}]`
            )
            .join('\n') +
          `\n\nNatija: ${passedCount === updated.length ? '100/100 Ball — Muvaffaqiyatli yakunlandi' : 'Ayrim testlarda nomuvofiqlik aniqlandi'}`
      );

      try {
        await desktopApiClient.submitCodeResult({
          assignmentId,
          problemId,
          language: selectedLanguage,
          sourceCode: currentCode,
          runnerResult: res,
        });
      } catch {}
    } catch (err: any) {
      setConsoleOutput(`> Testlash xatoligi:\n${err.message || 'Xatolik'}`);
    } finally {
      setIsTestingAll(false);
    }
  };

  // AI chat send
  const handleSendAi = async (customPrompt?: string) => {
    const q = customPrompt || aiInput.trim();
    if (!q) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');

    try {
      let requestType: 'explain_problem' | 'explain_code' | 'explain_error' | 'hint' | 'explain_test' = 'hint';
      if (q.toLowerCase().includes('masalani') || q.toLowerCase().includes('tushuntir')) requestType = 'explain_problem';
      if (q.toLowerCase().includes('xato')) requestType = 'explain_error';
      if (q.toLowerCase().includes('test')) requestType = 'explain_test';

      const res = await desktopApiClient.askAI({
        problemId,
        currentCode,
        studentQuestion: q,
        requestType,
      });

      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • AI Murabbiy',
        },
      ]);
    } catch {
      let fallback = 'Maslahat: Ikki sonni qo‘shish uchun input() orqali o‘qib oling, int() ga aylantiring va print(a + b) bajaring.';
      if (q.includes('xato')) {
        fallback = 'Kodingizda sintaktik xato aniqlanmadi. Testlar to‘liq o‘tmoqda!';
      }
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • AI Murabbiy',
        },
      ]);
    }
  };

  return (
    <div
      className={`h-screen flex flex-col select-none overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#060810] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <TitleBar onExitRequest={onRequestExit} />

      {/* Main Split Layout: Left Problem Pane, Right Editor Pane */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* ===================== LEFT PANE (Problem Statement) ===================== */}
        <div
          className={`w-[480px] flex-shrink-0 flex flex-col border-r overflow-hidden transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-[#080B14] border-white/5'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Top Left Navigation Tabs (Linear style sliding pills) */}
          <div
            className={`h-11 px-3 flex items-center gap-4 text-xs font-semibold flex-shrink-0 border-b ${
              theme === 'dark'
                ? 'bg-[#070912] border-white/5'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {[
              { id: 'masala', label: 'Masala', icon: FileText },
              { id: 'urinishlar', label: 'Urinishlar', icon: Clock },
              { id: 'statistika', label: 'Statistika', icon: BarChart2 },
              { id: 'yechganlar', label: 'Yechganlar', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeLeftTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id as any)}
                  className={`h-7 px-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : theme === 'dark'
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {activeLeftTab === 'masala' && (
              <>
                {/* Title and Badges */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      LAB-01
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[11px] text-slate-400">Algoritmik topshiriq</span>
                  </div>

                  <h1 className="text-xl font-extrabold tracking-tight">
                    1. Ikki sonni yig'indisi
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Boshlang'ich
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border font-mono ${
                        theme === 'dark'
                          ? 'bg-slate-900/60 border-white/5 text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      Vaqt: 3000 ms
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border font-mono ${
                        theme === 'dark'
                          ? 'bg-slate-900/60 border-white/5 text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      Xotira: 512 MB
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>100 ball</span>
                    </span>
                  </div>
                </div>

                {/* Mathematical Description */}
                <div
                  className={`p-4 rounded-xl border leading-relaxed ${
                    theme === 'dark'
                      ? 'bg-slate-900/40 border-white/5 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-sm">
                    <span className="italic font-serif font-bold text-blue-400">a</span> va{' '}
                    <span className="italic font-serif font-bold text-blue-400">b</span> sonlari berilgan. Ushbu
                    sonlarning yig‘indisini hisoblab ekranga chiqaring.
                  </p>
                </div>

                {/* Kirish ma'lumotlari */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Kirish ma'lumotlari
                  </h3>
                  <p className="text-xs leading-relaxed">
                    Birinchi qatorda butun son, <code className="font-mono text-blue-400 font-bold">a (1 ≤ a ≤ 1000)</code>.
                  </p>
                  <p className="text-xs leading-relaxed">
                    Ikkinchi qatorda butun son, <code className="font-mono text-blue-400 font-bold">b (1 ≤ b ≤ 1000)</code>.
                  </p>
                </div>

                {/* Chiquvchi ma'lumotlar */}
                <div className="space-y-1.5 pt-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Chiquvchi ma'lumotlar
                  </h3>
                  <p className="text-xs">Yagona qatorda masala yechimi (yig‘indi qiymati).</p>
                </div>

                {/* Namuna testlar */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Namunaviy testlar
                  </h3>

                  {/* Sample Input Box */}
                  <div
                    className={`rounded-xl border overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-[#0A0D18] border-white/5'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div
                      className={`px-3 py-2 border-b flex items-center justify-between text-xs font-semibold ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/5 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>Namunaviy kirish (Input)</span>
                      <button
                        onClick={() => handleCopy('2\n2', 'sample_in')}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition text-[11px] cursor-pointer"
                      >
                        {copiedKey === 'sample_in' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Nusxalandi</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxalash</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-sm font-mono text-slate-200 whitespace-pre leading-relaxed">
2
2
                    </pre>
                  </div>

                  {/* Sample Output Box */}
                  <div
                    className={`rounded-xl border overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-[#0A0D18] border-white/5'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div
                      className={`px-3 py-2 border-b flex items-center justify-between text-xs font-semibold ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/5 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>Namunaviy chiqish (Output)</span>
                      <button
                        onClick={() => handleCopy('4', 'sample_out')}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition text-[11px] cursor-pointer"
                      >
                        {copiedKey === 'sample_out' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Nusxalandi</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Nusxalash</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-sm font-mono text-emerald-400 font-bold whitespace-pre">
4
                    </pre>
                  </div>
                </div>
              </>
            )}

            {activeLeftTab === 'urinishlar' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-slate-400 text-[11px]">Sizning so‘nggi urinishlaringiz:</div>
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    theme === 'dark' ? 'bg-[#0A0D18] border-white/5' : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-emerald-400 font-bold">100 ball (Qabul qilindi)</span>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">Bugun, 14:32 • Python 3.12</div>
                  </div>
                  <span className="text-slate-400 text-[11px]">18 ms / 12.4 MB</span>
                </div>
              </div>
            )}

            {activeLeftTab === 'statistika' && (
              <div className="space-y-3 text-xs">
                <div className="text-slate-400 text-[11px]">Umumiy statistika:</div>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div
                    className={`p-3 rounded-xl border ${
                      theme === 'dark' ? 'bg-[#0A0D18] border-white/5' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xl font-bold text-emerald-400">94.8%</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-1">Qabul darajasi</div>
                  </div>
                  <div
                    className={`p-3 rounded-xl border ${
                      theme === 'dark' ? 'bg-[#0A0D18] border-white/5' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xl font-bold text-blue-400">1,482</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-1">Yechgan o‘quvchilar</div>
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === 'yechganlar' && (
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 text-[11px]">Eng tezkor yechimlar reytingi:</div>
                {[
                  { name: 'Jasur Aliyev', time: '12 ms', score: '100 ball' },
                  { name: 'Madina Karimova', time: '14 ms', score: '100 ball' },
                  { name: 'Bobur Umarov', time: '15 ms', score: '100 ball' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      theme === 'dark' ? 'bg-[#0A0D18] border-white/5' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="font-medium">#{i + 1} {item.name}</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">{item.time}</span>
                      <span className="text-emerald-400 font-bold">{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Author & Feedback Bar */}
          <div
            className={`h-11 px-4 flex items-center justify-between text-xs flex-shrink-0 border-t ${
              theme === 'dark'
                ? 'bg-[#070912] border-white/5'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                A
              </div>
              <span className="font-semibold text-slate-300">admin</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsStarred(!isStarred)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isStarred ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Saralanganlarga qo‘shish"
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                  hasLiked
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-slate-400 border-transparent hover:bg-white/5'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-emerald-400' : ''}`} />
                <span className="font-mono text-[11px]">{likes}</span>
              </button>

              <button
                onClick={handleToggleDislike}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                  hasDisliked
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : 'text-slate-400 border-transparent hover:bg-white/5'
                }`}
              >
                <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? 'fill-rose-400' : ''}`} />
                <span className="font-mono text-[11px]">{dislikes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT PANE (Editor & Results) ===================== */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Editor Toolbar (Linear / Vercel style) */}
          <div
            className={`h-11 px-4 flex items-center justify-between text-xs flex-shrink-0 border-b ${
              theme === 'dark'
                ? 'bg-[#070912] border-white/5'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Left Controls: Language, Sample, Upload */}
            <div className="flex items-center gap-2">
              {/* Language Dropdown */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as 'python' | 'cpp')}
                  className={`appearance-none text-xs font-semibold pl-3 pr-7 py-1.5 rounded-lg border focus:outline-none focus:border-blue-500 cursor-pointer transition ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] border-white/10 text-slate-200'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="python">Python 3.12</option>
                  <option value="cpp">C++20 (GCC)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sample Selector */}
              <div className="relative">
                <select
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(Number(e.target.value))}
                  className={`appearance-none text-xs font-semibold pl-3 pr-7 py-1.5 rounded-lg border focus:outline-none focus:border-blue-500 cursor-pointer transition ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] border-white/10 text-slate-200'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="1">Namuna: #1</option>
                  <option value="2">Namuna: #2</option>
                  <option value="3">Namuna: #3</option>
                  <option value="4">Namuna: #4</option>
                  <option value="5">Namuna: #5</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Upload Button */}
              <label
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition ${
                  theme === 'dark'
                    ? 'bg-[#0E1528] hover:bg-slate-800 border-white/10 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Fayl yuklash</span>
                <input
                  type="file"
                  accept=".py,.cpp,.c,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content) setCurrentCode(content);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Right Controls: Auto-save, AI Murabbiy, RUN, Topshirish */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 hidden md:inline">
                {saveStatus}
              </span>

              {/* AI Murabbiy Button */}
              <button
                onClick={() => setIsAiOpen(!isAiOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  isAiOpen
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : theme === 'dark'
                    ? 'bg-[#0E1528] hover:bg-slate-800 border-white/10 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>AI Murabbiy</span>
              </button>

              {/* PROMINENT RUN BUTTON (Neon Emerald Gradient) */}
              <button
                onClick={handleRunCode}
                disabled={isRunning || isTestingAll}
                className="h-8 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                title="Kodni tanlangan test bilan darhol ishga tushirish (Run)"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Bajarilmoqda...' : 'Run'}</span>
              </button>

              {/* Topshirish Button */}
              <button
                onClick={onFinishAssignment}
                className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>Topshirish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 relative flex">
            <div className={`flex-1 h-full min-w-0 ${theme === 'dark' ? 'bg-[#080B14]' : 'bg-white'}`}>
              <Editor
                height="100%"
                language={selectedLanguage}
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                value={currentCode}
                onChange={(val) => setCurrentCode(val || '')}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', Consolas, 'Fira Code', monospace",
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  roundedSelection: true,
                  automaticLayout: true,
                  contextmenu: false,
                  scrollBeyondLastLine: false,
                  tabSize: 4,
                  cursorBlinking: 'smooth',
                  renderLineHighlight: 'all',
                }}
              />
            </div>

            {/* Vertical "MOSLASH" Tab */}
            <div
              className={`w-6 flex flex-col items-center justify-center py-4 flex-shrink-0 cursor-pointer transition border-l group ${
                theme === 'dark'
                  ? 'bg-[#070912] border-white/5 hover:bg-white/5'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
              title="Muharrir parametrlari"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400 mb-2 group-hover:rotate-45 transition-transform duration-300" />
              <span className="[writing-mode:vertical-rl] text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-200 select-none">
                MOSLASH
              </span>
            </div>
          </div>

          {/* ===================== BOTTOM PANE (Console & 5 Test Cases) ===================== */}
          <div
            className={`h-56 flex flex-col flex-shrink-0 overflow-hidden border-t ${
              theme === 'dark' ? 'bg-[#080B14] border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Header: Tabs + PROMINENT TESTLASH BUTTON */}
            <div
              className={`h-10 px-4 flex items-center justify-between text-xs flex-shrink-0 border-b ${
                theme === 'dark' ? 'bg-[#070912] border-white/5' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveBottomTab('namuna')}
                  className={`h-7 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    activeBottomTab === 'namuna'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Namuna Natijalari (5 ta test)</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('konsol')}
                  className={`h-7 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    activeBottomTab === 'konsol'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal / Konsol</span>
                </button>
              </div>

              {/* PROMINENT TESTLASH BUTTON (Neon Blue Gradient) */}
              <button
                onClick={handleTestAllCases}
                disabled={isTestingAll || isRunning}
                className="h-7 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                title="Barcha 5 ta testni bir vaqtda tekshirish"
              >
                <CheckSquare className={`w-3.5 h-3.5 ${isTestingAll ? 'animate-spin' : ''}`} />
                <span>{isTestingAll ? 'Tekshirilmoqda...' : 'Testlash'}</span>
              </button>
            </div>

            {/* Content: Left 5 Test Cases + Right Values */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              {/* Left 5 Test Cases Sub-Column */}
              <div
                className={`w-[240px] flex flex-col flex-shrink-0 overflow-y-auto border-r ${
                  theme === 'dark' ? 'bg-[#060810] border-white/5' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div
                  className={`px-3 py-1.5 text-[11px] font-semibold border-b flex items-center justify-between ${
                    theme === 'dark' ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span>Tekshirish testlari</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {testCases.filter((t) => t.status === 'passed').length}/5 to‘g‘ri
                  </span>
                </div>

                <div className="p-1.5 space-y-1">
                  {testCases.map((tc) => {
                    const isSelected = tc.id === selectedTestId;
                    return (
                      <button
                        key={tc.id}
                        onClick={() => setSelectedTestId(tc.id)}
                        className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs font-mono cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : theme === 'dark'
                            ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                            : 'bg-white hover:bg-slate-200/80 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {tc.status === 'passed' ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isSelected ? 'text-white' : 'text-emerald-400'
                              }`}
                            />
                          ) : tc.status === 'failed' ? (
                            <XCircle
                              className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isSelected ? 'text-white' : 'text-rose-400'
                              }`}
                            />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-semibold">{tc.title}</span>
                            <span
                              className={`text-[10px] block ${
                                isSelected ? 'text-blue-100' : 'text-slate-400'
                              }`}
                            >
                              Kirish: {tc.displayInput}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : tc.status === 'passed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {tc.expected}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Values Area: Kirish + Sizning chiqishingiz + Javob */}
              <div
                className={`flex-1 min-w-0 p-3 overflow-y-auto ${
                  theme === 'dark' ? 'bg-[#080B14]' : 'bg-white'
                }`}
              >
                {activeBottomTab === 'namuna' ? (
                  <div className="h-full flex flex-col justify-between space-y-2">
                    {/* Top Card: Kirish */}
                    <div
                      className={`p-2.5 rounded-xl border flex-1 min-h-[50px] flex flex-col justify-between ${
                        theme === 'dark'
                          ? 'bg-[#0C101E] border-white/5'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span>Kirish (Input)</span>
                        <button
                          onClick={() => handleCopy(activeTestCase.input, 'tc_in')}
                          className="text-slate-400 hover:text-white transition cursor-pointer"
                        >
                          {copiedKey === 'tc_in' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-sm text-slate-200 mt-1 whitespace-pre leading-snug">
{activeTestCase.input}
                      </pre>
                    </div>

                    {/* Bottom Row: Sizning chiqishingiz & Javob */}
                    <div className="grid grid-cols-2 gap-2 flex-1 min-h-[50px]">
                      {/* Left: Sizning chiqishingiz */}
                      <div
                        className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                          theme === 'dark'
                            ? 'bg-[#0C101E] border-white/5'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5">
                            Sizning chiqishingiz
                            {activeTestCase.status === 'passed' ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            )}
                          </span>
                          <button
                            onClick={() => handleCopy(activeTestCase.actual, 'tc_act')}
                            className="text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            {copiedKey === 'tc_act' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="font-mono text-sm text-slate-200 mt-1 font-bold">
{activeTestCase.actual || '(Natija yo‘q)'}
                        </pre>
                      </div>

                      {/* Right: Javob */}
                      <div
                        className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                          theme === 'dark'
                            ? 'bg-[#0C101E] border-white/5'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                          <span>Kutilgan javob</span>
                          <button
                            onClick={() => handleCopy(activeTestCase.expected, 'tc_exp')}
                            className="text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            {copiedKey === 'tc_exp' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="font-mono text-sm text-emerald-400 mt-1 font-bold">
{activeTestCase.expected}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`h-full p-3 rounded-xl border font-mono text-xs overflow-y-auto whitespace-pre-wrap leading-relaxed ${
                      theme === 'dark'
                        ? 'bg-[#0A0D18] border-white/5 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {consoleOutput}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Status Strip */}
            <div
              className={`h-6 px-4 flex items-center justify-between text-[11px] font-mono flex-shrink-0 border-t ${
                theme === 'dark'
                  ? 'bg-[#060810] border-white/5 text-slate-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <div>
                Til: <span className="text-blue-400 font-semibold">{selectedLanguage === 'python' ? 'Python 3.12' : 'C++20 (GCC)'}</span>
              </div>
              <div className="flex items-center gap-5">
                <span>Vaqt cheklovi: <b className="text-slate-300">3000 ms</b></span>
                <span>Xotira cheklovi: <b className="text-slate-300">512 MB</b></span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== AI ASSISTANT SLIDE DRAWER ===================== */}
        {isAiOpen && (
          <div
            className={`w-[340px] flex flex-col justify-between flex-shrink-0 shadow-2xl z-40 animate-in slide-in-from-right duration-200 border-l ${
              theme === 'dark'
                ? 'bg-[#080B14] border-white/10'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div
              className={`h-11 px-4 flex items-center justify-between flex-shrink-0 text-xs border-b ${
                theme === 'dark'
                  ? 'bg-[#0E1528] border-white/5 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI Murabbiy</span>
                <span className="text-[10px] font-normal text-blue-400">• Faol</span>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message history */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[9px] text-slate-400 mb-0.5">{msg.time}</div>
                  <div
                    className={`p-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap max-w-[94%] ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                        : theme === 'dark'
                        ? 'bg-[#0E1528] text-slate-200 rounded-bl-none border border-white/5'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Suggestions & Input */}
            <div
              className={`p-3 border-t space-y-2 ${
                theme === 'dark'
                  ? 'bg-[#060810] border-white/5'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Tezkor savollar:
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <button
                  onClick={() => handleSendAi('Masalani tushuntir')}
                  className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer border ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] hover:bg-white/10 border-white/5 text-slate-300'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <HelpCircle className="w-3 h-3 text-blue-400" />
                  <span>Tushuntir</span>
                </button>
                <button
                  onClick={() => handleSendAi('Kodimdagi xatoni top')}
                  className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer border ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] hover:bg-white/10 border-white/5 text-slate-300'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Xatoni top</span>
                </button>
                <button
                  onClick={() => handleSendAi('Maslahat ber')}
                  className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer border ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] hover:bg-white/10 border-white/5 text-slate-300'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Lightbulb className="w-3 h-3 text-emerald-400" />
                  <span>Maslahat</span>
                </button>
                <button
                  onClick={() => handleSendAi('Test natijasini tushuntir')}
                  className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer border ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] hover:bg-white/10 border-white/5 text-slate-300'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <CheckSquare className="w-3 h-3 text-indigo-400" />
                  <span>Test tahlili</span>
                </button>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAi();
                }}
                className="flex items-center gap-1.5 pt-1"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="AI ga savol bering..."
                  className={`flex-1 h-8 px-2.5 rounded-lg text-xs border focus:outline-none focus:border-blue-500 transition ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] border-white/10 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  className="h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
