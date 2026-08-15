import React from 'react';
import { ShieldCheck, Mail, MapPin } from 'lucide-react';

/**
 * Komponen Footer Aplikasi (Global Footer)
 *
 * Menampilkan ringkasan identitas brand, tautan navigasi pencari kerja & recruiter,
 * informasi kontak bantuan, serta hak cipta platform.
 * Dioptimalkan dengan React.memo dan styling Tailwind CSS responsif.
 */
export const Footer: React.FC = React.memo(() => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid Informasi Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12">
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
              Platform ekosistem rekrutmen digital terdepan di Indonesia. Menghubungkan talenta unggul dengan perusahaan terkemuka secara transparan, aman, dan real-time.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
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

          {/* Kolom Kontak & Bantuan */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Bantuan & Layanan
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <a href="mailto:support@yukkerja.id" className="transition hover:text-amber-400">
                  support@yukkerja.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Jakarta Selatan, DKI Jakarta</span>
              </li>
              <li>
                <span className="transition hover:text-amber-400 cursor-pointer">
                  Kebijakan Privasi
                </span>
              </li>
              <li>
                <span className="transition hover:text-amber-400 cursor-pointer">
                  Syarat & Ketentuan
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pembatas & Baris Hak Cipta Bawah */}
        <div className="border-t border-slate-800/80 pt-8 text-center text-xs text-slate-500">
          <p>© 2026 <strong className="text-slate-400">yukKerja.id</strong>. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
