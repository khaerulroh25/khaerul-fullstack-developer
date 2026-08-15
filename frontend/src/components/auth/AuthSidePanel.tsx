import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export interface AuthFeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface AuthSidePanelProps {
  badgeText: string;
  title: React.ReactNode;
  description: string;
  features: readonly AuthFeatureItem[];
  securityNote?: string;
  onNavigateToHome: () => void;
}

/**
 * Komponen Sisi Kiri (Hero Panel) terpusat untuk LoginPage dan RegisterPage
 * Mencegah duplikasi markup, visual glow, dan header logo
 */
export const AuthSidePanel: React.FC<AuthSidePanelProps> = React.memo(({
  badgeText,
  title,
  description,
  features,
  securityNote = 'Data akun dan privasi Anda terjamin aman dengan perlindungan enkripsi standar industri.',
  onNavigateToHome,
}) => {
  return (
    <div className="hidden lg:flex flex-col justify-between border-r border-slate-800 bg-slate-900/95 p-12 relative overflow-hidden">
      {/* Efek Visual Latar Belakang */}
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
              <span className="text-xl font-black text-white tracking-tight">yuk</span>
              <span className="text-xl font-black text-amber-400 tracking-tight">Kerja</span>
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

      {/* Konten Value Proposition */}
      <div className="relative z-10 my-8">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-bold text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{badgeText}</span>
        </div>

        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          {title}
        </h2>

        <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-400">
          {description}
        </p>

        <div className="space-y-3.5">
          {features.map((item, idx) => (
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

      {/* Lencana Komitmen Keamanan */}
      <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-sm text-xs text-slate-300">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
        <span>{securityNote}</span>
      </div>
    </div>
  );
});

AuthSidePanel.displayName = 'AuthSidePanel';
