import React, { useState, useEffect, useRef } from 'react';
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
  TrendingUp,
  AlertCircle,
  CheckCircle2,
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

const UZBEK_WORDS = [
  'dasturlash', 'algoritm', 'kompyuter', 'klaviatura', 'ma’lumot', 'o‘rganish', 'natija', 'muvaffaqiyat',
  'loyiha', 'ishlash', 'tezlik', 'aqlli', 'texnologiya', 'tizim', 'kelajak', 'amaliyot', 'bilim', 'yozish',
  'kodlash', 'masala', 'funksiya', 'o‘zgaruvchi', 'qator', 'shart', 'takrorlash', 'massiv', 'usul', 'baho',
  'topshiriq', 'matn', 'harf', 'so‘z', 'savol', 'javob', 'sinov', 'jadval', 'fayl', 'tarmoq', 'xotira',
  'ekran', 'tugma', 'reja', 'maqsad', 'harakat', 'guruh', 'talaba', 'ustoz', 'maktab', 'kurs', 'rivojlanish',
  'qobiliyat', 'diqqat', 'aniqlik', 'sabr', 'intilish', 'g‘alaba', 'mukofot', 'ball', 'tanga', 'yulduz',
  'chempion', 'tezkor', 'yangi', 'foydali', 'tajriba', 'dasturchi', 'mantiq', 'hisoblash', 'struktura', 'baza',
  'foydalanuvchi', 'internet', 'aloqa', 'xavfsizlik', 'himoya', 'tez', 'aniq', 'mukammal', 'sifat', 'imkoniyat',
  'yutuq', 'yuksalish', 'boshlash', 'yakunlash', 'quvonch', 'ishonch', 'yordam', 'hamkorlik', 'zamonaviy',
  'yondashuv', 'tartib', 'intizom', 'odob', 'halollik', 'mehnat', 'sabot', 'jasorat', 'donolik', 'ziyraklik',
  'kuch', 'quvvat', 'ilhom', 'parvoz', 'parol', 'kirish', 'chiqish', 'saqlash', 'yangilash', 'ochish', 'yopish',
  'qidiruv', 'tanlash', 'almashish', 'joylash', 'yuborish', 'qabul', 'qilish', 'mustaqil', 'sermahsul', 'zamonaviy'
];

const RUSSIAN_WORDS = [
  'программирование', 'алгоритм', 'компьютер', 'клавиатура', 'данные', 'обучение', 'результат', 'успех',
  'проект', 'работа', 'скорость', 'умный', 'технологии', 'система', 'будущее', 'практика', 'знания',
  'печать', 'код', 'задача', 'функция', 'переменная', 'строка', 'условие', 'цикл', 'массив', 'метод',
  'оценка', 'задание', 'текст', 'буква', 'слово', 'вопрос', 'ответ', 'тест', 'таблица', 'файл', 'сеть',
  'память', 'экран', 'кнопка', 'план', 'цель', 'действие', 'группа', 'студент', 'учитель', 'школа', 'курс',
  'развитие', 'способность', 'внимание', 'точность', 'терпение', 'победа', 'награда', 'балл', 'монета',
  'звезда', 'чемпион', 'быстрый', 'новый', 'полезный', 'опыт', 'разработчик', 'логика', 'вычисление',
  'структура', 'база', 'пользователь', 'интернет', 'связь', 'безопасность', 'защита', 'точный', 'идеальный',
  'качество', 'возможность', 'достижение', 'начало', 'финиш', 'радость', 'доверие', 'помощь', 'современный',
  'порядок', 'труд', 'сила', 'вдохновение', 'пароль', 'вход', 'выход', 'сохранить', 'обновить', 'поиск',
  'выбор', 'отправка', 'уровень', 'интерфейс', 'уверенность', 'навыки', 'решение', 'процесс', 'созидание'
];

const ENGLISH_WORDS = [
  'programming', 'algorithm', 'computer', 'keyboard', 'data', 'learning', 'result', 'success',
  'project', 'work', 'speed', 'smart', 'technology', 'system', 'future', 'practice', 'knowledge',
  'typing', 'code', 'problem', 'function', 'variable', 'string', 'condition', 'loop', 'array',
  'method', 'grade', 'assignment', 'text', 'letter', 'word', 'question', 'answer', 'test', 'table',
  'file', 'network', 'memory', 'screen', 'button', 'plan', 'goal', 'action', 'group', 'student',
  'teacher', 'school', 'course', 'development', 'skill', 'focus', 'accuracy', 'patience', 'victory',
  'reward', 'points', 'coin', 'star', 'champion', 'fast', 'new', 'useful', 'experience', 'developer',
  'logic', 'computing', 'structure', 'database', 'user', 'internet', 'connection', 'security', 'protection',
  'precise', 'perfect', 'quality', 'opportunity', 'achievement', 'start', 'finish', 'confidence', 'support',
  'modern', 'discipline', 'effort', 'inspiration', 'password', 'login', 'logout', 'save', 'update',
  'search', 'select', 'submit', 'dynamic', 'efficiency', 'performance', 'creative', 'challenge', 'progress'
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

// Web Audio API yordamida mexanik klaviatura ovozi
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

export const TypingPage: React.FC = () => {
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

  // Yangi matnni tayyorlash
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

  // Taymer hisobi
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

  // Jonli WPM va Aniqlik hisoblash
  const elapsedSeconds = Math.max(1, selectedDuration - timeLeft);
  const elapsedMinutes = elapsedSeconds / 60;
  const currentWpm = Math.max(0, Math.round((correctCharsCount / 5) / elapsedMinutes));
  const currentCpm = Math.max(0, Math.round(correctCharsCount / elapsedMinutes));
  const currentAccuracy = totalTypedChars > 0
    ? Math.min(100, Math.max(0, Math.round((correctCharsCount / totalTypedChars) * 100)))
    : 100;

  // Mashq yakunlanganda ball va mukofotlarni hisoblash
  const finishGame = () => {
    setIsActive(false);
    setIsFinished(true);

    const finalWpm = currentWpm;
    const finalAccuracy = currentAccuracy;
    const finalCpm = currentCpm;

    // Ball hisoblash formulasi: WPM * 10 * Accuracy multiplier
    let accuracyMultiplier = 1.0;
    if (finalAccuracy >= 98) accuracyMultiplier = 1.3;
    else if (finalAccuracy >= 95) accuracyMultiplier = 1.15;
    else if (finalAccuracy >= 90) accuracyMultiplier = 1.0;
    else accuracyMultiplier = 0.8;

    const baseScore = Math.round(finalWpm * 10);
    const calculatedScore = Math.round(baseScore * accuracyMultiplier);

    // XP va Tangalar mukofoti
    const earnedXp = Math.max(15, Math.round(finalWpm * 1.5 + (finalAccuracy >= 95 ? 25 : 0)));
    const earnedCoins = Math.max(5, Math.round((finalWpm * 0.45) * accuracyMultiplier));

    // Daraja unvoni
    let rankTitle = '🐢 Boshlovchi';
    if (finalWpm >= 96) rankTitle = '👑 Master Typer';
    else if (finalWpm >= 71) rankTitle = '🏆 Professional';
    else if (finalWpm >= 46) rankTitle = '🚀 Tezkor Dasturchi';
    else if (finalWpm >= 26) rankTitle = '⚡️ O‘rtacha';

    const result: TypingResult = {
      id: `typ-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      wpm: finalWpm,
      cpm: finalCpm,
      accuracy: finalAccuracy,
      score: calculatedScore,
      earnedXp,
      earnedCoins,
      language: selectedLanguage,
      durationSeconds: selectedDuration,
      rankTitle,
    };

    setCurrentResult(result);

    // Tarixga saqlash
    const updatedHistory = [result, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    try {
      localStorage.setItem('cp_typing_history', JSON.stringify(updatedHistory));
      // Talabaning umumiy tangalari va XP sini yangilash (Do'kon / Rewards integratsiyasi)
      const currentCoins = Number(localStorage.getItem('cp_student_coins') || '850');
      const currentXp = Number(localStorage.getItem('cp_student_xp') || '1240');
      localStorage.setItem('cp_student_coins', String(currentCoins + earnedCoins));
      localStorage.setItem('cp_student_xp', String(currentXp + earnedXp));
    } catch {}
  };

  // Klaviaturani bosish hodisalari
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (!isActive) {
      setIsActive(true);
    }

    const value = e.target.value;

    if (soundEnabled) {
      playMechanicalKeySound();
    }

    // Probel (Space) bosilganda keyingi so'zga o'tish
    if (value.endsWith(' ')) {
      const trimmed = value.trim();
      const currentTargetWord = words[currentWordIndex] || '';

      if (trimmed.length > 0) {
        const isMatch = trimmed === currentTargetWord;
        setTypedWordsHistory((prev) => [...prev, { typed: trimmed, isCorrect: isMatch }]);

        // Belgilar hisobini qo'shish
        setTotalTypedChars((prev) => prev + trimmed.length + 1);
        if (isMatch) {
          setCorrectCharsCount((prev) => prev + currentTargetWord.length + 1);
        } else {
          setErrorsCount((prev) => prev + 1);
        }

        setCurrentWordIndex((prev) => prev + 1);
        setCurrentInput('');

        // Agar so'zlar tugab qolayotgan bo'lsa, yangi so'zlar qo'shish
        if (currentWordIndex >= words.length - 15) {
          setWords((prev) => [...prev, ...generateWordsList(selectedLanguage, 50)]);
        }
      }
      return;
    }

    // So'z ichidagi harflar sonini hisoblash
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

  // Tab + Enter yoki Esc orqali tezkor qayta boshlash
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      resetGame();
    }
  };

  const bestScore = history.reduce((max, h) => Math.max(max, h.wpm), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* 1. Header & Titul */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Klaviatura Trenajyori</span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  WPM & Reyting
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Klaviaturada tez yozishni mashq qiling, WPM tezligingizga yarasha XP va tangalar yutib oling!
              </p>
            </div>
          </div>
        </div>

        {/* Shaxsiy Rekord */}
        {bestScore > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Shaxsiy Rekord:</div>
              <div className="text-base font-black text-amber-950 font-mono">{bestScore} WPM</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Sozlamalar paneli (Til, Vaqt, Ovoz) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Til tanlash */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Til:</span>
          </span>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => { setSelectedLanguage('uz'); resetGame('uz', selectedDuration); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedLanguage === 'uz'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇺🇿</span>
              <span>O‘zbekcha</span>
            </button>
            <button
              onClick={() => { setSelectedLanguage('ru'); resetGame('ru', selectedDuration); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedLanguage === 'ru'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇷🇺</span>
              <span>Русский</span>
            </button>
            <button
              onClick={() => { setSelectedLanguage('en'); resetGame('en', selectedDuration); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedLanguage === 'en'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Vaqt tanlash */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Vaqt:</span>
          </span>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl gap-1 font-mono text-xs font-bold">
            {([15, 30, 60, 120] as TimeOption[]).map((dur) => (
              <button
                key={dur}
                onClick={() => { setSelectedDuration(dur); resetGame(selectedLanguage, dur); }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedDuration === dur
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>

        {/* Ovoz va Qayta boshlash tugmalari */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
            title={soundEnabled ? 'Klaviatura ovozini o‘chirish' : 'Ovozni yoqish'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Ovoz yoqilgan' : 'Ovozsiz'}</span>
          </button>

          <button
            onClick={() => resetGame()}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Qayta boshlash (Tab + Enter)"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Qayta boshlash</span>
          </button>
        </div>
      </div>

      {/* 3. Jonli Statistika ko‘rsatkichlari */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Tezlik (WPM)</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">
            {currentWpm}
            <span className="text-xs font-semibold text-slate-400 ml-1">so‘z/daq</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aniqlik</span>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono mt-1">
            {currentAccuracy}%
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Qolgan vaqt</span>
          </div>
          <div className={`text-3xl font-black font-mono mt-1 ${timeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Xatolar</span>
          </div>
          <div className="text-3xl font-black text-rose-600 font-mono mt-1">
            {errorsCount}
          </div>
        </div>
      </div>

      {/* 4. Asosiy Typing Maydoni (Monkeytype-style) */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="relative bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-sm min-h-[220px] cursor-text transition-all hover:border-blue-400/80 flex flex-col justify-center"
      >
        {/* Yashirin haqiqiy input maydoni */}
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className="absolute opacity-0 pointer-events-none"
        />

        {/* So'zlar oqimi */}
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
                    historyItem.isCorrect ? 'text-emerald-600 font-semibold' : 'text-rose-500 line-through bg-rose-50 px-1 rounded'
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
                  className="relative px-1.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 font-bold text-slate-900"
                >
                  {word.split('').map((char, charIdx) => {
                    const typedChar = currentInput[charIdx];
                    let charColor = 'text-slate-400';
                    let charBg = '';

                    if (typedChar !== undefined) {
                      if (typedChar === char) {
                        charColor = 'text-emerald-600';
                      } else {
                        charColor = 'text-rose-600';
                        charBg = 'bg-rose-100 rounded';
                      }
                    }

                    const isCaret = charIdx === currentInput.length;

                    return (
                      <span key={charIdx} className={`relative ${charColor} ${charBg}`}>
                        {isCaret && (
                          <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-blue-600 animate-pulse" />
                        )}
                        {char}
                      </span>
                    );
                  })}
                  {currentInput.length > word.length && (
                    <span className="text-rose-600 bg-rose-100 rounded px-0.5">
                      {currentInput.slice(word.length)}
                    </span>
                  )}
                  {currentInput.length === word.length && (
                    <span className="inline-block w-0.5 h-5 bg-blue-600 animate-pulse align-middle ml-0.5" />
                  )}
                </span>
              );
            }

            return (
              <span key={actualIndex} className="text-slate-400">
                {word}
              </span>
            );
          })}
        </div>

        {/* Start hint */}
        {!isActive && !isFinished && (
          <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full font-medium">
              💡 Boshlash uchun klaviaturada istalgan harfni bosing...
            </span>
          </div>
        )}
      </div>

      {/* 5. Natijalar Modali (O'yin tugaganda) */}
      {isFinished && currentResult && (
        <div className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-3xl border-2 border-blue-200 shadow-lg space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mashq muvaffaqiyatli yakunlandi!</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentResult.rankTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quyida sizning ushbu mashg‘ulotdagi to‘liq natijangiz va berilgan mukofotlar:
              </p>
            </div>

            <button
              onClick={() => resetGame()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yana bir bor urinish</span>
            </button>
          </div>

          {/* Asosiy natija kartochkalari */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Tezlik</span>
              <div className="text-4xl font-black text-blue-600 font-mono mt-1">
                {currentResult.wpm}
                <span className="text-xs text-slate-400 font-normal ml-1">WPM</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Aniqlik</span>
              <div className="text-4xl font-black text-emerald-600 font-mono mt-1">
                {currentResult.accuracy}%
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase">To‘plangan Ball</span>
              <div className="text-4xl font-black text-purple-600 font-mono mt-1">
                +{currentResult.score}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-tr from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-2xs">
              <span className="text-xs font-bold text-amber-700 uppercase">Yutilgan Mukofot</span>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 font-mono font-black text-xl text-amber-600">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>+{currentResult.earnedXp} XP</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-black text-xl text-amber-700">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span>+{currentResult.earnedCoins}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. So'nggi Natijalar Tarixi (Leaderboard / High Scores) */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                So‘nggi Mashg‘ulotlar Tarixi
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Jami urinishlar: {history.length} ta
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5">Vaqt</th>
                  <th className="pb-2.5">Til</th>
                  <th className="pb-2.5">Tezlik (WPM)</th>
                  <th className="pb-2.5">Aniqlik</th>
                  <th className="pb-2.5">To‘plangan Ball</th>
                  <th className="pb-2.5">Mukofot</th>
                  <th className="pb-2.5">Daraja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 font-mono text-slate-600">{item.timestamp}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                        {item.language}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-blue-600 text-sm">
                      {item.wpm} <span className="text-[10px] text-slate-400 font-normal">WPM</span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-emerald-600">
                      {item.accuracy}%
                    </td>
                    <td className="py-2.5 font-mono font-bold text-purple-600">
                      +{item.score}
                    </td>
                    <td className="py-2.5 font-mono">
                      <span className="text-amber-600 font-bold">+{item.earnedXp} XP</span>
                      <span className="text-slate-300 mx-1">•</span>
                      <span className="text-amber-700 font-bold">+{item.earnedCoins} 🪙</span>
                    </td>
                    <td className="py-2.5 text-slate-700 font-semibold">{item.rankTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Reyting va Darajalar Qo‘llanmasi */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <strong className="text-slate-800 block">WPM Reyting jadvali:</strong>
            0–25 (Boshlovchi) • 26–45 (O‘rtacha) • 46–70 (Tezkor) • 71–95 (Professional) • 96+ (Master)
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          * Har bir urinishda to‘plangan tangalaringiz «Sovg‘alar (Do‘kon)» balansiga qo‘shib boriladi.
        </div>
      </div>
    </div>
  );
};
