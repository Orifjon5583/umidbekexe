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
      return getStored<Group[]>('groups', INITIAL_GROUPS);
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

  async createGroup(name: string): Promise<Group> {
    try {
      return await realClient.createGroup(name);
    } catch {
      const current = getStored<Group[]>('groups', INITIAL_GROUPS);
      const newGroup: Group = {
        id: `g-${Date.now()}`,
        name,
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

  async updateGroupName(groupId: string, newName: string): Promise<Group> {
    const groups = getStored<Group[]>('groups', INITIAL_GROUPS);
    const updated = groups.map((g) =>
      g.id === groupId ? { ...g, name: newName.trim(), updatedAt: new Date().toISOString() } : g
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
      const assignments = getStored<Assignment[]>('assignments', INITIAL_ASSIGNMENTS);
      const allStudents = getStored<User[]>('students', MOCK_STUDENTS);

      return {
        groupId: grp.id,
        groupName: grp.name,
        students: allStudents.map((st, sIdx) => ({
          studentId: st.id,
          studentName: st.fullName,
          username: st.username,
          assignments: assignments.map((ass, aIdx) => {
            const completed = (sIdx + aIdx) % 3 === 0 ? ass.totalProblems || 2 : 1;
            const total = ass.totalProblems || 2;
            const pct = Math.round((completed / total) * 100);
            return {
              assignmentId: ass.id,
              assignmentTitle: ass.title,
              completedProblems: completed,
              totalProblems: total,
              progressPercentage: pct,
            };
          }),
        })),
      };
    }
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
};
