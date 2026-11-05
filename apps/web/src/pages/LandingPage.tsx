import React, { useState } from 'react';
import {
  Download,
  Terminal,
  CheckCircle2,
  WifiOff,
  Code2,
  Cpu,
  Layers,
  Globe,
  ExternalLink,
  Shield,
  Laptop,
  LogIn,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  Share2,
  Monitor,
  Check,
  Zap,
  BookOpen,
  Award,
  Send,
  Video,
  FileCode2,
  FolderArchive,
  Info,
} from 'lucide-react';

interface Props {
  onGoToLogin: () => void;
  currentUser?: any | null;
  onGoToDashboard?: () => void;
}

interface NewsItem {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

export const LandingPage: React.FC<Props> = ({ onGoToLogin, currentUser, onGoToDashboard }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('Mintera-Setup.zip');

  const newsList: NewsItem[] = [
    {
      id: 'news-1',
      tag: 'Python',
      date: '28-Fevral, 2025',
      title: 'Python 3.13: Dasturchilar uchun yangi imkoniyatlar va JIT kompilyator',
      excerpt:
        'Python dasturlash tilining so‘nggi versiyasidagi tezlik va samaradorlik o‘zgarishlari bo‘yicha batafsil sharh. Global Interpreter Lock (GIL) erkin rejimi tahlili.',
      content:
        'Python 3.13 relizida JIT (Just-In-Time) eksperimental kompilyatori joriy etildi. Bu dasturlar ishlash tezligini sezilarli darajada oshiradi. Shuningdek, free-threaded rejimi tufayli ko‘p oqimli (multithreading) dasturlashda GIL to‘sig‘i olib tashlandi. Mintera platformasi o‘quvchilar kodini tekshirishda eng so‘nggi Python 3.12 va 3.13 standartlariga to‘liq moslashtirilgan.',
      image:
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'news-2',
      tag: 'Frontend',
      date: '25-Fevral, 2025',
      title: 'Frontend dasturlashda 2026-yilgi eng talabgor freymvorklar',
      excerpt:
        'React 19, Next.js va zamonaviy web texnologiyalari bo‘yicha global bozor tahlili va ko‘nikmalar talabi. Kuchli dasturchilar tanlovi.',
      content:
        'Zamonaviy web dasturlashda React Server Components (RSC), tezkor bundlerlar (Vite, Turbopack) va qulay UI kutubxonalari standartga aylandi. Mintera web platformasi ham aynan shu ilg‘or texnologiyalar ustiga qurilgan bo‘lib, o‘qituvchi va ma’murlar uchun qulay, har qanday smartfon va planshetga moslashuvchan boshqaruv panelini taqdim etadi.',
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'news-3',
      tag: 'Algoritmlar',
      date: '20-Fevral, 2025',
      title: 'Algoritmlarni o‘rganishda eng keng tarqalgan 5 ta xato',
      excerpt:
        'Texnik suhbatlar va kodlash musobaqalariga tayyorgarlik ko‘rishda e’tibor qaratish lozim bo‘lgan muhim qoidalar va yechimlar.',
      content:
        'Dasturlash musobaqalari va olimpiadalarda eng ko‘p uchraydigan xatolar: chekka holatlarni (edge cases) hisobga olmaslik, vaqt va xotira murakkabligini (Big-O) oldindan tahlil qilmaslik hamda testlar soni kamligi. Mintera avtomatlashtirilgan test tizimi har bir masala bo‘yicha o‘nlab yashirin va ochiq testlar bilan o‘quvchi kodini xolis baholaydi.',
      image:
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleDownload = (fileName = 'Mintera-Setup.zip') => {
    setDownloadedFileName(fileName);
    // Trigger download
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show confirmation modal
    setDownloadSuccessModal(true);
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. FIXED TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#091128] border border-blue-500/30 flex items-center justify-center p-1.5 shadow-md shadow-blue-500/10 group-hover:scale-105 transition">
              <img src="/icon.png" alt="Mintera" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Min<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-500">tera</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                CodePractice
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-blue-700 bg-white shadow-xs hover:text-blue-800 transition"
            >
              Bosh sahifa
            </button>
            <button
              onClick={() => scrollTo('about-app')}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition"
            >
              Ilova haqida
            </button>
            <button
              onClick={() => scrollTo('news')}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition"
            >
              Yangiliklar
            </button>
            <button
              onClick={() => scrollTo('about-us')}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition"
            >
              Biz haqimizda
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download CTA Button */}
            <button
              onClick={() => handleDownload('Mintera-Setup.zip')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 flex-shrink-0 animate-bounce" />
              <span className="hidden xs:inline">Yuklab olish (.zip)</span>
              <span className="xs:hidden">Yuklab olish</span>
            </button>

            {/* Teacher / Admin Portal Switcher */}
            {currentUser ? (
              <button
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                title="Boshqaruv paneliga o‘tish"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden lg:inline">{currentUser.fullName || 'Paneli'}</span>
              </button>
            ) : (
              <button
                onClick={onGoToLogin}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200/80 transition cursor-pointer"
                title="O‘qituvchi va Administratorlar kirishi"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Kirish</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-2 shadow-xl animate-fade-in">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 flex items-center justify-between"
            >
              <span>Bosh sahifa</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('about-app')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Ilova haqida</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('news')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Yangiliklar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('about-us')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Biz haqimizda</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => handleDownload('Mintera-Setup.zip')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20"
              >
                <Download className="w-4 h-4" />
                <span>Mintera to‘plamini yuklab olish (.zip)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-sm font-semibold"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>O‘qituvchi va Ma’mur kirishi</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="w-full pt-20">
        {/* 2. HERO SECTION */}
        <section className="relative w-full overflow-hidden pt-10 sm:pt-14 pb-16 sm:pb-24">
          {/* Ambient Glows */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-blue-200/50 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading, Text & Action Buttons */}
              <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-5">
                {/* OS Platform Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/60 text-xs font-semibold shadow-xs">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span>Ish stoli ilovasi • Windows (x64) • macOS & Linux</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Dasturlashni{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500">
                    sinab ko‘ring!
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                  <strong>Mintera</strong> orqali dasturlash bilimlaringizni sinang, yangi ko‘nikmalarni rivojlantiring
                  va o‘z ustingizda ishlang. Haqiqiy vaqt rejimida avtomatlashtirilgan kod tahlili, mustaqil test
                  muhiti va qiziqarli sovg‘alar do‘koni.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownload('Mintera-Setup.zip')}
                    className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5" />
                    <span>Ilovani yuklab olish (.zip)</span>
                  </button>
                  <button
                    onClick={() => scrollTo('about-app')}
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-slate-300 shadow-xs transition cursor-pointer w-full sm:w-auto"
                  >
                    <Info className="w-5 h-5 text-slate-500" />
                    <span>Batafsil ma’lumot</span>
                  </button>
                </div>

                {/* Supporting Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Versiya 2.4.0 (Rasmiy)
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    100% Bepul
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
                    <WifiOff className="w-4 h-4 text-blue-600" />
                    Offline rejimda ishlash
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Visual Graphic & Editor Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden p-4 sm:p-5">
                  {/* Mock terminal header */}
                  <div className="flex items-center justify-between pb-3 mb-3 bg-slate-900 text-white px-4 py-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-300 font-mono ml-2">tester.py • Active Test</span>
                    </div>
                    <span className="text-[11px] text-amber-300 bg-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                      00:45:12
                    </span>
                  </div>

                  {/* Visual Image Banner with 100% test coverage overlay */}
                  <div className="relative rounded-xl overflow-hidden mb-4 aspect-[16/9] bg-slate-950">
                    <img
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                      alt="Mintera Test Architecture"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <div className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                          Avtomatlashtirilgan tekshirish
                        </div>
                        <div className="text-lg font-extrabold flex items-center gap-2">
                          <span>100% Sinov qamrovi</span>
                          <span className="text-xs bg-emerald-500/80 text-white px-2 py-0.5 rounded-full">Passed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Code Snippet Box */}
                  <div className="bg-slate-900 rounded-xl p-4 font-mono text-[12px] sm:text-[13px] leading-relaxed text-slate-200 shadow-inner">
                    <div className="flex justify-between text-slate-400 text-[11px] mb-2 font-sans font-semibold uppercase tracking-wider border-b border-slate-800 pb-1.5">
                      <span className="text-blue-400">Vazifa #14: Binar qidiruv</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Passed 12/12
                      </span>
                    </div>
                    <p className="text-amber-400">
                      <span className="text-purple-400 font-bold">def</span> binary_search(arr, target):
                    </p>
                    <p className="pl-4 text-slate-300">left, right = 0, len(arr) - 1</p>
                    <p className="pl-4 text-purple-400 font-bold">
                      while <span className="text-slate-300 font-normal">left &lt;= right:</span>
                    </p>
                    <p className="pl-8 text-slate-300">mid = (left + right) // 2</p>
                    <p className="pl-8 text-purple-400 font-bold">
                      if <span className="text-slate-300 font-normal">arr[mid] == target:</span>{' '}
                      <span className="text-rose-400 font-bold">return</span> mid
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Xotira: 14.2 MB • Vaqt: 28 ms
                      </span>
                      <span className="text-[11px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                        Python 3.12
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ABOUT THE APPLICATION (ILOVA HAQIDA) */}
        <section className="w-full bg-slate-100/70 py-16 sm:py-24 border-y border-slate-200/60" id="about-app">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center max-w-2xl mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider mb-3">
                <Laptop className="w-3.5 h-3.5" />
                Desktop dastur
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Mintera ilovasi haqida
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Kompyuteringizga o‘rnatiladigan qulay, tezkor va internet talab qilmaydigan zamonaviy dasturlash sinov
                muhiti. Testlarni topshiring, kodingizni tekshiring va shaxsiy rivojlanishingizni kuzatib boring.
              </p>
            </div>

            {/* 3 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full mb-16">
              {/* Feature 1 */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Dasturlash testlari</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Python, C++, JavaScript, Algoritmlar va ma’lumotlar tuzilmasi bo‘yicha ko‘p bosqichli amaliy testlar
                  to‘plami. Boshlang‘ichdan xalqaro olimpiada darajasigacha bo‘lgan masalalar.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Bilimlarni sinash</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Haqiqiy vaqt rejimida sintaksis va mantiqiy xatolarni tekshiruvchi avtomatlashtirilgan baholash
                  tizimi. Bir necha millisekundda aniq test xulosalari va xatolik joyini ko‘rsatish.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Natijalarni ko‘rish & Sovg‘alar</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Batafsil tahlil, xatolar ustida ishlash bo‘yicha maslahatlar va shaxsiy o‘sish reytingi. Topshiriqlarni
                  muvaffaqiyatli topshirgan o‘quvchilar platforma ballarini to‘plab, haqiqiy IT-sovg‘alarga ega bo‘ladilar.
                </p>
              </div>
            </div>

            {/* Desktop App Mockup Showcase */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden mb-16">
              {/* Mockup Window Bar */}
              <div className="bg-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="text-xs text-slate-300 font-mono font-semibold">Mintera Desktop — v2.4.0</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    Protected Exam Mode
                  </span>
                </div>
              </div>

              {/* Window Content */}
              <div className="p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex flex-col gap-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                      Interaktiv Interface
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      To‘liq integratsiyalashgan dasturlash muhiti
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Mintera ilovasi orqali test savollarini yechishda professional kod muharriridan foydalaning. Kod
                      yozing, kompyuteringizdagi ichki runner orqali natijani bir zumda tekshiring.
                    </p>

                    <div className="flex flex-col gap-2.5 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Avtonom mahalliy sinov serveri (Offline)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Intelligent kod auto-to‘ldirish va sintaksis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>O‘zbek va ingliz tillaridagi interfeys</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Xavfsiz va xolis baholash (Anti-cheat himoyasi)</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 shadow-lg border border-slate-800 aspect-video flex items-center justify-center p-4">
                      {/* Interactive UI Mockup graphic inside laptop */}
                      <div className="w-full h-full bg-[#0F172A] rounded-lg p-3 text-white flex flex-col justify-between font-mono text-xs border border-slate-700/50">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-blue-400 font-bold flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5" /> main.py — Mintera Editor
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                            Status: Active
                          </span>
                        </div>
                        <div className="space-y-1 text-slate-300 py-2">
                          <p><span className="text-purple-400">import</span> sys, time</p>
                          <p><span className="text-purple-400">def</span> <span className="text-amber-300">solve</span>():</p>
                          <p className="pl-4 text-slate-400"># Mintera Avtomatik Test runner tekshiruvi</p>
                          <p className="pl-4">nums = list(map(int, input().split()))</p>
                          <p className="pl-4">ans = sum(x for x in nums if x % 2 == 0)</p>
                          <p className="pl-4"><span className="text-purple-400">print</span>(f<span className="text-emerald-300">"Javob: &#123;ans&#125;"</span>)</p>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] flex items-center justify-between">
                          <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Barcha 10 ta test muvaffaqiyatli o‘tdi!
                          </span>
                          <span className="text-slate-400 font-sans">+50 Ball taqdim etildi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION CTA: DOWNLOAD SECTION */}
            <div
              className="flex flex-col items-center gap-4 text-center max-w-2xl bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-xl"
              id="download-section"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Download className="w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Platformani hoziroq yuklab oling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                O‘rnatish jarayoni atigi 1 daqiqa vaqt oladi. Barcha operatsion tizimlar uchun moslashtirilgan.
              </p>

              {/* Direct Download Options */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
                <button
                  onClick={() => handleDownload('Mintera-Setup.zip')}
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>ZIP to‘plamni yuklab olish (.zip) — Tavsiya etiladi</span>
                </button>
                <button
                  onClick={() => handleDownload('Mintera-Setup.exe')}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  <FolderArchive className="w-4 h-4 text-slate-600" />
                  <span>To‘g‘ridan-to‘g‘ri Setup (.exe)</span>
                </button>
                <button
                  onClick={() => handleDownload('Mintera.exe')}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  <FileCode2 className="w-4 h-4 text-slate-600" />
                  <span>Portable (.exe)</span>
                </button>
              </div>

              {/* OS Icons Support indicator */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-500 text-xs font-semibold pt-3">
                <div className="flex items-center gap-1.5 hover:text-blue-600 transition">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span>Windows (x64) • 10 / 11</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 hover:text-blue-600 transition">
                  <Laptop className="w-4 h-4 text-slate-600" />
                  <span>macOS (Apple Silicon / Intel)</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 hover:text-blue-600 transition">
                  <Terminal className="w-4 h-4 text-slate-600" />
                  <span>Linux (.deb / AppImage)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROGRAMMING NEWS (SO‘NGGI YANGILIKLAR) */}
        <section className="w-full bg-white py-16 sm:py-24" id="news">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center max-w-2xl mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                IT va Dasturlash yangiliklari
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                So‘nggi yangiliklar
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Dasturlash olamidagi eng so‘nggi tendensiyalar, texnologiyalar va Mintera platformasi yangilanishlari.
              </p>
            </div>

            {/* 3 News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full mb-12">
              {newsList.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer"
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-blue-700 font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mt-1">
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-800 pt-2 transition">
                      <span>Batafsil o‘qish</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ABOUT US (BIZ HAQIMIZDA) */}
        <section className="w-full bg-slate-50 py-16 sm:py-24 border-t border-slate-200/70" id="about-us">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/20">
                  <Shield className="w-3.5 h-3.5" />
                  Bizning Missiyamiz
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  Mintera — IT ta’limida mustaqil sinov va yuksalish maydoni
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  Biz O‘zbekistondagi yosh dasturchilar, o‘quvchilar va murabbiylar uchun jahon standartlariga javob
                  beruvchi avtomatlashtirilgan kod sinov muhitini yaratdik. Maqsadimiz — har bir iqtidorli o‘quvchiga
                  o‘z bilimini adolatli, mustaqil va qiziqarli sinovlar orqali isbotlash hamda qimmatbaho mukofotlar
                  yutib olish imkoniyatini taqdim etishdir.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">100+</div>
                    <div className="text-xs text-slate-400 mt-0.5">Amaliy dasturlash masalalari</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">0.02s</div>
                    <div className="text-xs text-slate-400 mt-0.5">Lokal test natijalari tezligi</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
                    <div className="text-xs text-slate-400 mt-0.5">Xolis va mustaqil baholash</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="w-full bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-800">
            {/* Brand column */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#091128] border border-blue-500/30 flex items-center justify-center p-1">
                  <img src="/icon.png" alt="Mintera" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Min<span className="text-blue-400">tera</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                Dasturlash ko‘nikmalarini real vaqt rejimida aniq, xavfsiz va xolis baholash uchun mo‘ljallangan zamonaviy
                desktop va web ilovasi.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tezkor havolalar
              </span>
              <nav className="flex flex-col gap-2 text-xs sm:text-sm text-slate-400">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-left hover:text-white transition"
                >
                  Bosh sahifa
                </button>
                <button onClick={() => scrollTo('about-app')} className="text-left hover:text-white transition">
                  Ilova haqida
                </button>
                <button onClick={() => scrollTo('download-section')} className="text-left hover:text-white transition">
                  Ilovani yuklab olish
                </button>
                <button onClick={() => scrollTo('news')} className="text-left hover:text-white transition">
                  Yangiliklar
                </button>
                <button onClick={() => scrollTo('about-us')} className="text-left hover:text-white transition">
                  Biz haqimizda
                </button>
              </nav>
            </div>

            {/* Social & Admin Portal */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Bog‘lanish va Kirish
              </span>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-400">
                <a
                  href="https://t.me/mintera_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-blue-400 transition"
                >
                  <Send className="w-4 h-4 text-blue-400" />
                  <span>Telegram: @mintera_uz</span>
                </a>
                <a
                  href="https://github.com/Orifjon5583/umidbekexe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition"
                >
                  <FileCode2 className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
                <button
                  onClick={onGoToLogin}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold pt-1 transition text-left"
                >
                  <LogIn className="w-4 h-4" />
                  <span>O‘qituvchi / Admin Paneli &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Mintera. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-4">
              <span>v2.4.0 Desktop Release</span>
              <span>•</span>
              <button
                onClick={() => handleDownload('Mintera-Setup.zip')}
                className="text-blue-400 hover:underline"
              >
                Mintera-Setup.zip yuklab olish
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* NEWS DETAILS MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
              {selectedNews.tag}
            </span>
            <div className="text-xs text-slate-400 mb-2">{selectedNews.date}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4 leading-snug">
              {selectedNews.title}
            </h3>

            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5 bg-slate-100">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line mb-6">
              {selectedNews.content}
            </p>

            <button
              onClick={() => setSelectedNews(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* DOWNLOAD CONFIRMATION MODAL / TOAST */}
      {downloadSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Yuklab olish boshlandi!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="font-bold text-blue-700 block mb-1">
                📦 {downloadedFileName} yuklab olinmoqda.
              </span>
              <span className="text-slate-800 font-bold block mt-2 mb-1">O‘rnatish tartibi:</span>
              1. Yuklab olingan ZIP arxivni oching (Extract / Hammasini chiqarish)
              <br />
              2. Ichidagi <strong>Mintera-Setup.exe</strong> faylini ishga tushiring
              <br />
              3. "O‘rnatish" tugmasini bosing — ilova ish stolingizda paydo bo‘ladi!
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setDownloadSuccessModal(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                Tushunarli, rahmat!
              </button>
              <div className="flex items-center justify-center gap-2 pt-2 text-xs">
                <button
                  onClick={() => handleDownload('Mintera-Setup.exe')}
                  className="text-slate-500 hover:text-blue-600 underline"
                >
                  To‘g‘ridan-to‘g‘ri .exe
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => handleDownload('Mintera.exe')}
                  className="text-slate-500 hover:text-blue-600 underline"
                >
                  Portable versiya (.exe)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};