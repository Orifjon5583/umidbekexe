import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { LandingPage } from './pages/LandingPage';
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
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  useEffect(() => {
    const userJson = localStorage.getItem('cp_user');
    const token = localStorage.getItem('cp_access_token');
    if (userJson && token) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        if (window.location.hash === '#dashboard' || window.location.search.includes('panel')) {
          setCurrentView('dashboard');
        }
      } catch {}
    } else {
      if (window.location.hash === '#login' || window.location.pathname === '/login') {
        setCurrentView('login');
      }
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleGoToLogin = () => {
    setCurrentView('login');
    window.location.hash = 'login';
  };

  const handleGoToLanding = () => {
    setCurrentView('landing');
    window.location.hash = '';
  };

  const handleGoToDashboard = () => {
    setCurrentView('dashboard');
    window.location.hash = 'dashboard';
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <>
      {/* Sahifa yangilanganda / ochilganda chiquvchi zamonaviy Zagruzka (Preloader ~3.8s) */}
      {isAppLoading && (
        <Preloader onFinish={() => setIsAppLoading(false)} minDurationMs={3800} />
      )}

      {currentView === 'landing' ? (
        <LandingPage
          onGoToLogin={handleGoToLogin}
          currentUser={currentUser}
          onGoToDashboard={handleGoToDashboard}
        />
      ) : currentView === 'login' || !currentUser ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={handleGoToLanding}
        />
      ) : (
        <DashboardLayout
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onGoToLanding={handleGoToLanding}
        >
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
      )}
    </>
  );
};
