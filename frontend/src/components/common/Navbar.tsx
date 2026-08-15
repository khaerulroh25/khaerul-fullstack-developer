import React, { useState } from "react";
import {
  LogIn,
  LogOut,
  ChevronDown,
  PlusCircle,
  Menu,
  X,
  Search,
  FileCheck,
  Users,
} from "lucide-react";
import type { AuthUser } from "../../types/index.js";

/**
 * Kontrak Properti untuk Komponen Navbar
 */
interface NavbarProps {
  /** Objek data pengguna aktif yang terautentikasi (atau null jika tamu) */
  currentUser: AuthUser | null;
  /** Jumlah total lamaran yang telah diajukan pengguna */
  applicationsCount: number;
  /** Callback untuk berpindah ke halaman pelacak lamaran */
  onNavigateToTracker: () => void;
  /** Callback untuk berpindah ke halaman pemasangan lowongan */
  onNavigateToPostJob: () => void;
  /** Callback untuk berpindah ke halaman manajemen pelamar (ATS) */
  onNavigateToApplicants: () => void;
  /** Callback untuk berpindah ke halaman masuk (login) */
  onNavigateToLogin: () => void;
  /** Callback untuk berpindah ke halaman pendaftaran (register) */
  onNavigateToRegister: () => void;
  /** Callback untuk proses keluar (logout) */
  onLogout: () => void;
  /** Callback untuk scroll ke katalog lowongan kerja di landing page */
  onScrollToJobs: () => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(
  ({
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Helper untuk menutup mobile menu saat navigasi diklik
    const handleMobileNav = (callback: () => void) => {
      setIsMobileMenuOpen(false);
      callback();
    };

    const isRecruiter = currentUser?.role === "RECRUITER";
    const isJobSeeker = currentUser?.role === "JOB_SEEKER";
    const roleDisplay = isRecruiter ? "Perekrut (HR)" : "Pencari Kerja";

    return (
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-[68px]">
          {/* Sisi Kiri: Brand Logo + Menu Navigasi Sejajar */}
          <div className="flex items-center gap-8">
            {/* Brand Logo */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                onScrollToJobs();
              }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-400 font-black text-sm sm:text-base tracking-tighter text-slate-950 shadow-md transition group-hover:scale-105">
                YK
              </div>
              <div>
                <div className="flex items-center leading-none">
                  <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                    yuk
                  </span>
                  <span className="text-lg sm:text-xl font-black text-amber-400 tracking-tight">
                    Kerja
                  </span>
                </div>
                <span className="hidden xs:block sm:block mt-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Portal Karier Indonesia
                </span>
              </div>
            </div>

            {/* Menu Navigasi Desktop Menempel di Kiri */}
            <nav className="hidden md:flex items-center gap-1.5 border-l border-slate-800/80 pl-6">
              <button
                onClick={onScrollToJobs}
                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
              >
                <Search className="h-4 w-4 text-amber-400" />
                <span>Jelajah Lowongan</span>
              </button>

              {/* Menu khusus Pencari Kerja: Status Lamaran */}
              {isJobSeeker && (
                <button
                  onClick={onNavigateToTracker}
                  className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
                >
                  <FileCheck className="h-4 w-4 text-amber-400" />
                  <span>Status Lamaran</span>
                  {applicationsCount > 0 && (
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-black text-slate-950 shadow-sm">
                      {applicationsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Menu khusus Perekrut (HR): Kelola Pelamar */}
              {isRecruiter && (
                <button
                  onClick={onNavigateToApplicants}
                  className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-400 transition hover:bg-amber-400/10"
                >
                  <Users className="h-4 w-4 text-amber-400" />
                  <span>Kelola Pelamar (ATS)</span>
                </button>
              )}
            </nav>
          </div>

          {/* Sisi Kanan: Panel Aksi & Autentikasi */}
          <div className="flex items-center gap-3">
            {/* Tombol Pasang Lowongan Desktop - Khusus Recruiter */}
            {isRecruiter && (
              <button
                onClick={onNavigateToPostJob}
                className="hidden sm:inline-flex items-center gap-1.5 justify-center rounded-xl border border-amber-400/40 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-400 shadow-sm transition hover:border-amber-400 hover:bg-slate-800 hover:text-amber-300 active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Pasang Lowongan</span>
              </button>
            )}

            {/* Sesi Pengguna Aktif (Desktop Dropdown) */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 py-1.5 px-3 select-none transition hover:border-slate-700 hover:bg-slate-800"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="h-7 w-7 rounded-full border border-amber-400 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 font-bold text-xs text-slate-950">
                      {currentUser.fullName.charAt(0)}
                    </div>
                  )}

                  <div className="hidden sm:block text-left pr-1">
                    <span className="block text-xs font-bold text-slate-100 leading-tight">
                      {currentUser.fullName.split(" ")[0]}
                    </span>
                    <span
                      className={`block text-[10px] font-medium ${isRecruiter ? "text-amber-400" : "text-slate-400"}`}
                    >
                      {roleDisplay}
                    </span>
                  </div>

                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu Pengguna */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="mb-1.5 border-b border-slate-800/80 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-xs sm:text-sm font-bold text-white">
                          {currentUser.fullName}
                        </div>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isRecruiter
                              ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {roleDisplay}
                        </span>
                      </div>
                      <div className="truncate text-xs text-slate-400 mt-0.5">
                        {currentUser.email}
                      </div>
                    </div>

                    {/* Menu khusus Recruiter */}
                    {isRecruiter && (
                      <>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigateToPostJob();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-amber-400 transition hover:bg-amber-400/10 sm:hidden"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Pasang Lowongan Baru</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigateToApplicants();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
                        >
                          <Users className="h-4 w-4 text-amber-400" />
                          <span>Kelola Pelamar (ATS)</span>
                        </button>
                      </>
                    )}

                    {/* Menu khusus Job Seeker */}
                    {isJobSeeker && (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onNavigateToTracker();
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileCheck className="h-4 w-4 text-amber-400" />
                          <span>Status Lamaran Saya</span>
                        </div>
                        {applicationsCount > 0 && (
                          <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-black text-slate-950">
                            {applicationsCount}
                          </span>
                        )}
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-800/60" />

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Tombol Masuk / Daftar Tunggal Terpadu (Hanya Tampil di Desktop, di Mobile ada di dalam Drawer) */
              <button
                onClick={onNavigateToLogin}
                className="hidden md:inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk / Daftar</span>
              </button>
            )}

            {/* Tombol Hamburger Menu Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Drawer Navigasi Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/98 px-4 py-4 backdrop-blur-lg animate-in slide-in-from-top-2 duration-150">
            <div className="space-y-2">
              <button
                onClick={() => handleMobileNav(onScrollToJobs)}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-slate-200 transition hover:bg-slate-900 hover:text-amber-400"
              >
                <Search className="h-4 w-4 text-amber-400" />
                <span>Jelajah Lowongan</span>
              </button>

              {/* Menu Pelamar di Mobile */}
              {isJobSeeker && (
                <button
                  onClick={() => handleMobileNav(onNavigateToTracker)}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-slate-200 transition hover:bg-slate-900 hover:text-amber-400"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-4 w-4 text-amber-400" />
                    <span>Status Lamaran Saya</span>
                  </div>
                  {applicationsCount > 0 && (
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950">
                      {applicationsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Menu Recruiter di Mobile */}
              {isRecruiter && (
                <>
                  <button
                    onClick={() => handleMobileNav(onNavigateToApplicants)}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-slate-200 transition hover:bg-slate-900 hover:text-amber-400"
                  >
                    <Users className="h-4 w-4 text-amber-400" />
                    <span>Kelola Pelamar (ATS Recruiter)</span>
                  </button>

                  <button
                    onClick={() => handleMobileNav(onNavigateToPostJob)}
                    className="flex w-full items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-2.5 text-left text-xs font-bold text-amber-400 transition hover:bg-amber-400/20"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Pasang Lowongan Baru</span>
                  </button>
                </>
              )}

              {/* Aksi Autentikasi Mobile */}
              {currentUser ? (
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleMobileNav(onLogout)}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-left text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar ({currentUser.fullName.split(" ")[0]})</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleMobileNav(onNavigateToLogin)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Masuk / Daftar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    );
  },
);

Navbar.displayName = "Navbar";
