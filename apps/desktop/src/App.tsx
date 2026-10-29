import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { GuidePage } from './pages/GuidePage';
import { DashboardPage } from './pages/DashboardPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AssignmentDetailsPage } from './pages/AssignmentDetailsPage';
import { CodeEditorPage } from './pages/CodeEditorPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SubmissionResultPage } from './pages/SubmissionResultPage';
import { ExitModal } from './components/ExitModal';

type AppScreen =
  | 'login'
  | 'guide'
  | 'dashboard'
  | 'assignments'
  | 'assignment_details'
  | 'code_editor'
  | 'results'
  | 'profile'
  | 'submission_result';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>('assign-1');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>('prob-1');
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Maxfiy chiqish kombinatsiyasini ushlash (Ctrl+Shift+Q yoki oynani yopish)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!e || !e.key) return;

      // Agar modal ochiq bo'lsa va Esc bosilsa, modalni yopamiz
      if (e.key === 'Escape') {
        setIsExitModalOpen((prev) => !prev ? false : false);
        return;
      }

      // Agar biror input yoki kod muharririda yozilayotgan bo'lsa, chiqish modalini chaqirmaymiz
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable ||
          activeEl.classList.contains('inputarea'))
      ) {
        return;
      }

      // Maxsus o'qituvchi kombinatsiyasi: Ctrl + Shift + Q
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setIsExitModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Avval saqlangan sessiyani tekshirish
  useEffect(() => {
    const userJson = localStorage.getItem('cp_student_user');
    const token = localStorage.getItem('cp_student_access_token');
    const hasReadGuide = sessionStorage.getItem('cp_guide_read');

    if (userJson && token) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        if (hasReadGuide) {
          setCurrentScreen('dashboard');
        } else {
          setCurrentScreen('guide');
        }
      } catch {}
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    const hasReadGuide = sessionStorage.getItem('cp_guide_read');
    if (hasReadGuide) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('guide');
    }
  };

  const handleGuideProceed = () => {
    sessionStorage.setItem('cp_guide_read', 'true');
    setCurrentScreen('dashboard');
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    localStorage.removeItem('cp_student_access_token');
    localStorage.removeItem('cp_student_refresh_token');
    localStorage.removeItem('cp_student_user');
    sessionStorage.removeItem('cp_guide_read');
    setCurrentUser(null);
    setCurrentScreen('login');

    // Agar Tauri muhitida bo'lsa oynani yopish
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      try {
        import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
          getCurrentWindow().close();
        });
      } catch {}
    }
  };

  return (
    <ThemeProvider>
      {currentScreen === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {currentScreen === 'guide' && (
        <GuidePage onProceed={handleGuideProceed} />
      )}

      {currentScreen === 'dashboard' && (
        <DashboardPage
          onSelectAssignment={(id) => {
            setSelectedAssignmentId(id);
            setCurrentScreen('assignment_details');
          }}
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onShowGuide={() => setCurrentScreen('guide')}
          onRequestExit={() => setIsExitModalOpen(true)}
          onViewResults={() => setCurrentScreen('submission_result')}
        />
      )}

      {currentScreen === 'assignments' && (
        <AssignmentsPage
          onSelectAssignment={(id) => {
            setSelectedAssignmentId(id);
            setCurrentScreen('assignment_details');
          }}
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
        />
      )}

      {currentScreen === 'assignment_details' && selectedAssignmentId && (
        <AssignmentDetailsPage
          assignmentId={selectedAssignmentId}
          onBack={() => setCurrentScreen('assignments')}
          onStartProblem={(pId) => {
            setSelectedProblemId(pId);
            setCurrentScreen('code_editor');
          }}
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
        />
      )}

      {currentScreen === 'code_editor' && selectedAssignmentId && selectedProblemId && (
        <CodeEditorPage
          assignmentId={selectedAssignmentId}
          problemId={selectedProblemId}
          onBackToAssignment={() => setCurrentScreen('assignment_details')}
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
          onFinishAssignment={() => setCurrentScreen('results')}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsPage
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
          onOpenCodeEditor={(assignId, probId) => {
            setSelectedAssignmentId(assignId);
            setSelectedProblemId(probId);
            setCurrentScreen('code_editor');
          }}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfilePage
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
        />
      )}

      {currentScreen === 'submission_result' && (
        <SubmissionResultPage
          onBackToDashboard={() => setCurrentScreen('dashboard')}
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
          onReviewCode={() => setCurrentScreen('code_editor')}
        />
      )}

      {/* Exit Modal (Exit pin: 4826) */}
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExit={handleConfirmExit}
      />
    </ThemeProvider>
  );
};
