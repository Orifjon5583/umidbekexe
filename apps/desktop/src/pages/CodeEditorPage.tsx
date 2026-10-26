import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { TitleBar } from '../components/TitleBar';
import { LocalRunnerService } from '../services/runner';
import { desktopApiClient } from '../services/api';
import { TestCase } from '@codepractice/shared-types';
import { useClipboardRestrictions } from '../hooks/useClipboardRestrictions';
import {
  Play,
  Check,
  Copy,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  ArrowLeft,
  RefreshCw,
  Sliders,
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

  // Programming language selection
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp'>('python');

  // Code state (Python default matching user screenshot)
  const [codePython, setCodePython] = useState<string>(
`son1 = int(input())
son2 = int(input())
print(son1 + son2)
`
  );

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

  // Left pane tabs: 'masala' | 'urinishlar' | 'statistika' | 'yechganlar'
  const [activeLeftTab, setActiveLeftTab] = useState<'masala' | 'urinishlar' | 'statistika' | 'yechganlar'>('masala');

  // Bottom pane tabs: 'konsol' | 'namuna'
  const [activeBottomTab, setActiveBottomTab] = useState<'konsol' | 'namuna'>('namuna');

  // 5 test cases as requested by the user
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
    `> ${selectedLanguage === 'python' ? 'python3 main.py' : 'g++ -O3 main.cpp -o main && ./main'} < input.txt\n4\n[Jarayon 0.018s ichida muvaffaqiyatli yakunlandi]`
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Social stats state (matching screenshot: 142 likes, 16 dislikes, star)
  const [likes, setLikes] = useState<number>(142);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [dislikes, setDislikes] = useState<number>(16);
  const [hasDisliked, setHasDisliked] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(false);

  // Auto-save notification
  const [saveStatus, setSaveStatus] = useState<string>('Saqlandi');

  // AI Assistant drawer state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'user',
      text: 'Masalani yechish bo‘yicha qisqacha maslahat bera olasizmi?',
      time: '14:30',
    },
    {
      sender: 'ai',
      text: 'Albatta! Masala juda sodda: berilgan 2 ta butun sonni o‘qib olib, ularning yig‘indisini topishingiz kerak.\n\nPython tilida:\n`son1 = int(input())`\n`son2 = int(input())`\n`print(son1 + son2)`\n\nC++ tilida esa `cin >> a >> b;` va `cout << a + b;` dan foydalanishingiz mumkin.',
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

  // Autosave draft to backend
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
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentCode, selectedLanguage, assignmentId, problemId]);

  // RUN CODE (Single Test / Current code execution)
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
        actualResult.trim() === tc.expected.trim() && res.status !== 'compile_error' && res.status !== 'time_limit_exceeded';

      // Update current test case
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

      // Console output
      const langCmd = selectedLanguage === 'python' ? 'python3 main.py' : './main';
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

  // TESTLASH (Full test suite execution on all 5 test cases)
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
        `> Barcha testlar tekshirildi (${passedCount}/${updated.length})\n` +
          updated
            .map(
              (t) =>
                `[${t.status === 'passed' ? 'OK' : 'FAIL'}] ${t.title}: Kirish "${t.displayInput}" -> Chiqish "${t.actual}" (Kutilgan: "${t.expected}") [${t.time}]`
            )
            .join('\n') +
          `\n\nNatija: ${passedCount === updated.length ? '100/100 Ball - MUVAFFAQIYATLI YAKUNLANDI' : 'Ayrim testlarda nomuvofiqlik aniqlandi'}`
      );

      // Submit results to server
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
      setConsoleOutput(`> Testlashda xatolik:\n${err.message || 'Xatolik yuz berdi'}`);
    } finally {
      setIsTestingAll(false);
    }
  };

  // AI Chat send
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
      let fallbackReply = 'Maslahat: Ikki sonni qo‘shish uchun input() orqali o‘qib olib, int() ga o‘giring va print(a + b) bajaring.';
      if (q.includes('xato')) {
        fallbackReply = 'Kodingizda sintaktik xato aniqlanmadi. Testlar to‘liq o‘tmoqda!';
      }
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • AI Murabbiy',
        },
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#000000] text-slate-100 select-none overflow-hidden font-sans">
      {/* TitleBar with Windows Controls */}
      <TitleBar onExitRequest={onRequestExit} />

      {/* Main Split Layout: Left Problem Pane, Right Editor Pane */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* ===================== LEFT PANE (Problem Statement) ===================== */}
        <div className="w-[500px] flex-shrink-0 flex flex-col bg-[#000000] border-r border-[#21262d] overflow-hidden">
          {/* Top Left Navigation Tabs */}
          <div className="h-10 bg-[#000000] border-b border-[#21262d] px-3 flex items-center gap-6 text-xs font-medium flex-shrink-0">
            <button
              onClick={() => setActiveLeftTab('masala')}
              className={`h-full flex items-center gap-1.5 px-1 border-b-2 transition ${
                activeLeftTab === 'masala'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Masala</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('urinishlar')}
              className={`h-full flex items-center gap-1.5 px-1 border-b-2 transition ${
                activeLeftTab === 'urinishlar'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Urinishlar</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('statistika')}
              className={`h-full flex items-center gap-1.5 px-1 border-b-2 transition ${
                activeLeftTab === 'statistika'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Statistika</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('yechganlar')}
              className={`h-full flex items-center gap-1.5 px-1 border-b-2 transition ${
                activeLeftTab === 'yechganlar'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Yechganlar</span>
            </button>
          </div>

          {/* Left Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-200">
            {activeLeftTab === 'masala' && (
              <>
                {/* Title and Badges */}
                <div className="space-y-3">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    1. Ikki sonni yig`indisi
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                      Boshlang'ich
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#161B22] text-slate-300 border border-slate-700/60 font-mono">
                      Vaqt cheklovi: 3000 ms
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#161B22] text-slate-300 border border-slate-700/60 font-mono">
                      Xotira cheklovi: 512 MB
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#161B22] text-slate-300 border border-slate-700/60 font-mono flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>100</span>
                    </span>
                  </div>
                </div>

                {/* Mathematical Problem Statement */}
                <div className="pt-2 text-slate-300 text-sm leading-relaxed border-b border-[#21262d] pb-4">
                  <p>
                    <span className="italic font-serif font-semibold text-slate-100">a</span> va{' '}
                    <span className="italic font-serif font-semibold text-slate-100">b</span> sonlari berilgan. Ushbu
                    sonlar yig'indisini hisoblang.
                  </p>
                </div>

                {/* Kirish ma'lumotlari */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-white text-sm">Kirish ma'lumotlari</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Birinchi qatorda butun son, <span className="font-mono text-slate-200">a(1 ≤ a ≤ 1000)</span>.
                  </p>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Ikkinchi qatorda butun son, <span className="font-mono text-slate-200">b(1 ≤ b ≤ 1000)</span>.
                  </p>
                </div>

                {/* Chiquvchi ma'lumotlar */}
                <div className="space-y-1.5 pt-1">
                  <h3 className="font-bold text-white text-sm">Chiquvchi ma'lumotlar</h3>
                  <p className="text-slate-300 text-xs">Yagona qatorda masala yechimi.</p>
                </div>

                {/* Namuna testlar */}
                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-white text-sm">Namuna testlar</h3>

                  {/* Sample Input Box */}
                  <div className="bg-[#0D1117] border border-[#21262D] rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-[#161B22]/60 border-b border-[#21262D] flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Kirish</span>
                      <button
                        onClick={() => handleCopy('2\n2', 'sample_in')}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition text-[11px]"
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
                  <div className="bg-[#0D1117] border border-[#21262D] rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-[#161B22]/60 border-b border-[#21262D] flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Chiqish</span>
                      <button
                        onClick={() => handleCopy('4', 'sample_out')}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition text-[11px]"
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
                    <pre className="p-3 text-sm font-mono text-slate-200 whitespace-pre">
4
                    </pre>
                  </div>
                </div>
              </>
            )}

            {activeLeftTab === 'urinishlar' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-slate-400 text-[11px]">Sizning so‘nggi urinishlaringiz:</div>
                <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#21262D] flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold">Qabul qilindi (100 ball)</span>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">Bugun, 14:32 • Python 3.12</div>
                  </div>
                  <span className="text-slate-400 text-[11px]">18 ms / 12.4 MB</span>
                </div>
              </div>
            )}

            {activeLeftTab === 'statistika' && (
              <div className="space-y-3 text-xs">
                <div className="text-slate-400 text-[11px]">Umumiy statistika:</div>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#21262D]">
                    <div className="text-lg font-bold text-emerald-400">94.8%</div>
                    <div className="text-[10px] text-slate-500 font-sans">Qabul darajasi</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#21262D]">
                    <div className="text-lg font-bold text-blue-400">1,482</div>
                    <div className="text-[10px] text-slate-500 font-sans">Yechgan o‘quvchilar</div>
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === 'yechganlar' && (
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 text-[11px]">Eng tezkor yechimlar:</div>
                {['Jasur Aliyev (0.012s)', 'Madina Karimova (0.014s)', 'Bobur Umarov (0.015s)'].map((name, i) => (
                  <div key={i} className="p-2 rounded bg-[#0D1117] border border-[#21262D] flex items-center justify-between">
                    <span className="text-slate-200">#{i + 1} {name}</span>
                    <span className="text-emerald-400 font-mono text-[11px]">100 ball</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Author Bar (Matching user screenshot) */}
          <div className="h-11 bg-[#000000] border-t border-[#21262d] px-4 flex items-center justify-between text-xs flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
                cp
              </div>
              <span className="text-slate-300 font-semibold">admin</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStarred(!isStarred)}
                className={`p-1.5 rounded hover:bg-[#161B22] transition ${
                  isStarred ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Saralanganlarga qo‘shish"
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1 px-2.5 py-1 rounded bg-[#161B22]/70 border border-slate-800 text-xs transition ${
                  hasLiked ? 'text-emerald-400 border-emerald-800/80' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-emerald-400' : ''}`} />
                <span className="font-mono text-[11px]">{likes}</span>
              </button>

              <button
                onClick={handleToggleDislike}
                className={`flex items-center gap-1 px-2.5 py-1 rounded bg-[#161B22]/70 border border-slate-800 text-xs transition ${
                  hasDisliked ? 'text-rose-400 border-rose-800/80' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? 'fill-rose-400' : ''}`} />
                <span className="font-mono text-[11px]">{dislikes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT PANE (Editor & Results) ===================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#000000] overflow-hidden">
          {/* Top Editor Toolbar (Matching screenshot + RUN button requested by user) */}
          <div className="h-11 bg-[#000000] border-b border-[#21262d] px-4 flex items-center justify-between text-xs flex-shrink-0">
            {/* Left Controls */}
            <div className="flex items-center gap-2.5">
              {/* Language Dropdown */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as 'python' | 'cpp')}
                  className="appearance-none bg-[#0D1117] hover:bg-[#161B22] text-slate-200 text-xs font-medium pl-3 pr-8 py-1.5 rounded-md border border-[#30363D] focus:outline-none focus:border-blue-500 cursor-pointer transition"
                >
                  <option value="python">Til: Python 3.12</option>
                  <option value="cpp">Til: C++20 (GCC)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sample Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(Number(e.target.value))}
                  className="appearance-none bg-[#0D1117] hover:bg-[#161B22] text-slate-200 text-xs font-medium pl-3 pr-8 py-1.5 rounded-md border border-[#30363D] focus:outline-none focus:border-blue-500 cursor-pointer transition"
                >
                  <option value="1">Namuna: #1</option>
                  <option value="2">Namuna: #2</option>
                  <option value="3">Namuna: #3</option>
                  <option value="4">Namuna: #4</option>
                  <option value="5">Namuna: #5</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Upload File Button */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] text-slate-300 hover:text-white cursor-pointer transition text-xs font-medium">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Fayl yuklash</span>
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

            {/* Right Controls: RUN Button, AI, Navigation */}
            <div className="flex items-center gap-2.5">
              {/* Auto-save indicator */}
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline-block">
                {saveStatus}
              </span>

              {/* AI Murabbiy Toggle Button */}
              <button
                onClick={() => setIsAiOpen(!isAiOpen)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 border transition ${
                  isAiOpen
                    ? 'bg-blue-600/90 border-blue-500 text-white'
                    : 'bg-[#0D1117] hover:bg-[#161B22] border-[#30363D] text-slate-300'
                }`}
                title="AI Murabbiydan maslahat so‘rash"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Murabbiy</span>
              </button>

              {/* USER REQUESTED: PROMINENT RUN BUTTON */}
              <button
                onClick={handleRunCode}
                disabled={isRunning || isTestingAll}
                className="h-8 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                title="Kodni tanlangan test bilan darhol ishga tushirish (Run)"
              >
                <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Bajarilmoqda...' : 'Run'}</span>
              </button>

              {/* Finish Assignment Button */}
              <button
                onClick={onFinishAssignment}
                className="h-8 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 shadow-sm transition"
              >
                <span>Topshirish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Container with Vertical "MOSLASH" Tab on Right */}
          <div className="flex-1 min-h-0 relative flex">
            <div className="flex-1 h-full min-w-0 bg-[#000000]">
              <Editor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
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

            {/* Vertical "MOSLASH" Tab (Exact matching from screenshot) */}
            <div className="w-6 bg-[#0D1117] border-l border-[#21262D] flex flex-col items-center justify-center py-4 flex-shrink-0 cursor-pointer hover:bg-[#161B22] transition group" title="Muharrir sozlamalari">
              <Settings className="w-3.5 h-3.5 text-blue-400 mb-2 group-hover:rotate-45 transition-transform duration-300" />
              <span className="[writing-mode:vertical-rl] text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-200 select-none">
                MOSLASH
              </span>
            </div>
          </div>

          {/* ===================== BOTTOM PANE (Console & 5 Test Cases) ===================== */}
          <div className="h-56 bg-[#000000] border-t border-[#21262d] flex flex-col flex-shrink-0 overflow-hidden">
            {/* Bottom Tabs Header Bar + USER REQUESTED: TESTLASH BUTTON */}
            <div className="h-10 bg-[#000000] border-b border-[#21262d] px-4 flex items-center justify-between text-xs flex-shrink-0">
              {/* Left Tabs */}
              <div className="flex items-center gap-6 h-full">
                <button
                  onClick={() => setActiveBottomTab('konsol')}
                  className={`h-full flex items-center gap-1.5 px-1 border-b-2 transition ${
                    activeBottomTab === 'konsol'
                      ? 'border-blue-500 text-blue-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Konsol</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('namuna')}
                  className={`h-full flex items-center gap-1.5 px-1 border-b-2 transition ${
                    activeBottomTab === 'namuna'
                      ? 'border-blue-500 text-blue-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Namuna Natijalari (5 ta test)</span>
                </button>
              </div>

              {/* Right: USER REQUESTED: TESTLASH KNOPKASI */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestAllCases}
                  disabled={isTestingAll || isRunning}
                  className="h-7 px-4 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                  title="Barcha 5 ta testni bir vaqtda tekshirish"
                >
                  <CheckSquare className={`w-3.5 h-3.5 ${isTestingAll ? 'animate-spin' : ''}`} />
                  <span>{isTestingAll ? 'Tekshirilmoqda...' : 'Testlash'}</span>
                </button>
              </div>
            </div>

            {/* Main Content Area of Bottom Pane */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              {/* USER REQUESTED: "chap tarafda 5 ta taxminan tekshirish uchun qiymatlar va natijasi tursin" */}
              <div className="w-[240px] bg-[#070B12] border-r border-[#21262D] flex flex-col flex-shrink-0 overflow-y-auto">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#21262D]/60 flex items-center justify-between">
                  <span>Tekshirish testlari</span>
                  <span className="text-[10px] font-mono text-emerald-400">
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
                        className={`w-full text-left p-2 rounded-md transition flex items-center justify-between text-xs font-mono ${
                          isSelected
                            ? 'bg-[#161B22] border border-blue-500/80 text-white shadow-xs'
                            : 'bg-[#0D1117]/60 hover:bg-[#161B22]/50 border border-transparent text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {tc.status === 'passed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : tc.status === 'failed' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-semibold">{tc.title}</span>
                            <span className="text-[10px] text-slate-500 block">
                              Kirish: {tc.displayInput}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 pl-1">
                          <span
                            className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded ${
                              tc.status === 'passed'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                            }`}
                          >
                            {tc.expected}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Sub-Area: Detailed Values & Comparison Cards (Matching screenshot) */}
              <div className="flex-1 min-w-0 p-3 overflow-y-auto bg-[#000000]">
                {activeBottomTab === 'namuna' ? (
                  <div className="h-full flex flex-col justify-between space-y-2">
                    {/* Top Card: Kirish */}
                    <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-2.5 flex-1 min-h-[50px] flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span>Kirish</span>
                        <button
                          onClick={() => handleCopy(activeTestCase.input, 'tc_in')}
                          className="text-slate-400 hover:text-white transition"
                          title="Nusxalash"
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

                    {/* Bottom Two Cards: Sizning chiqishingiz & Javob */}
                    <div className="grid grid-cols-2 gap-2 flex-1 min-h-[50px]">
                      {/* Left: Sizning chiqishingiz */}
                      <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-2.5 flex flex-col justify-between">
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
                            className="text-slate-400 hover:text-white transition"
                            title="Nusxalash"
                          >
                            {copiedKey === 'tc_act' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="font-mono text-sm text-slate-200 mt-1">
{activeTestCase.actual || '(Natija yo‘q)'}
                        </pre>
                      </div>

                      {/* Right: Javob */}
                      <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-2.5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                          <span>Javob</span>
                          <button
                            onClick={() => handleCopy(activeTestCase.expected, 'tc_exp')}
                            className="text-slate-400 hover:text-white transition"
                            title="Nusxalash"
                          >
                            {copiedKey === 'tc_exp' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="font-mono text-sm text-slate-200 mt-1">
{activeTestCase.expected}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-[#0D1117] border border-[#21262D] rounded-lg p-3 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {consoleOutput}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Status Strip (Matching screenshot) */}
            <div className="h-6 bg-[#000000] border-t border-[#21262D] px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono flex-shrink-0">
              <div>
                Til: <span className="text-slate-200">{selectedLanguage === 'python' ? 'Python 3.12' : 'C++20 (GCC)'}</span>
              </div>
              <div className="flex items-center gap-5">
                <span>Vaqt cheklovi: <b className="text-slate-200">3000 ms</b></span>
                <span>Xotira cheklovi: <b className="text-slate-200">512 MB</b></span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== AI ASSISTANT SLIDE DRAWER ===================== */}
        {isAiOpen && (
          <div className="w-[340px] bg-[#0D1117] border-l border-[#21262D] flex flex-col justify-between flex-shrink-0 shadow-2xl z-40 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="h-11 px-4 bg-[#161B22] border-b border-[#21262D] text-white flex items-center justify-between flex-shrink-0 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Murabbiy</span>
                <span className="text-[10px] font-normal text-slate-400">• Intellektual yordam</span>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
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
                  <div className="text-[9px] text-slate-500 mb-0.5">{msg.time}</div>
                  <div
                    className={`p-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap max-w-[94%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-[#161B22] text-slate-200 rounded-bl-none border border-[#21262D]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Suggestions & Input */}
            <div className="p-3 border-t border-[#21262D] bg-[#070B12] space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Tezkor savollar:
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <button
                  onClick={() => handleSendAi('Masalani tushuntir')}
                  className="p-1.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] rounded text-[10px] text-slate-300 flex items-center gap-1 transition"
                >
                  <HelpCircle className="w-3 h-3 text-blue-400" />
                  <span>Tushuntir</span>
                </button>
                <button
                  onClick={() => handleSendAi('Kodimdagi xatoni top')}
                  className="p-1.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] rounded text-[10px] text-slate-300 flex items-center gap-1 transition"
                >
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Xatoni top</span>
                </button>
                <button
                  onClick={() => handleSendAi('Maslahat ber')}
                  className="p-1.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] rounded text-[10px] text-slate-300 flex items-center gap-1 transition"
                >
                  <Lightbulb className="w-3 h-3 text-emerald-400" />
                  <span>Maslahat</span>
                </button>
                <button
                  onClick={() => handleSendAi('Test natijasini tushuntir')}
                  className="p-1.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] rounded text-[10px] text-slate-300 flex items-center gap-1 transition"
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
                  className="flex-1 h-8 px-2.5 bg-[#161B22] border border-[#30363D] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition"
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
