import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Kontrak Properti untuk Komponen CtaBanner
 */
interface CtaBannerProps {
  /** Fungsi untuk mengarahkan layar pengguna ke katalog lowongan kerja (smooth scroll) */
  onScrollToJobs: () => void;
}

/**
 * Komponen Seksi Ajakan Bertindak (Call to Action / CTA Banner)
 *
 * Mendorong konversi pelamar untuk mulai mengeksplorasi lowongan dan mendaftar.
 * Dioptimalkan dengan React.memo dan styling Tailwind CSS responsif.
 */
export const CtaBanner: React.FC<CtaBannerProps> = React.memo(({
  onScrollToJobs,
}) => {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner Penutup Interaktif Beraksen Gelap Modern */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-8 sm:p-12 shadow-2xl">
          {/* Efek Cahaya Latar Belakang (Ambient Light) */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Teks Pesan Ajakan & Manfaat Platform */}
            <div className="max-w-2xl">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="h-4 w-4" />
                Mulai Langkah Karier Anda Sekarang
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Siap Menemukan Peluang Terbaik di Industri Impian Anda?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                Buat profil pelamar dalam 2 menit, lamar pekerjaan hanya dengan 1 klik, dan pantau status seleksi lamaran Anda secara real-time.
              </p>
            </div>

            {/* Tombol Aksi Utama Menuju Katalog Lowongan */}
            <div className="shrink-0">
              <button
                onClick={onScrollToJobs}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-lg transition hover:bg-amber-300 active:scale-95"
              >
                <span>Jelajahi Semua Lowongan</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CtaBanner.displayName = 'CtaBanner';
