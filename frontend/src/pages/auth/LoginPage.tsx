import React, { useState, useCallback } from 'react';
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
  ShieldCheck,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import type { AuthUser } from '../../types/index.js';
import { authService } from '../../services/auth.service.js';
import { parseApiError } from '../../services/api.js';
import { AuthSidePanel, type AuthFeatureItem } from '../../components/auth/AuthSidePanel.js';

const LOGIN_FEATURES: readonly AuthFeatureItem[] = [
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

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateToRegister: () => void;
  onNavigateToHome: () => void;
}

/**
 * Komponen Halaman Masuk Akun (LoginPage)
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
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fitur Login Cepat 1-Klik untuk Evaluasi / Demo Akun
  const handleQuickLogin = useCallback(async (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setGeneralError(null);
    setErrors({});
    setIsLoading(true);

    try {
      const { user } = await authService.login({ email: quickEmail, password: quickPass });
      onLoginSuccess(user);
    } catch (err) {
      const parsed = parseApiError(err, 'Gagal masuk akun demo.');
      setGeneralError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }, [onLoginSuccess]);

  // Handler pengiriman formulir masuk ke Backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const errs: Record<string, string> = {};

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!password || password.length < 1) {
      errs.password = 'Password wajib diisi';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { user } = await authService.login({ email: email.trim(), password });
      onLoginSuccess(user);
    } catch (err) {
      const { message, fieldErrors } = parseApiError(
        err,
        'Gagal masuk. Periksa kembali email dan kata sandi Anda.'
      );
      setGeneralError(message);
      setErrors(fieldErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] bg-slate-950 text-white">
      {/* Panel Hero & Branding Sisi Kiri (Komponen Reusable) */}
      <AuthSidePanel
        badgeText="Platform Rekrutmen & Karier Terintegrasi"
        title={
          <>
            Akses Ratusan Peluang Karier Terbaik di{' '}
            <span className="text-amber-400">Indonesia</span>
          </>
        }
        description="Masuk untuk mengakses dasbor pelamar, memantau kemajuan seleksi lowongan, atau mengelola pipeline ATS kandidat."
        features={LOGIN_FEATURES}
        onNavigateToHome={onNavigateToHome}
      />

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

          {/* Alert General Error */}
          {generalError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Kotak Pintasan 1-Klik Login Akun Demo */}
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-sm">
            <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pintasan Cepat Evaluasi Demo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('pelamar@indokerja.id', 'Password123!')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95 disabled:opacity-50"
              >
                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Pelamar (Job Seeker)</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('recruiter.goto@indokerja.id', 'Password123!')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 shadow-sm transition hover:border-amber-400 hover:text-amber-400 active:scale-95 disabled:opacity-50"
              >
                <Briefcase className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>Perekrut (Recruiter)</span>
              </button>
            </div>
          </div>

          {/* Pembatas Garis Pemisah */}
          <div className="mb-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-800" />
            <span>atau masuk dengan akun terdaftar</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Formulir Autentikasi */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Navigasi Pendaftaran */}
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
