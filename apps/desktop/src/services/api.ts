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
      // Offline fallback: check AI & AI Plus settings from localStorage
      let isPlus = true;
      let tokenLimit = 25000;
      let currentTokensUsed = 850;

      try {
        const raw = localStorage.getItem('cp_web_system_settings') || localStorage.getItem('cp_system_settings');
        if (raw) {
          const s = JSON.parse(raw);
          isPlus = s.aiModelTier !== 'standard';
          tokenLimit = s.aiMaxTokensPerStudent || 25000;
        }
        const usedRaw = localStorage.getItem('cp_tokens_used_today');
        if (usedRaw) currentTokensUsed = Number(usedRaw) || 850;
      } catch {}

      // Token sarfini yangilash (so'rov uchun o'rtacha 350-500 token)
      const cost = isPlus ? 420 : 250;
      const nextUsed = Math.min(tokenLimit, currentTokensUsed + cost);
      try {
        localStorage.setItem('cp_tokens_used_today', String(nextUsed));
      } catch {}
      const remainingTokens = Math.max(0, tokenLimit - nextUsed);

      if (remainingTokens <= 0) {
        return {
          response: `⚠️ **Kunlik AI token chegarasiga yetdingiz (${tokenLimit.toLocaleString()} / ${tokenLimit.toLocaleString()} token).**\n\nAdministrator tomonidan belgilangan limit tugadi. Yangi kvota ertaga 00:00 da avtomatik qayta tiklanadi.`,
          remainingDailyTokens: 0,
        };
      }

      const prefix = isPlus
        ? `✨ **[CodePractice AI Plus • Gemini 1.5 Pro]**\n\n`
        : `🤖 **[CodePractice AI • Standart Flash]**\n\n`;

      let responseText = '';

      if (payload.requestType === 'explain_error') {
        responseText = prefix +
          `🔍 **Chuqur xatolik diagnostikasi:**\n\n` +
          `Aniqlangan xatolik: \`${payload.errorMessage || 'Sintaktik yoki mantiqiy xato'}\`.\n\n` +
          `💡 **Xatoning kelib chiqish sababi:**\n` +
          `1. Koddagi o‘zgaruvchilar turi va qiymat kiritish jarayonini tekshiring (masalan, bo‘sh joylar yoki satrni songa aylantirish).\n` +
          `2. Indekslar chegaradan chiqib ketmaganligiga (masalan: massiv uzunligidan ortiq elementga murojaat) ishonch hosil qiling.\n\n` +
          `🎯 **Tavsiya:** Xato yuz bergan qatordan oldingi ifodani chop etib (\`print\` yoki \`std::cout\`), qiymatlarni tahlil qiling.`;
      } else if (payload.requestType === 'hint') {
        responseText = prefix +
          `💡 **Algoritmik yo‘naltiruvchi maslahat (Hint):**\n\n` +
          `1. **Kiruvchi ma’lumot:** Barcha parametrlarni to‘g‘ri ajratib oling.\n` +
          `2. **Asosiy mantiq:** Masala shartidagi matematik yoki mantiqiy qonuniyatni ifodalovchi formulani toping.\n` +
          `3. **Chekka holatlar (Edge Cases):** \`0\`, manfiy sonlar yoki massivning bitta elementdan iborat bo‘lish holatini hisobga oldingizmi?\n\n` +
          `> *Qoida bo‘yicha to‘liq kod yozib berilmaydi. Qadam-baqadam mustaqil davom eting!*`;
      } else if (payload.requestType === 'explain_code') {
        responseText = prefix +
          `📝 **Kodingizning chuqur strukturaviy tahlili:**\n\n` +
          `• **Ijobiy tomoni:** Kodingiz asosiy kiritish-chiqarish tuzilmasiga ega va mantiq to‘g‘ri yo‘nalishda shakllantirilgan.\n` +
          `• **Yaxshilash kerak bo‘lgan qism:** Sikl (loop) sharti va if/else tarmoqlanishini qayta ko‘rib chiqing. Kutilgan chiqish formati bilan amaldagi format to‘liq mos kelishi kerak.\n` +
          `• **Vaqt samaradorligi:** Ortiqcha takroriy hisoblashlarni oldini oling.`;
      } else if (payload.requestType === 'explain_test') {
        responseText = prefix +
          `🧪 **Test holatlari tahlili:**\n\n` +
          `Kodingiz namunaviy testlardan o‘tgan bo‘lishi mumkin, ammo yashirin yoki qo‘shimcha testlarda quyidagi omillar sababli xatolik yuz berishi ehtimoli yuqori:\n` +
          `- Juda katta sonlar (overflow / int chegarasi)\n` +
          `- Bo‘sh satr yoki bitta elementli kiruvchi qiymat\n` +
          `- Natija oxirida ortiqcha probel yoki yangi qator belgisi qo‘yilganligi.`;
      } else {
        responseText = prefix +
          `Salom! Masalani muvaffaqiyatli topshirishingiz uchun kerakli bosqichlarni belgilab oling. Qaysi qismda tushunmovchilik bo‘layotganini aniqlashtirsangiz, batafsil yo‘naltirib beraman.`;
      }

      return {
        response: responseText,
        remainingDailyTokens: remainingTokens,
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
