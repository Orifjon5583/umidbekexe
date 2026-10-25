import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { LocalRunnerService } from '../services/runner';
import { Problem, RunnerResult, TestCase } from '@codepractice/shared-types';
import { useClipboardRestrictions } from '../hooks/useClipboardRestrictions';
import {
  Play,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Cpu,
  Save,
  Check,
  Send,
  X,
  Bot,
  User,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  CheckSquare,
  FileCode2,
} from 'lucide-react';

interface Props {
  assignmentId: string;
  problemId: string;
  onBackToAssignment: () => void;
  onNavigateTab: (tab: 'dashboard' | 'assignment_details' | 'code_editor') => void;
  onRequestExit: () => void;
  onFinishAssignment: () => void;
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

  // Editor states
  const [code, setCode] = useState<string>(
`def find_largest_even(numbers):
    max_even = -1
    for num in numbers:
        if num % 2 == 0 and num > max_even:
            max_even = num
    return max_even

# Kiruvchi ma'lumotlarni o'qish
n = int(input())
nums = list(map(int, input().split()))
print(find_largest_even(nums))
`
  );

  const [saveStatus, setSaveStatus] = useState<string>('Saqlandi (14:32)');
  const [activeBottomTab, setActiveBottomTab] = useState<'tests' | 'console' | 'errors'>('tests');
  const [isRunning, setIsRunning] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(true);

  // AI Chat state
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'user',
      text: 'Nega koddagi for siklida juftlik tekshirilyapti?',
      time: '14:30',
    },
    {
      sender: 'ai',
      text: 'Tushuntirish:\nSiz juft sonni aniqlash uchun num % 2 == 0 shartidan foydalanmoqdasiz. Bu to‘g‘ri yondashuv.\n\nEndi barcha sonlar manfiy bo‘lsa qanday ishlashini tekshirib ko‘rishingiz mumkin (masalan: -4, -8 holatida).',
      time: '14:31 • AI Murabbiy',
    },
  ]);
  const [aiInput, setAiInput] = useState('');

  // Sample Test results
  const [testResults, setTestResults] = useState([
    {
      id: 1,
      title: 'Test #1',
      input: '[12, 45, 78, 3, 90]',
      expected: '90',
      time: '0.02s',
      status: 'Muvaffaqiyatli',
    },
    {
      id: 2,
      title: 'Test #2 (Faqat toq sonlar)',
      input: '[3, 5, 7, 9, 11]',
      expected: '-1',
      time: '0.03s',
      status: 'Muvaffaqiyatli',
    },
    {
      id: 3,
      title: 'Test #3 Yashirin test',
      input: 'Kiruvchi va chiquvchi ma’lumotlar yashirilgan',
      expected: '',
      time: '0.04s',
      status: 'Muvaffaqiyatli',
      isHidden: true,
    },
  ]);

  const handleRunCode = async () => {
    setIsRunning(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRunning(false);
    setActiveBottomTab('tests');
  };

  const handleSendAi = (text?: string) => {
    const q = text || aiInput.trim();
    if (!q) return;

    setAiMessages((prev) => [
      ...prev,
      { sender: 'user', text: q, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setAiInput('');

    setTimeout(() => {
      let reply = 'Maslahat: Juftlik tekshiruvida qoldiq nolga tengligini ifodalovchi num % 2 == 0 shartini alohida qavsga oling va chekka qiymatlarni hisobga oling.';
      if (q.includes('tushuntir')) {
        reply = 'Masala sharti: Sizga berilgan massivdagi juft sonlardan eng kattasini topish talab etiladi. Agar massivda hech bir juft son bo‘lmasa, javob -1 bo‘lishi shart.';
      } else if (q.includes('xato')) {
        reply = 'Kodingizda sintaktik xato aniqlanmadi. Algoritm to‘g‘ri ishlamoqda. Manfiy juft sonlar mavjud bo‘lganda max_even boshlang‘ich qiymatini qayta ko‘rib chiqishingiz mumkin.';
      }
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • AI Murabbiy',
        },
      ]);
    }, 700);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800 select-none overflow-hidden font-sans">
      <TitleBar onExitRequest={onRequestExit} />
      <TopHeader
        studentName="Azizbek Rahimov"
        grade="9-A sinf"
        breadcrumb="Amaliyot > Python & C++ Laboratoriyasi"
        onRequestExit={onRequestExit}
      />

      {/* Subheader Banner Bar */}
      <div className="h-10 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-[11px] border border-blue-100">
            LAB-04 // Algoritmlar
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Avtomatik saqlanish: <b>{saveStatus}</b>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Foydalanuvchi limiti: <b className="text-slate-700 font-mono">1.0s / 256MB</b>
          </span>

          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`h-7 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isAiOpen ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Yordamchi</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar currentTab="code_editor" onNavigate={onNavigateTab} />

        {/* 3 Columns Workspace */}
        <div className="flex-1 flex min-w-0 overflow-hidden bg-slate-100">
          {/* Column 1: Masala Sharti Pane */}
          <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                    1-masala (Medium)
                  </span>
                  <span className="bg-blue-50 text-blue-700 font-mono px-1.5 py-0.5 rounded text-[10px]">
                    Python 3.11
                  </span>
                </div>
                <span className="text-blue-600 font-semibold text-[10px]">● Bajarilmoqda</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                Ro‘yxatdagi eng katta juft sonni topish
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-slate-600 pt-1">
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <FileCode2 className="w-3.5 h-3.5 text-blue-600" /> Masala sharti
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    Berilgan N ta butun sondan iborat massiv/ro‘yxat ichidan barcha juft sonlarni ajratib olib, ularning eng kattasini ekranga chiqaring. Agar juft son mavjud bo‘lmasa, <b>-1</b> chiqaring.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 text-[10px] uppercase">Kiruvchi ma’lumotlar</h4>
                  <p className="text-slate-500 text-[11px]">
                    Birinchi qatorda N (1 &lt;= N &lt;= 1000). Ikkinchi qatorda probel bilan ajratilgan N ta butun son.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 text-[10px] uppercase">Chiquvchi ma’lumotlar</h4>
                  <p className="text-slate-500 text-[11px]">
                    Ro‘yxatdagi eng katta juft son yoki juft son yo‘q bo‘lsa -1.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-[11px]">
                  <div className="text-[10px] font-sans font-bold text-slate-500 mb-1">Namunaviy 1</div>
                  <div className="text-slate-700 mb-1">
                    <span className="text-slate-400 font-sans text-[10px] block">Kirish (Input):</span>
                    5<br />12 45 78 3 90
                  </div>
                  <div className="text-slate-700 pt-1 border-t border-slate-200">
                    <span className="text-slate-400 font-sans text-[10px] block">Chiqish (Output):</span>
                    90
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <div className="font-bold text-slate-500">Cheklovlar:</div>
                  <div>• 1 &lt;= N &lt;= 1,000</div>
                  <div>• -10^9 &lt;= A[i] &lt;= 10^9</div>
                  <div>• Vaqt chegarasi: 1.0 soniya</div>
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                disabled
                className="flex-1 h-8 rounded-lg border border-slate-200 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Oldingi</span>
              </button>
              <button
                onClick={onFinishAssignment}
                className="flex-1 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs transition"
              >
                <span>Keyingi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Code Editor & Results Bottom Pane */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
            {/* Editor File Tabs Bar */}
            <div className="h-9 bg-[#0B132B] border-b border-slate-800 px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="px-3 py-1 rounded-t-lg bg-slate-800 text-white font-mono text-xs flex items-center gap-2 border-t border-blue-500">
                  <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>solution.py *</span>
                </div>
                <div className="px-3 py-1 rounded-t-lg text-slate-400 hover:text-slate-200 font-mono text-xs cursor-pointer">
                  test_cases.py
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  Python 3.10
                </span>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                >
                  <Play className={`w-3 h-3 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Tekshirilmoqda...' : 'Kodni tekshirish'}</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0 relative">
              <Editor
                height="100%"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  roundedSelection: true,
                  automaticLayout: true,
                  contextmenu: false,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            {/* Editor Bottom Status Strip */}
            <div className="h-6 bg-[#0B132B] border-t border-slate-800 px-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <div>Ln 11, Col 31 &nbsp; UTF-8 &nbsp; Spaces: 4</div>
              <div className="text-emerald-400 font-medium">Sintaktik xatolar yo‘q</div>
            </div>

            {/* Bottom Results & Tests Pane */}
            <div className="h-44 bg-white border-t border-slate-200 flex flex-col flex-shrink-0 text-slate-800">
              {/* Tabs strip */}
              <div className="h-8 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveBottomTab('tests')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      activeBottomTab === 'tests'
                        ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Test natijalari (3/3)
                  </button>
                  <button
                    onClick={() => setActiveBottomTab('console')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      activeBottomTab === 'console'
                        ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Konsol
                  </button>
                  <button
                    onClick={() => setActiveBottomTab('errors')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      activeBottomTab === 'errors'
                        ? 'bg-white text-red-600 border border-slate-200 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Xatolar (0)
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
                  <span>Vaqt: <b className="text-slate-800">0.04s</b></span>
                  <span>CPU: <b className="text-slate-800">12%</b></span>
                  <span>RAM: <b className="text-slate-800">18.4 MB</b></span>
                </div>
              </div>

              {/* Tab Content List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {activeBottomTab === 'tests' && (
                  <div className="space-y-1.5 font-mono text-xs">
                    {testResults.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition"
                      >
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-slate-900">{t.title}</span>
                          <span className="text-slate-500">
                            Kirish: <span className="text-slate-800">{t.input}</span>
                            {t.expected ? <> &nbsp; Kutilgan: <span className="text-slate-800">{t.expected}</span></> : null}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[10px]">{t.time}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-sans">
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeBottomTab === 'console' && (
                  <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap">
                    &gt; python solution.py &lt; input.txt
                    90
                    [Process completed in 0.04s]
                  </pre>
                )}

                {activeBottomTab === 'errors' && (
                  <div className="text-xs text-slate-500 py-2">
                    Xatoliklar aniqlanmadi. Kod to‘g‘ri bajarildi.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: AI Yordamchi Right Panel (1-rasmdagidek) */}
          {isAiOpen && (
            <div className="w-[300px] bg-white border-l border-slate-200 flex flex-col justify-between flex-shrink-0 animate-in slide-in-from-right duration-150">
              {/* Header */}
              <div className="h-10 px-4 bg-blue-600 text-white flex items-center justify-between flex-shrink-0 text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Yordamchi</span>
                  <span className="text-[10px] font-normal text-blue-200">• Faol tahlilchi</span>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="text-blue-200 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat history */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="text-[9px] text-slate-400 mb-0.5">{msg.time}</div>
                    <div
                      className={`p-2.5 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap max-w-[92%] ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions & Input */}
              <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Tezkor savollar:</div>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => handleSendAi('Masalani tushuntir')}
                    className="w-full text-left px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[10px] text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <HelpCircle className="w-3 h-3 text-blue-500" />
                    <span>Masalani tushuntir</span>
                  </button>
                  <button
                    onClick={() => handleSendAi('Kodimdagi xatoni tushuntir')}
                    className="w-full text-left px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[10px] text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>Kodimdagi xatoni tushuntir</span>
                  </button>
                  <button
                    onClick={() => handleSendAi('Maslahat ber')}
                    className="w-full text-left px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[10px] text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Lightbulb className="w-3 h-3 text-emerald-500" />
                    <span>Maslahat ber</span>
                  </button>
                  <button
                    onClick={() => handleSendAi('Test natijasini tushuntir')}
                    className="w-full text-left px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[10px] text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <CheckSquare className="w-3 h-3 text-indigo-500" />
                    <span>Test natijasini tushuntir</span>
                  </button>
                </div>

                {/* Input box */}
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
                    className="flex-1 h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
