import React, { useState } from 'react';
import { desktopApiClient } from '../services/api';
import { AIRequestType } from '@codepractice/shared-types';
import { Sparkles, Send, X, Bot, User, HelpCircle, AlertCircle, Lightbulb, CheckSquare } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  currentCode: string;
  lastErrorMessage?: string;
  lastTestSummary?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  problemId,
  currentCode,
  lastErrorMessage,
  lastTestSummary,
}) => {
  const [aiSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('cp_web_system_settings') || localStorage.getItem('cp_system_settings');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      aiMurabbiyEnabled: true,
      aiModelTier: 'plus',
      aiModelName: 'Gemini 1.5 Pro • Next-Gen AI Plus',
      aiMaxTokensPerStudent: 25000,
    };
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Salom! Men sizning sun’iy intellekt mentor sizman (✨ CodePractice AI Plus faol). Masala shartini tushunishda, murakkab algoritmik va sintaktik xatolarni tahlil qilishda yordam beraman. Qoidaga ko‘ra tayyor to‘liq yechimni yozib bermayman, ammo mustaqil yechishingizga qadam-baqadam yo‘naltiraman!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingTokens, setRemainingTokens] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  const handleSend = async (type: AIRequestType = 'hint', customQuestion?: string) => {
    const question = customQuestion || inputText.trim();
    if (!question && type === 'hint') return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text:
        type === 'explain_problem'
          ? 'Masala shartini tushuntirib bering.'
          : type === 'explain_code'
          ? 'Kodimdagi xatolarni ko‘rib bering.'
          : type === 'explain_error'
          ? 'Chiqgan xatolikni tushuntiring.'
          : type === 'explain_test'
          ? 'Test natijalarini izohlang.'
          : question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await desktopApiClient.askAI({
        problemId,
        requestType: type,
        studentQuestion: question,
        currentCode,
        errorMessage: lastErrorMessage,
        testResultsSummary: lastTestSummary,
      });

      if (res.remainingDailyTokens !== undefined) {
        setRemainingTokens(res.remainingDailyTokens);
      }

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: `Xatolik: ${err.message || 'AI xizmati bilan bog‘lanishda muammo yuz berdi.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-16 px-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">AI Mentor</h3>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  aiSettings.aiModelTier === 'plus'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-200 text-slate-950 font-black shadow-2xs'
                    : 'bg-blue-900 text-blue-200'
                }`}
              >
                {aiSettings.aiModelTier === 'plus' ? '✨ PLUS' : 'FLASH'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {aiSettings.aiModelTier === 'plus' ? 'Gemini 1.5 Pro • Kuchli model' : 'Gemini 1.5 Flash • Standart'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Token: {(remainingTokens ?? 24150).toLocaleString()}
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5 flex-shrink-0">
        <button
          onClick={() => handleSend('explain_problem')}
          disabled={loading}
          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded text-xs font-medium text-slate-700 flex items-center gap-1 shadow-2xs transition disabled:opacity-50"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          Masalani tushuntir
        </button>
        <button
          onClick={() => handleSend('explain_code')}
          disabled={loading}
          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded text-xs font-medium text-slate-700 flex items-center gap-1 shadow-2xs transition disabled:opacity-50"
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          Xatoni tushuntir
        </button>
        <button
          onClick={() => handleSend('hint')}
          disabled={loading}
          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded text-xs font-medium text-slate-700 flex items-center gap-1 shadow-2xs transition disabled:opacity-50"
        >
          <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
          Maslahat ber
        </button>
        <button
          onClick={() => handleSend('explain_test')}
          disabled={loading}
          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded text-xs font-medium text-slate-700 flex items-center gap-1 shadow-2xs transition disabled:opacity-50"
        >
          <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
          Testni izohla
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 mb-1 text-[11px] text-slate-400">
              {m.sender === 'user' ? (
                <>
                  <span>Siz</span>
                  <User className="w-3 h-3" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-blue-600" />
                  <span>AI Mentor</span>
                </>
              )}
              <span>• {m.timestamp}</span>
            </div>
            <div
              className={`max-w-[88%] p-3 rounded-lg text-xs leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
            AI javob tayyorlamoqda...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend('hint');
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Savolingizni yozing..."
            disabled={loading}
            className="flex-1 h-10 px-3 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
