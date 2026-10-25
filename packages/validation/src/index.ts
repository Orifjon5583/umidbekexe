import {
  UserRole,
  ProgrammingLanguage,
  ProblemDifficulty,
  AssignmentStatus,
  AIRequestType,
  SubmissionStatus
} from '@codepractice/shared-types';

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: ValidationErrorItem[];
  data?: T;
}

export function validateLogin(data: any): ValidationResult<{ username: string; password: string; rememberMe?: boolean }> {
  const errors: ValidationErrorItem[] = [];
  if (!data?.username || typeof data.username !== 'string' || data.username.trim().length < 3) {
    errors.push({ field: 'username', message: 'Foydalanuvchi nomi kamida 3 ta belgidan iborat bo‘lishi kerak' });
  }
  if (!data?.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' });
  }
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      username: data.username.trim(),
      password: data.password,
      rememberMe: Boolean(data.rememberMe)
    } : undefined
  };
}

export function validateCreateUser(data: any): ValidationResult<{
  fullName: string;
  username: string;
  password: string;
  role: UserRole;
}> {
  const errors: ValidationErrorItem[] = [];
  if (!data?.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'To‘liq ism kamida 2 ta belgidan iborat bo‘lishi kerak' });
  }
  if (!data?.username || typeof data.username !== 'string' || !/^[a-zA-Z0-9_.-]{3,30}$/.test(data.username)) {
    errors.push({ field: 'username', message: 'Login 3-30 ta belgi (harf, raqam, _, ., -) bo‘lishi kerak' });
  }
  if (!data?.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' });
  }
  const validRoles: UserRole[] = ['admin', 'teacher', 'student'];
  if (!data?.role || !validRoles.includes(data.role)) {
    errors.push({ field: 'role', message: 'Noto‘g‘ri rol tanlandi' });
  }
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      fullName: data.fullName.trim(),
      username: data.username.trim().toLowerCase(),
      password: data.password,
      role: data.role
    } : undefined
  };
}

export function validateProblem(data: any): ValidationResult<{
  title: string;
  statement: string;
  inputDescription: string;
  outputDescription: string;
  sampleInput: string;
  sampleOutput: string;
  language: ProgrammingLanguage;
  difficulty: ProblemDifficulty;
  timeLimitMs: number;
  memoryLimitMb: number;
}> {
  const errors: ValidationErrorItem[] = [];
  if (!data?.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Masala sarlavhasi kamida 3 ta belgidan iborat bo‘lishi kerak' });
  }
  if (!data?.statement || typeof data.statement !== 'string' || data.statement.trim().length < 10) {
    errors.push({ field: 'statement', message: 'Masala sharti kamida 10 ta belgidan iborat bo‘lishi kerak' });
  }
  const validLanguages: ProgrammingLanguage[] = ['python', 'cpp'];
  if (!data?.language || !validLanguages.includes(data.language)) {
    errors.push({ field: 'language', message: 'Faqat Python yoki C++ tanlanishi mumkin' });
  }
  const validDifficulties: ProblemDifficulty[] = ['easy', 'medium', 'hard'];
  if (!data?.difficulty || !validDifficulties.includes(data.difficulty)) {
    errors.push({ field: 'difficulty', message: 'Qiyinlik darajasi noto‘g‘ri' });
  }
  const timeLimit = Number(data?.timeLimitMs ?? 2000);
  if (isNaN(timeLimit) || timeLimit < 100 || timeLimit > 10000) {
    errors.push({ field: 'timeLimitMs', message: 'Vaqt chegarasi 100 ms dan 10000 ms gacha bo‘lishi kerak' });
  }
  const memLimit = Number(data?.memoryLimitMb ?? 128);
  if (isNaN(memLimit) || memLimit < 16 || memLimit > 1024) {
    errors.push({ field: 'memoryLimitMb', message: 'RAM chegarasi 16 MB dan 1024 MB gacha bo‘lishi kerak' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      title: data.title.trim(),
      statement: data.statement.trim(),
      inputDescription: String(data.inputDescription || ''),
      outputDescription: String(data.outputDescription || ''),
      sampleInput: String(data.sampleInput || ''),
      sampleOutput: String(data.sampleOutput || ''),
      language: data.language,
      difficulty: data.difficulty,
      timeLimitMs: timeLimit,
      memoryLimitMb: memLimit
    } : undefined
  };
}

export function validateAssignment(data: any): ValidationResult<{
  title: string;
  description: string;
  groupId: string;
  startsAt: string;
  dueAt: string;
  problemIds: string[];
}> {
  const errors: ValidationErrorItem[] = [];
  if (!data?.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Vazifa nomi kamida 3 ta belgi bo‘lishi kerak' });
  }
  if (!data?.groupId || typeof data.groupId !== 'string') {
    errors.push({ field: 'groupId', message: 'Guruh tanlanishi shart' });
  }
  if (!data?.startsAt || isNaN(Date.parse(data.startsAt))) {
    errors.push({ field: 'startsAt', message: 'Boshlanish sanasi noto‘g‘ri' });
  }
  if (!data?.dueAt || isNaN(Date.parse(data.dueAt))) {
    errors.push({ field: 'dueAt', message: 'Topshirish muddati noto‘g‘ri' });
  }
  if (data?.startsAt && data?.dueAt && new Date(data.dueAt) <= new Date(data.startsAt)) {
    errors.push({ field: 'dueAt', message: 'Topshirish muddati boshlanish vaqtidan keyin bo‘lishi kerak' });
  }
  if (!Array.isArray(data?.problemIds) || data.problemIds.length === 0) {
    errors.push({ field: 'problemIds', message: 'Kamida 1 ta masala tanlanishi kerak' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      title: data.title.trim(),
      description: String(data.description || ''),
      groupId: data.groupId,
      startsAt: new Date(data.startsAt).toISOString(),
      dueAt: new Date(data.dueAt).toISOString(),
      problemIds: data.problemIds
    } : undefined
  };
}
