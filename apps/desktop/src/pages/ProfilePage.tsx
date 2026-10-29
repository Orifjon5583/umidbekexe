import React, { useState } from 'react';
import { TitleBar } from '../components/TitleBar';
import { TopHeader } from '../components/TopHeader';
import { Sidebar } from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  Users,
  ShieldCheck,
  Cpu,
  Terminal,
  Layers,
  LogOut,
  Moon,
  Sun,
  CheckCircle2,
  HardDrive,
  Code2,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: any) => void;
  onRequestExit: () => void;
}

export const ProfilePage: React.FC<Props> = ({
  onNavigateTab,
  onRequestExit,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors duration-200 ${
        theme === 'dark' ? 'mesh-bg-dark text-slate-100' : 'mesh-bg-light text-slate-900'
      }`}
    >
      <TitleBar />
      <TopHeader
        studentName="Aliyev Asliddin"
        grade="9-A sinf"
        breadcrumb="Profil va tizim holati"
        onRequestExit={onRequestExit}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab="profile"
          onNavigate={onNavigateTab}
          onRequestExit={onRequestExit}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl">
          {/* Sarlavha */}
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <User className="w-6 h-6 text-blue-500" />
              <span>O‘quvchi profili va dastur parametrlari</span>
            </h1>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Shaxsiy ma’lumotlar, biriktirilgan guruh va lokal kompilyatorlar holati
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chap tomondagi profil kartasi */}
            <div
              className={`p-6 rounded-3xl border text-center space-y-4 ${
                theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-xl shadow-blue-500/20">
                A
              </div>

              <div>
                <h3 className="text-lg font-extrabold tracking-tight">Aliyev Asliddin</h3>
                <p className="text-xs text-blue-500 font-mono mt-0.5">@student1</p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  O‘quvchi (Student)
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Guruh:</span>
                  <span className="font-bold">9-A sinf</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">O‘qituvchi:</span>
                  <span className="font-bold">Karimov Jasur</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="font-mono text-slate-400">usr_st_48291</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onRequestExit}
                  className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Ilovadan chiqish</span>
                </button>
              </div>
            </div>

            {/* O'ng tomondagi tizim va sozlamalar kartasi */}
            <div className="md:col-span-2 space-y-4">
              {/* Lokal muhit holati (Python & C++) */}
              <div
                className={`p-6 rounded-3xl border space-y-4 ${
                  theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
                }`}
              >
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Kompyuterdagi dasturlash muhiti diagnostikasi</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        Python Muhiti
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Faol
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">Versiya: Python 3.11.x (Windows)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Lokal kod izolyatsiyasi: Ishga tushirilgan</div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-purple-400" />
                        C++ Muhiti
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Tayyor
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">Kompilyator: MinGW-w64 (GCC 13)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Standart: C++17 (-O2 optimizatsiyalangan)</div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#080C1A] border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Lokal xavfsizlik cheklovlari (Clipboard, Job Objects, Memory Limit) faol</span>
                  </span>
                  <span className="font-mono text-emerald-400 text-[11px] font-bold">100% HIMOYALANGAN</span>
                </div>
              </div>

              {/* Dastur haqida va Mavzu sozlamasi */}
              <div
                className={`p-6 rounded-3xl border space-y-4 ${
                  theme === 'dark' ? 'glass-card-dark border-white/10' : 'glass-card-light border-slate-200 shadow-sm'
                }`}
              >
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span>Dastur sozlamalari va versiya ma’lumotlari</span>
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-bold text-xs">Vizual mavzu (Interfeys rejimi)</div>
                    <div className="text-[11px] text-slate-400">Qorong‘u (Dark) yoki Yorug‘ (Light) rejimni tanlang</div>
                  </div>

                  <button
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                    }`}
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>Yorug‘ rejim</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-blue-600" />
                        <span>Qorong‘u rejim</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>CodePractice Desktop Versiyasi:</span>
                  <span className="font-bold text-blue-500">v2.4.0 (Windows 11 Production)</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
