import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Award,
  Zap,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Check,
} from 'lucide-react';
import type { AuthUser, UserRole } from '../../types/index.js';
import { authService } from '../../services/auth.service.js';
import { parseApiError } from '../../services/api.js';
import { AuthSidePanel, type AuthFeatureItem } from '../../components/auth/AuthSidePanel.js';

const REGISTER_FEATURES: readonly AuthFeatureItem[] = [
  {
    icon: <Zap className="h-5 w-5 text-amber-400 shrink-0" />,
    title: 'Lamar Cepat 1-Klik',
    desc: 'Simpan dokumen resume sekali, lamar ke ratusan posisi lowongan tanpa repot.',
  },
  {
    icon: <Award className="h-5 w-5 text-amber-400 shrink-0" />,
    title: 'Rekomendasi Karier Personal',
    desc: 'Dapatkan notifikasi peluang kerja yang cocok dengan keahlian dan minat Anda.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />,
    title: 'Keamanan Data Pelamar',
    desc: 'Informasi kontak dan riwayat karier Anda terlindungi dengan enkripsi standar industri.',
  },
] as const;

interface RegisterPageProps {
  onRegisterSuccess: (user: AuthUser) => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

/**
 * Komponen Halaman Pendaftaran Akun (RegisterPage)
 */
export const RegisterPage: React.FC<RegisterPageProps> = React.memo(({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateToHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('JOB_SEEKER');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handler pengiriman form pendaftaran
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Nama lengkap minimal 2 karakter';
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!password || password.length < 8) {
      errs.password = 'Password minimal harus 8 karakter';
    } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      errs.password = 'Password harus mengandung kombinasi huruf dan angka';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { user } = await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
      });

      onRegisterSuccess(user);
    } catch (err) {
      const { message, fieldErrors } = parseApiError(
        err,
        'Pendaftaran gagal. Silakan periksa kembali data Anda.'
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
        badgeText="Gratis 100% untuk Seluruh Pencari Kerja"
        title={
          <>
            Mulai Langkah Karier Gemilang Bersama{' '}
            <span className="text-amber-400">yukKerja</span>
          </>
        }
        description="Daftarkan diri Anda dalam 2 menit dan dapatkan akses prioritas ke ribuan peluang kerja di perusahaan terdepan Indonesia."
        features={REGISTER_FEATURES}
        onNavigateToHome={onNavigateToHome}
      />

      {/* Panel Formulir Pendaftaran Sisi Kanan */}
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
              Buat Akun Baru
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Bergabung dengan ribuan talenta profesional di <strong className="text-slate-200">yukKerja</strong>
            </p>
          </div>

          {/* Alert General Error */}
          {generalError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Formulir Pendaftaran */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pemilihan Peran (Role Selector dengan Checklist Indikator) */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Daftar Sebagai (Pilih Peran Akun):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Opsi 1: Pencari Kerja (Default) */}
                <button
                  type="button"
                  onClick={() => setRole('JOB_SEEKER')}
                  className={`flex w-full text-left cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-all select-none focus:outline-none ${
                    role === 'JOB_SEEKER'
                      ? 'border-amber-400 bg-amber-400/10 text-white shadow-sm ring-1 ring-amber-400/30'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      role === 'JOB_SEEKER'
                        ? 'border-amber-400 bg-amber-400 text-slate-950 shadow-sm'
                        : 'border-slate-700 bg-slate-800 text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <User className={`h-3.5 w-3.5 ${role === 'JOB_SEEKER' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className={role === 'JOB_SEEKER' ? 'text-amber-300' : 'text-slate-200'}>
                        Pencari Kerja
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400 leading-tight">
                      Mencari & melamar pekerjaan
                    </p>
                  </div>
                </button>

                {/* Opsi 2: Perekrut (HR) */}
                <button
                  type="button"
                  onClick={() => setRole('RECRUITER')}
                  className={`flex w-full text-left cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-all select-none focus:outline-none ${
                    role === 'RECRUITER'
                      ? 'border-amber-400 bg-amber-400/10 text-white shadow-sm ring-1 ring-amber-400/30'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      role === 'RECRUITER'
                        ? 'border-amber-400 bg-amber-400 text-slate-950 shadow-sm'
                        : 'border-slate-700 bg-slate-800 text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Briefcase className={`h-3.5 w-3.5 ${role === 'RECRUITER' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className={role === 'RECRUITER' ? 'text-amber-300' : 'text-slate-200'}>
                        Perekrut (HR)
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400 leading-tight">
                      Pasang lowongan & rekrut
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-fullname" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Ahmad Farhan Pratama"
                  className={`w-full rounded-xl border bg-slate-900 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                    errors.fullName
                      ? 'border-rose-500 focus:ring-rose-400/20'
                      : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400/20'
                  }`}
                />
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>
              {errors.fullName && (
                <span className="mt-1 block text-xs font-medium text-rose-400">{errors.fullName}</span>
              )}
            </div>

            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  id="reg-email"
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
              <label htmlFor="reg-phone" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Nomor Telepon / WhatsApp (Opsional)
              </label>
              <div className="relative">
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Kata Sandi (Min. 8 karakter, kombinasi huruf & angka)
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter (huruf & angka)"
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
                <span>Mendaftarkan Akun...</span>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Navigasi Sudah Punya Akun */}
          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
            Sudah memiliki akun?{' '}
            <button
              onClick={onNavigateToLogin}
              className="font-bold text-amber-400 hover:underline underline-offset-4"
            >
              Masuk ke Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

RegisterPage.displayName = 'RegisterPage';
