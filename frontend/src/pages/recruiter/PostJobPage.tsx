import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Gift,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import type {
  Job,
  JobType,
  ExperienceLevel,
  Company,
} from '../../types/index.js';
import { CATEGORIES_LIST, DUMMY_COMPANIES } from '../../data/dummyData.js';
import { formatSalary } from '../../utils/formatters.js';

/**
 * Daftar opsi tipe pekerjaan untuk recruiter
 */
const JOB_TYPE_SELECT_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full-Time (Penuh Waktu)' },
  { value: 'HYBRID', label: 'Hybrid (Kombinasi WFH / WFO)' },
  { value: 'REMOTE', label: '100% Remote (Jarak Jauh)' },
  { value: 'CONTRACT', label: 'Kontrak / Project-based' },
  { value: 'INTERNSHIP', label: 'Internship / Magang' },
] as const;

/**
 * Daftar opsi tingkat pengalaman kerja yang dicari
 */
const EXPERIENCE_LEVEL_SELECT_OPTIONS = [
  { value: 'ENTRY_LEVEL', label: 'Entry Level (Fresh Graduate)' },
  { value: 'JUNIOR', label: 'Junior (1 - 2 Tahun)' },
  { value: 'MID_LEVEL', label: 'Mid Level (3 - 5 Tahun)' },
  { value: 'SENIOR', label: 'Senior (5+ Tahun)' },
  { value: 'LEAD', label: 'Lead / Managerial' },
] as const;

/**
 * Kontrak Properti untuk Komponen PostJobPage
 */
interface PostJobPageProps {
  /** Callback untuk kembali ke halaman sebelumnya */
  onNavigateBack: () => void;
  /** Callback untuk memproses publikasi lowongan baru */
  onSubmitJob: (jobData: Omit<Job, 'id' | 'createdAt'>) => void;
}

/**
 * Komponen Halaman Penerbitan Lowongan Kerja (PostJobPage)
 *
 * Menyediakan formulir publikasi lowongan terstruktur bagi perusahaan dan recruiter,
 * mencakup informasi umum, kompensasi & transparansi gaji, kualifikasi dinamis, benefit,
 * serta fitur promosi lowongan unggulan (featured).
 * Dioptimalkan dengan React.memo, live preview format gaji, dan styling Tailwind CSS responsif.
 */
export const PostJobPage: React.FC<PostJobPageProps> = React.memo(({
  onNavigateBack,
  onSubmitJob,
}) => {
  // State Formulir Penerbitan Lowongan
  const [title, setTitle] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    DUMMY_COMPANIES[0]?.id || 'comp-1'
  );
  const [category, setCategory] = useState(
    CATEGORIES_LIST[0]?.name || 'Software Engineering'
  );
  const [jobType, setJobType] = useState<JobType>('FULL_TIME');
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>('MID_LEVEL');
  const [location, setLocation] = useState('Jakarta Selatan, DKI Jakarta');
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(true);
  const [salaryMin, setSalaryMin] = useState<number>(18000000);
  const [salaryMax, setSalaryMax] = useState<number>(28000000);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [isFeatured, setIsFeatured] = useState(false);

  // Daftar Dinamis Persyaratan & Fasilitas
  const [requirements, setRequirements] = useState<string[]>([
    'Pengalaman minimal 3 tahun di bidang terkait',
    'Menguasai arsitektur sistem modern dan RESTful API',
    'Mampu bekerja sama secara kolaboratif dalam tim agile',
  ]);
  const [newReqInput, setNewReqInput] = useState('');

  const [benefits, setBenefits] = useState<string[]>([
    'BPJS Kesehatan & Ketenagakerjaan',
    'Tunjangan Asuransi Swasta & Medical Checkup',
    'Fleksibilitas Kerja Hybrid & Tunjangan Laptop',
  ]);
  const [newBenInput, setNewBenInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCompany: Company =
    DUMMY_COMPANIES.find((c) => c.id === selectedCompanyId) ||
    DUMMY_COMPANIES[0];

  // Handler Tambah/Hapus Persyaratan
  const handleAddRequirement = () => {
    if (newReqInput.trim()) {
      setRequirements((prev) => [...prev, newReqInput.trim()]);
      setNewReqInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handler Tambah/Hapus Benefit
  const handleAddBenefit = () => {
    if (newBenInput.trim()) {
      setBenefits((prev) => [...prev, newBenInput.trim()]);
      setNewBenInput('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Validasi Formulir
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) {
      errs.title = 'Judul posisi pekerjaan minimal 3 karakter';
    }
    if (!description.trim() || description.trim().length < 20) {
      errs.description = 'Deskripsi pekerjaan minimal 20 karakter';
    }
    if (!location.trim()) {
      errs.location = 'Lokasi penempatan wajib diisi';
    }
    if (requirements.length === 0) {
      errs.requirements = 'Minimal cantumkan 1 kualifikasi / persyaratan';
    }
    if (isSalaryDisclosed && salaryMin > salaryMax) {
      errs.salary = 'Gaji minimum tidak boleh lebih besar dari gaji maksimum';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handler Submit Lowongan Baru
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newJob: Omit<Job, 'id' | 'createdAt'> = {
        companyId: selectedCompany.id,
        company: selectedCompany,
        title: title.trim(),
        category,
        jobType,
        experienceLevel,
        location: location.trim(),
        salaryMin: isSalaryDisclosed ? Number(salaryMin) : undefined,
        salaryMax: isSalaryDisclosed ? Number(salaryMax) : undefined,
        isSalaryDisclosed,
        description: description.trim(),
        requirements,
        benefits,
        status: 'ACTIVE',
        deadline,
        isFeatured,
      };

      onSubmitJob(newJob);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="py-8 pb-28 text-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Tombol Navigasi Kembali */}
        <button
          onClick={onNavigateBack}
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Header Seksi Penerbitan Lowongan */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Portal Perusahaan & Recruiter
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pasang Lowongan Pekerjaan Baru
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Lengkapi rincian berikut untuk mempublikasikan lowongan kerja ke ribuan talenta di <strong className="text-slate-700">yukKerja</strong>.
          </p>
        </div>

        {/* Kontainer Formulir Terpadu */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seksi Informasi Utama Lowongan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
              <Briefcase className="h-5 w-5 text-amber-600" />
              <span>Informasi Utama Lowongan</span>
            </h2>

            <div className="space-y-5">
              {/* Judul Posisi */}
              <div>
                <label htmlFor="job-title" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Judul Posisi Pekerjaan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Senior Fullstack Engineer (React & Node.js)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
                {errors.title && (
                  <span className="mt-1 block text-xs text-rose-500">{errors.title}</span>
                )}
              </div>

              {/* Pemilihan Perusahaan & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="job-company" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Perusahaan Penerbit Lowongan
                  </label>
                  <select
                    id="job-company"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  >
                    {DUMMY_COMPANIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.industry})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="job-category" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Kategori Industri Pekerjaan
                  </label>
                  <select
                    id="job-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tipe Pekerjaan & Tingkat Pengalaman */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="job-type" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Tipe Pekerjaan
                  </label>
                  <select
                    id="job-type"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as JobType)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  >
                    {JOB_TYPE_SELECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="job-exp" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Tingkat Pengalaman yang Dicari
                  </label>
                  <select
                    id="job-exp"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  >
                    {EXPERIENCE_LEVEL_SELECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Seksi Lokasi Penempatan & Kompensasi Gaji */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
              <MapPin className="h-5 w-5 text-amber-600" />
              <span>Lokasi Penempatan & Kompensasi Gaji</span>
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="job-location" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Kota / Lokasi Penempatan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="job-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Jakarta Selatan, DKI Jakarta / BSD, Tangerang"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
                {errors.location && (
                  <span className="mt-1 block text-xs text-rose-500">{errors.location}</span>
                )}
              </div>

              {/* Toggle Tampilkan Gaji */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    Tampilkan Rentang Gaji ke Publik
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Lowongan dengan transparansi gaji memperoleh 2.5x lebih banyak pelamar berkualitas.
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="salary-disclose"
                  checked={isSalaryDisclosed}
                  onChange={(e) => setIsSalaryDisclosed(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-amber-400 accent-amber-400 focus:ring-amber-400"
                />
              </div>

              {isSalaryDisclosed && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="salary-min" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Gaji Minimum Bulanan (Rp)
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <div className="bg-amber-50 px-3.5 py-2.5 border-r border-amber-200/80 font-black text-xs text-amber-800 select-none">
                          Rp
                        </div>
                        <input
                          id="salary-min"
                          type="number"
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 outline-none"
                          placeholder="15000000"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="salary-max" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Gaji Maksimum Bulanan (Rp)
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <div className="bg-amber-50 px-3.5 py-2.5 border-r border-amber-200/80 font-black text-xs text-amber-800 select-none">
                          Rp
                        </div>
                        <input
                          id="salary-max"
                          type="number"
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 outline-none"
                          placeholder="25000000"
                        />
                      </div>
                    </div>
                  </div>

                  {errors.salary && (
                    <span className="mt-2 block text-xs text-rose-500">{errors.salary}</span>
                  )}

                  <span className="mt-2 block text-[11px] text-slate-500 font-medium">
                    💡 Pratinjau Tampilan: {formatSalary(salaryMin, salaryMax, true, '/ bulan')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Seksi Deskripsi & Tanggung Jawab */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
              <Building2 className="h-5 w-5 text-amber-600" />
              <span>Deskripsi & Tanggung Jawab Pekerjaan</span>
            </h2>

            <div>
              <label htmlFor="job-desc" className="mb-1.5 block text-xs font-semibold text-slate-700">
                Deskripsi Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="job-desc"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm leading-relaxed text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 resize-y"
                placeholder="Jelaskan peran pekerjaan ini, tanggung jawab harian, teknologi yang digunakan, serta kriteria keberhasilan posisi ini..."
              />
              {errors.description && (
                <span className="mt-1 block text-xs text-rose-500">{errors.description}</span>
              )}
            </div>
          </div>

          {/* Seksi Kualifikasi & Persyaratan Kandidat */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Kualifikasi & Persyaratan Kandidat</span>
            </h2>

            {/* Daftar Poin Persyaratan */}
            <div className="mb-5 space-y-3">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="font-medium text-slate-800">{req}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="p-1 text-slate-400 transition hover:text-rose-500"
                    title="Hapus kualifikasi ini"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input Tambah Persyaratan */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newReqInput}
                onChange={(e) => setNewReqInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
                placeholder="Ketik kualifikasi baru (cth: Berpengalaman dengan Tailwind CSS & Next.js)..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-amber-400 transition hover:bg-slate-800 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Poin</span>
              </button>
            </div>
            {errors.requirements && (
              <span className="mt-2 block text-xs text-rose-500">{errors.requirements}</span>
            )}
          </div>

          {/* Seksi Benefit & Fasilitas Perusahaan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
              <Gift className="h-5 w-5 text-amber-600" />
              <span>Benefit & Fasilitas yang Ditawarkan</span>
            </h2>

            {/* Daftar Poin Benefit */}
            <div className="mb-5 space-y-3">
              {benefits.map((ben, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm"
                >
                  <div className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span className="font-medium text-slate-800">{ben}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="p-1 text-slate-400 transition hover:text-rose-500"
                    title="Hapus benefit ini"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input Tambah Benefit */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenInput}
                onChange={(e) => setNewBenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
                placeholder="Ketik benefit baru (cth: Tunjangan Kursus & Sertifikasi Profesional)..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-amber-400 transition hover:bg-slate-800 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Benefit</span>
              </button>
            </div>
          </div>

          {/* Seksi Tenggat Waktu & Promosi Unggulan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-base sm:text-lg font-extrabold text-slate-900">
              <Calendar className="h-5 w-5 text-amber-600" />
              <span>Tenggat Waktu & Fitur Promosi</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <div>
                <label htmlFor="job-deadline" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Batas Akhir Penutupan Lamaran
                </label>
                <input
                  id="job-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 sm:mt-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Jadikan Lowongan Unggulan (Featured)</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-amber-700">
                    Diprioritaskan paling atas pada hasil pencarian kandidat.
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="job-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-amber-400 accent-amber-400 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Tombol Aksi Formulir (Batal & Publikasikan) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onNavigateBack}
              className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg transition hover:bg-amber-300 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <span>Menerbitkan Lowongan...</span>
              ) : (
                <>
                  <Briefcase className="h-4 w-4" />
                  <span>Publikasikan Lowongan Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

PostJobPage.displayName = 'PostJobPage';
