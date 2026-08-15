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
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import type { AuthUser } from '../../types/index.js';

/**
 * Daftar poin keunggulan pendaftaran akun baru
 * Didefinisikan di level modul untuk mencegah alokasi memori berulang saat re-render
 */
const REGISTER_BENEFITS = [
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

/**
 * Kontrak Properti untuk Komponen RegisterPage
 */
interface RegisterPageProps {
  /** Callback saat pendaftaran akun baru berhasil */
  onRegisterSuccess: (user: AuthUser) => void;
  /** Callback untuk berpindah ke halaman masuk (login) */
  onNavigateToLogin: () => void;
  /** Callback untuk kembali ke halaman utama / beranda */
  onNavigateToHome: () => void;
}

/**
 * Komponen Halaman Pendaftaran Akun (RegisterPage)
 *
 * Menyediakan antarmuka pembuatan akun pelamar baru dengan validasi form komprehensif,
 * panel benefit pendaftaran, serta navigasi integrasi autentikasi.
 * Dioptimalkan dengan React.memo dan styling murni Tailwind CSS responsif.
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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handler pengiriman form pendaftaran
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Nama lengkap minimal 2 karakter';
    }
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
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        fullName: fullName.trim(),
        role: 'JOB_SEEKER',
        phone: phone.trim() || undefined,
        avatarUrl:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      };

      setIsLoading(false);
      onRegisterSuccess(newUser);
    }, 400);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] bg-slate-950 text-white">
      {/* Panel Keunggulan & Branding Sisi Kiri */}
      <div className="hidden lg:flex flex-col justify-between border-r border-slate-800 bg-slate-900/95 p-12 relative overflow-hidden">
        {/* Efek Cahaya Latar Belakang (Ambient Light Glow) */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        {/* Header Panel: Logo Brand & Tombol Kembali */}
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

        {/* Konten Manfaat Pembuatan Akun */}
        <div className="relative z-10 my-8">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-bold text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Gratis 100% untuk Seluruh Pencari Kerja</span>
          </div>

          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Mulai Langkah Karier Gemilang Bersama{' '}
            <span className="text-amber-400">yukKerja</span>
          </h2>

          <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-400">
            Daftarkan diri Anda dalam 2 menit dan dapatkan akses prioritas ke ribuan peluang kerja di perusahaan terdepan Indonesia.
          </p>

          {/* Daftar Keuntungan Bergabung */}
          <div className="space-y-3.5">
            {REGISTER_BENEFITS.map((item, idx) => (
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

        {/* Lencana Komitmen Keamanan Platform */}
        <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-sm text-xs text-slate-300">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>Seluruh lowongan telah melalui proses kurasi dan verifikasi legalitas perusahaan.</span>
        </div>
      </div>

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

          {/* Formulir Pendaftaran */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama Lengkap */}
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

            {/* Input Email */}
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

            {/* Input Nomor Telepon */}
            <div>
              <label htmlFor="reg-phone" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Nomor Telepon (WhatsApp)
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

            {/* Input Password */}
            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
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

            {/* Tombol Buat Akun */}
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
