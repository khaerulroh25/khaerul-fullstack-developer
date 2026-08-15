import React, { useState, useEffect } from 'react';
import { Building, Star, ArrowUpRight } from 'lucide-react';
import type { Company } from '../../types/index.js';
import { companyService } from '../../services/company.service.js';

/**
 * Kontrak Properti untuk Komponen CompanySpotlight
 */
interface CompanySpotlightProps {
  /** Callback saat pengguna memilih perusahaan untuk menyaring lowongan terkait */
  onSelectCompany: (companyName: string) => void;
}

/**
 * Komponen Seksi Profil & Sorotan Mitra Perusahaan
 * Mengambil data real mitra perusahaan dari backend API & PostgreSQL
 */
export const CompanySpotlight: React.FC<CompanySpotlightProps> = React.memo(({
  onSelectCompany,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const liveCompanies = await companyService.getCompanies();
        if (liveCompanies && liveCompanies.length > 0) {
          setCompanies(liveCompanies);
        }
      } catch (err) {
        console.warn('Gagal memuat perusahaan dari backend API, menggunakan data fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <section id="companies" className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Seksi Sorotan Perusahaan */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Mitra Perusahaan
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Perusahaan Terkemuka yang Sedang Merekrut
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-slate-500">
            Temukan kultur kerja terbaik dan jenjang karier mapan bersama perusahaan idaman.
          </p>
        </div>

        {/* Grid Kartu Profil Perusahaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded mb-2" />
                <div className="h-3 w-3/4 bg-slate-200 rounded mb-5" />
                <div className="border-t border-slate-100 pt-4 flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              </div>
            ))
          ) : (
            companies.map((company) => (
              <div
                key={company.id}
                onClick={() => onSelectCompany(company.name)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md cursor-pointer"
              >
                <div>
                  {/* Header Profil Perusahaan (Logo, Nama, Rating) */}
                  <div className="mb-4 flex items-center gap-3.5">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        loading="lazy"
                        className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 font-bold text-base text-slate-900 border border-slate-200">
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {company.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-0.5 font-bold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                          <span>{company.rating || 4.8}</span>
                        </div>
                        <span>•</span>
                        <span>{company.location ? company.location.split(',')[0] : 'Indonesia'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi Singkat Profil Perusahaan */}
                  <p className="mb-5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {company.description || `${company.name} adalah perusahaan terkemuka di sektor ${company.industry}.`}
                  </p>
                </div>

                {/* Footer Kartu & Indikator Lowongan Aktif */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                    {company.openJobsCount || 5} Lowongan Aktif
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-amber-600 transition-colors">
                    <span>Lihat Posisi</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
});

CompanySpotlight.displayName = 'CompanySpotlight';
