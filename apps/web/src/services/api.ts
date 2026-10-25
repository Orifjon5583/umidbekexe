import { CodePracticeApiClient } from '@codepractice/api-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = new CodePracticeApiClient({
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
