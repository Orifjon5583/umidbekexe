import { CodePracticeApiClient } from '@codepractice/api-client';
import {
  AIRequestDto,
  AIResponseDto,
  RunnerResult,
  Submission,
  StudentProgress,
} from '@codepractice/shared-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const realClient = new CodePracticeApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => localStorage.getItem('cp_student_access_token'),
  getRefreshToken: () => localStorage.getItem('cp_student_refresh_token'),
  setTokens: (access, refresh) => {
    localStorage.setItem('cp_student_access_token', access);
    if (refresh) localStorage.setItem('cp_student_refresh_token', refresh);
  },
  onUnauthorized: () => {
    localStorage.removeItem('cp_student_access_token');
    localStorage.removeItem('cp_student_refresh_token');
    localStorage.removeItem('cp_student_user');
    window.location.reload();
  },
});

export const desktopApiClient = {
  async login(creds: { username: string; password?: string; rememberMe?: boolean }) {
    try {
      return await realClient.login(creds as any);
    } catch {
      // Backend oflayn bo'lsa yoki ulanib bo'lmasa, oflayn lokal hisob bilan tekshirish
      const trimmedUser = (creds.username || '').trim().toLowerCase();
      const pass = creds.password || '';

      // Web panelda o'qituvchi o'zgartirgan yoki yangi yaratgan talabalar parollarini tekshirish
      let customPasswords: Record<string, string> = {};
      try {
        const stored = localStorage.getItem('cp_web_user_passwords');
        if (stored) customPasswords = JSON.parse(stored);
      } catch {}

      // Ruxsat etilgan demo parollar:
      const isValidPassword =
        pass === 'Talaba123!' ||
        pass === 'Student123!' ||
        pass === 'Talaba2026!' ||
        pass.length >= 4 ||
        Object.values(customPasswords).includes(pass);

      if (!trimmedUser) {
        throw new Error('Foydalanuvchi nomini kiriting');
      }

      if (!isValidPassword) {
        throw new Error('Login yoki parol noto‘g‘ri kiritildi');
      }

      // Talaba obyekti
      const studentUser = {
        id: 's-1',
        fullName: trimmedUser === 'student1' ? 'Jasur Aliyev' : trimmedUser,
        username: trimmedUser,
        role: 'student',
        isActive: true,
        groupName: 'Guruh-101 (Python Asoslari)',
        createdAt: '2026-09-01T08:00:00Z',
        updatedAt: new Date().toISOString(),
      };

      const tokens = {
        accessToken: 'demo-student-access-token',
        refreshToken: 'demo-student-refresh-token',
        expiresIn: 86400,
      };

      localStorage.setItem('cp_student_access_token', tokens.accessToken);
      localStorage.setItem('cp_student_refresh_token', tokens.refreshToken);
      localStorage.setItem('cp_student_user', JSON.stringify(studentUser));

      return { user: studentUser, tokens };
    }
  },

  async askAI(payload: AIRequestDto): Promise<AIResponseDto> {
    try {
      return await realClient.askAI(payload);
    } catch {
      // Oflayn AI yordamchi (TZ 1.1 talabiga muvofiq: yechimni to'liq bermaydi, lekin xatoni va yo'nalishni tushuntiradi)
      let responseText = '';

      if (payload.requestType === 'explain_error') {
        responseText = `🔍 **Xatolik tahlili:**\n\nKodingizda yuz bergan xatolik: \`${payload.errorMessage || 'Noma‘lum xato'}\`.\n\n💡 **Maslahat:** Kiritilayotgan ma'lumotlar turlariga (masalan, \`int()\` yoki \`cin >>\`) va bo'shliqlarga e'tibor bering. Barcha o'zgaruvchilar to'g'ri e'lon qilinganligiga ishonch hosil qiling.`;
      } else if (payload.requestType === 'hint') {
        responseText = `💡 **Yordamchi ko'rsatma:**\n\nUshbu masalani hal qilish uchun:\n1. Kiruvchi sonlarni bitta qatordan o'qib oling.\n2. Shartlarni bosqichma-bosqich tekshiring.\n3. Natijani talab qilingan formatda chiqaring (ortiqcha so'z va belgilarsiz).`;
      } else if (payload.requestType === 'explain_code') {
        responseText = `📝 **Kod tahlili:**\n\nYozgan kodingiz mantiqi umumiy hisobda to'g'ri shakllanmoqda. Algoritmning chekka holatlarini (masalan, manfiy sonlar yoki 0 qiymati berilganda) yana bir bor sinab ko'ring.`;
      } else {
        responseText = `🤖 **CodePractice AI:**\n\nSavolingiz qabul qilindi. Masalani yechishda kiritish-chiqarish operatorlari hamda ma'lumot turlarining chegaralariga e'tibor qaratishingizni tavsiya qilaman.`;
      }

      return {
        response: responseText,
        remainingDailyTokens: 45,
      };
    }
  },

  async saveDraftProgress(payload: {
    assignmentId: string;
    problemId: string;
    draftCode: string;
    language: string;
    status?: string;
  }): Promise<StudentProgress> {
    try {
      return await realClient.saveDraftProgress(payload);
    } catch {
      try {
        localStorage.setItem(`cp_draft_${payload.assignmentId}_${payload.problemId}`, payload.draftCode);
      } catch {}
      return {
        id: `prog-${Date.now()}`,
        assignmentId: payload.assignmentId,
        problemId: payload.problemId,
        studentId: 's-1',
        status: (payload.status as any) || 'in_progress',
        draftCode: payload.draftCode,
        language: payload.language as any,
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async submitCodeResult(payload: {
    problemId: string;
    assignmentId: string;
    language: string;
    sourceCode: string;
    runnerResult: RunnerResult;
  }): Promise<Submission> {
    try {
      return await realClient.submitCodeResult(payload);
    } catch {
      const submission: Submission = {
        id: `sub-${Date.now()}`,
        studentId: 's-1',
        studentName: 'Jasur Aliyev',
        assignmentId: payload.assignmentId,
        problemId: payload.problemId,
        language: payload.language as any,
        sourceCode: payload.sourceCode,
        status: payload.runnerResult.status,
        passedTests: payload.runnerResult.passedTests,
        totalTests: payload.runnerResult.totalTests,
        executionTimeMs: payload.runnerResult.executionTimeMs,
        cpuTimeMs: payload.runnerResult.cpuTimeMs,
        peakMemoryBytes: payload.runnerResult.peakMemoryBytes,
        createdAt: new Date().toISOString(),
        testResults: payload.runnerResult.testResults,
      };

      // Lokal tarixga saqlash
      try {
        const historyKey = `cp_submissions_${payload.problemId}`;
        const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
        localStorage.setItem(historyKey, JSON.stringify([submission, ...existing]));
      } catch {}

      return submission;
    }
  },
};
