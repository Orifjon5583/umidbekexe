import React from 'react';
import { LayoutDashboard, Users, BookOpen, CheckSquare, BarChart3, LogOut, Code2, ShieldAlert } from 'lucide-react';

interface Props {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ currentTab, onTabChange, children }) => {
  const userJson = localStorage.getItem('cp_user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('cp_access_token');
    localStorage.removeItem('cp_refresh_token');
    localStorage.removeItem('cp_user');
    window.location.reload();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'groups', label: 'Guruhlar', icon: Users },
    { id: 'problems', label: 'Masalalar banki', icon: Code2 },
    { id: 'assignments', label: 'Vazifalar', icon: CheckSquare },
    { id: 'reports', label: 'Natijalar va Hisobot', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow">
            CP
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">CodePractice</h1>
            <p className="text-xs text-slate-400">O‘qituvchi boshqaruv paneli</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-colors h-11 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.fullName || 'O‘qituvchi'}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role || 'teacher'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Chiqish"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {navItems.find((n) => n.id === currentTab)?.label || 'Boshqaruv'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Onlayn
            </span>
          </div>
        </header>

        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
