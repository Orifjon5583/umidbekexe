import {
  User,
  Group,
  GroupWithMembers,
  Problem,
  Assignment,
  TeacherDashboardStats,
} from '@codepractice/shared-types';

export const MOCK_TEACHER_USER: User = {
  id: 't-1',
  fullName: 'Anvar Qodirov',
  username: 'teacher1',
  role: 'teacher',
  isActive: true,
  createdAt: '2026-09-01T08:00:00Z',
  updatedAt: '2026-10-29T10:00:00Z',
};

export const MOCK_ADMIN_USER: User = {
  id: 'a-1',
  fullName: 'Tizim Administratori',
  username: 'admin',
  role: 'admin',
  isActive: true,
  createdAt: '2026-09-01T08:00:00Z',
  updatedAt: '2026-10-29T10:00:00Z',
};

export const MOCK_STUDENTS: User[] = [
  { id: 's-1', fullName: 'Aliyev Jasur', username: 'jasur_a', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 's-2', fullName: 'Karimova Malika', username: 'malika_k', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 's-3', fullName: 'Saidov Bobur', username: 'bobur_s', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 's-4', fullName: 'Rustamova Nodira', username: 'nodira_r', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 's-5', fullName: 'Toshmatov Otabek', username: 'otabek_t', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 's-6', fullName: 'Yusupova Diyora', username: 'diyora_y', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 's-7', fullName: 'Xalilov Sardor', username: 'sardor_x', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 's-8', fullName: 'Mamatov Aziz', username: 'aziz_m', role: 'student', isActive: true, createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
];

export const INITIAL_GROUPS: Group[] = [
  { id: 'g-1', name: 'Guruh-101 (Python Asoslari)', studentCount: 18, activeAssignmentsCount: 2, telegramChatId: '-100192837482', createdAt: '2026-09-01T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 'g-2', name: 'Guruh-102 (C++ Algoritmlar)', studentCount: 16, activeAssignmentsCount: 1, telegramChatId: '-100183749201', createdAt: '2026-09-10T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
  { id: 'g-3', name: 'Guruh-103 (Olimpiada dasturlash)', studentCount: 14, activeAssignmentsCount: 1, telegramChatId: '-100174829103', createdAt: '2026-09-15T08:00:00Z', updatedAt: '2026-10-29T10:00:00Z' },
];

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'p-1',
    title: 'A + B Yig‘indisi',
    statement: 'Ikkita butun son A va B berilgan. Ularning yig‘indisini hisoblovchi dastur tuzing.',
    inputDescription: 'Bitta qatorda probel bilan ajratilgan ikkita butun son: A va B (-10^9 <= A, B <= 10^9).',
    outputDescription: 'A va B sonlarining yig‘indisini chiqaring.',
    sampleInput: '5 7',
    sampleOutput: '12',
    language: 'python',
    difficulty: 'easy',
    timeLimitMs: 2000,
    memoryLimitMb: 128,
    version: 1,
    isActive: true,
    createdBy: 't-1',
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
    testCases: [
      { id: 'tc-1', problemId: 'p-1', inputData: '5 7', expectedOutput: '12', isHidden: false, orderIndex: 1 },
      { id: 'tc-2', problemId: 'p-1', inputData: '-3 8', expectedOutput: '5', isHidden: false, orderIndex: 2 },
      { id: 'tc-3', problemId: 'p-1', inputData: '1000 2500', expectedOutput: '3500', isHidden: true, orderIndex: 3 },
    ],
  },
  {
    id: 'p-2',
    title: 'Uchta sondan kattasi',
    statement: 'Uchta butun son berilgan. Ularning orasidagi eng katta qiymatni toping.',
    inputDescription: 'Bitta qatorda uchta butun son a, b, c (-10^5 <= a,b,c <= 10^5).',
    outputDescription: 'Eng katta sonni ekranga chiqaring.',
    sampleInput: '14 99 42',
    sampleOutput: '99',
    language: 'python',
    difficulty: 'easy',
    timeLimitMs: 2000,
    memoryLimitMb: 128,
    version: 1,
    isActive: true,
    createdBy: 't-1',
    createdAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
    testCases: [
      { id: 'tc-21', problemId: 'p-2', inputData: '14 99 42', expectedOutput: '99', isHidden: false, orderIndex: 1 },
      { id: 'tc-22', problemId: 'p-2', inputData: '-5 -1 -10', expectedOutput: '-1', isHidden: false, orderIndex: 2 },
      { id: 'tc-23', problemId: 'p-2', inputData: '7 7 7', expectedOutput: '7', isHidden: true, orderIndex: 3 },
    ],
  },
  {
    id: 'p-3',
    title: 'Tub sonni tekshirish',
    statement: 'Berilgan N natural sonining tub yoki tub emasligini tekshiring.',
    inputDescription: 'Bitta natural son N (1 <= N <= 10^9).',
    outputDescription: 'Agar N tub bo‘lsa "YES", aks holda "NO" chiqaring.',
    sampleInput: '17',
    sampleOutput: 'YES',
    language: 'cpp',
    difficulty: 'medium',
    timeLimitMs: 1500,
    memoryLimitMb: 128,
    version: 1,
    isActive: true,
    createdBy: 't-1',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
    testCases: [
      { id: 'tc-31', problemId: 'p-3', inputData: '17', expectedOutput: 'YES', isHidden: false, orderIndex: 1 },
      { id: 'tc-32', problemId: 'p-3', inputData: '24', expectedOutput: 'NO', isHidden: false, orderIndex: 2 },
      { id: 'tc-33', problemId: 'p-3', inputData: '1', expectedOutput: 'NO', isHidden: true, orderIndex: 3 },
    ],
  },
  {
    id: 'p-4',
    title: 'Palindrom satr',
    statement: 'Berilgan satr chapdan o‘ngga va o‘ngdan chapga bir xil o‘qiladimi yoki yo‘qligini aniqlang.',
    inputDescription: 'Kichik lotin harflaridan iborat satr S (uzunligi 1 dan 10^5 gacha).',
    outputDescription: 'Palindrom bo‘lsa "YES", aks holda "NO".',
    sampleInput: 'radar',
    sampleOutput: 'YES',
    language: 'python',
    difficulty: 'medium',
    timeLimitMs: 2000,
    memoryLimitMb: 128,
    version: 1,
    isActive: true,
    createdBy: 't-1',
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
  },
  {
    id: 'p-5',
    title: 'Massiv elementlari yig‘indisi',
    statement: 'N ta butun sondan iborat massiv berilgan. Barcha juft elementlar yig‘indisini hisoblang.',
    inputDescription: 'Birinchi qatorda N (1 <= N <= 10^5). Ikkinchi qatorda N ta butun son.',
    outputDescription: 'Juft sonlar yig‘indisini chiqaring.',
    sampleInput: '5\n2 3 4 5 6',
    sampleOutput: '12',
    language: 'cpp',
    difficulty: 'medium',
    timeLimitMs: 1500,
    memoryLimitMb: 128,
    version: 1,
    isActive: true,
    createdBy: 't-1',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
  },
  {
    id: 'p-6',
    title: 'Faktorial va oxiridagi nollar',
    statement: 'N! (N faktorial) sonining oxirida nechta nol borligini hisoblang.',
    inputDescription: 'Bitta butun son N (1 <= N <= 10^9).',
    outputDescription: 'Oxiridagi nollar sonini chiqaring.',
    sampleInput: '25',
    sampleOutput: '6',
    language: 'python',
    difficulty: 'hard',
    timeLimitMs: 2000,
    memoryLimitMb: 128,
    version: 1,
    isActive: true,
    createdBy: 't-1',
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a-1',
    title: '1-Mavzu: Boshlang‘ich hisoblash va A+B masalasi',
    description: 'Python asoslari bo‘yicha ilk amaliy mashq. Kiritish-chiqarish operatorlarini o‘zlashtirish.',
    groupId: 'g-1',
    groupName: 'Guruh-101 (Python Asoslari)',
    startsAt: '2026-10-20T08:00:00.000Z',
    dueAt: '2026-11-05T23:59:00.000Z',
    status: 'published',
    createdBy: 't-1',
    createdAt: '2026-10-20T08:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z',
    totalProblems: 2,
    progressPercentage: 85,
    studentStatus: 'in_progress',
  },
  {
    id: 'a-2',
    title: '2-Mavzu: Shartli operatorlar va taqqoslash',
    description: 'If-else shart operatorlari va mantiqiy amallar bo‘yicha amaliy topshiriqlar to‘plami.',
    groupId: 'g-1',
    groupName: 'Guruh-101 (Python Asoslari)',
    startsAt: '2026-10-25T08:00:00.000Z',
    dueAt: '2026-11-08T23:59:00.000Z',
    status: 'published',
    createdBy: 't-1',
    createdAt: '2026-10-25T08:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z',
    totalProblems: 2,
    progressPercentage: 60,
    studentStatus: 'in_progress',
  },
  {
    id: 'a-3',
    title: 'C++ Standart kutubxona va massivlar bilan ishlash',
    description: 'C++20 da massivlar, ko‘rsatkichlar va vektorlar bilan amaliy topshiriqlar.',
    groupId: 'g-2',
    groupName: 'Guruh-102 (C++ Algoritmlar)',
    startsAt: '2026-10-22T08:00:00.000Z',
    dueAt: '2026-11-10T23:59:00.000Z',
    status: 'published',
    createdBy: 't-1',
    createdAt: '2026-10-22T08:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z',
    totalProblems: 2,
    progressPercentage: 45,
    studentStatus: 'in_progress',
  },
  {
    id: 'a-4',
    title: 'Olimpiada saralash: Sonlar nazariyasi',
    description: 'Tub sonlar, tub ko‘paytuvchilar va modulli arifmetika masalalari.',
    groupId: 'g-3',
    groupName: 'Guruh-103 (Olimpiada dasturlash)',
    startsAt: '2026-10-24T08:00:00.000Z',
    dueAt: '2026-11-02T23:59:00.000Z',
    status: 'published',
    createdBy: 't-1',
    createdAt: '2026-10-24T08:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z',
    totalProblems: 3,
    progressPercentage: 70,
    studentStatus: 'in_progress',
  },
];

export const MOCK_DASHBOARD_STATS: TeacherDashboardStats = {
  totalStudents: 48,
  activeAssignments: 4,
  completedAssignments: 112,
  overdueAssignments: 3,
  recentSubmissions: [
    {
      id: 'sub-1',
      studentName: 'Aliyev Jasur',
      groupName: 'Guruh-101 (Python Asoslari)',
      assignmentTitle: '1-Mavzu: Boshlang‘ich hisoblash',
      problemTitle: 'A + B Yig‘indisi',
      status: 'accepted',
      passedTests: 10,
      totalTests: 10,
      submittedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-2',
      studentName: 'Karimova Malika',
      groupName: 'Guruh-101 (Python Asoslari)',
      assignmentTitle: '2-Mavzu: Shartli operatorlar',
      problemTitle: 'Uchta sondan kattasi',
      status: 'accepted',
      passedTests: 10,
      totalTests: 10,
      submittedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-3',
      studentName: 'Saidov Bobur',
      groupName: 'Guruh-102 (C++ Algoritmlar)',
      assignmentTitle: 'C++ Standart kutubxona',
      problemTitle: 'Tub sonni tekshirish',
      status: 'wrong_answer',
      passedTests: 7,
      totalTests: 10,
      submittedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-4',
      studentName: 'Rustamova Nodira',
      groupName: 'Guruh-102 (C++ Algoritmlar)',
      assignmentTitle: 'C++ Standart kutubxona',
      problemTitle: 'Massiv elementlari yig‘indisi',
      status: 'accepted',
      passedTests: 10,
      totalTests: 10,
      submittedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-5',
      studentName: 'Toshmatov Otabek',
      groupName: 'Guruh-103 (Olimpiada dasturlash)',
      assignmentTitle: 'Olimpiada saralash',
      problemTitle: 'Faktorial va oxiridagi nollar',
      status: 'compile_error',
      passedTests: 0,
      totalTests: 10,
      submittedAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-6',
      studentName: 'Yusupova Diyora',
      groupName: 'Guruh-101 (Python Asoslari)',
      assignmentTitle: '2-Mavzu: Shartli operatorlar',
      problemTitle: 'Palindrom satr',
      status: 'accepted',
      passedTests: 10,
      totalTests: 10,
      submittedAt: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    },
  ],
};

export interface TeacherRecord {
  id: string;
  fullName: string;
  username: string;
  email?: string;
  subject: string;
  assignedGroups: string[];
  studentCount: number;
  isActive: boolean;
  createdAt: string;
}

export const INITIAL_TEACHERS: TeacherRecord[] = [
  {
    id: 't-1',
    fullName: 'Anvar Qodirov',
    username: 'teacher1',
    email: 'anvar.qodirov@mintera.uz',
    subject: 'Python va Algoritmlar',
    assignedGroups: ['Guruh-101 (Python Asoslari)'],
    studentCount: 18,
    isActive: true,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 't-2',
    fullName: 'Dilnoza Karimova',
    username: 'dilnoza_k',
    email: 'dilnoza.karimova@mintera.uz',
    subject: 'C++ va Algoritmlar',
    assignedGroups: ['Guruh-102 (C++ Algoritmlar)'],
    studentCount: 16,
    isActive: true,
    createdAt: '2026-09-15T08:00:00Z',
  },
  {
    id: 't-3',
    fullName: 'Sardorbek Rahimov',
    username: 'sardor_r',
    email: 'sardor.rahimov@mintera.uz',
    subject: 'Olimpiada dasturlash',
    assignedGroups: ['Guruh-103 (Olimpiada dasturlash)'],
    studentCount: 14,
    isActive: true,
    createdAt: '2026-10-01T08:00:00Z',
  },
];

export interface SystemSettingsData {
  appName: string;
  systemVersion: string;
  pythonEnabled: boolean;
  cppEnabled: boolean;
  javaEnabled: boolean;

  // AI & AI Plus sozlamalari
  aiMurabbiyEnabled: boolean;
  aiModelTier: 'standard' | 'plus'; // 'standard' (Flash) vs 'plus' (Gemini Pro / GPT-4o Plus)
  aiModelName: string;
  aiMaxTokensPerStudent: number;
  aiDailyRequestsLimit: number;
  aiAllowedGroups: string[]; // AI ruxsat berilgan guruhlar
  aiPlusGroups: string[]; // Kuchliroq AI Plus ajratilgan guruhlar
  aiCustomApiKey?: string;

  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
  strictClipboardBlock: boolean;
  requireFullscreenMode: boolean;
  serverRegion: string;
  backupStatus: string;
}

export const INITIAL_SYSTEM_SETTINGS: SystemSettingsData = {
  appName: 'Mintera Enterprise',
  systemVersion: 'v2.4 (Windows 11 + Web Panel)',
  pythonEnabled: true,
  cppEnabled: true,
  javaEnabled: false,
  aiMurabbiyEnabled: true,
  aiModelTier: 'plus',
  aiModelName: 'Gemini 1.5 Pro • Next-Gen AI Plus',
  aiMaxTokensPerStudent: 25000,
  aiDailyRequestsLimit: 40,
  aiAllowedGroups: ['Guruh-101 (Python Asoslari)', 'Guruh-102 (C++ Algoritmlar)', 'Guruh-103 (Olimpiada dasturlash)'],
  aiPlusGroups: ['Guruh-101 (Python Asoslari)', 'Guruh-102 (C++ Algoritmlar)'],
  aiCustomApiKey: '',
  defaultTimeLimitMs: 2000,
  defaultMemoryLimitMb: 128,
  strictClipboardBlock: true,
  requireFullscreenMode: true,
  serverRegion: 'AWS eu-central-1 (Frankfurt)',
  backupStatus: 'Har kuni 04:00 da avtomatik zaxira olinadi',
};

export interface SecurityLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: 'student' | 'teacher' | 'admin' | 'guest';
  eventType:
    | 'clipboard_violation'
    | 'window_blur'
    | 'sandbox_violation'
    | 'login_success'
    | 'failed_login'
    | 'assignment_create'
    | 'settings_change';
  severity: 'danger' | 'warning' | 'info' | 'success';
  details: string;
  ip: string;
}

export const INITIAL_SECURITY_LOGS: SecurityLogItem[] = [
  {
    id: 'log-0a',
    timestamp: '05.11.2026 16:45',
    user: 'student3 (Sardor Rustamov)',
    role: 'student',
    eventType: 'sandbox_violation',
    severity: 'danger',
    details: 'Python yechimida taqiqlangan "import os; os.system" chaqiruvi aniqlandi va Sandbox tomonidan darhol to‘xtatildi.',
    ip: '192.168.1.112',
  },
  {
    id: 'log-0b',
    timestamp: '05.11.2026 16:10',
    user: 'student2 (Malika Karimova)',
    role: 'student',
    eventType: 'window_blur',
    severity: 'warning',
    details: 'Imtihon paytida dastur oynasidan chiqish (Alt+Tab / boshqa oynaga o‘tish) aniqlandi.',
    ip: '192.168.1.108',
  },
  {
    id: 'log-1',
    timestamp: '01.11.2026 14:52',
    user: 'student1 (Jasur Aliyev)',
    role: 'student',
    eventType: 'clipboard_violation',
    severity: 'warning',
    details: 'Monaco kod muharririga tashqi matnni paste (Ctrl+V) qilishga urinish to‘xtatildi.',
    ip: '192.168.1.104',
  },
  {
    id: 'log-2',
    timestamp: '01.11.2026 14:30',
    user: 'teacher1 (Anvar Qodirov)',
    role: 'teacher',
    eventType: 'assignment_create',
    severity: 'info',
    details: 'Guruh-101 uchun yangi "2-Mavzu: Shartli operatorlar" topshirig‘i e’lon qilindi.',
    ip: '192.168.1.45',
  },
  {
    id: 'log-3',
    timestamp: '01.11.2026 14:15',
    user: 'admin (Tizim Administratori)',
    role: 'admin',
    eventType: 'login_success',
    severity: 'info',
    details: 'Administrator boshqaruv tizimiga muvaffaqiyatli kirdi.',
    ip: '127.0.0.1',
  },
  {
    id: 'log-4',
    timestamp: '01.11.2026 12:40',
    user: 'teacher1 (Anvar Qodirov)',
    role: 'teacher',
    eventType: 'clipboard_violation',
    severity: 'warning',
    details: 'student1 (Jasur Aliyev) paroli o‘qituvchi tomonidan yangilandi.',
    ip: '192.168.1.45',
  },
  {
    id: 'log-5',
    timestamp: '01.11.2026 11:20',
    user: 'noma‘lum_mehmon',
    role: 'guest',
    eventType: 'failed_login',
    severity: 'danger',
    details: 'O‘qituvchi paneliga noto‘g‘ri parol orqali 3 marta kirishga urinish qayd etildi.',
    ip: '192.168.1.210',
  },
  {
    id: 'log-6',
    timestamp: '01.11.2026 09:05',
    user: 'admin (Tizim Administratori)',
    role: 'admin',
    eventType: 'settings_change',
    severity: 'success',
    details: 'AI murabbiy kvotasi va test vaqt chegaralari tekshirildi va saqlandi.',
    ip: '127.0.0.1',
  },
];
