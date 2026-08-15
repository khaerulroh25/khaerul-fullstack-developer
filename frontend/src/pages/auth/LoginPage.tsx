import React, { useState } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Sparkles,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  Star,
  ShieldCheck,
} from 'lucide-react';
import type { AuthUser } from '../../types/index.js';

/**
 * Daftar poin keunggulan platform (Value Propositions)
 * Didefinisikan di level modul untuk mencegah alokasi memori berulang saat re-render
 */
const VALUE_PROPOSITIONS = [
  {
    icon: <Building2 className="h-5 w-5 text-amber-400 shrink-0" />,
    title: '1,200+ Perusahaan Terverifikasi',
    desc: 'Lowongan resmi dari ekosistem Startup, Unicorn & BUMN nasional.',
  },
  {
    icon: <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />,
    title: 'Pelacakan Status Lamaran Real-Time',
    desc: 'Ketahui setiap tahapan: Screening, Interview hingga Offering Letter.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />,
    title: 'Privasi & Keamanan Terjamin',
    desc: 'Data profil dan dokumen resume Anda aman dan terenkripsi.',
  },
] as const;

/**
 * Kontrak Properti untuk Komponen LoginPage
 */
interface LoginPageProps {
  /** Callback saat autentikasi akun berhasil */
  onLoginSuccess: (user: AuthUser) => void;
  /** Callback untuk berpindah ke halaman pendaftaran */
  onNavigateToRegister: () => void;
  /** Callback untuk kembali ke halaman utama / beranda */
  onNavigateToHome: () => void;
}

/**
 * Komponen Halaman Masuk Akun (LoginPage)
 *
 * Menyediakan antarmuka login formulir email/password, fitur pintasan 1-klik Akun Demo,
 * panel branding & testimonial pelamar, serta validasi form interaktif.
 * Dioptimalkan dengan React.memo dan styling murni Tailwind CSS responsif.
 */
export const LoginPage: React.FC<LoginPageProps> = React.memo(({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fitur Login Cepat 1-Klik untuk Evaluasi / Demo Akun
  const handleQuickLogin = () => {
    const demoUser: AuthUser = {
      id: 'usr-demo-pelamar',
      email: 'pelamar@indokerja.id',
      fullName: 'Ahmad Farhan Pratama',
      role: 'JOB_SEEKER',
      phone: '085712345678',
      avatarUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    };
    onLoginSuccess(demoUser);
  };

  // Handler pengiriman formulir masuk
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password minimal 6 karakter';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      const loggedInUser: AuthUser = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        fullName: email.split('@')[0],
        role: 'JOB_SEEKER',
      };

      setIsLoading(false);
      onLoginSuccess(loggedInUser);
    }, 400);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] bg-slate-950 text-white">
      {/* Panel Promosi & Identitas Brand Sisi Kiri */}
      <div className="hidden lg:flex flex-col justify-between border-r border-slate-800 bg-slate-900/95 p-12 relative overflow-hidden">
        {/* Efek Visual Latar Belakang (Ambient Light Glow) */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        {/* Header Panel: Logo & Tombol Kembali */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-3 select-none text-left transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 font-black text-base tracking-tighter text-slate-950 shadow-md">
              YK
            </div>
            <div>
              <div className="flex items-center leading-none">
                <span className="text-xl font-black tracking-tight text-white">yuk</span>
                <span className="text-xl font-black tracking-tight text-amber-400">Kerja</span>
              </div>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Portal Karier Indonesia
              </span>
            </div>
          </button>

          <button
            onClick={onNavigateToHome}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-sm transition hover:border-amber-400 hover:text-amber-400 active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </button>
        </div>

        {/* Konten Promosi & Poin Nilai Tambah Platform */}
        <div className="relative z-10 my-8">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-bold text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Portal Karier Terpercaya di Indonesia</span>
          </div>

          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Akselerasi Karier Impian & Temukan{' '}
            <span className="text-amber-400">Peluang Terbaik</span>
          </h2>

          <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-400">
            Masuk untuk mengakses ribuan lowongan kerja terverifikasi, melamar dalam 1-klik, dan pantau status tahapan seleksi secara transparan.
          </p>

          {/* Daftar Keunggulan Layanan */}
          <div className="space-y-3.5">
            {VALUE_PROPOSITIONS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-sm transition hover:border-slate-700"
              >
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kartu Testimonial & Bukti Sosial */}
        <div className="relative z-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1.5 text-xs font-bold text-slate-200">
              4.9 / 5.0 Rating Kepuasan Pelamar
            </span>
          </div>

          <p className="text-xs italic leading-relaxed text-slate-300">
            "Proses melamar di yukKerja sangat cepat dan status interview terpantau jelas. Saya diterima sebagai Senior Engineer dalam 2 minggu!"
          </p>

          <div className="mt-3 flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100"
              alt="Ahmad Farhan"
              className="h-7 w-7 rounded-full object-cover border border-slate-700"
            />
            <span className="text-xs font-semibold text-amber-400">
              Ahmad Farhan Pratama — Pelamar Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* Panel Formulir Masuk Sisi Kanan */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Header Formulir */}
          <div className="mb-8">
            <button
              onClick={onNavigateToHome}
              className="lg:hidden mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Beranda</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Selamat Datang Kembali
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Masuk ke akun <strong className="text-slate-200">yukKerja</strong> untuk melamar & memantau lowongan kerja
            </p>
          </div>

          {/* Kotak Pintasan 1-Klik Login Akun Demo */}
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-sm">
            <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Login Cepat Akun Demo (1-Klik)</span>
            </div>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
            >
              <UserCheck className="h-4 w-4" />
              <span>Masuk Sebagai Ahmad Farhan (Pelamar Demo)</span>
            </button>
          </div>

          {/* Pembatas Garis Pemisah */}
          <div className="mb-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-800" />
            <span>atau masuk dengan email</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Formulir Autentikasi Email & Password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className={`w-full rounded-xl border bg-slate-900 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-400/20'
                      : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400/20'
                  }`}
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>
              {errors.email && (
                <span className="mt-1 block text-xs font-medium text-rose-400">{errors.email}</span>
              )}
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-900 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-400/20'
                      : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400/20'
                  }`}
                />
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="mt-1 block text-xs font-medium text-rose-400">{errors.password}</span>
              )}
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition hover:bg-amber-300 disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Navigasi Pendaftaran Akun Baru */}
          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
            Belum memiliki akun?{' '}
            <button
              onClick={onNavigateToRegister}
              className="font-bold text-amber-400 hover:underline underline-offset-4"
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

LoginPage.displayName = 'LoginPage';
