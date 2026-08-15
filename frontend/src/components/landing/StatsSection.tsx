import React from "react";
import { Building2, Users, FileCheck2, Award } from "lucide-react";

const PLATFORM_STATS = [
  {
    icon: <Building2 className="h-6 w-6 text-amber-600" />,
    value: "1,200+",
    label: "Perusahaan Terverifikasi",
    desc: "Startup, Unicorn & BUMN",
  },
  {
    icon: <FileCheck2 className="h-6 w-6 text-amber-600" />,
    value: "4,500+",
    label: "Lowongan Kerja Aktif",
    desc: "Diperbarui setiap hari",
  },
  {
    icon: <Users className="h-6 w-6 text-amber-600" />,
    value: "45,000+",
    label: "Kandidat Talenta Unggul",
    desc: "Siap bergabung & direkrut",
  },
  {
    icon: <Award className="h-6 w-6 text-amber-600" />,
    value: "98%",
    label: "Tingkat Kepuasan",
    desc: "Proses hiring transparan",
  },
] as const;

/**
 * Komponen Seksi Metrik & Statistik Platform
 *
 * Menampilkan pencapaian kuantitatif platform untuk membangun kepercayaan pengguna (social proof).
 * Dioptimalkan dengan React.memo dan layout grid Tailwind responsif.
 */
export const StatsSection: React.FC = React.memo(() => {
  return (
    <section className="border-b border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid Kartu Metrik Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50/20"
            >
              {/* Wadah Ikon Metrik */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                {stat.icon}
              </div>

              {/* Rincian Angka & Label */}
              <div>
                <div className="text-xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-400">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = "StatsSection";
