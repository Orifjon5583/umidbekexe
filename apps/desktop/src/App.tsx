import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { GuidePage } from './pages/GuidePage';
import { DashboardPage } from './pages/DashboardPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AssignmentDetailsPage } from './pages/AssignmentDetailsPage';
import { CodeEditorPage } from './pages/CodeEditorPage';
import { ResultsPage } from './pages/ResultsPage';
import { RewardsPage } from './pages/RewardsPage';
import { ProfilePage } from './pages/ProfilePage';
import { TypingPage } from './pages/TypingPage';
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
  | 'rewards'
  | 'typing'
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

        // 1 soatlik majburiy mashg'ulot taymeri uchun boshlanish vaqtini saqlash
        if (!localStorage.getItem('cp_login_timestamp')) {
          localStorage.setItem('cp_login_timestamp', String(Date.now()));
        }

        if (hasReadGuide) {
          setCurrentScreen('dashboard');
        } else {
          setCurrentScreen('guide');
        }
      } catch {}
    }
  }, []);

  // 1 soatlik majburiy dars davomida oynani yoki sahifani ruxsatsiz yopishni to'xtatish
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentScreen === 'login') return;

      const loginTimeStr = localStorage.getItem('cp_login_timestamp');
      if (loginTimeStr) {
        const loginTime = parseInt(loginTimeStr, 10);
        const remSeconds = 3600 - Math.floor((Date.now() - loginTime) / 1000);
        if (remSeconds > 0) {
          e.preventDefault();
          e.returnValue = '1 soatlik majburiy dars rejimi faol! Muddatidan oldin chiqish taqiqlangan.';
          setIsExitModalOpen(true);
          return e.returnValue;
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Tauri oynani yopish so'rovini tutish (Alt+F4 yoki X tugmasi)
    let unlistenTauriClose: any = null;
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        getCurrentWindow().onCloseRequested((event) => {
          const loginTimeStr = localStorage.getItem('cp_login_timestamp');
          if (loginTimeStr) {
            const loginTime = parseInt(loginTimeStr, 10);
            const remSeconds = 3600 - Math.floor((Date.now() - loginTime) / 1000);
            if (remSeconds > 0) {
              event.preventDefault();
              setIsExitModalOpen(true);
            }
          }
        }).then((fn) => { unlistenTauriClose = fn; });
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (unlistenTauriClose) unlistenTauriClose();
    };
  }, [currentScreen]);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);

    // 1 soatlik mashg'ulot taymerini boshlash
    if (!localStorage.getItem('cp_login_timestamp')) {
      localStorage.setItem('cp_login_timestamp', String(Date.now()));
    }

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
    localStorage.removeItem('cp_login_timestamp');
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

      {currentScreen === 'rewards' && (
        <RewardsPage
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
        />
      )}

      {currentScreen === 'typing' && (
        <TypingPage
          onNavigateTab={(tab) => setCurrentScreen(tab)}
          onRequestExit={() => setIsExitModalOpen(true)}
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
