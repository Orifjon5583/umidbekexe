import {
  AuthResponse,
  User,
  Problem,
  Assignment,
  StudentProgress,
  Submission,
  RunnerResult,
  AIRequestDto,
  AIResponseDto,
  TeacherDashboardStats,
  Group,
  GroupWithMembers
} from '@codepractice/shared-types';

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  setTokens?: (accessToken: string, refreshToken: string) => void;
  onUnauthorized?: () => void;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export class CodePracticeApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(private config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const token = this.config.getAccessToken?.();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        const refreshedToken = await this.handleTokenRefresh();
        if (refreshedToken) {
          headers.set('Authorization', `Bearer ${refreshedToken}`);
          const retryResponse = await fetch(url, { ...options, headers });
          if (!retryResponse.ok) {
            const errData = await retryResponse.json().catch(() => ({}));
            throw new ApiError(retryResponse.status, errData.message || 'Request failed after token refresh', errData);
          }
          return retryResponse.json();
        } else {
          this.config.onUnauthorized?.();
          throw new ApiError(401, 'Sessiya muddati tugadi. Iltimos, qayta kiring.');
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errData.message || `Xatolik: ${response.statusText}`, errData);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, err.message || 'Tarmoqqa ulanishda xatolik yuz berdi');
    }
  }

  private async handleTokenRefresh(): Promise<string | null> {
    const refreshToken = this.config.getRefreshToken?.();
    if (!refreshToken) return null;

    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.config.onUnauthorized?.();
        return null;
      }

      const data = await response.json();
      if (data.tokens?.accessToken) {
        this.config.setTokens?.(data.tokens.accessToken, data.tokens.refreshToken || refreshToken);
        this.refreshSubscribers.forEach((cb) => cb(data.tokens.accessToken));
        this.refreshSubscribers = [];
        return data.tokens.accessToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  // --- Auth endpoints ---
  async login(credentials: { username: string; password: string; rememberMe?: boolean }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.tokens) {
      this.config.setTokens?.(res.tokens.accessToken, res.tokens.refreshToken);
    }
    return res;
  }

  async logout(): Promise<void> {
    const refreshToken = this.config.getRefreshToken?.();
    await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // --- Student endpoints ---
  async getStudentDashboard(): Promise<{
    studentName: string;
    assignments: Assignment[];
  }> {
    return this.request('/students/me/dashboard');
  }

  async getStudentAssignments(): Promise<Assignment[]> {
    return this.request('/assignments');
  }

  async getAssignmentDetails(id: string): Promise<Assignment> {
    return this.request(`/assignments/${id}`);
  }

  async startAssignment(id: string): Promise<{ started: boolean }> {
    return this.request(`/assignments/${id}/start`, { method: 'POST' });
  }

  async getProblem(id: string): Promise<Problem> {
    return this.request(`/problems/${id}`);
  }

  async getStudentProgress(assignmentId: string, problemId: string): Promise<StudentProgress | null> {
    return this.request(`/assignments/${assignmentId}/progress?problemId=${problemId}`);
  }

  async saveDraftProgress(payload: {
    assignmentId: string;
    problemId: string;
    draftCode: string;
    language: string;
    status?: string;
  }): Promise<StudentProgress> {
    return this.request(`/assignments/${payload.assignmentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async submitCodeResult(payload: {
    assignmentId: string;
    problemId: string;
    language: string;
    sourceCode: string;
    runnerResult: RunnerResult;
  }): Promise<Submission> {
    return this.request(`/problems/${payload.problemId}/submissions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- AI endpoints ---
  async askAI(payload: AIRequestDto): Promise<AIResponseDto> {
    let endpoint = '/ai/explain-problem';
    if (payload.requestType === 'explain_code') endpoint = '/ai/explain-code';
    if (payload.requestType === 'explain_error') endpoint = '/ai/explain-error';
    if (payload.requestType === 'hint') endpoint = '/ai/hint';
    if (payload.requestType === 'explain_test') endpoint = '/ai/explain-test';

    return this.request<AIResponseDto>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- Teacher endpoints ---
  async getTeacherDashboard(): Promise<TeacherDashboardStats> {
    return this.request('/teacher/dashboard');
  }

  async getTeacherGroups(): Promise<Group[]> {
    return this.request('/teacher/groups');
  }

  async createGroup(name: string): Promise<Group> {
    return this.request('/teacher/groups', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getGroupDetails(id: string): Promise<GroupWithMembers> {
    return this.request(`/teacher/groups/${id}`);
  }

  async addStudentToGroup(groupId: string, studentId: string): Promise<void> {
    return this.request(`/teacher/groups/${groupId}/students`, {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
  }

  async removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
    return this.request(`/teacher/groups/${groupId}/students/${studentId}`, {
      method: 'DELETE',
    });
  }

  async getTeacherProblems(): Promise<Problem[]> {
    return this.request('/teacher/problems');
  }

  async createProblem(data: Partial<Problem>): Promise<Problem> {
    return this.request('/teacher/problems', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProblem(id: string, data: Partial<Problem>): Promise<Problem> {
    return this.request(`/teacher/problems/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async addTestCase(problemId: string, testCase: { inputData: string; expectedOutput: string; isHidden: boolean }): Promise<any> {
    return this.request(`/teacher/problems/${problemId}/tests`, {
      method: 'POST',
      body: JSON.stringify(testCase),
    });
  }

  async deleteTestCase(problemId: string, testId: string): Promise<void> {
    return this.request(`/teacher/problems/${problemId}/tests/${testId}`, {
      method: 'DELETE',
    });
  }

  async getTeacherAssignments(): Promise<Assignment[]> {
    return this.request('/teacher/assignments');
  }

  async createAssignment(data: any): Promise<Assignment> {
    return this.request('/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGroupProgress(groupId: string): Promise<any> {
    return this.request(`/teacher/groups/${groupId}/progress`);
  }

  async getStudentProgressReport(studentId: string): Promise<any> {
    return this.request(`/teacher/students/${studentId}/progress`);
  }

  async exportReportCsv(groupId?: string): Promise<string> {
    const url = `${this.baseUrl}/teacher/reports/export${groupId ? `?groupId=${groupId}` : ''}`;
    const token = this.config.getAccessToken?.();
    const res = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!res.ok) throw new ApiError(res.status, 'Hisobotni yuklab olishda xatolik yuz berdi');
    return res.text();
  }

  // --- Admin endpoints ---
  async getAdminUsers(): Promise<User[]> {
    return this.request('/admin/users');
  }

  async createAdminUser(data: { fullName: string; username: string; password: string; role: string }): Promise<User> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    return this.request(`/admin/users/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }
}
