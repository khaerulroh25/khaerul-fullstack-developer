import React from 'react';
import { ArrowLeft, Star, Building2, TrendingUp } from 'lucide-react';

export interface AuthFeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface AuthSidePanelProps {
  badgeText: string;
  title: React.ReactNode;
  description: string;
  features?: readonly AuthFeatureItem[];
  onNavigateToHome: () => void;
}

const TRUSTED_COMPANIES = [
  { name: 'GoTo Group', category: 'Tech Unicorn' },
  { name: 'Bank Mandiri', category: 'BUMN Perbankan' },
  { name: 'Traveloka', category: 'Online Travel' },
  { name: 'Tiket.com', category: 'E-Commerce' },
] as const;

/**
 * Komponen Sisi Kiri (Hero Showcase Panel) untuk Autentikasi
 * Desain Light Mode Bersih, Terstruktur, dan Presisi
 */
export const AuthSidePanel: React.FC<AuthSidePanelProps> = React.memo(({
  badgeText,
  title,
  description,
  onNavigateToHome,
}) => {
  return (
    <div className="hidden lg:flex flex-col justify-between border-r border-slate-200 bg-slate-50 p-12 lg:p-14 relative overflow-hidden select-none">
      {/* Background Ambience: Subtle Warm Radial Highlights */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_-20%,rgba(245,158,11,0.08),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />

      {/* Top Header: Brand Logo & Minimal Back Navigation */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateToHome}
          className="group flex items-center gap-3 text-left transition-opacity hover:opacity-90 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 font-black text-base tracking-tighter text-slate-950 shadow-sm transition-transform group-hover:scale-105">
            YK
          </div>
          <div>
            <div className="flex items-center leading-none">
              <span className="text-xl font-black text-slate-950 tracking-tight">yuk</span>
              <span className="text-xl font-black text-amber-600 tracking-tight">Kerja</span>
            </div>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Portal Karier Indonesia
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateToHome}
          className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-800 active:scale-95 focus:outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-slate-500 group-hover:text-amber-600" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 my-auto py-6">
        {/* Subtitle Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>{badgeText}</span>
        </div>

        {/* Headline */}
        <h2 className="mb-3.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-[1.2]">
          {title}
        </h2>

        {/* Description */}
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-slate-600">
          {description}
        </p>

        {/* Live ATS & Candidate Hiring Snapshot Card */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
          <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span>Live Application & Hiring Pipeline</span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Aktif Real-time
            </span>
          </div>

          {/* Timeline Mini Tracker */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
                  GoTo
                </div>
                <div className="truncate">
                  <div className="truncate text-xs font-bold text-slate-900">
                    Senior Fullstack Engineer
                  </div>
                  <div className="text-[11px] text-slate-500">GoTo Group • Jakarta</div>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
                Interview
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800 font-bold text-xs">
                  TVLK
                </div>
                <div className="truncate">
                  <div className="truncate text-xs font-bold text-slate-900">
                    Lead Product Designer
                  </div>
                  <div className="text-[11px] text-slate-500">Traveloka • BSD City</div>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                Offered
              </span>
            </div>
          </div>

          {/* Recruiter Endorsement Quote */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <span className="font-bold text-slate-800 text-[11px]">4.9 / 5.0 Rating Kepuasan</span>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              1.200+ Lowongan Aktif
            </span>
          </div>
        </div>

        {/* Structured Partner Ecosystem Showcase */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Dipercaya Perekrut Perusahaan:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TRUSTED_COMPANIES.map((comp) => (
              <div
                key={comp.name}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xs transition-colors hover:border-amber-300"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-slate-800">{comp.name}</div>
                  <div className="truncate text-[10px] text-slate-400">{comp.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom: Trust Signal & Social Proof Avatars */}
      <div className="relative z-10 flex items-center justify-between border-t border-slate-200 pt-6">
        <div className="flex items-center gap-3">
          {/* Candidate Avatars Stack */}
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
              alt="Talent User 1"
            />
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
              alt="Talent User 2"
            />
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100"
              alt="Talent User 3"
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-bold text-[10px] text-slate-950 ring-2 ring-white">
              +45k
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">45.000+ Talenta Profesional</div>
            <div className="text-[11px] text-slate-500">Telah menemukan karier impian</div>
          </div>
        </div>
      </div>
    </div>
  );
});

AuthSidePanel.displayName = 'AuthSidePanel';
