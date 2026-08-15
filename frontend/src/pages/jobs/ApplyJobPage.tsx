import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  User,
  Check,
} from 'lucide-react';
import type { Job, Application, AuthUser } from '../../types/index.js';
import { getJobTypeLabel } from '../../utils/formatters.js';

/**
 * Daftar tahapan wizard formulir lamaran (Stepper Steps)
 * Didefinisikan di level modul untuk efisiensi alokasi memori
 */
const APPLICATION_STEPS = [
  { stepNumber: 1, label: 'Data Diri Pelamar', icon: User },
  { stepNumber: 2, label: 'Kualifikasi & Resume', icon: FileText },
  { stepNumber: 3, label: 'Konfirmasi & Kirim', icon: CheckCircle2 },
] as const;

/**
 * Kontrak Properti untuk Komponen ApplyJobPage
 */
interface ApplyJobPageProps {
  /** Objek data lowongan pekerjaan yang sedang dilamar */
  job: Job | null;
  /** Objek data pengguna aktif yang sedang login (opsional) */
  currentUser?: AuthUser | null;
  /** Callback untuk kembali ke halaman sebelumnya / detail lowongan */
  onNavigateBack: () => void;
  /** Callback untuk memproses pengiriman data lamaran */
  onSubmitApplication: (appData: Omit<Application, 'id' | 'createdAt' | 'logs'>) => boolean;
}

/**
 * Komponen Halaman Pengajuan Lamaran Pekerjaan (ApplyJobPage)
 *
 * Menyediakan alur wizard bertahap (3-step stepper) untuk pengisian data diri,
 * kualifikasi/resume, dan ringkasan konfirmasi sebelum submit.
 * Dioptimalkan dengan React.memo, integrasi formatter, dan styling Tailwind CSS responsif.
 */
export const ApplyJobPage: React.FC<ApplyJobPageProps> = React.memo(({
  job,
  currentUser,
  onNavigateBack,
  onSubmitApplication,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // State Formulir Lamaran (Pre-filled dengan profil pengguna aktif atau default demo)
  const [formData, setFormData] = useState({
    applicantName: currentUser?.fullName || 'Ahmad Farhan Pratama',
    applicantEmail: currentUser?.email || 'pelamar@indokerja.id',
    applicantPhone: currentUser?.phone || '085712345678',
    linkedinUrl: currentUser?.linkedinUrl || 'https://linkedin.com/in/farhan-pratama-dev',
    portfolioUrl: currentUser?.portfolioUrl || 'https://farhanpratama.dev',
    resumeUrl: currentUser?.resumeUrl || 'https://farhanpratama.dev/resume-ahmad-farhan.pdf',
    coverLetter: '',
    expectedSalary: currentUser?.expectedSalary || 25000000,
    noticePeriod: '1 Bulan (30 Hari)',
  });

  // Sinkronisasi data form saat status currentUser berubah
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        applicantName: currentUser.fullName || prev.applicantName,
        applicantEmail: currentUser.email || prev.applicantEmail,
        applicantPhone: currentUser.phone || prev.applicantPhone,
        linkedinUrl: currentUser.linkedinUrl || prev.linkedinUrl,
        portfolioUrl: currentUser.portfolioUrl || prev.portfolioUrl,
        resumeUrl: currentUser.resumeUrl || prev.resumeUrl,
        expectedSalary: currentUser.expectedSalary || prev.expectedSalary,
      }));
    }
  }, [currentUser]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State ketika data lowongan tidak valid / kosong
  if (!job) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 max-w-md shadow-sm">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-900">Lowongan Tidak Ditemukan</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Lowongan yang ingin Anda lamar mungkin telah ditutup atau tidak aktif.
          </p>
          <button
            onClick={onNavigateBack}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Katalog</span>
          </button>
        </div>
      </div>
    );
  }

  // Validasi Tahap 1: Data Diri Pelamar
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.applicantName.trim()) errs.applicantName = 'Nama lengkap wajib diisi';
    if (!formData.applicantEmail.trim()) {
      errs.applicantEmail = 'Email aktif wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) {
      errs.applicantEmail = 'Format email tidak valid';
    }
    if (!formData.applicantPhone.trim()) errs.applicantPhone = 'Nomor kontak telepon/WhatsApp wajib diisi';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validasi Tahap 2: Dokumen & Kompensasi
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.resumeUrl.trim()) errs.resumeUrl = 'Tautan resume / CV wajib dicantumkan';
    if (!formData.expectedSalary || formData.expectedSalary <= 0) {
      errs.expectedSalary = 'Ekspektasi gaji harus bernilai positif';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Navigasi langkah maju
  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  // Navigasi langkah mundur
  const handlePrev = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  // Handler pengajuan berkas lamaran
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const success = onSubmitApplication({
        jobId: job.id,
        job,
        applicantName: formData.applicantName.trim(),
        applicantEmail: formData.applicantEmail.trim(),
        applicantPhone: formData.applicantPhone.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        coverLetter: formData.coverLetter.trim(),
        expectedSalary: Number(formData.expectedSalary),
        noticePeriod: formData.noticePeriod,
        status: 'Applied',
      });

      setIsSubmitting(false);
      if (success) {
        onNavigateBack();
      }
    }, 400);
  };

  return (
    <div className="py-8 pb-20 text-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Tombol Navigasi Kembali */}
        <button
          onClick={onNavigateBack}
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Detail Lowongan</span>
        </button>

        {/* Header Ringkasan Lowongan yang Dilamar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="h-14 w-14 rounded-2xl border border-slate-200 object-cover shadow-sm bg-white"
            />
            <div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Formulir Lamaran Kerja
              </span>
              <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">
                {job.title}
              </h1>
              <span className="text-xs sm:text-sm text-slate-500">
                {job.company.name} • {job.location}
              </span>
            </div>
          </div>

          <div className="self-start sm:self-center rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 whitespace-nowrap">
            {getJobTypeLabel(job.jobType)}
          </div>
        </div>

        {/* Kontainer Utama Wizard Formulir */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Stepper Indikator Kemajuan */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-4 sm:p-6 gap-3">
            {APPLICATION_STEPS.map((s) => {
              const isCurrent = step === s.stepNumber;
              const isDone = step > s.stepNumber;

              return (
                <div
                  key={s.stepNumber}
                  className={`flex flex-1 items-center gap-2.5 text-xs sm:text-sm font-semibold ${
                    isCurrent
                      ? 'text-slate-950 font-bold'
                      : isDone
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : s.stepNumber}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Form Wizard Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Tahap 1: Data Diri Pelamar */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="apply-name" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="apply-name"
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                    placeholder="Masukkan nama lengkap Anda..."
                  />
                  {errors.applicantName && (
                    <span className="mt-1 block text-xs text-rose-500">{errors.applicantName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="apply-email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Alamat Email Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="apply-email"
                      type="email"
                      value={formData.applicantEmail}
                      onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                      placeholder="contoh@email.com"
                    />
                    {errors.applicantEmail && (
                      <span className="mt-1 block text-xs text-rose-500">{errors.applicantEmail}</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="apply-phone" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Nomor WhatsApp / Telepon <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="apply-phone"
                      type="tel"
                      value={formData.applicantPhone}
                      onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                      placeholder="08123456789"
                    />
                    {errors.applicantPhone && (
                      <span className="mt-1 block text-xs text-rose-500">{errors.applicantPhone}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="apply-linkedin" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Tautan Profil LinkedIn
                    </label>
                    <input
                      id="apply-linkedin"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label htmlFor="apply-portfolio" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Portofolio / Website / GitHub URL
                    </label>
                    <input
                      id="apply-portfolio"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                      placeholder="https://github.com/username atau web portofolio"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tahap 2: Kualifikasi & Dokumen Resume */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="apply-resume" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Tautan Dokumen Resume / CV (PDF / Google Drive / Dropbox) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="apply-resume"
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                    placeholder="https://drive.google.com/your-cv.pdf"
                  />
                  {errors.resumeUrl && (
                    <span className="mt-1 block text-xs text-rose-500">{errors.resumeUrl}</span>
                  )}
                  <span className="mt-1.5 block text-[11px] text-slate-500">
                    💡 Pastikan link CV dapat diakses oleh publik / tim recruiter.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="apply-salary" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Ekspektasi Gaji Bulanan (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="apply-salary"
                      type="number"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                      placeholder="20000000"
                    />
                    {errors.expectedSalary && (
                      <span className="mt-1 block text-xs text-rose-500">{errors.expectedSalary}</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="apply-notice" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Notice Period / Ketersediaan Kerja
                    </label>
                    <select
                      id="apply-notice"
                      value={formData.noticePeriod}
                      onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                    >
                      <option value="Segera (Available Immediately)">Segera (Immediately)</option>
                      <option value="1 Bulan (30 Hari)">1 Bulan (30 Hari)</option>
                      <option value="2 Bulan (60 Hari)">2 Bulan (60 Hari)</option>
                      <option value="Masih Bekerja (Nego)">Fleksibel / Nego</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="apply-cover" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Surat Lamaran / Pesan untuk Tim HR (Opsional)
                  </label>
                  <textarea
                    id="apply-cover"
                    rows={4}
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 resize-y"
                    placeholder="Ceritakan secara singkat keahlian terbaik Anda dan motivasi bergabung dengan posisi ini..."
                  />
                </div>
              </div>
            )}

            {/* Tahap 3: Ringkasan Konfirmasi & Review */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3.5 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    Periksa kembali keakuratan data Anda sebelum mengirimkan berkas. Sistem <strong>yukKerja</strong> menerapkan proteksi verifikasi duplikasi lamaran per lowongan.
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Posisi & Perusahaan:</span>
                    <strong className="text-slate-900">
                      {job.title} di {job.company.name}
                    </strong>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Nama Pelamar:</span>
                    <strong className="text-slate-900">{formData.applicantName}</strong>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Email & Kontak:</span>
                    <strong className="text-slate-900">
                      {formData.applicantEmail} • {formData.applicantPhone}
                    </strong>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200/80">
                    <span className="text-slate-500">Ekspektasi Gaji:</span>
                    <strong className="text-slate-900">
                      Rp {formData.expectedSalary.toLocaleString('id-ID')} / bulan
                    </strong>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between py-1.5">
                    <span className="text-slate-500">Tautan CV / Resume:</span>
                    <a
                      href={formData.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-amber-600 underline break-all hover:text-amber-700"
                    >
                      {formData.resumeUrl}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Aksi Wizard (Navigasi Tahapan & Submit) */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Tahap Sebelumnya</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNavigateBack}
                  className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  Batal
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-95"
                >
                  <span>Langkah Berikutnya</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-md transition hover:bg-amber-300 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Mengirimkan Berkas...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Kirim Lamaran Sekarang</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

ApplyJobPage.displayName = 'ApplyJobPage';
