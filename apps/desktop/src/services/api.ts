import { CodePracticeApiClient } from '@codepractice/api-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const desktopApiClient = new CodePracticeApiClient({
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
