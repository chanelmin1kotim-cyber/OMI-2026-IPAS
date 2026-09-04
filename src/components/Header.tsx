import React from 'react';
import {
  Sparkles,
  Trophy,
  BookOpen,
  UserCheck,
  Flame,
  GraduationCap,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  profile: UserProfile;
  onOpenAiAssistant: () => void;
  onToggleRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  profile,
  onOpenAiAssistant,
  onToggleRole,
}) => {
  const userInitials = profile.name
    ? profile.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'AZ';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex cursor-pointer items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c4a6e] text-white shadow-md shadow-sky-900/20 group-hover:scale-105 transition-transform">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 text-base sm:text-lg">
                OMI IPAS <span className="text-sky-600">2026</span>
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Madrasah Indonesia
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 sm:block font-medium">
              Bank Soal Olimpiade Madrasah Indonesia
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'home'
                ? 'bg-white text-sky-700 shadow-xs ring-1 ring-slate-200/80 border-b-2 border-b-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            Beranda
          </button>
          <button
            onClick={() => setCurrentView('topics')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'topics'
                ? 'bg-white text-sky-700 shadow-xs ring-1 ring-slate-200/80 border-b-2 border-b-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Bank Materi
          </button>
          <button
            onClick={() => setCurrentView('ai-generator')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'ai-generator'
                ? 'bg-white text-sky-700 shadow-xs ring-1 ring-slate-200/80 border-b-2 border-b-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            AI Generator
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'dashboard'
                ? 'bg-white text-sky-700 shadow-xs ring-1 ring-slate-200/80 border-b-2 border-b-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Hasil Saya
          </button>
          <button
            onClick={() => setCurrentView('teacher')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'teacher'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/80 border-b-2 border-b-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Portal Guru
          </button>
        </nav>

        {/* Right Tools & User Info */}
        <div className="flex items-center gap-2.5">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-[#0c4a6e] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-110 active:scale-95 transition-all"
            title="Buka Asisten AI Kak Sains"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">Kak Sains AI</span>
          </button>

          {/* Daily Streak */}
          <div
            className="flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200/90 px-2.5 py-1 text-xs font-bold text-amber-800"
            title={`Streak Latihan: ${profile.streakDays} hari berturut-turut!`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
            <span>{profile.streakDays} Hari</span>
          </div>

          {/* User Badge - Professional Polish Style */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-2.5 py-1 shadow-xs">
            <div className="text-right hidden lg:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {profile.name || 'Ahmad Zaki'}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                MI • Kelas {profile.grade}
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#0c4a6e] text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
              {userInitials}
            </div>
          </div>

          {/* Role Switcher Pill */}
          <button
            onClick={onToggleRole}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            title="Klik untuk beralih mode Siswa / Guru"
          >
            <UserCheck className="h-3.5 w-3.5 text-sky-600" />
            <span>{profile.role === 'student' ? 'Siswa' : 'Guru'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
