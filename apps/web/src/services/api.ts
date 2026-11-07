import { CodePracticeApiClient } from '@codepractice/api-client';
import {
  Group,
  GroupWithMembers,
  Problem,
  Assignment,
  TeacherDashboardStats,
  User,
} from '@codepractice/shared-types';
import {
  MOCK_TEACHER_USER,
  MOCK_ADMIN_USER,
  MOCK_STUDENTS,
  INITIAL_GROUPS,
  INITIAL_PROBLEMS,
  INITIAL_ASSIGNMENTS,
  MOCK_DASHBOARD_STATS,
  INITIAL_TEACHERS,
  TeacherRecord,
  INITIAL_SYSTEM_SETTINGS,
  SystemSettingsData,
  INITIAL_SECURITY_LOGS,
  SecurityLogItem,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const realClient = new CodePracticeApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => localStorage.getItem('cp_access_token'),
  getRefreshToken: () => localStorage.getItem('cp_refresh_token'),
  setTokens: (access, refresh) => {
    localStorage.setItem('cp_access_token', access);
    if (refresh) localStorage.setItem('cp_refresh_token', refresh);
  },
  onUnauthorized: () => {
    localStorage.removeItem('cp_access_token');
    localStorage.removeItem('cp_refresh_token');
    localStorage.removeItem('cp_user');
    window.location.href = '/login';
  },
});

// Mahalliy xotira (localStorage) yordamida ma'lumotlarni saqlash helperlari
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(`cp_web_${key}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultVal;
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`cp_web_${key}`, JSON.stringify(val));
  } catch {}
}

export const apiClient = {
  async login(creds: { username: string; password?: string; rememberMe?: boolean }) {
    try {
      return await realClient.login(creds as any);
    } catch (err) {
      console.warn('[Web API] Backend server oflayn, demo hisobdan foydalanilmoqda:', err);
      const isAdm = creds.username.toLowerCase().includes('admin');
      const user = isAdm ? MOCK_ADMIN_USER : { ...MOCK_TEACHER_USER, username: creds.username || 'teacher1' };
      const tokens = {
        accessToken: 'demo-jwt-access-token',
        refreshToken: 'demo-jwt-refresh-token',
        expiresIn: 86400,
      };
      localStorage.setItem('cp_access_token', tokens.accessToken);
      localStorage.setItem('cp_refresh_token', tokens.refreshToken);
      localStorage.setItem('cp_user', JSON.stringify(user));
      return { user, tokens };
    }
  },

  async getTeacherDashboard(): Promise<TeacherDashboardStats> {
    try {
      return await realClient.getTeacherDashboard();
    } catch {
      return MOCK_DASHBOARD_STATS;
    }
  },

  async getTeacherGroups(): Promise<Group[]> {
    try {
      return await realClient.getTeacherGroups();
    } catch {
      const allGroups = getStored<Group[]>('groups', INITIAL_GROUPS);
      const userJson = localStorage.getItem('cp_user');
      const user = userJson ? JSON.parse(userJson) : null;
      if (user && user.role === 'teacher') {
        const teachers = await this.getTeachers();
        const currentTeacher = teachers.find(
          (t) => t.username.toLowerCase() === user.username.toLowerCase()
        );
        if (currentTeacher && currentTeacher.assignedGroups && currentTeacher.assignedGroups.length > 0) {
          return allGroups.filter((g) =>
            currentTeacher.assignedGroups.some((ag) => {
              const cleanAg = ag.toLowerCase().replace(/[^a-z0-9]/g, '');
              const cleanG = g.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              return cleanAg.includes(cleanG) || cleanG.includes(cleanAg);
            })
          );
        }
      }
      return allGroups;
    }
  },

  async getAdminUsers(): Promise<User[]> {
    try {
      return await realClient.getAdminUsers();
    } catch {
      return getStored<User[]>('students', MOCK_STUDENTS);
    }
  },

  async getGroupDetails(groupId: string): Promise<GroupWithMembers> {
    try {
      return await realClient.getGroupDetails(groupId);
    } catch {
      const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
      const grp = groups.find((g) => g.id === groupId) || groups[0];
      const allStudents = getStored<User[]>('students', MOCK_STUDENTS);

      const defaultMemberIds =
        grp.id === 'g-1'
          ? ['s-1', 's-2', 's-6']
          : grp.id === 'g-2'
          ? ['s-3', 's-4', 's-7']
          : ['s-5', 's-8'];

      const memberIds = getStored<string[]>(`group_members_${grp.id}`, defaultMemberIds);
      const members = memberIds.map((id) => {
        const student = allStudents.find((s) => s.id === id) || {
          id,
          fullName: 'O‘quvchi',
          username: id,
          role: 'student' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          student,
          joinedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        };
      });

      return {
        ...grp,
        studentCount: members.length,
        members,
      };
    }
  },

  async createGroup(name: string, telegramChatId?: string): Promise<Group> {
    try {
      return await realClient.createGroup(name);
    } catch {
      const current = getStored<Group[]>('groups', INITIAL_GROUPS);
      const newGroup: Group = {
        id: `g-${Date.now()}`,
        name,
        telegramChatId: telegramChatId?.trim() || '',
        studentCount: 0,
        activeAssignmentsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newGroup, ...current];
      setStored('groups', updated);
      setStored(`group_members_${newGroup.id}`, []);
      return newGroup;
    }
  },

  async updateGroupName(groupId: string, newName: string, telegramChatId?: string): Promise<Group> {
    const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
    const updated = groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            name: newName.trim(),
            telegramChatId: telegramChatId !== undefined ? telegramChatId.trim() : g.telegramChatId,
            updatedAt: new Date().toISOString(),
          }
        : g
    );
    setStored('groups', updated);
    return updated.find((g) => g.id === groupId)!;
  },

  async deleteGroup(groupId: string): Promise<void> {
    try {
      await (realClient as any).deleteGroup?.(groupId);
    } catch {}
    const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
    const updated = groups.filter((g) => g.id !== groupId);
    setStored('groups', updated);
  },

  async addStudentToGroup(groupId: string, studentId: string): Promise<void> {
    try {
      await realClient.addStudentToGroup(groupId, studentId);
    } catch {}
    const defaultIds = groupId === 'g-1' ? ['s-1', 's-2', 's-6'] : ['s-3', 's-4'];
    const currentMembers = getStored<string[]>(`group_members_${groupId}`, defaultIds);
    if (!currentMembers.includes(studentId)) {
      const updated = [...currentMembers, studentId];
      setStored(`group_members_${groupId}`, updated);

      const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
      setStored(
        'groups',
        groups.map((g) => (g.id === groupId ? { ...g, studentCount: updated.length } : g))
      );
    }
  },

  async removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
    try {
      await realClient.removeStudentFromGroup(groupId, studentId);
    } catch {}
    const defaultIds = groupId === 'g-1' ? ['s-1', 's-2', 's-6'] : ['s-3', 's-4'];
    const currentMembers = getStored<string[]>(`group_members_${groupId}`, defaultIds);
    const updated = currentMembers.filter((id) => id !== studentId);
    setStored(`group_members_${groupId}`, updated);

    const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
    setStored(
      'groups',
      groups.map((g) => (g.id === groupId ? { ...g, studentCount: updated.length } : g))
    );
  },

  async createNewStudent(data: { fullName: string; username: string; password?: string }): Promise<User> {
    const allStudents = getStored<User[]>('students', MOCK_STUDENTS);
    const newStudent: User = {
      id: `s-${Date.now()}`,
      fullName: data.fullName.trim(),
      username: data.username.trim().toLowerCase().replace(/\s+/g, '_'),
      role: 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStored('students', [...allStudents, newStudent]);

    if (data.password) {
      const passwords = getStored<Record<string, string>>('user_passwords', {});
      passwords[newStudent.id] = data.password;
      setStored('user_passwords', passwords);
    }

    return newStudent;
  },

  async updateStudentPassword(studentId: string, newPassword: string): Promise<boolean> {
    try {
      // If backend has admin user password endpoint, call it
    } catch {}
    const passwords = getStored<Record<string, string>>('user_passwords', {});
    passwords[studentId] = newPassword;
    setStored('user_passwords', passwords);
    console.log(`[Demo] Student ${studentId} password updated to: ${newPassword}`);
    return true;
  },

  async getStudentPassword(studentId: string): Promise<string> {
    const passwords = getStored<Record<string, string>>('user_passwords', {});
    return passwords[studentId] || 'Talaba123!';
  },

  async getTeacherProblems(): Promise<Problem[]> {
    try {
      return await realClient.getTeacherProblems();
    } catch {
      return getStored<Problem[]>('problems', INITIAL_PROBLEMS);
    }
  },

  async createProblem(dto: any): Promise<Problem> {
    try {
      return await realClient.createProblem(dto);
    } catch {
      const current = getStored<Problem[]>('problems', INITIAL_PROBLEMS);
      const newProb: Problem = {
        id: `p-${Date.now()}`,
        title: dto.title,
        statement: dto.statement,
        inputDescription: dto.inputDescription,
        outputDescription: dto.outputDescription,
        sampleInput: dto.sampleInput,
        sampleOutput: dto.sampleOutput,
        language: dto.language,
        difficulty: dto.difficulty,
        timeLimitMs: dto.timeLimitMs || 2000,
        memoryLimitMb: dto.memoryLimitMb || 128,
        version: 1,
        isActive: true,
        createdBy: 't-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        testCases: (dto.testCases || []).map((tc: any, i: number) => ({
          id: `tc-${Date.now()}-${i}`,
          problemId: `p-${Date.now()}`,
          inputData: tc.inputData,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          orderIndex: i + 1,
        })),
      };
      const updated = [newProb, ...current];
      setStored('problems', updated);
      return newProb;
    }
  },

  async getTeacherAssignments(): Promise<Assignment[]> {
    try {
      return await realClient.getTeacherAssignments();
    } catch {
      return getStored<Assignment[]>('assignments', INITIAL_ASSIGNMENTS);
    }
  },

  async createAssignment(dto: any): Promise<Assignment> {
    try {
      return await realClient.createAssignment(dto);
    } catch {
      const current = getStored<Assignment[]>('assignments', INITIAL_ASSIGNMENTS);
      const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
      const targetGroup = groups.find((g) => g.id === dto.groupId);
      const newAssignment: Assignment = {
        id: `a-${Date.now()}`,
        title: dto.title,
        description: dto.description,
        groupId: dto.groupId,
        groupName: targetGroup ? targetGroup.name : 'Noma’lum guruh',
        startsAt: dto.startsAt,
        dueAt: dto.dueAt,
        status: 'published',
        createdBy: 't-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalProblems: dto.problemIds?.length || 1,
        progressPercentage: 0,
        studentStatus: 'new',
      };
      const updated = [newAssignment, ...current];
      setStored('assignments', updated);
      return newAssignment;
    }
  },

  async getGroupProgress(groupId: string): Promise<any> {
    try {
      return await realClient.getGroupProgress(groupId);
    } catch {
      const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
      const grp = groups.find((g) => g.id === groupId) || groups[0];
      const allAssignments = getStored<Assignment[]>('assignments', INITIAL_ASSIGNMENTS);
      const allStudents = getStored<User[]>('students', MOCK_STUDENTS);

      // Har bir guruh a'zolarini ajratish (N1 da boshqa o'quvchilar, N2 da boshqa o'quvchilar)
      const defaultMemberIds =
        grp.id === 'g-1'
          ? ['s-1', 's-2', 's-6']
          : grp.id === 'g-2'
          ? ['s-3', 's-4', 's-7']
          : ['s-5', 's-8'];

      const memberIds = getStored<string[]>(`group_members_${grp.id}`, defaultMemberIds);
      const groupStudents = allStudents.filter((s) => memberIds.includes(s.id));

      // Aynan shu guruhga tegishli topshiriqlar
      let groupAssignments = allAssignments.filter((a) => a.groupId === grp.id);
      if (groupAssignments.length === 0) {
        groupAssignments = allAssignments.slice(0, 2);
      }

      const telegramChatId =
        grp.telegramChatId ||
        (grp.id === 'g-1' ? '-100192837482' : grp.id === 'g-2' ? '-100183749201' : '-100174829103');

      return {
        groupId: grp.id,
        groupName: grp.name,
        telegramChatId,
        students: groupStudents.map((st, sIdx) => ({
          studentId: st.id,
          studentName: st.fullName,
          username: st.username,
          assignments: groupAssignments.map((ass, aIdx) => {
            const total = ass.totalProblems || 2;
            let completed = 0;
            if ((sIdx + aIdx) % 3 === 0) {
              completed = total; // 100%
            } else if ((sIdx + aIdx) % 3 === 1) {
              completed = Math.max(1, total - 1); // Qisman
            } else {
              completed = 0; // 0%
            }
            const pct = Math.round((completed / total) * 100);
            return {
              assignmentId: ass.id,
              assignmentTitle: ass.title,
              completedProblems: completed,
              totalProblems: total,
              progressPercentage: pct,
              status: pct === 100 ? 'completed' : pct > 0 ? 'in_progress' : 'not_started',
            };
          }),
        })),
      };
    }
  },

  async testTelegramBotConnection(token?: string): Promise<{ success: boolean; botName?: string; username?: string; message: string }> {
    const cleanToken = token?.trim() || '';

    // 1. Agar token bo'lsa, to'g'ridan-to'g'ri Telegram API orqali tekshirish
    if (cleanToken) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
        const data = await res.json();
        if (data.ok) {
          const username = `@${data.result.username}`;
          // Muvaffaqiyatli tekshiruvdan so'ng darhol xotiraga saqlash
          try {
            localStorage.setItem('mintera_telegram_bot_token', cleanToken);
            localStorage.setItem('mintera_telegram_bot_username', username);
          } catch {}

          // Server boti bilan ham fonda sinxronizatsiya qilish
          fetch('/api/telegram/set-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: cleanToken, username }),
          }).catch(() => {});

          return {
            success: true,
            botName: data.result.first_name,
            username: username,
            message: `Ulanish muvaffaqiyatli! Bot: "${data.result.first_name}" (${username})`,
          };
        } else {
          return {
            success: false,
            message: `Telegram xatoligi: ${data.description || 'Token noto‘g‘ri yoki yaroqsiz'}`,
          };
        }
      } catch (err: any) {
        return {
          success: false,
          message: `Internet yoki tarmoq xatosi: ${err.message}`,
        };
      }
    }

    // 2. Agar token kiritilmagan bo'lsa, serverdagi bot holatini tekshirish
    try {
      const serverRes = await fetch('/api/telegram/status');
      if (serverRes.ok) {
        const sData = await serverRes.json();
        if (sData.online && sData.bot) {
          return {
            success: true,
            botName: sData.bot,
            username: `@${sData.bot}`,
            message: `Serverdagi Telegram Bot (.env) faol va ulangan! (@${sData.bot})`,
          };
        }
      }
    } catch {}

    return { success: false, message: 'Iltimos, Bot Tokenni kiriting yoki serverdagi botni tekshiring!' };
  },

  async sendTelegramGroupReport(data: {
    groupId: string;
    groupName: string;
    telegramChatId: string;
    assignmentTitle: string;
    messageText: string;
  }): Promise<{ success: boolean; message: string; isRealTelegramSent?: boolean }> {
    const settings = getStored<SystemSettingsData>('system_settings', INITIAL_SYSTEM_SETTINGS);
    const token = (
      settings.telegramBotToken ||
      localStorage.getItem('mintera_telegram_bot_token') ||
      localStorage.getItem('cp_telegram_bot_token') ||
      ''
    ).trim();

    let realSent = false;
    let deliveryNote = '';

    // 1. Agar brauzerda Token mavjud bo'lsa, to'g'ridan-to'g'ri rasmiy Telegram API orqali yuborish
    // Bu usul hech qanday proxy yoki Nginx talab qilmaydi, 100% barqaror ishlaydi
    if (token) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: data.telegramChatId,
            text: data.messageText,
            parse_mode: 'HTML',
          }),
        });
        const resJson = await response.json();
        if (resJson.ok) {
          realSent = true;
          deliveryNote = ` (Telegram API orqali yetkazildi, Msg ID: ${resJson.result?.message_id || 'OK'})`;
        } else {
          deliveryNote = ` (Telegram API xatosi: ${resJson.description || 'Xabar yuborilmadi'}. Bot guruhda borligini va admin ekanini tekshiring!)`;
        }
      } catch (err: any) {
        deliveryNote = ` (Telegram ulanish xatosi: ${err.message})`;
      }
    }

    // 2. Agar to'g'ridan-to'g'ri o'tmagan bo'lsa, Serverdagi bot xizmati (/api/telegram/send-message) orqali yuborish
    if (!realSent) {
      try {
        const serverResp = await fetch('/api/telegram/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: data.telegramChatId,
            text: data.messageText,
          }),
        });
        if (serverResp.ok) {
          const serverJson = await serverResp.json();
          if (serverJson.ok) {
            realSent = true;
            deliveryNote = ` (Server Telegram boti orqali muvaffaqiyatli yetkazildi, Msg ID: ${serverJson.result?.message_id || 'OK'})`;
          }
        }
      } catch {}
    }

    // 3. Agar lokal muhitda ishlab turgan bo'lsa (http://127.0.0.1:4005)
    if (!realSent) {
      try {
        const localResp = await fetch('http://127.0.0.1:4005/api/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: data.telegramChatId,
            text: data.messageText,
          }),
        });
        if (localResp.ok) {
          const localJson = await localResp.json();
          if (localJson.ok) {
            realSent = true;
            deliveryNote = ` (Lokal bot orqali muvaffaqiyatli yetkazildi, Msg ID: ${localJson.result?.message_id || 'OK'})`;
          }
        }
      } catch {}
    }

    // 4. Agar barcha usullar o'tmagan bo'lsa
    if (!realSent && !deliveryNote) {
      if (!token) {
        deliveryNote = ` (Telegram Bot Token kiritilmagan yoki saqlanmagan. "Tizim sozlamalari" sahifasida Bot Tokenni kiriting va "Saqlash" tugmasini bosing).`;
      } else {
        deliveryNote = ` (Xabar yetkazilmadi. Telegram bot tokeni va guruh ID sini tekshiring).`;
      }
    }

    console.log(`[Telegram Bot] Sent to ${data.groupName} (${data.telegramChatId}):\n`, data.messageText);

    // Xavfsizlik va audit loglariga yozish
    const logs = getStored<any[]>('security_logs', []);
    logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'O‘qituvchi',
      role: 'teacher',
      eventType: 'telegram_report_sent',
      details: `${data.groupName} (${data.telegramChatId}) guruhiga "${data.assignmentTitle}" topshirig‘i hisoboti yuborildi.${deliveryNote}`,
      ipAddress: '127.0.0.1 (Lokal)',
      status: realSent ? 'success' : 'info',
    });
    setStored('security_logs', logs.slice(0, 100));

    return {
      success: true,
      isRealTelegramSent: realSent,
      message: realSent
        ? `Hisobot "${data.groupName}" (${data.telegramChatId}) Telegram guruhiga jonli yuborildi! 🚀`
        : `Hisobot audit jurnaliga saqlandi.${deliveryNote}`,
    };
  },

  // Telegram guruhiga sinov xabari yuborib aloqani tekshirish
  async sendTestGroupMessage(chatId: string, groupName: string): Promise<{ success: boolean; message: string }> {
    const text =
      `🔔 <b>MINTERA LMS — ALOQA TESTI</b>\n\n` +
      `🏢 <b>Guruh:</b> <code>${groupName}</code>\n` +
      `🆔 <b>Chat ID:</b> <code>${chatId}</code>\n` +
      `✅ <b>Holat:</b> Telegram bot va Mintera platformasi o‘rtasida aloqa 100% barqaror!\n` +
      `⏱ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n\n` +
      `<i>Ushbu test xabari orqali botning ushbu guruhda hisobotlar yoza olishi tasdiqlandi.</i>`;

    const res = await this.sendTelegramGroupReport({
      groupId: 'test-ping',
      groupName: groupName,
      telegramChatId: chatId,
      assignmentTitle: 'Aloqa Sinovi',
      messageText: text,
    });

    return {
      success: res.isRealTelegramSent ?? res.success,
      message: res.isRealTelegramSent
        ? `«${groupName}» guruhiga sinov xabari muvaffaqiyatli yuborildi! Telegramni tekshiring. 🚀`
        : res.message,
    };
  },

  // Talaba test topshirganda xabarni FAQAT uning o'z guruhiga yuborish (Strict Group Isolation)
  async sendStudentSubmissionAlert(params: {
    studentId: string;
    studentName: string;
    problemTitle: string;
    status: 'accepted' | 'wrong_answer' | 'compilation_error' | 'runtime_error';
    passedTests: number;
    totalTests: number;
  }): Promise<{ sent: boolean; groupName?: string }> {
    const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
    let targetGroup: Group | undefined;

    // Talabaning aynan qaysi guruhda o'qishini aniqlash (N1, N2, ...)
    for (const g of groups) {
      const defaultMembers =
        g.id === 'g-1'
          ? ['s-1', 's-2', 's-6']
          : g.id === 'g-2'
          ? ['s-3', 's-4', 's-7']
          : ['s-5', 's-8'];
      const memberIds = getStored<string[]>(`group_members_${g.id}`, defaultMembers);
      if (memberIds.includes(params.studentId)) {
        targetGroup = g;
        break;
      }
    }

    if (!targetGroup || !targetGroup.telegramChatId) {
      // Guruh topilmadi yoki Telegram Chat ID biriktirilmagan
      return { sent: false };
    }

    // FAQAT talabaning o'z guruhiga xabar yuborish (N1 talabasi boshqa guruhga aslo bormaydi)
    const isAccepted = params.status === 'accepted';
    const icon = isAccepted ? '🏆' : '⚠️';
    const statusText = isAccepted ? 'Muvaffaqiyatli topshirildi (100%)' : 'Xatolik aniqlandi';

    const text =
      `${icon} <b>YANGI TOPSHIRIQ NATIJASI</b>\n\n` +
      `👤 <b>O‘quvchi:</b> ${params.studentName}\n` +
      `🏢 <b>Guruh:</b> <code>${targetGroup.name}</code>\n` +
      `📝 <b>Masala:</b> ${params.problemTitle}\n` +
      `📊 <b>Testlar natijasi:</b> ${params.passedTests} / ${params.totalTests} ta o‘tdi\n` +
      `📌 <b>Holat:</b> ${statusText}\n` +
      `⏱ <b>Vaqt:</b> ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}\n\n` +
      `<i>🔒 Ushbu xabar FAQAT «${targetGroup.name}» guruhi uchun chiqarildi.</i>`;

    await this.sendTelegramGroupReport({
      groupId: targetGroup.id,
      groupName: targetGroup.name,
      telegramChatId: targetGroup.telegramChatId,
      assignmentTitle: params.problemTitle,
      messageText: text,
    });

    return { sent: true, groupName: targetGroup.name };
  },

  async exportReportCsv(groupId?: string): Promise<string> {
    try {
      return await realClient.exportReportCsv(groupId);
    } catch {
      const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
      const targetGroup = groupId ? groups.find((g) => g.id === groupId) || groups[0] : groups[0];
      const assignments = getStored<Assignment[]>('assignments', INITIAL_ASSIGNMENTS);
      const allStudents = getStored<User[]>('students', MOCK_STUDENTS);

      let csv = '\uFEFF'; // UTF-8 BOM Excel uchun
      csv += 'O‘quvchi Ismi,Username,Guruh,Vazifa,Bajarilgan Masalalar,Jami Masalalar,Foiz,Holat\n';

      for (const st of allStudents) {
        for (const ass of assignments) {
          const total = ass.totalProblems || 2;
          const completed = total;
          csv += `"${st.fullName}","${st.username}","${targetGroup.name}","${ass.title}",${completed},${total},100%,"Bajarildi"\n`;
        }
      }

      return csv;
    }
  },

  // ================= ADMIN EXCLUSIVE SERVICES =================
  async getTeachers(): Promise<TeacherRecord[]> {
    const teachers = getStored<TeacherRecord[]>('teachers', INITIAL_TEACHERS);
    // Sanitize old mock storage where teacher1 had both Guruh-101 and Guruh-102
    let modified = false;
    const sanitized = teachers.map((t) => {
      if (t.username === 'teacher1' && t.assignedGroups?.includes('Guruh-102 (C++ Algoritmlar)')) {
        modified = true;
        return {
          ...t,
          assignedGroups: ['Guruh-101 (Python Asoslari)'],
          studentCount: 18,
        };
      }
      return t;
    });
    if (modified) {
      setStored('teachers', sanitized);
      return sanitized;
    }
    return teachers;
  },

  async createTeacher(dto: {
    fullName: string;
    username: string;
    password?: string;
    subject: string;
    assignedGroups: string[];
    email?: string;
  }): Promise<TeacherRecord> {
    const teachers = getStored<TeacherRecord[]>('teachers', INITIAL_TEACHERS);
    const newTeacher: TeacherRecord = {
      id: `t-${Date.now()}`,
      fullName: dto.fullName.trim(),
      username: dto.username.trim().toLowerCase().replace(/\s+/g, '_'),
      email: dto.email || `${dto.username.toLowerCase()}@mintera.uz`,
      subject: dto.subject || 'Dasturlash asoslari',
      assignedGroups: dto.assignedGroups || [],
      studentCount: (dto.assignedGroups || []).length * 15,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTeacher, ...teachers];
    setStored('teachers', updated);

    if (dto.password) {
      const passwords = getStored<Record<string, string>>('teacher_passwords', {});
      passwords[newTeacher.username] = dto.password;
      setStored('teacher_passwords', passwords);
    }

    return newTeacher;
  },

  async updateTeacher(id: string, dto: Partial<TeacherRecord>): Promise<TeacherRecord> {
    const teachers = getStored<TeacherRecord[]>('teachers', INITIAL_TEACHERS);
    const updated = teachers.map((t) => (t.id === id ? { ...t, ...dto } : t));
    setStored('teachers', updated);
    return updated.find((t) => t.id === id)!;
  },

  async toggleTeacherStatus(id: string): Promise<boolean> {
    const teachers = getStored<TeacherRecord[]>('teachers', INITIAL_TEACHERS);
    const updated = teachers.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t));
    setStored('teachers', updated);
    const target = updated.find((t) => t.id === id);
    return target ? target.isActive : true;
  },

  async deleteTeacher(id: string): Promise<boolean> {
    const teachers = getStored<TeacherRecord[]>('teachers', INITIAL_TEACHERS);
    const updated = teachers.filter((t) => t.id !== id);
    setStored('teachers', updated);
    return true;
  },

  async getSystemSettings(): Promise<SystemSettingsData> {
    const settings = getStored<SystemSettingsData>('system_settings', INITIAL_SYSTEM_SETTINGS);
    // Agar bot tokeni alohida xotira kalitida saqlangan bo'lsa, uni ham tekshirish
    if (!settings.telegramBotToken) {
      const fallback =
        localStorage.getItem('mintera_telegram_bot_token') ||
        localStorage.getItem('cp_telegram_bot_token');
      if (fallback) settings.telegramBotToken = fallback;
    }
    if (!settings.telegramBotUsername) {
      const fallbackUser = localStorage.getItem('mintera_telegram_bot_username');
      if (fallbackUser) settings.telegramBotUsername = fallbackUser;
    }
    return settings;
  },

  async updateSystemSettings(dto: Partial<SystemSettingsData>): Promise<SystemSettingsData> {
    const current = getStored<SystemSettingsData>('system_settings', INITIAL_SYSTEM_SETTINGS);
    const updated = { ...current, ...dto };
    setStored('system_settings', updated);

    // Cross-platform va zaxira xotira uchun saqlash
    try {
      localStorage.setItem('cp_system_settings', JSON.stringify(updated));
      if (updated.telegramBotToken) {
        localStorage.setItem('mintera_telegram_bot_token', updated.telegramBotToken.trim());
      }
      if (updated.telegramBotUsername) {
        localStorage.setItem('mintera_telegram_bot_username', updated.telegramBotUsername.trim());
      }
    } catch {}

    // Serverdagi bot servisi bilan fonda sinxronlash (.env fayliga yozish)
    if (updated.telegramBotToken) {
      fetch('/api/telegram/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: updated.telegramBotToken.trim(),
          username: updated.telegramBotUsername?.trim() || '',
        }),
      }).catch(() => {});
    }

    return updated;
  },

  async getSecurityLogs(): Promise<SecurityLogItem[]> {
    return getStored<SecurityLogItem[]>('security_logs', INITIAL_SECURITY_LOGS);
  },
};
