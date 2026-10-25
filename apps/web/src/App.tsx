import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { GroupsPage } from './pages/GroupsPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { ReportsPage } from './pages/ReportsPage';

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

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'dashboard' && <DashboardPage />}
      {currentTab === 'groups' && <GroupsPage />}
      {currentTab === 'problems' && <ProblemsPage />}
      {currentTab === 'assignments' && <AssignmentsPage />}
      {currentTab === 'reports' && <ReportsPage />}
    </DashboardLayout>
  );
};
