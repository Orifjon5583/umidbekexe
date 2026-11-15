import React, { useState, useEffect, useRef } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import {
  Keyboard,
  RotateCcw,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Flame,
  Award,
  Globe,
  Coins,
  History,
  AlertCircle,
  CheckCircle2,
  Gift,
} from 'lucide-react';

export type TypingLanguage = 'uz' | 'ru' | 'en';
export type TimeOption = 15 | 30 | 60 | 120;

export interface TypingResult {
  id: string;
  timestamp: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  score: number;
  earnedXp: number;
  earnedCoins: number;
  language: TypingLanguage;
  durationSeconds: number;
  rankTitle: string;
}

interface Props {
  onNavigateTab: (tab: any) => void;
  onRequestExit: () => void;
}

const UZBEK_WORDS = [
  'dasturlash', 'algoritm', 'kompyuter', 'klaviatura', 'ma’lumot', 'o‘rganish', 'natija', 'muvaffaqiyat',
  'loyiha', 'ishlash', 'tezlik', 'aqlli', 'texnologiya', 'tizim', 'kelajak', 'amaliyot', 'bilim', 'yozish',
  'kodlash', 'masala', 'funksiya', 'o‘zgaruvchi', 'qator', 'shart', 'takrorlash', 'massiv', 'usul', 'baho',
  'topshiriq', 'matn', 'harf', 'so‘z', 'savol', 'javob', 'sinov', 'jadval', 'fayl', 'tarmoq', 'xotira',
  'ekran', 'tugma', 'reja', 'maqsad', 'harakat', 'guruh', 'talaba', 'ustoz', 'maktab', 'kurs', 'rivojlanish',
  'qobiliyat', 'diqqat', 'aniqlik', 'sabr', 'intilish', 'g‘alaba', 'mukofot', 'ball', 'tanga', 'yulduz',
  'chempion', 'tezkor', 'yangi', 'foydali', 'tajriba', 'dasturchi', 'mantiq', 'hisoblash', 'struktura', 'baza',
  'foydalanuvchi', 'internet', 'aloqa', 'xavfsizlik', 'himoya', 'tez', 'aniq', 'mukammal', 'sifat', 'imkoniyat',
  'yutuq', 'yuksalish', 'boshlash', 'yakunlash', 'quvonch', 'ishonch', 'yordam', 'hamkorlik', 'zamonaviy'
];

const RUSSIAN_WORDS = [
  'программирование', 'алгоритм', 'компьютер', 'клавиатура', 'данные', 'обучение', 'результат', 'успех',
  'проект', 'работа', 'скорость', 'умный', 'технологии', 'система', 'будущее', 'практика', 'знания',
  'печать', 'код', 'задача', 'функция', 'переменная', 'строка', 'условие', 'цикл', 'массив', 'метод',
  'оценка', 'задание', 'текст', 'буква', 'слово', 'вопрос', 'ответ', 'тест', 'таблица', 'файл', 'сеть',
  'память', 'экран', 'кнопка', 'план', 'цель', 'действие', 'группа', 'студент', 'учитель', 'школа', 'курс',
  'развитие', 'способность', 'внимание', 'точность', 'терпение', 'победа', 'награда', 'балл', 'монета',
  'звезда', 'чемпион', 'быстрый', 'новый', 'полезный', 'опыт', 'разработчик', 'логика', 'вычисление'
];

const ENGLISH_WORDS = [
  'programming', 'algorithm', 'computer', 'keyboard', 'data', 'learning', 'result', 'success',
  'project', 'work', 'speed', 'smart', 'technology', 'system', 'future', 'practice', 'knowledge',
  'typing', 'code', 'problem', 'function', 'variable', 'string', 'condition', 'loop', 'array',
  'method', 'grade', 'assignment', 'text', 'letter', 'word', 'question', 'answer', 'test', 'table',
  'file', 'network', 'memory', 'screen', 'button', 'plan', 'goal', 'action', 'group', 'student',
  'teacher', 'school', 'course', 'development', 'skill', 'focus', 'accuracy', 'patience', 'victory',
  'reward', 'points', 'coin', 'star', 'champion', 'fast', 'new', 'useful', 'experience', 'developer'
];

function generateWordsList(lang: TypingLanguage, count = 100): string[] {
  const bank = lang === 'uz' ? UZBEK_WORDS : lang === 'ru' ? RUSSIAN_WORDS : ENGLISH_WORDS;
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * bank.length);
    list.push(bank[randomIndex]);
  }
  return list;
}

function playMechanicalKeySound(volume = 0.12) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550 + Math.random() * 250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

export const TypingPage: React.FC<Props> = ({ onNavigateTab, onRequestExit }) => {
  const { theme } = useTheme();

  // Sozlamalar
  const [selectedLanguage, setSelectedLanguage] = useState<TypingLanguage>('uz');
  const [selectedDuration, setSelectedDuration] = useState<TimeOption>(30);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // O'yin holati
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [typedWordsHistory, setTypedWordsHistory] = useState<Array<{ typed: string; isCorrect: boolean }>>([]);

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Jonli statistika
  const [totalTypedChars, setTotalTypedChars] = useState<number>(0);
  const [correctCharsCount, setCorrectCharsCount] = useState<number>(0);
  const [errorsCount, setErrorsCount] = useState<number>(0);

  // Natija va tarix
  const [currentResult, setCurrentResult] = useState<TypingResult | null>(null);
  const [history, setHistory] = useState<TypingResult[]>(() => {
    try {
      const saved = localStorage.getItem('cp_typing_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  const resetGame = (lang = selectedLanguage, duration = selectedDuration) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newWords = generateWordsList(lang, 120);
    setWords(newWords);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWordsHistory([]);
    setTimeLeft(duration);
    setIsActive(false);
    setIsFinished(false);
    setTotalTypedChars(0);
    setCorrectCharsCount(0);
    setErrorsCount(0);
    setCurrentResult(null);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    resetGame(selectedLanguage, selectedDuration);
  }, [selectedLanguage, selectedDuration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const elapsedSeconds = Math.max(1, selectedDuration - timeLeft);
  const elapsedMinutes = elapsedSeconds / 60;
  const currentWpm = Math.max(0, Math.round((correctCharsCount / 5) / elapsedMinutes));
  const currentAccuracy = totalTypedChars > 0
    ? Math.min(100, Math.max(0, Math.round((correctCharsCount / totalTypedChars) * 100)))
    : 100;

  const finishGame = () => {
    setIsActive(false);
    setIsFinished(true);

    const finalWpm = currentWpm;
    const finalAccuracy = currentAccuracy;

    let accuracyMultiplier = 1.0;
    if (finalAccuracy >= 98) accuracyMultiplier = 1.3;
    else if (finalAccuracy >= 95) accuracyMultiplier = 1.15;
    else if (finalAccuracy >= 90) accuracyMultiplier = 1.0;
    else accuracyMultiplier = 0.8;

    const baseScore = Math.round(finalWpm * 10);
    const calculatedScore = Math.round(baseScore * accuracyMultiplier);

    const earnedXp = Math.max(15, Math.round(finalWpm * 1.5 + (finalAccuracy >= 95 ? 25 : 0)));
    const earnedCoins = Math.max(5, Math.round((finalWpm * 0.45) * accuracyMultiplier));

    let rankTitle = '🐢 Boshlovchi';
    if (finalWpm >= 96) rankTitle = '👑 Master Typer';
    else if (finalWpm >= 71) rankTitle = '🏆 Professional';
    else if (finalWpm >= 46) rankTitle = '🚀 Tezkor Dasturchi';
    else if (finalWpm >= 26) rankTitle = '⚡️ O‘rtacha';

    const result: TypingResult = {
      id: `typ-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      wpm: finalWpm,
      cpm: Math.round(correctCharsCount / elapsedMinutes),
      accuracy: finalAccuracy,
      score: calculatedScore,
      earnedXp,
      earnedCoins,
      language: selectedLanguage,
      durationSeconds: selectedDuration,
      rankTitle,
    };

    setCurrentResult(result);

    const updatedHistory = [result, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    try {
      localStorage.setItem('cp_typing_history', JSON.stringify(updatedHistory));
      const currentCoins = Number(localStorage.getItem('cp_student_coins') || '850');
      const currentXp = Number(localStorage.getItem('cp_student_xp') || '1240');
      localStorage.setItem('cp_student_coins', String(currentCoins + earnedCoins));
      localStorage.setItem('cp_student_xp', String(currentXp + earnedXp));
    } catch {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    if (!isActive) setIsActive(true);

    const value = e.target.value;
    if (soundEnabled) playMechanicalKeySound();

    if (value.endsWith(' ')) {
      const trimmed = value.trim();
      const currentTargetWord = words[currentWordIndex] || '';

      if (trimmed.length > 0) {
        const isMatch = trimmed === currentTargetWord;
        setTypedWordsHistory((prev) => [...prev, { typed: trimmed, isCorrect: isMatch }]);

        setTotalTypedChars((prev) => prev + trimmed.length + 1);
        if (isMatch) {
          setCorrectCharsCount((prev) => prev + currentTargetWord.length + 1);
        } else {
          setErrorsCount((prev) => prev + 1);
        }

        setCurrentWordIndex((prev) => prev + 1);
        setCurrentInput('');

        if (currentWordIndex >= words.length - 15) {
          setWords((prev) => [...prev, ...generateWordsList(selectedLanguage, 50)]);
        }
      }
      return;
    }

    const currentTargetWord = words[currentWordIndex] || '';
    const diff = value.length - currentInput.length;
    if (diff > 0) {
      setTotalTypedChars((prev) => prev + 1);
      const charIndex = value.length - 1;
      if (value[charIndex] === currentTargetWord[charIndex]) {
        setCorrectCharsCount((prev) => prev + 1);
      } else {
        setErrorsCount((prev) => prev + 1);
      }
    }

    setCurrentInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      resetGame();
    }
  };

  const bestScore = history.reduce((max, h) => Math.max(max, h.wpm), 0);

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-screen select-none ${isDark ? 'bg-[#070B18] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <TitleBar />
      <TopHeader breadcrumb="Tez Yozish Trenajyori" onRequestExit={onRequestExit} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentTab="typing" onNavigate={onNavigateTab} onRequestExit={onRequestExit} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className={`rounded-3xl border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
            isDark ? 'bg-[#0D1527] border-blue-500/20' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <Keyboard className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                    <span>Klaviatura Trenajyori</span>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      WPM & Reyting
                    </span>
                  </h1>
                  <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Klaviaturada tez yozishni mashq qiling, WPM tezligingizga yarasha XP va tangalar yutib oling!
                  </p>
                </div>
              </div>
            </div>

            {bestScore > 0 && (
              <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${
                isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">Shaxsiy Rekord:</div>
                  <div className="text-base font-black font-mono">{bestScore} WPM</div>
                </div>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className={`rounded-2xl border p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'bg-[#0D1527] border-blue-500/20' : 'bg-white border-slate-200'
          }`}>
            {/* Language */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold flex items-center gap-1.5 mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Globe className="w-4 h-4" />
                <span>Til:</span>
              </span>
              <div className={`inline-flex p-1 rounded-xl gap-1 ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
                {(['uz', 'ru', 'en'] as TypingLanguage[]).map((lang) => {
                  const label = lang === 'uz' ? '🇺🇿 O‘zbekcha' : lang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English';
                  const isSel = selectedLanguage === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLanguage(lang); resetGame(lang, selectedDuration); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isSel
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold flex items-center gap-1.5 mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Clock className="w-4 h-4" />
                <span>Vaqt:</span>
              </span>
              <div className={`inline-flex p-1 rounded-xl gap-1 font-mono text-xs font-bold ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
                {([15, 30, 60, 120] as TimeOption[]).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => { setSelectedDuration(dur); resetGame(selectedLanguage, dur); }}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      selectedDuration === dur
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & Restart */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                    : isDark ? 'bg-slate-800/50 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title={soundEnabled ? 'Klaviatura ovozini o‘chirish' : 'Ovozni yoqish'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Ovoz yoqilgan' : 'Ovozsiz'}</span>
              </button>

              <button
                onClick={() => resetGame()}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta boshlash</span>
              </button>
            </div>
          </div>

          {/* Real-time stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`rounded-2xl border p-4 shadow-xs ${isDark ? 'bg-[#0D1527] border-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tezlik (WPM)</span>
              </div>
              <div className="text-3xl font-black font-mono mt-1 text-cyan-400">
                {currentWpm}
                <span className="text-xs font-semibold text-slate-400 ml-1">so‘z/daq</span>
              </div>
            </div>

            <div className={`rounded-2xl border p-4 shadow-xs ${isDark ? 'bg-[#0D1527] border-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aniqlik</span>
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                {currentAccuracy}%
              </div>
            </div>

            <div className={`rounded-2xl border p-4 shadow-xs ${isDark ? 'bg-[#0D1527] border-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Qolgan vaqt</span>
              </div>
              <div className={`text-3xl font-black font-mono mt-1 ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : ''}`}>
                {timeLeft}s
              </div>
            </div>

            <div className={`rounded-2xl border p-4 shadow-xs ${isDark ? 'bg-[#0D1527] border-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Xatolar</span>
              </div>
              <div className="text-3xl font-black text-rose-500 font-mono mt-1">
                {errorsCount}
              </div>
            </div>
          </div>

          {/* Typing Arena */}
          <div
            onClick={() => inputRef.current?.focus()}
            className={`relative rounded-3xl border-2 p-8 shadow-sm min-h-[220px] cursor-text transition-all flex flex-col justify-center ${
              isDark
                ? 'bg-[#0A1022] border-blue-500/30 hover:border-cyan-400/60'
                : 'bg-white border-slate-200 hover:border-blue-400'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
              className="absolute opacity-0 pointer-events-none"
            />

            <div className="text-lg sm:text-2xl leading-relaxed tracking-wide font-mono select-none flex flex-wrap gap-x-3 gap-y-2.5 items-center justify-start max-h-[160px] overflow-hidden">
              {words.slice(Math.max(0, currentWordIndex - 2), currentWordIndex + 22).map((word, relIdx) => {
                const actualIndex = Math.max(0, currentWordIndex - 2) + relIdx;
                const isCurrent = actualIndex === currentWordIndex;
                const historyItem = typedWordsHistory[actualIndex];

                if (actualIndex < currentWordIndex && historyItem) {
                  return (
                    <span
                      key={actualIndex}
                      className={`transition-colors ${
                        historyItem.isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 line-through bg-rose-500/10 px-1 rounded'
                      }`}
                    >
                      {word}
                    </span>
                  );
                }

                if (isCurrent) {
                  return (
                    <span
                      key={actualIndex}
                      className={`relative px-1.5 py-0.5 rounded-lg border font-bold ${
                        isDark ? 'bg-cyan-500/20 border-cyan-400/50 text-white' : 'bg-blue-50 border-blue-200 text-slate-900'
                      }`}
                    >
                      {word.split('').map((char, charIdx) => {
                        const typedChar = currentInput[charIdx];
                        let charColor = isDark ? 'text-slate-500' : 'text-slate-400';
                        let charBg = '';

                        if (typedChar !== undefined) {
                          if (typedChar === char) {
                            charColor = 'text-emerald-400';
                          } else {
                            charColor = 'text-rose-400';
                            charBg = 'bg-rose-500/20 rounded';
                          }
                        }

                        const isCaret = charIdx === currentInput.length;

                        return (
                          <span key={charIdx} className={`relative ${charColor} ${charBg}`}>
                            {isCaret && (
                              <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-cyan-400 animate-pulse" />
                            )}
                            {char}
                          </span>
                        );
                      })}
                      {currentInput.length > word.length && (
                        <span className="text-rose-400 bg-rose-500/20 rounded px-0.5">
                          {currentInput.slice(word.length)}
                        </span>
                      )}
                      {currentInput.length === word.length && (
                        <span className="inline-block w-0.5 h-5 bg-cyan-400 animate-pulse align-middle ml-0.5" />
                      )}
                    </span>
                  );
                }

                return (
                  <span key={actualIndex} className={isDark ? 'text-slate-600' : 'text-slate-400'}>
                    {word}
                  </span>
                );
              })}
            </div>

            {!isActive && !isFinished && (
              <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                  isDark ? 'bg-slate-800/80 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  💡 Boshlash uchun klaviaturada istalgan harfni bosing...
                </span>
              </div>
            )}
          </div>

          {/* Results screen */}
          {isFinished && currentResult && (
            <div className={`p-6 rounded-3xl border shadow-lg space-y-6 animate-fade-in ${
              isDark ? 'bg-gradient-to-br from-[#0D1527] to-[#111A38] border-cyan-500/30' : 'bg-gradient-to-br from-white to-blue-50/40 border-blue-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mashq muvaffaqiyatli yakunlandi!</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {currentResult.rankTitle}
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Quyida sizning ushbu mashg‘ulotdagi to‘liq natijangiz va berilgan mukofotlar:
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateTab('rewards')}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Sovg‘alar do‘koni</span>
                  </button>
                  <button
                    onClick={() => resetGame()}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-cyan-600/25 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Yana urinish</span>
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#090E1E] border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase">Tezlik</span>
                  <div className="text-4xl font-black text-cyan-400 font-mono mt-1">
                    {currentResult.wpm}
                    <span className="text-xs text-slate-400 font-normal ml-1">WPM</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#090E1E] border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase">Aniqlik</span>
                  <div className="text-4xl font-black text-emerald-400 font-mono mt-1">
                    {currentResult.accuracy}%
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#090E1E] border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase">To‘plangan Ball</span>
                  <div className="text-4xl font-black text-purple-400 font-mono mt-1">
                    +{currentResult.score}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                  <span className="text-xs font-bold text-amber-400 uppercase">Yutilgan Mukofot</span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 font-mono font-black text-xl text-amber-300">
                      <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span>+{currentResult.earnedXp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-black text-xl text-amber-400">
                      <Coins className="w-5 h-5 text-amber-400" />
                      <span>+{currentResult.earnedCoins}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className={`rounded-2xl border p-5 shadow-xs space-y-4 ${
              isDark ? 'bg-[#0D1527] border-blue-500/20' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-sm sm:text-base">
                    So‘nggi Mashg‘ulotlar Tarixi
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Jami: {history.length} ta
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5 uppercase text-[10px] tracking-wider">
                      <th className="pb-2.5">Vaqt</th>
                      <th className="pb-2.5">Til</th>
                      <th className="pb-2.5">Tezlik (WPM)</th>
                      <th className="pb-2.5">Aniqlik</th>
                      <th className="pb-2.5">Ball</th>
                      <th className="pb-2.5">Mukofot</th>
                      <th className="pb-2.5">Daraja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition">
                        <td className="py-2.5 font-mono text-slate-400">{item.timestamp}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 font-bold uppercase text-[10px]">
                            {item.language}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono font-bold text-cyan-400 text-sm">
                          {item.wpm} <span className="text-[10px] text-slate-400 font-normal">WPM</span>
                        </td>
                        <td className="py-2.5 font-mono font-bold text-emerald-400">
                          {item.accuracy}%
                        </td>
                        <td className="py-2.5 font-mono font-bold text-purple-400">
                          +{item.score}
                        </td>
                        <td className="py-2.5 font-mono">
                          <span className="text-amber-300 font-bold">+{item.earnedXp} XP</span>
                          <span className="text-slate-500 mx-1">•</span>
                          <span className="text-amber-400 font-bold">+{item.earnedCoins} 🪙</span>
                        </td>
                        <td className="py-2.5 text-slate-300 font-semibold">{item.rankTitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
