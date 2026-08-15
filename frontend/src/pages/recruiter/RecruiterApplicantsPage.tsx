import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Users,
  Briefcase,
  Search,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  Filter,
  Eye,
  Send,
  X,
} from 'lucide-react';
import type { Application, ApplicationStatus, Job } from '../../types/index.js';
import { formatDateID, formatSalary } from '../../utils/formatters.js';

/**
 * Daftar tab navigasi status seleksi pelamar
 */
const STATUS_TABS = [
  { id: 'ALL', label: 'Semua Pelamar' },
  { id: 'Applied', label: 'Applied' },
  { id: 'Reviewing', label: 'Reviewing' },
  { id: 'Shortlisted', label: 'Shortlisted' },
  { id: 'Accepted', label: 'Accepted' },
  { id: 'Rejected', label: 'Rejected' },
] as const;

/**
 * Kontrak Properti untuk Komponen RecruiterApplicantsPage
 */
interface RecruiterApplicantsPageProps {
  /** Daftar seluruh lowongan pekerjaan aktif dan historis */
  jobs: Job[];
  /** Daftar seluruh berkas lamaran yang masuk dari pelamar */
  applications: Application[];
  /** Callback untuk kembali ke halaman utama */
  onNavigateBack: () => void;
  /** Callback untuk berpindah ke halaman pemasangan lowongan baru */
  onNavigateToPostJob: () => void;
  /** Callback untuk memperbarui status seleksi dan catatan HR */
  onUpdateApplicationStatus: (
    applicationId: string,
    newStatus: ApplicationStatus,
    recruiterNotes?: string
  ) => void;
}

/**
 * Komponen Halaman Manajemen Pelamar & ATS (RecruiterApplicantsPage)
 *
 * Menyediakan dashboard pelacakan kandidat (Applicant Tracking System), metrik status lamaran,
 * filter multi-kriteria (lowongan, status tahapan, pencarian pelamar), serta modal interaktif
 * untuk memperbarui status seleksi dan catatan feedback HR.
 * Dioptimalkan dengan React.memo, komputasi metrik berbasis useMemo, dan styling Tailwind CSS responsif.
 */
export const RecruiterApplicantsPage: React.FC<RecruiterApplicantsPageProps> = React.memo(({
  jobs,
  applications,
  onNavigateBack,
  onNavigateToPostJob,
  onUpdateApplicationStatus,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Pembaharuan Status & Catatan HR
  const [activeAppForNotes, setActiveAppForNotes] = useState<Application | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [tempStatus, setTempStatus] = useState<ApplicationStatus>('Reviewing');

  // Komputasi Metrik Statistik Pelamar (Memoized)
  const metrics = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status === 'Applied').length;
    const reviewing = applications.filter((a) => a.status === 'Reviewing').length;
    const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
    const accepted = applications.filter((a) => a.status === 'Accepted').length;

    return { total, applied, reviewing, shortlisted, accepted };
  }, [applications]);

  // Komputasi Daftar Pelamar Terfilter (Memoized)
  const filteredApplicants = useMemo(() => {
    return applications.filter((app) => {
      // Filter Lowongan Kerja
      if (selectedJobId !== 'ALL' && app.jobId !== selectedJobId) {
        return false;
      }
      // Filter Status Tahapan
      if (selectedStatus !== 'ALL' && app.status !== selectedStatus) {
        return false;
      }
      // Filter Kata Kunci (Nama, Email, Judul Posisi)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = app.applicantName.toLowerCase().includes(q);
        const matchEmail = app.applicantEmail.toLowerCase().includes(q);
        const matchTitle = app.job.title.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchTitle) return false;
      }
      return true;
    });
  }, [applications, selectedJobId, selectedStatus, searchQuery]);

  // Helper Lencana Status Visual
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

  // Handler Buka Modal Perubahan Status
  const handleOpenStatusModal = (app: Application) => {
    setActiveAppForNotes(app);
    setTempStatus(app.status);
    setTempNotes(app.recruiterNotes || '');
  };

  // Handler Simpan Status & Catatan HR
  const handleSaveStatusAndNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppForNotes) return;

    onUpdateApplicationStatus(activeAppForNotes.id, tempStatus, tempNotes.trim());
    setActiveAppForNotes(null);
  };

  return (
    <div className="py-8 pb-28 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tombol Navigasi Kembali */}
        <button
          onClick={onNavigateBack}
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Header Seksi ATS Recruiter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Applicant Tracking System (ATS)
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Manajemen Kandidat & Pelamar Kerja
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Kelola seluruh berkas kandidat yang melamar, tinjau kualifikasi CV, dan berikan feedback tahapan seleksi secara terpusat.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onNavigateToPostJob}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-md transition hover:bg-amber-300 active:scale-95"
            >
              <span>Pasang Lowongan Baru</span>
            </button>
          </div>
        </div>

        {/* Ringkasan Kartu Metrik Pelamar */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <span className="block text-xs font-bold text-slate-500">Total Pelamar</span>
            <div className="mt-1 text-2xl font-black text-slate-900">{metrics.total}</div>
            <span className="text-[11px] text-slate-400">Seluruh berkas</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <span className="block text-xs font-bold text-blue-600">Applied</span>
            <div className="mt-1 text-2xl font-black text-blue-600">{metrics.applied}</div>
            <span className="text-[11px] text-slate-400">Berkas baru masuk</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <span className="block text-xs font-bold text-amber-600">Reviewing</span>
            <div className="mt-1 text-2xl font-black text-amber-600">{metrics.reviewing}</div>
            <span className="text-[11px] text-slate-400">Sedang ditinjau</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <span className="block text-xs font-bold text-purple-600">Shortlisted</span>
            <div className="mt-1 text-2xl font-black text-purple-600">{metrics.shortlisted}</div>
            <span className="text-[11px] text-slate-400">Kandidat terpilih</span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <span className="block text-xs font-bold text-emerald-600">Accepted</span>
            <div className="mt-1 text-2xl font-black text-emerald-600">{metrics.accepted}</div>
            <span className="text-[11px] text-slate-400">Kandidat diterima</span>
          </div>
        </div>

        {/* Toolbar Filter Lowongan & Pencarian Cepat */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Dropdown Filter Lowongan */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-slate-500">
              <Filter className="h-3.5 w-3.5 text-amber-600" />
              <span>Lowongan:</span>
            </span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full lg:min-w-[260px] cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            >
              <option value="ALL">Semua Lowongan Pekerjaan ({jobs.length})</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.company.name})
                </option>
              ))}
            </select>
          </div>

          {/* Input Pencarian Nama / Email Pelamar */}
          <div className="relative w-full lg:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pelamar / email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
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

        {/* Tab Navigasi Kategori Status */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                selectedStatus === tab.id
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daftar Kartu Pelamar */}
        {filteredApplicants.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <Users className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <h3 className="text-base font-extrabold text-slate-900">
              Belum Ada Pelamar yang Sesuai
            </h3>
            <p className="mx-auto mt-1 mb-5 max-w-md text-xs text-slate-500">
              Tidak ada berkas kandidat yang cocok dengan kriteria filter atau kata kunci pencarian saat ini.
            </p>
            <button
              onClick={() => {
                setSelectedJobId('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="rounded-xl bg-amber-100 px-4 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-200"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-400 hover:shadow-md"
              >
                {/* Header Profil Pelamar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-100 text-base font-black text-amber-800 shadow-sm">
                      {app.applicantName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base font-extrabold text-slate-900">
                          {app.applicantName}
                        </h3>
                        {renderStatusBadge(app.status)}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Briefcase className="h-3.5 w-3.5 text-amber-600" />
                          <span>Melamar: <strong className="text-slate-900">{app.job.title}</strong></span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{app.applicantEmail}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{app.applicantPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Recruiter (Buka CV & Ubah Status) */}
                  <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-amber-100 hover:text-amber-900"
                    >
                      <Eye className="h-3.5 w-3.5 text-amber-700" />
                      <span>Buka CV Pelamar</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>

                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Ubah Status & Catatan HR</span>
                    </button>
                  </div>
                </div>

                {/* Grid Rincian Metadata Pelamar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-600">
                  <div>
                    <span className="mb-0.5 block text-slate-400">Ekspektasi Gaji:</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {app.expectedSalary
                        ? formatSalary(app.expectedSalary, undefined, true, '/ bulan')
                        : 'Negosiasi'}
                    </strong>
                  </div>

                  <div>
                    <span className="mb-0.5 block text-slate-400">Ketersediaan Kerja:</span>
                    <strong className="font-bold text-slate-900">
                      {app.noticePeriod || 'Segera (Immediately)'}
                    </strong>
                  </div>

                  <div>
                    <span className="mb-0.5 block text-slate-400">Tanggal Pengajuan:</span>
                    <strong className="font-bold text-slate-900">
                      {formatDateID(app.createdAt)}
                    </strong>
                  </div>
                </div>

                {/* Surat Lamaran Pelamar (Jika Ada) */}
                {app.coverLetter && (
                  <div className="mt-3.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700">
                    <strong className="mb-1 block text-slate-900">Pesan dari Pelamar:</strong>
                    "{app.coverLetter}"
                  </div>
                )}

                {/* Catatan Feedback HR Terakhir (Jika Ada) */}
                {app.recruiterNotes && (
                  <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900">
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                    <div>
                      <strong>Catatan / Undangan HR:</strong> {app.recruiterNotes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal: Ubah Status & Catatan HR */}
        {activeAppForNotes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
              {/* Tombol Tutup Modal */}
              <button
                onClick={() => setActiveAppForNotes(null)}
                className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-5">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Update Tahapan Seleksi
                </span>
                <h3 className="mt-1.5 text-xl font-extrabold text-slate-900">
                  {activeAppForNotes.applicantName}
                </h3>
                <p className="text-xs text-slate-500">
                  Posisi: {activeAppForNotes.job.title}
                </p>
              </div>

              <form onSubmit={handleSaveStatusAndNotes} className="space-y-4">
                <div>
                  <label htmlFor="status-select" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Pilih Tahapan Status Baru
                  </label>
                  <select
                    id="status-select"
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value as ApplicationStatus)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  >
                    <option value="Applied">Applied (Berkas Masuk)</option>
                    <option value="Reviewing">Reviewing (Sedang Ditinjau)</option>
                    <option value="Shortlisted">Shortlisted (Kandidat Terpilih)</option>
                    <option value="Accepted">Accepted (Diterima)</option>
                    <option value="Rejected">Rejected (Belum Lolos)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="hr-notes" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Catatan HR / Undangan Wawancara untuk Kandidat
                  </label>
                  <textarea
                    id="hr-notes"
                    rows={4}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="Contoh: Berkas CV lolos screening. Jadwal interview via Google Meet: Kamis, 20 Agustus pukul 14:00 WIB..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 resize-y"
                  />
                  <span className="mt-1.5 block text-[11px] text-slate-500">
                    💡 Catatan ini akan otomatis muncul pada dashboard pelacak pelamar.
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveAppForNotes(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-md transition hover:bg-amber-300 active:scale-95"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

RecruiterApplicantsPage.displayName = 'RecruiterApplicantsPage';
