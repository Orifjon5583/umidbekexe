import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  BarChart3,
  LogOut,
  Code2,
  Gift,
  GraduationCap,
  Sliders,
  ShieldAlert,
  Shield,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

export const DashboardLayout: React.FC<Props> = ({ currentTab, onTabChange, children }) => {
  const userJson = localStorage.getItem('cp_user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('cp_access_token');
    localStorage.removeItem('cp_refresh_token');
    localStorage.removeItem('cp_user');
    window.location.reload();
  };

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teachers', label: 'O‘qituvchilar', icon: GraduationCap, badge: 'Admin' },
    { id: 'groups', label: 'Guruhlar & O‘quvchilar', icon: Users },
    { id: 'problems', label: 'Masalalar banki', icon: Code2 },
    { id: 'assignments', label: 'Topshiriqlar', icon: CheckSquare },
    { id: 'reports', label: 'Umumiy hisobotlar', icon: BarChart3 },
    { id: 'rewards', label: 'Sovg‘alar (Do‘kon)', icon: Gift },
    { id: 'settings', label: 'Tizim sozlamalari', icon: Sliders, badge: 'Admin' },
    { id: 'logs', label: 'Xavfsizlik jurnali', icon: ShieldAlert, badge: 'Admin' },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'groups', label: 'Guruhlarim', icon: Users },
    { id: 'problems', label: 'Masalalar banki', icon: Code2 },
    { id: 'assignments', label: 'Vazifalar', icon: CheckSquare },
    { id: 'reports', label: 'Natijalar va Hisobot', icon: BarChart3 },
    { id: 'rewards', label: 'Sovg‘alar (Do‘kon)', icon: Gift },
  ];

  const navItems = isAdmin ? adminNavItems : teacherNavItems;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-blue-500/30 flex items-center justify-center p-1 shadow-md shadow-blue-500/20 flex-shrink-0">
            <img src="/icon.png" alt="Mintera" className="w-full h-full object-contain" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight truncate">
              Mintera
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              {isAdmin ? 'Administrator Paneli' : 'O‘qituvchi Paneli'}
            </p>
          </div>
        </div>

        {/* Role Badge Indicator in Sidebar */}
        <div className="px-4 pt-4 pb-1">
          <div
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
              isAdmin
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                : 'bg-blue-950/40 border-blue-500/30 text-blue-300'
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>To‘liq Admin Huquqi</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>O‘qituvchi Rejimi</span>
              </>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all h-10 ${
                  isActive
                    ? isAdmin
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-bold text-white truncate">{user?.fullName || (isAdmin ? 'Administrator' : 'O‘qituvchi')}</p>
              <p className="text-[11px] text-slate-400 font-mono">@{user?.username || (isAdmin ? 'admin' : 'teacher1')}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Chiqish"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {navItems.find((n) => n.id === currentTab)?.label || 'Boshqaruv'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                Administrator Paneli
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                O‘qituvchi Paneli
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
