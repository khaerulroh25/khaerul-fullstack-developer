import React, { useState, useMemo } from 'react';
import {
  BookmarkCheck,
  Clock,
  MessageSquare,
  ExternalLink,
  Search,
  ArrowLeft,
  Briefcase,
  X,
} from 'lucide-react';
import type { Application, ApplicationStatus, Job } from '../../types/index.js';
import { formatDateID } from '../../utils/formatters.js';

/**
 * Tahapan runtutan status seleksi pelamar
 */
const TRACKER_STEPS: ApplicationStatus[] = [
  'Applied',
  'Reviewing',
  'Shortlisted',
  'Accepted',
];

/**
 * Filter tab status pelacakan lamaran
 */
const TRACKER_STATUS_TABS = [
  { id: 'ALL', label: 'Semua' },
  { id: 'Applied', label: 'Applied' },
  { id: 'Reviewing', label: 'Reviewing' },
  { id: 'Shortlisted', label: 'Shortlisted' },
  { id: 'Accepted', label: 'Accepted' },
  { id: 'Rejected', label: 'Rejected' },
] as const;

/**
 * Kontrak Properti untuk Komponen ApplicationTrackerPage
 */
interface ApplicationTrackerPageProps {
  /** Daftar seluruh berkas lamaran yang telah diajukan pengguna */
  applications: Application[];
  /** Callback untuk kembali ke halaman utama / beranda */
  onNavigateToHome: () => void;
  /** Callback untuk scroll ke katalog lowongan kerja */
  onNavigateToJobs: () => void;
  /** Callback untuk melihat rincian detail lowongan kerja */
  onViewJobDetail: (job: Job) => void;
}

/**
 * Komponen Halaman Pelacak Status Lamaran (ApplicationTrackerPage)
 *
 * Menampilkan status progresif pelamar (Applied -> Reviewing -> Shortlisted -> Accepted/Rejected),
 * feedback & undangan interview dari tim HR, serta riwayat lamaran yang diajukan.
 * Dioptimalkan dengan React.memo, useMemo filter, dan styling Tailwind CSS responsif.
 */
export const ApplicationTrackerPage: React.FC<ApplicationTrackerPageProps> = React.memo(({
  applications,
  onNavigateToHome,
  onNavigateToJobs,
  onViewJobDetail,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Komputasi filter lamaran (Memoized)
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (selectedStatus !== 'ALL' && app.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = app.job.title.toLowerCase().includes(q);
        const matchCompany = app.job.company.name.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany) return false;
      }
      return true;
    });
  }, [applications, selectedStatus, searchQuery]);

  // Helper Badge Visual Status
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
            Applied
          </span>
        );
      case 'Reviewing':
        return (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            Reviewing
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-800">
            Shortlisted
          </span>
        );
      case 'Accepted':
        return (
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Helper Komponen Timeline Progresif Pelamar
  const renderTimelineSteps = (currentStatus: ApplicationStatus) => {
    const isRejected = currentStatus === 'Rejected';
    const currentIndex = TRACKER_STEPS.indexOf(currentStatus);

    return (
      <div className="my-4 flex items-center">
        {TRACKER_STEPS.map((step, idx) => {
          const isPassed = !isRejected && currentIndex >= idx;
          const isCurrent = !isRejected && currentIndex === idx;

          return (
            <React.Fragment key={step}>
              <div className="flex shrink-0 items-center gap-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isPassed
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isPassed ? '✓' : idx + 1}
                </div>
                <span
                  className={`hidden sm:inline text-xs capitalize ${
                    isCurrent
                      ? 'font-bold text-slate-900'
                      : 'font-medium text-slate-500'
                  }`}
                >
                  {step.toLowerCase()}
                </span>
              </div>

              {idx < TRACKER_STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                    isPassed && currentIndex > idx
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-8 pb-24 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header Seksi Status Lamaran */}
        <div className="mb-6">
          <button
            onClick={onNavigateToHome}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Lowongan</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <BookmarkCheck className="h-6 w-6 text-amber-600 shrink-0" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Status Lamaran Saya
              </h1>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {applications.length} Lamaran
              </span>
            </div>

            {/* Input Pencarian Cepat */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari posisi / perusahaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Filter Status */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {TRACKER_STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                selectedStatus === tab.id
                  ? 'border border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daftar Kartu Status Lamaran */}
        {filteredApplications.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <Clock className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <h3 className="text-base font-bold text-slate-900">
              Tidak Ada Lamaran Ditemukan
            </h3>
            <p className="mx-auto mt-1 mb-5 max-w-sm text-xs text-slate-500">
              {applications.length === 0
                ? 'Anda belum mengirimkan berkas lamaran lowongan apapun.'
                : 'Tidak ada berkas yang sesuai dengan kriteria filter status ini.'}
            </p>
            <button
              onClick={onNavigateToJobs}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
            >
              <Briefcase className="h-4 w-4" />
              <span>Jelajah Katalog Lowongan</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition hover:border-amber-400 hover:shadow-md"
              >
                {/* Header Profil Lowongan & Lencana Status */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-2">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={app.job.company.logoUrl}
                      alt={app.job.company.name}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover shadow-sm bg-white"
                    />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {app.job.title}
                      </h3>
                      <div className="mt-0.5 text-xs text-slate-500">
                        <span>{app.job.company.name}</span> • <span>{app.job.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-start sm:self-center">
                    {renderStatusBadge(app.status)}
                  </div>
                </div>

                {/* Indikator Alur Progresif Seleksi */}
                {renderTimelineSteps(app.status)}

                {/* Catatan / Feedback HR (Jika Tersedia) */}
                {app.recruiterNotes && (
                  <div className="mb-3.5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs leading-relaxed text-amber-900">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <div>
                      <strong className="block font-bold">Feedback Tim Recruiter:</strong>
                      <p className="mt-0.5">{app.recruiterNotes}</p>
                    </div>
                  </div>
                )}

                {/* Footer Rincian Tanggal & Tautan Aksi */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <div>
                    Dikirim pada <strong className="text-slate-700">{formatDateID(app.createdAt)}</strong>
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-amber-600 underline hover:text-amber-700"
                    >
                      Lihat CV Saya
                    </a>

                    <button
                      onClick={() => onViewJobDetail(app.job)}
                      className="inline-flex items-center gap-1 font-semibold text-slate-800 transition hover:text-amber-600"
                    >
                      <span>Detail Posisi</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

ApplicationTrackerPage.displayName = 'ApplicationTrackerPage';
