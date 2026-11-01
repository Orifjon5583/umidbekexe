import React, { useState } from 'react';
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
  Menu,
  X,
  MoreHorizontal,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userJson = localStorage.getItem('cp_user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('cp_access_token');
    localStorage.removeItem('cp_refresh_token');
    localStorage.removeItem('cp_user');
    window.location.reload();
  };

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
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

  // Bottom Navigation quick tabs (4 primary items for 1-thumb mobile navigation)
  const bottomQuickTabs: NavItem[] = isAdmin
    ? [
        { id: 'dashboard', label: 'Boshqaruv', icon: LayoutDashboard },
        { id: 'teachers', label: 'O‘qituvchi', icon: GraduationCap },
        { id: 'groups', label: 'Guruhlar', icon: Users },
        { id: 'rewards', label: 'Sovg‘alar', icon: Gift },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'groups', label: 'Guruhlar', icon: Users },
        { id: 'assignments', label: 'Vazifalar', icon: CheckSquare },
        { id: 'rewards', label: 'Sovg‘alar', icon: Gift },
      ];

  const currentTabLabel = navItems.find((n) => n.id === currentTab)?.label || 'Boshqaruv';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Slide-over Drawer on Mobile/Tablet (< lg), Static Sidebar on Desktop (>= lg) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 border-r border-slate-800 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#091128] border border-blue-500/30 flex items-center justify-center p-1 shadow-md shadow-blue-500/20 flex-shrink-0">
              <img src="/icon.png" alt="Mintera" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-base tracking-tight leading-none text-white truncate mb-1">
                Min<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">tera</span>
              </h1>
              <p className="text-[10px] text-amber-400 font-mono font-bold truncate">
                {isAdmin ? 'Administrator Paneli' : 'O‘qituvchi Paneli'}
              </p>
            </div>
          </div>

          {/* Close button for Mobile Drawer */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Menyuni yopish"
          >
            <X className="w-5 h-5" />
          </button>
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
                <ShieldAlert className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="truncate">To‘liq Admin Huquqi</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="truncate">O‘qituvchi Rejimi</span>
              </>
            )}
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all h-10 ${
                  isActive
                    ? isAdmin
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/20 flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex-shrink-0">
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
        {/* Top Header */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Hamburger button for Mobile / Tablet */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer flex-shrink-0"
              title="Menyuni ochish"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Icon */}
            <div className="lg:hidden w-8 h-8 rounded-lg bg-[#091128] border border-blue-500/30 flex items-center justify-center p-0.5 flex-shrink-0">
              <img src="/icon.png" alt="Mintera" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {currentTabLabel}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                <span className="hidden sm:inline">Administrator Paneli</span>
                <span className="sm:hidden">Admin</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="hidden sm:inline">O‘qituvchi Paneli</span>
                <span className="sm:hidden">O‘qituvchi</span>
              </span>
            )}

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Onlayn
            </span>

            {/* Mobile quick logout */}
            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="lg:hidden p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Container (Responsive Padding & Bottom Margin for Mobile Bottom Nav) */}
        <div className="p-3.5 sm:p-5 md:p-6 lg:p-8 flex-1 w-full max-w-full overflow-x-hidden pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile & Tablet Bottom Navigation Bar (Fixed for 1-thumb ergonomics on small screens) */}
      <nav
        className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around pb-[max(env(safe-area-inset-bottom),0.375rem)]"
        aria-label="Mobil tezkor navigatsiya"
      >
        {bottomQuickTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition ${
                isActive
                  ? isAdmin
                    ? 'text-purple-600 font-bold'
                    : 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition ${
                  isActive
                    ? isAdmin
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-blue-50 text-blue-600'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* "Barchasi" / Menu Drawer Trigger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition ${
            isMobileMenuOpen || !bottomQuickTabs.some((t) => t.id === currentTab)
              ? isAdmin
                ? 'text-purple-600 font-bold'
                : 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-lg transition ${
              isMobileMenuOpen || !bottomQuickTabs.some((t) => t.id === currentTab)
                ? isAdmin
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-blue-50 text-blue-600'
                : ''
            }`}
          >
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[64px]">
            Barchasi
          </span>
        </button>
      </nav>
    </div>
  );
};
