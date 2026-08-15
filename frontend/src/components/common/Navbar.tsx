import React, { useState } from 'react';
import {
  LogIn,
  LogOut,
  ChevronDown,
  PlusCircle,
} from 'lucide-react';
import type { AuthUser } from '../../types/index.js';

interface NavbarProps {
  currentUser: AuthUser | null;
  applicationsCount: number;
  onNavigateToTracker: () => void;
  onNavigateToPostJob: () => void;
  onNavigateToApplicants: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onLogout: () => void;
  onScrollToJobs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  applicationsCount,
  onNavigateToTracker,
  onNavigateToPostJob,
  onNavigateToApplicants,
  onNavigateToLogin,
  onLogout,
  onScrollToJobs,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px]">
        {/* Left: Brand Logo */}
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onScrollToJobs();
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-base tracking-tighter shadow-md group-hover:scale-105 transition-transform">
            YK
          </div>
          <div>
            <div className="flex items-center leading-none">
              <span className="text-xl font-black text-white tracking-tight">
                yuk
              </span>
              <span className="text-xl font-black text-yellow-400 tracking-tight">
                Kerja
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold block mt-0.5">
              Portal Karier Indonesia
            </span>
          </div>
        </div>

        {/* Center: Clean Text Navigation Links (No Icons) */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={onScrollToJobs}
            className="text-slate-300 hover:text-white hover:bg-slate-800/60 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Jelajah Lowongan
          </button>

          <button
            onClick={onNavigateToTracker}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800/60 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <span>Status Lamaran</span>
            {applicationsCount > 0 && (
              <span className="bg-yellow-400 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                {applicationsCount}
              </span>
            )}
          </button>

          <button
            onClick={onNavigateToApplicants}
            className="text-slate-300 hover:text-white hover:bg-slate-800/60 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Kelola Pelamar
          </button>
        </nav>

        {/* Right: Actions (Post Job CTA & User Profile) */}
        <div className="flex items-center gap-3">
          {/* Post Job Action Button */}
          <button
            onClick={onNavigateToPostJob}
            className="hidden sm:inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-yellow-400 hover:text-yellow-300 border border-yellow-400/40 hover:border-yellow-400 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
          >
            <span>Pasang Lowongan</span>
          </button>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="relative">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 py-1.5 px-3 rounded-full cursor-pointer transition-all select-none"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-yellow-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                )}

                <div className="hidden sm:block text-left pr-1">
                  <span className="text-xs font-bold text-slate-100 block leading-tight">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-yellow-400 font-medium block">
                    Pelamar / HR
                  </span>
                </div>

                <ChevronDown size={14} className="text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] bg-slate-900 border border-slate-800 rounded-2xl p-2 w-60 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-3 border-b border-slate-800/80 mb-1.5">
                    <div className="text-sm font-bold text-white truncate">
                      {currentUser.fullName}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {currentUser.email}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onNavigateToPostJob();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-xl text-xs font-bold transition-colors text-left cursor-pointer sm:hidden"
                  >
                    <PlusCircle size={15} />
                    <span>Pasang Lowongan Baru</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onNavigateToTracker();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer"
                  >
                    <span>Status Lamaran Saya</span>
                    {applicationsCount > 0 && (
                      <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {applicationsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onNavigateToApplicants();
                    }}
                    className="w-full flex items-center px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer"
                  >
                    <span>Kelola Kandidat (ATS)</span>
                  </button>

                  <div className="my-1 border-t border-slate-800/60" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onNavigateToLogin}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <LogIn size={15} />
              <span>Masuk / Daftar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
