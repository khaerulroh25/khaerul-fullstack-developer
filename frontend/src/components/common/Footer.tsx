import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

/**
 * Komponen Footer Aplikasi (Global Footer)
 *
 * Menampilkan ringkasan identitas brand, tautan navigasi pencari kerja & recruiter,
 * informasi arsitektur teknologi, serta hak cipta platform.
 * Dioptimalkan dengan React.memo dan styling murni Tailwind CSS responsif.
 */
export const Footer: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid Informasi Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12">
          {/* Kolom Profil & Identitas Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
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
            </div>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400">
              Platform simulasi dan ekosistem rekrutmen digital terdepan di Indonesia. Menghubungkan talenta unggul dengan perusahaan terkemuka secara transparan dan real-time.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Lowongan Terverifikasi & Bebas Penipuan</span>
            </div>
          </div>

          {/* Kolom Navigasi Pencari Kerja */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Pencari Kerja
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#jobs-catalog" className="transition hover:text-amber-400">
                  Jelajah Lowongan
                </a>
              </li>
              <li>
                <a href="#categories" className="transition hover:text-amber-400">
                  Kategori Populer
                </a>
              </li>
              <li>
                <a href="#companies" className="transition hover:text-amber-400">
                  Mitra Perusahaan
                </a>
              </li>
              <li>
                <a href="#jobs-catalog" className="transition hover:text-amber-400">
                  Pekerjaan Remote
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom Navigasi Recruiter & HR */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Perusahaan & HR
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="cursor-pointer transition hover:text-amber-400">
                  Pasang Lowongan Baru
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition hover:text-amber-400">
                  Applicant Tracking System (ATS)
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition hover:text-amber-400">
                  Manajemen Pipeline Kandidat
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition hover:text-amber-400">
                  Solusi Hiring Enterprise
                </span>
              </li>
            </ul>
          </div>

          {/* Kolom Standar Rekayasa Perangkat Lunak */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Teknologi Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>React 19 + TypeScript</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Tailwind CSS Utility Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Node.js + Clean Architecture</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>PostgreSQL + Prisma ORM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pembatas & Baris Hak Cipta Bawah */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-500">
          <div>
            © 2026 <strong className="text-slate-400">yukKerja.id</strong>. Seluruh hak cipta dilindungi undang-undang.
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Dibuat dengan dedikasi</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 inline" />
            <span>untuk talenta Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
