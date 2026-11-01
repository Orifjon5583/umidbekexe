import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { GroupsPage } from './pages/GroupsPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { RewardsPage } from './pages/RewardsPage';
import { TeachersPage } from './pages/TeachersPage';
import { SystemSettingsPage } from './pages/SystemSettingsPage';
import { SecurityLogsPage } from './pages/SecurityLogsPage';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  useEffect(() => {
    const userJson = localStorage.getItem('cp_user');
    const token = localStorage.getItem('cp_access_token');
    if (userJson && token) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      } catch {}
    }
  }, []);

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'dashboard' && <DashboardPage />}
      {currentTab === 'groups' && <GroupsPage />}
      {currentTab === 'problems' && <ProblemsPage />}
      {currentTab === 'assignments' && <AssignmentsPage />}
      {currentTab === 'reports' && <ReportsPage />}
      {currentTab === 'rewards' && <RewardsPage />}

      {/* Admin Exclusive Tabs */}
      {isAdmin && currentTab === 'teachers' && <TeachersPage />}
      {isAdmin && currentTab === 'settings' && <SystemSettingsPage />}
      {isAdmin && currentTab === 'logs' && <SecurityLogsPage />}
    </DashboardLayout>
  );
};
