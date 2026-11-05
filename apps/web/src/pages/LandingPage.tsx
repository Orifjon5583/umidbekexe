import React, { useState, useEffect } from 'react';
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
  ChevronDown,
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
  Sun,
  Moon,
  Languages,
  User,
} from 'lucide-react';

interface Props {
  onGoToLogin: () => void;
  currentUser?: any | null;
  onGoToDashboard?: () => void;
}

export type Language = 'uz' | 'ru' | 'kr';
export type ThemeMode = 'light' | 'dark';

interface NewsItem {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

// Ko'p tilli lug'at (O'zbekcha lotin, Ruscha, O'zbekcha kirill)
const translations: Record<Language, any> = {
  uz: {
    nav: {
      home: 'Bosh sahifa',
      aboutApp: 'Ilova haqida',
      news: 'Yangiliklar',
      aboutUs: 'Biz haqimizda',
      download: 'Yuklab olish (.zip)',
      login: 'Kirish',
      dashboard: 'Boshqaruv paneli',
      themeLight: 'Kunduzgi',
      themeDark: 'Tungi',
    },
    hero: {
      osPill: 'Ish stoli ilovasi • Windows 10 & 11 (x64)',
      title1: 'Dasturlashni ',
      title2: 'sinab ko‘ring!',
      desc: 'Mintera orqali dasturlash bilimlaringizni sinang, yangi ko‘nikmalarni rivojlantiring va o‘z ustingizda ishlang. Haqiqiy vaqt rejimida avtomatlashtirilgan kod tahlili va interaktiv muhit.',
      downloadBtn: 'Ilovani yuklab olish (.zip)',
      moreBtn: 'Batafsil ma’lumot',
      version: 'Versiya 2.4.0 (Rasmiy)',
      free: '100% Bepul',
      offline: 'Offline rejimda ishlash',
    },
    simulator: {
      taskTitle: 'Vazifa #14: Binar qidiruv',
      passed: '12/12 Testdan o‘tdi',
      activeTest: 'tester.py • Faol sinov',
      autoCheck: 'Avtomatlashtirilgan tekshirish',
      coverage: '100% Sinov qamrovi',
      statusPassed: 'Qabul qilindi',
      specs: 'Xotira: 14.2 MB • Vaqt: 28 ms',
    },
    aboutApp: {
      pill: 'Desktop dastur',
      title: 'Mintera ilovasi haqida',
      desc: 'Kompyuteringizga o‘rnatiladigan qulay, tezkor va internet talab qilmaydigan zamonaviy dasturlash sinov muhiti. Testlarni topshiring, kodingizni tekshiring va shaxsiy rivojlanishingizni kuzatib boring.',
      f1Title: 'Dasturlash testlari',
      f1Desc: 'Python, C++, Algoritmlar va ma’lumotlar tuzilmasi bo‘yicha ko‘p bosqichli amaliy testlar to‘plami. Boshlang‘ichdan olimpiada darajasigacha.',
      f2Title: 'Bilimlarni sinash',
      f2Desc: 'Haqiqiy vaqt rejimida sintaksis va mantiqiy xatolarni tekshiruvchi avtomatlashtirilgan baholash tizimi. Bir necha millisekundda aniq xulosa.',
      f3Title: 'Natijalar & Sovg‘alar',
      f3Desc: 'Batafsil tahlil, xatolar ustida ishlash bo‘yicha maslahatlar va shaxsiy o‘sish reytingi. Ballarni to‘plab, haqiqiy IT-sovg‘alarga ega bo‘ling.',
      mockupTag: 'Interaktiv interfeys',
      mockupTitle: 'To‘liq integratsiyalashgan dasturlash muhiti',
      mockupDesc: 'Mintera ilovasi orqali test savollarini yechishda professional Monaco kod muharriridan foydalaning. Kod yozing va lokal runner orqali tekshiring.',
      p1: 'Avtonom mahalliy sinov serveri (Offline ishlash)',
      p2: 'Intelligent kod auto-to‘ldirish va sintaksis yordami',
      p3: 'Anti-Cheat va Sandbox orqali xavfsiz baholash',
      p4: 'Keng qamrovli xavfsizlik audit jurnali',
    },
    downloadSection: {
      title: 'Platformani hoziroq yuklab oling',
      desc: 'O‘rnatish jarayoni atigi 1 daqiqa vaqt oladi. Qulay ZIP arxivda dastur, o‘rnatuvchi va to‘liq qo‘llanma mavjud.',
      btnZip: 'ZIP to‘plamni yuklab olish (.zip) — Tavsiya etiladi',
      btnExe: 'To‘g‘ridan-to‘g‘ri Setup (.exe)',
      btnPortable: 'Portable versiya (.exe)',
      guarantee: '100% Xavfsiz • Viruslardan xoli • Windows Defender sertifikatlangan',
    },
    news: {
      pill: 'IT va Dasturlash yangiliklari',
      title: 'So‘nggi yangiliklar',
      desc: 'Dasturlash olamidagi eng so‘nggi tendensiyalar, texnologiyalar va Mintera platformasi yangilanishlari.',
      readMore: 'Batafsil o‘qish',
      close: 'Yopish',
    },
    aboutUs: {
      pill: 'Bizning Missiyamiz',
      title: 'Mintera — IT ta’limida mustaqil sinov va yuksalish maydoni',
      desc: 'Biz O‘zbekistondagi yosh dasturchilar, o‘quvchilar va murabbiylar uchun jahon standartlariga javob beruvchi avtomatlashtirilgan kod sinov muhitini yaratdik. Maqsadimiz — har bir iqtidorli o‘quvchiga o‘z bilimini adolatli va mustaqil sinovlar orqali isbotlash imkoniyatini taqdim etishdir.',
      stat1: '100+ Amaliy dasturlash masalalari',
      stat2: '0.02s Lokal test natijalari tezligi',
      stat3: '100% Xolis va mustaqil baholash',
    },
    footer: {
      desc: 'Dasturlash ko‘nikmalarini real vaqt rejimida aniq, xavfsiz va xolis baholash uchun mo‘ljallangan zamonaviy desktop va web ilovasi.',
      quickLinks: 'Tezkor havolalar',
      contact: 'Bog‘lanish va Kirish',
      rights: '© 2026 Mintera. Barcha huquqlar himoyalangan.',
      adminPanel: 'O‘qituvchi / Admin Paneli →',
    },
    modal: {
      title: 'Yuklab olish boshlandi!',
      downloading: 'yuklab olinmoqda.',
      stepsTitle: 'O‘rnatish tartibi:',
      step1: '1. Yuklab olingan ZIP arxivni oching (Extract / Hammasini chiqarish).',
      step2: '2. Ichidagi "Mintera-Setup.exe" faylini ishga tushiring.',
      step3: '3. "O‘rnatish" tugmasini bosing — ilova ish stolingizda paydo bo‘ladi!',
      closeBtn: 'Tushunarli, rahmat!',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      aboutApp: 'О приложении',
      news: 'Новости',
      aboutUs: 'О нас',
      download: 'Скачать (.zip)',
      login: 'Войти',
      dashboard: 'Панель управления',
      themeLight: 'Светлая',
      themeDark: 'Тёмная',
    },
    hero: {
      osPill: 'Десктопное приложение • Windows 10 & 11 (x64)',
      title1: 'Испытайте силу ',
      title2: 'программирования!',
      desc: 'Проверяйте свои знания в программировании на платформе Mintera, развивайте навыки и совершенствуйтесь. Автоматический анализ кода и интерактивная среда в реальном времени.',
      downloadBtn: 'Скачать приложение (.zip)',
      moreBtn: 'Подробнее',
      version: 'Версия 2.4.0 (Официальный)',
      free: '100% Бесплатно',
      offline: 'Работает автономно (Offline)',
    },
    simulator: {
      taskTitle: 'Задача #14: Бинарный поиск',
      passed: '12/12 Тестов пройдено',
      activeTest: 'tester.py • Активный тест',
      autoCheck: 'Автоматическое тестирование',
      coverage: '100% Покрытие тестами',
      statusPassed: 'Пройдено',
      specs: 'Память: 14.2 МБ • Время: 28 мс',
    },
    aboutApp: {
      pill: 'Десктопное приложение',
      title: 'О платформе Mintera',
      desc: 'Удобная, быстрая и автономная среда для проверки навыков программирования. Решайте задачи, запускайте тесты локально и отслеживайте свой прогресс.',
      f1Title: 'Практические задачи',
      f1Desc: 'Обширная база задач по Python, C++, структурам данных и алгоритмам — от базового уровня до международных олимпиад.',
      f2Title: 'Мгновенное тестирование',
      f2Desc: 'Автоматизированная система проверки синтаксиса и логики за доли секунды с выводом понятных отчетов об ошибках.',
      f3Title: 'Рейтинг и Награды',
      f3Desc: 'Подробная аналитика решений, работа над ошибками и таблица лидеров. Набирайте баллы и получайте настоящие призы.',
      mockupTag: 'Интерактивный интерфейс',
      mockupTitle: 'Полноценная среда разработки',
      mockupDesc: 'Профессиональный редактор кода Monaco со встроенным локальным раннером и поддержкой быстрого исполнения.',
      p1: 'Автономный локальный раннер без обязательного интернета',
      p2: 'Умное автодополнение кода и подсветка синтаксиса',
      p3: 'Защита Anti-Cheat и песочница Sandbox для честной оценки',
      p4: 'Журнал аудита безопасности в реальном времени',
    },
    downloadSection: {
      title: 'Скачайте платформу прямо сейчас',
      desc: 'Установка занимает всего 1 минуту. В архиве содержатся программа, установщик и понятная инструкция.',
      btnZip: 'Скачать пакет ZIP (.zip) — Рекомендуется',
      btnExe: 'Установочный файл (.exe)',
      btnPortable: 'Портативная версия (.exe)',
      guarantee: '100% Безопасно • Без вирусов • Сертифицировано для Windows',
    },
    news: {
      pill: 'Новости IT и технологий',
      title: 'Последние новости',
      desc: 'Актуальные тренды в мире программирования, новые технологии и обновления платформы Mintera.',
      readMore: 'Читать подробнее',
      close: 'Закрыть',
    },
    aboutUs: {
      pill: 'Наша Миссия',
      title: 'Mintera — пространство для независимого роста в сфере IT',
      desc: 'Мы создали автоматизированную среду тестирования кода мирового уровня для молодых программистов и преподавателей в Узбекистане. Наша цель — дать каждому талантливому ученику возможность доказать свои знания.',
      stat1: '100+ Практических задач',
      stat2: '0.02с Скорость локального прогона',
      stat3: '100% Объективная оценка',
    },
    footer: {
      desc: 'Современная десктопная и веб-платформа для точной, безопасной и объективной оценки навыков программирования.',
      quickLinks: 'Быстрые ссылки',
      contact: 'Контакты и Вход',
      rights: '© 2026 Mintera. Все права защищены.',
      adminPanel: 'Панель преподавателя / Админа →',
    },
    modal: {
      title: 'Загрузка началась!',
      downloading: 'скачивается.',
      stepsTitle: 'Порядок установки:',
      step1: '1. Распакуйте скачанный ZIP-архив (Extract / Извлечь всё).',
      step2: '2. Запустите файл "Mintera-Setup.exe" из папки.',
      step3: '3. Нажмите "Установить" — ярлык появится на вашем рабочем столе!',
      closeBtn: 'Понятно, спасибо!',
    },
  },
  kr: {
    nav: {
      home: 'Бош саҳифа',
      aboutApp: 'Илова ҳақида',
      news: 'Янгиликлар',
      aboutUs: 'Биз ҳақимизда',
      download: 'Юклаб олиш (.zip)',
      login: 'Кириш',
      dashboard: 'Бошқарув панели',
      themeLight: 'Кундузги',
      themeDark: 'Тунги',
    },
    hero: {
      osPill: 'Иш столи иловаси • Windows 10 & 11 (x64)',
      title1: 'Дастурлашни ',
      title2: 'синаб кўринг!',
      desc: 'Mintera орқали дастурлаш билимларингизни синанг, янги кўникмаларни ривожлантиринг ва ўз устингизда ишланг. Ҳақиқий вақт режимида автоматлаштирилган код таҳлили ва интерактив муҳит.',
      downloadBtn: 'Иловани юклаб олиш (.zip)',
      moreBtn: 'Батафсил маълумот',
      version: 'Версия 2.4.0 (Расмий)',
      free: '100% Бепул',
      offline: 'Offline режимда ишлаш',
    },
    simulator: {
      taskTitle: 'Вазифа #14: Бинар қидирув',
      passed: '12/12 Тестдан ўтди',
      activeTest: 'tester.py • Фаол синов',
      autoCheck: 'Автоматлаштирилган текшириш',
      coverage: '100% Синов қамрови',
      statusPassed: 'Қабул қилинди',
      specs: 'Хотира: 14.2 МБ • Вақт: 28 мс',
    },
    aboutApp: {
      pill: 'Desktop дастур',
      title: 'Mintera иловаси ҳақида',
      desc: 'Компьютерингизга ўрнатиладиган қулай, тезкор ва интернет талаб қилмайдиган замонавий дастурлаш синов муҳити. Тестларни топширинг, кодингизни текширинг ва ривожланишингизни кузатинг.',
      f1Title: 'Дастурлаш тестлари',
      f1Desc: 'Python, C++, Алгоритмлар ва маълумотлар тузилмаси бўйича кўп босқичли амалий тестлар тўплами. Бошланғичдан олимпиада даражасигача.',
      f2Title: 'Билимларни синаш',
      f2Desc: 'Ҳақиқий вақт режимида синтаксис ва мантиқий хатоларни текширувчи автоматлаштирилган баҳолаш тизими. Бир неча миллисонияда аниқ хулоса.',
      f3Title: 'Натижалар & Совғалар',
      f3Desc: 'Батафсил таҳлил, хатолар устида ишлаш ва шахсий рейтинг. Балларни тўплаб, ҳақиқий IT-совғаларга эга бўлинг.',
      mockupTag: 'Интерактив интерфейс',
      mockupTitle: 'Тўлиқ интеграциялашган дастурлаш муҳити',
      mockupDesc: 'Mintera иловаси орқали тест саволларини ечишда профессионал Monaco код муҳарриридан фойдаланинг. Код ёзинг ва локал runner орқали текширинг.',
      p1: 'Автоном маҳаллий синов сервери (Offline ишлаш)',
      p2: 'Интеллигент код авто-тўлдириш ва ёрдам',
      p3: 'Anti-Cheat ва Sandbox орқали хавфсиз баҳолаш',
      p4: 'Кенг қамровли хавфсизлик аудит журнали',
    },
    downloadSection: {
      title: 'Платформани ҳозироқ юклаб олинг',
      desc: 'Ўрнатиш жараёни атиги 1 дақиқа вақт олади. Қулай ZIP архивда дастур, ўрнатувчи ва тўлиқ қўлланма мавжуд.',
      btnZip: 'ZIP тўпламни юклаб олиш (.zip) — Тавсия этилади',
      btnExe: 'Тўғридан-тўғри Setup (.exe)',
      btnPortable: 'Portable версия (.exe)',
      guarantee: '100% Хавфсиз • Вируслардан холи • Windows Defender сертификатланган',
    },
    news: {
      pill: 'IT ва Дастурлаш янгиликлари',
      title: 'Сўнгги янгиликлар',
      desc: 'Дастурлаш оламидаги энг сўнгги тенденциялар, технологиялар ва Mintera платформаси янгиланишлари.',
      readMore: 'Батафсил ўқиш',
      close: 'Ёпиш',
    },
    aboutUs: {
      pill: 'Бизнинг Миссиямиз',
      title: 'Mintera — IT таълимида мустақил синов ва юксалиш майдони',
      desc: 'Биз Ўзбекистондаги ёш дастурчилар, ўқувчилар ва мураббийлар учун жаҳон стандартларига жавоб берувчи автоматлаштирилган код синов муҳитини яратдик. Мақсадимиз — ҳар бир иқтидорли ўқувчига ўз билимини адолатли ва мустақил синовлар орқали исботлаш имкониятини беришдир.',
      stat1: '100+ Амалий дастурлаш масалалари',
      stat2: '0.02с Локал тест натижалари тезлиги',
      stat3: '100% Холис ва мустақил баҳолаш',
    },
    footer: {
      desc: 'Дастурлаш кўникмаларини реал вақт режимида аниқ, хавфсиз ва холис баҳолаш учун мўлжалланган замонавий desktop ва web иловаси.',
      quickLinks: 'Тезкор ҳаволалар',
      contact: 'Боғланиш ва Кириш',
      rights: '© 2026 Mintera. Барча ҳуқуқлар ҳимояланган.',
      adminPanel: 'Ўқитувчи / Админ Панели →',
    },
    modal: {
      title: 'Юклаб олиш бошланди!',
      downloading: 'юклаб олинмоқда.',
      stepsTitle: 'Ўрнатиш тартиби:',
      step1: '1. Юклаб олинган ZIP архивни очинг (Extract / Ҳаммасини чиқариш).',
      step2: '2. Ичидаги "Mintera-Setup.exe" файлини ишга туширинг.',
      step3: '3. "Ўрнатиш" тугмасини босинг — илова иш столингизда пайдо бўлади!',
      closeBtn: 'Тушунарли, раҳмат!',
    },
  },
};

export const LandingPage: React.FC<Props> = ({ onGoToLogin, currentUser, onGoToDashboard }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('Mintera-Setup.zip');

  // Til va Rejim boshqaruvi
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mintera_lang');
      if (saved === 'uz' || saved === 'ru' || saved === 'kr') return saved;
    } catch {}
    return 'uz';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('cp_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Til o'zgarganda saqlash
  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    setIsLangDropdownOpen(false);
    try {
      localStorage.setItem('mintera_lang', newLang);
    } catch {}
  };

  // Rejim (Dark / Light) o'zgarganda saqlash va HTML ga class ulash
  useEffect(() => {
    try {
      localStorage.setItem('cp_theme', theme);
    } catch {}
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const t = translations[lang];

  const newsList: NewsItem[] = [
    {
      id: 'news-1',
      tag: 'Python',
      date: lang === 'ru' ? '28 февраля 2025' : '28-Fevral, 2025',
      title:
        lang === 'ru'
          ? 'Python 3.13: Новые возможности и встроенный JIT-компилятор'
          : lang === 'kr'
          ? 'Python 3.13: Дастурчилар учун янги имкониятлар ва JIT компилятор'
          : 'Python 3.13: Dasturchilar uchun yangi imkoniyatlar va JIT kompilyator',
      excerpt:
        lang === 'ru'
          ? 'Обзор улучшений производительности в свежем релизе Python. Экспериментальный JIT и многопоточность без ограничений GIL.'
          : lang === 'kr'
          ? 'Python тилининг сўнгги версиясидаги тезлик ва самарадорлик ўзгаришлари бўйича батафсил шарҳ. Global Interpreter Lock (GIL) таҳлили.'
          : 'Python dasturlash tilining so‘nggi versiyasidagi tezlik va samaradorlik o‘zgarishlari bo‘yicha batafsil sharh. Global Interpreter Lock (GIL) tahlili.',
      content:
        lang === 'ru'
          ? 'В релизе Python 3.13 внедрен экспериментальный JIT-компилятор, который существенно ускоряет выполнение математических и вычислительных задач. Платформа Mintera полностью поддерживает новейшие стандарты Python 3.12 и 3.13 при локальной проверке заданий.'
          : lang === 'kr'
          ? 'Python 3.13 релисида JIT экспериментал компилятори жорий этилди. Бу дастурлар ишлаш тезлигини оширади. Mintera платформаси ўқувчилар кодини текширишда энг сўнгги Python 3.12 ва 3.13 стандартларига мослаштирилган.'
          : 'Python 3.13 relizida JIT eksperimental kompilyatori joriy etildi. Bu dasturlar ishlash tezligini sezilarli darajada oshiradi. Mintera platformasi o‘quvchilar kodini tekshirishda eng so‘nggi Python 3.12 va 3.13 standartlariga to‘liq moslashtirilgan.',
      image:
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'news-2',
      tag: 'Frontend',
      date: lang === 'ru' ? '25 февраля 2025' : '25-Fevral, 2025',
      title:
        lang === 'ru'
          ? 'Тренды веб-разработки 2026: React 19, адаптивный UI и сверхбыстрый Vite'
          : lang === 'kr'
          ? 'Frontend дастурлашда 2026-йилги энг талабгор фреймворклар'
          : 'Frontend dasturlashda 2026-yilgi eng talabgor freymvorklar',
      excerpt:
        lang === 'ru'
          ? 'Анализ современных инструментов разработки для создания кросс-платформенных и адаптивных интерфейсов нового поколения.'
          : lang === 'kr'
          ? 'React 19, Next.js ва замонавий web технологиялари бўйича глобал бозор таҳлили ва кўникмалар талаби.'
          : 'React 19, Next.js va zamonaviy web texnologiyalari bo‘yicha global bozor tahlili va ko‘nikmalar talabi.',
      content:
        lang === 'ru'
          ? 'Веб-панель управления Mintera построена на базе новейших технологий React и Tailwind CSS, что гарантирует мгновенный отклик и комфортную работу как с ПК, так и со смартфонов и планшетов.'
          : lang === 'kr'
          ? 'Mintera веб-платформаси React ва Tailwind CSS каби илғор технологиялар устига қурилган бўлиб, ўқитувчилар учун ҳар қандай смартфон ва планшетда ишлайди.'
          : 'Mintera web platformasi ham ilg‘or React va Tailwind texnologiyalari ustiga qurilgan bo‘lib, o‘qituvchi va ma’murlar uchun qulay, har qanday smartfon va planshetga moslashuvchan boshqaruvni taqdim etadi.',
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'news-3',
      tag: 'Algoritmlar',
      date: lang === 'ru' ? '20 февраля 2025' : '20-Fevral, 2025',
      title:
        lang === 'ru'
          ? '5 типичных ошибок при изучении алгоритмов и решении олимпиадных задач'
          : lang === 'kr'
          ? 'Алгоритмларни ўрганишда энг кенг тарқалган 5 та хато'
          : 'Algoritmlarni o‘rganishda eng keng tarqalgan 5 ta xato',
      excerpt:
        lang === 'ru'
          ? 'Советы для успешного прохождения технических собеседований и алгоритмических соревнований.'
          : lang === 'kr'
          ? 'Техник суҳбатлар ва кодлаш мусобақаларига тайёргарлик кўришда эътибор қаратиш лозим бўлган муҳим қоидалар.'
          : 'Texnik suhbatlar va kodlash musobaqalariga tayyorgarlik ko‘rishda e’tibor qaratish lozim bo‘lgan muhim qoidalar.',
      content:
        lang === 'ru'
          ? 'Частые ошибки начинающих: игнорирование краевых условий (edge cases), недостаточный анализ сложности Big-O и отсутствие стресс-тестирования. Mintera автоматически тестирует код на скрытых наборах данных.'
          : lang === 'kr'
          ? 'Мусобақаларда энг кўп учрайдиган хатолар: чекка ҳолатларни ҳисобга олмаслик ва вақт мураккаблигини таҳлил қилмаслик. Mintera автоматлаштирилган тест тизими буни холис текширади.'
          : 'Dasturlash musobaqalarida eng ko‘p uchraydigan xatolar: chekka holatlarni (edge cases) hisobga olmaslik va vaqt murakkabligini tahlil qilmaslik. Mintera avtomatlashtirilgan tizimi buni xolis baholaydi.',
      image:
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleDownload = (fileName = 'Mintera-Setup.zip') => {
    setDownloadedFileName(fileName);
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div
      className={`min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#070D1E] text-slate-100' : 'bg-[#FAFAFC] text-slate-900'
      }`}
    >
      {/* 1. FIXED TOP NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
          theme === 'dark'
            ? 'bg-[#0B1120]/90 border-slate-800 shadow-[0_1px_12px_rgba(0,0,0,0.5)]'
            : 'bg-white/90 border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#091128] border border-blue-500/30 flex items-center justify-center p-1.5 shadow-md shadow-blue-500/10 group-hover:scale-105 transition">
              <img src="/icon.png" alt="Mintera" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <span
                className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                Min<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500">tera</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                CodePractice
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                : 'bg-slate-100/80 border-slate-200/60 text-slate-600'
            }`}
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                theme === 'dark' ? 'text-white bg-slate-800 shadow-xs' : 'text-blue-700 bg-white shadow-xs'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => scrollTo('about-app')}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:text-blue-500 transition"
            >
              {t.nav.aboutApp}
            </button>
            <button
              onClick={() => scrollTo('news')}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:text-blue-500 transition"
            >
              {t.nav.news}
            </button>
            <button
              onClick={() => scrollTo('about-us')}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:text-blue-500 transition"
            >
              {t.nav.aboutUs}
            </button>
          </nav>

          {/* Right Action Controls: Download, Language, Dark/Light Mode, Portal */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Download CTA Button */}
            <button
              onClick={() => handleDownload('Mintera-Setup.zip')}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 flex-shrink-0 animate-bounce" />
              <span className="hidden sm:inline">{t.nav.download}</span>
              <span className="sm:hidden">ZIP</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Tilni tanlash / Выбор языка"
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span className="uppercase font-mono text-[11px] sm:text-xs">
                  {lang === 'uz' ? 'O‘ZB' : lang === 'ru' ? 'РУС' : 'ЎЗБ'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-2xl border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    theme === 'dark'
                      ? 'bg-[#0F172A] border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <button
                    onClick={() => changeLanguage('uz')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-blue-600/10 hover:text-blue-600 transition ${
                      lang === 'uz' ? 'text-blue-600 font-bold bg-blue-50/60 dark:bg-blue-950/40' : ''
                    }`}
                  >
                    <span>🇺🇿 O‘zbekcha</span>
                    {lang === 'uz' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => changeLanguage('ru')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-blue-600/10 hover:text-blue-600 transition ${
                      lang === 'ru' ? 'text-blue-600 font-bold bg-blue-50/60 dark:bg-blue-950/40' : ''
                    }`}
                  >
                    <span>🇷🇺 Русский</span>
                    {lang === 'ru' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => changeLanguage('kr')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-blue-600/10 hover:text-blue-600 transition ${
                      lang === 'kr' ? 'text-blue-600 font-bold bg-blue-50/60 dark:bg-blue-950/40' : ''
                    }`}
                  >
                    <span>🇺🇿 Ўзбекча</span>
                    {lang === 'kr' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 sm:px-2.5 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-400 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={theme === 'dark' ? 'Kunduzgi rejimga o‘tish' : 'Tungi rejimga o‘tish'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline text-slate-200 text-xs">{t.nav.themeLight}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span className="hidden md:inline text-slate-700 text-xs">{t.nav.themeDark}</span>
                </>
              )}
            </button>

            {/* Discreet Portal / Login Button (Without showing full name) */}
            {currentUser ? (
              <button
                onClick={onGoToDashboard}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                title={t.nav.dashboard}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500 dark:bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden xl:inline">{t.nav.dashboard}</span>
              </button>
            ) : (
              <button
                onClick={onGoToLogin}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl border font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={t.nav.login}
              >
                <LogIn className="w-4 h-4 text-blue-500" />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition ${
                theme === 'dark' ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-b px-6 py-4 space-y-2.5 shadow-xl animate-fade-in ${
              theme === 'dark' ? 'bg-[#0B1120] border-slate-800 text-slate-200' : 'bg-white border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-700'
              }`}
            >
              <span>{t.nav.home}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('about-app')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-500/10 flex items-center justify-between"
            >
              <span>{t.nav.aboutApp}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('news')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-500/10 flex items-center justify-between"
            >
              <span>{t.nav.news}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('about-us')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-500/10 flex items-center justify-between"
            >
              <span>{t.nav.aboutUs}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Mobile Language Switcher Pills */}
            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Til:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeLanguage('uz')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    lang === 'uz' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  O‘zb
                </button>
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    lang === 'ru' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Рус
                </button>
                <button
                  onClick={() => changeLanguage('kr')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    lang === 'kr' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Ўзб
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleDownload('Mintera-Setup.zip')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20"
              >
                <Download className="w-4 h-4" />
                <span>{t.nav.download}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser) {
                    onGoToDashboard?.();
                  } else {
                    onGoToLogin();
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
                }`}
              >
                <LogIn className="w-4 h-4 text-blue-500" />
                <span>{currentUser ? t.nav.dashboard : t.nav.login}</span>
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
          <div
            className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[400px] blur-3xl pointer-events-none -z-10 ${
              theme === 'dark'
                ? 'bg-gradient-to-b from-blue-900/40 via-indigo-900/20 to-transparent'
                : 'bg-gradient-to-b from-blue-200/50 via-indigo-100/30 to-transparent'
            }`}
          />
          <div
            className={`absolute top-40 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none -z-10 ${
              theme === 'dark' ? 'bg-amber-600/15' : 'bg-amber-200/30'
            }`}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading, Text & Action Buttons */}
              <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-5">
                {/* OS Platform Pill */}
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs ${
                    theme === 'dark'
                      ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                      : 'bg-blue-50 text-blue-800 border border-blue-200/60'
                  }`}
                >
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span>{t.hero.osPill}</span>
                </div>

                {/* Main Heading */}
                <h1
                  className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.hero.title1}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500">
                    {t.hero.title2}
                  </span>
                </h1>

                {/* Description */}
                <p
                  className={`text-base sm:text-lg max-w-xl leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {t.hero.desc}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownload('Mintera-Setup.zip')}
                    className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5" />
                    <span>{t.hero.downloadBtn}</span>
                  </button>
                  <button
                    onClick={() => scrollTo('about-app')}
                    className={`inline-flex items-center justify-center gap-2 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border shadow-xs transition cursor-pointer w-full sm:w-auto ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Info className="w-5 h-5 text-blue-500" />
                    <span>{t.hero.moreBtn}</span>
                  </button>
                </div>

                {/* Supporting Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs font-semibold">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-100/80 border-slate-200/60 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {t.hero.version}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-100/80 border-slate-200/60 text-slate-600'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {t.hero.free}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-100/80 border-slate-200/60 text-slate-600'
                    }`}
                  >
                    <WifiOff className="w-4 h-4 text-blue-500" />
                    {t.hero.offline}
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Visual Graphic & Editor Card */}
              <div className="lg:col-span-5 relative">
                <div
                  className={`relative rounded-2xl shadow-2xl border overflow-hidden p-4 sm:p-5 transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-[#0E1528] border-slate-800'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  {/* Mock terminal header */}
                  <div className="flex items-center justify-between pb-3 mb-3 bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-300 font-mono ml-2">{t.simulator.activeTest}</span>
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
                          {t.simulator.autoCheck}
                        </div>
                        <div className="text-lg font-extrabold flex items-center gap-2">
                          <span>{t.simulator.coverage}</span>
                          <span className="text-xs bg-emerald-500/80 text-white px-2 py-0.5 rounded-full">
                            {t.simulator.statusPassed}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Code Snippet Box */}
                  <div className="bg-slate-950 rounded-xl p-4 font-mono text-[12px] sm:text-[13px] leading-relaxed text-slate-200 border border-slate-800 shadow-inner">
                    <div className="flex justify-between text-slate-400 text-[11px] mb-2 font-sans font-semibold uppercase tracking-wider border-b border-slate-800 pb-1.5">
                      <span className="text-blue-400">{t.simulator.taskTitle}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {t.simulator.passed}
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
                        {t.simulator.specs}
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
        <section
          className={`w-full py-16 sm:py-24 border-y transition-colors duration-200 ${
            theme === 'dark' ? 'bg-[#0B1120] border-slate-800' : 'bg-slate-100/70 border-slate-200/60'
          }`}
          id="about-app"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center max-w-2xl mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold text-xs uppercase tracking-wider mb-3 border border-blue-500/20">
                <Laptop className="w-3.5 h-3.5" />
                {t.aboutApp.pill}
              </span>
              <h2
                className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t.aboutApp.title}
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.aboutApp.desc}
              </p>
            </div>

            {/* 3 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full mb-16">
              {/* Feature 1 */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border shadow-xs flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md ${
                  theme === 'dark' ? 'bg-[#0E1528] border-slate-800' : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t.aboutApp.f1Title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.aboutApp.f1Desc}
                </p>
              </div>

              {/* Feature 2 */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border shadow-xs flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md ${
                  theme === 'dark' ? 'bg-[#0E1528] border-slate-800' : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t.aboutApp.f2Title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.aboutApp.f2Desc}
                </p>
              </div>

              {/* Feature 3 */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border shadow-xs flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md ${
                  theme === 'dark' ? 'bg-[#0E1528] border-slate-800' : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t.aboutApp.f3Title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.aboutApp.f3Desc}
                </p>
              </div>
            </div>

            {/* Desktop App Mockup Showcase */}
            <div
              className={`w-full max-w-5xl rounded-2xl shadow-xl border overflow-hidden mb-16 transition-colors duration-200 ${
                theme === 'dark' ? 'bg-[#0E1528] border-slate-800' : 'bg-white border-slate-200/80'
              }`}
            >
              {/* Mockup Window Bar */}
              <div className="bg-slate-950 px-4 sm:px-6 py-3 flex items-center justify-between text-white border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="text-xs text-slate-300 font-mono font-semibold">Mintera Desktop — v2.4.0</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono font-bold">
                    🛡️ Protected Exam Mode
                  </span>
                </div>
              </div>

              {/* Window Content */}
              <div className="p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex flex-col gap-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-500">
                      {t.aboutApp.mockupTag}
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {t.aboutApp.mockupTitle}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t.aboutApp.mockupDesc}
                    </p>

                    <div className="flex flex-col gap-2.5 pt-2 text-xs sm:text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{t.aboutApp.p1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{t.aboutApp.p2}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{t.aboutApp.p3}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{t.aboutApp.p4}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 shadow-lg border border-slate-800 aspect-video flex items-center justify-center p-4">
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
              className={`flex flex-col items-center gap-4 text-center max-w-2xl p-8 sm:p-12 rounded-3xl border shadow-xl transition-colors duration-200 ${
                theme === 'dark' ? 'bg-[#0E1528] border-slate-800 text-white' : 'bg-white border-slate-200/90 text-slate-900'
              }`}
              id="download-section"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <Download className="w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                {t.downloadSection.title}
              </h3>
              <p className={`text-xs sm:text-sm max-w-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.downloadSection.desc}
              </p>

              {/* Direct Download Options */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
                <button
                  onClick={() => handleDownload('Mintera-Setup.zip')}
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>{t.downloadSection.btnZip}</span>
                </button>
                <button
                  onClick={() => handleDownload('Mintera-Setup.exe')}
                  className={`inline-flex items-center gap-2 font-semibold text-sm px-5 py-3.5 rounded-xl border transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <FolderArchive className="w-4 h-4 text-blue-500" />
                  <span>{t.downloadSection.btnExe}</span>
                </button>
                <button
                  onClick={() => handleDownload('Mintera.exe')}
                  className={`inline-flex items-center gap-2 font-semibold text-sm px-5 py-3.5 rounded-xl border transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <FileCode2 className="w-4 h-4 text-blue-500" />
                  <span>{t.downloadSection.btnPortable}</span>
                </button>
              </div>

              {/* OS Icons Support indicator */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400 text-xs font-semibold pt-3">
                <div className="flex items-center gap-1.5 hover:text-blue-500 transition">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <span>Windows (x64) • 10 / 11</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1.5 hover:text-blue-500 transition">
                  <Laptop className="w-4 h-4 text-slate-400" />
                  <span>macOS (Apple Silicon / Intel)</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1.5 hover:text-blue-500 transition">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span>Linux (.deb / AppImage)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROGRAMMING NEWS (SO‘NGGI YANGILIKLAR) */}
        <section className={`w-full py-16 sm:py-24 transition-colors duration-200 ${theme === 'dark' ? 'bg-[#070D1E]' : 'bg-white'}`} id="news">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center max-w-2xl mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold text-xs uppercase tracking-wider mb-3 border border-blue-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                {t.news.pill}
              </span>
              <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t.news.title}
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t.news.desc}
              </p>
            </div>

            {/* 3 News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full mb-12">
              {newsList.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-2xl border shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer ${
                    theme === 'dark' ? 'bg-[#0E1528] border-slate-800' : 'bg-white border-slate-200/80'
                  }`}
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-blue-400 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-700 shadow-xs">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      <h3
                        className={`text-base font-bold leading-snug line-clamp-2 transition ${
                          theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500 group-hover:text-blue-400 pt-2 transition">
                      <span>{t.news.readMore}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ABOUT US (BIZ HAQIMIZDA) */}
        <section
          className={`w-full py-16 sm:py-24 border-t transition-colors duration-200 ${
            theme === 'dark' ? 'bg-[#0B1120] border-slate-800' : 'bg-slate-50 border-slate-200/70'
          }`}
          id="about-us"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="bg-gradient-to-br from-slate-950 via-[#0B1736] to-slate-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-blue-900/30">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/20">
                  <Shield className="w-3.5 h-3.5" />
                  {t.aboutUs.pill}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  {t.aboutUs.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  {t.aboutUs.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">100+</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.aboutUs.stat1}</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">0.02s</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.aboutUs.stat2}</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.aboutUs.stat3}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="w-full bg-[#030611] text-white border-t border-slate-800">
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
                {t.footer.desc}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                {t.footer.quickLinks}
              </span>
              <nav className="flex flex-col gap-2 text-xs sm:text-sm text-slate-400">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-left hover:text-white transition"
                >
                  {t.nav.home}
                </button>
                <button onClick={() => scrollTo('about-app')} className="text-left hover:text-white transition">
                  {t.nav.aboutApp}
                </button>
                <button onClick={() => scrollTo('download-section')} className="text-left hover:text-white transition">
                  {t.nav.download}
                </button>
                <button onClick={() => scrollTo('news')} className="text-left hover:text-white transition">
                  {t.nav.news}
                </button>
                <button onClick={() => scrollTo('about-us')} className="text-left hover:text-white transition">
                  {t.nav.aboutUs}
                </button>
              </nav>
            </div>

            {/* Social & Admin Portal */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                {t.footer.contact}
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
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold pt-1 transition text-left cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.footer.adminPanel}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>{t.footer.rights}</p>
            <div className="flex items-center gap-4">
              <span>v2.4.0 Desktop Release</span>
              <span>•</span>
              <button
                onClick={() => handleDownload('Mintera-Setup.zip')}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Mintera-Setup.zip
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* NEWS DETAILS MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border animate-fade-in relative max-h-[90vh] overflow-y-auto ${
              theme === 'dark' ? 'bg-[#0E1528] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              {selectedNews.tag}
            </span>
            <div className="text-xs text-slate-400 mb-2">{selectedNews.date}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 leading-snug">
              {selectedNews.title}
            </h3>

            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5 bg-slate-900">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>

            <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {selectedNews.content}
            </p>

            <button
              onClick={() => setSelectedNews(null)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition cursor-pointer"
            >
              {t.news.close}
            </button>
          </div>
        </div>
      )}

      {/* DOWNLOAD CONFIRMATION MODAL / TOAST */}
      {downloadSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border text-center animate-fade-in ${
              theme === 'dark' ? 'bg-[#0E1528] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">
              {t.modal.title}
            </h3>
            <div
              className={`text-xs sm:text-sm mb-6 leading-relaxed text-left p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
              }`}
            >
              <span className="font-bold text-blue-400 block mb-1">
                📦 {downloadedFileName} {t.modal.downloading}
              </span>
              <span className={`font-bold block mt-2 mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {t.modal.stepsTitle}
              </span>
              {t.modal.step1}
              <br />
              {t.modal.step2}
              <br />
              {t.modal.step3}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setDownloadSuccessModal(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                {t.modal.closeBtn}
              </button>
              <div className="flex items-center justify-center gap-2 pt-2 text-xs">
                <button
                  onClick={() => handleDownload('Mintera-Setup.exe')}
                  className="text-slate-400 hover:text-blue-400 underline cursor-pointer"
                >
                  {t.downloadSection.btnExe}
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => handleDownload('Mintera.exe')}
                  className="text-slate-400 hover:text-blue-400 underline cursor-pointer"
                >
                  {t.downloadSection.btnPortable}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
