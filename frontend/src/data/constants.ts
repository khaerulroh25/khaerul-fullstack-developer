/**
 * Opsi Tipe Pekerjaan sesuai Enum Database Prisma (JobType)
 */
export const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Semua Tipe' },
  { value: 'FULL_TIME', label: 'Full-Time (Penuh Waktu)' },
  { value: 'HYBRID', label: 'Hybrid (WFH & WFO)' },
  { value: 'REMOTE', label: '100% Remote (Jarak Jauh)' },
  { value: 'CONTRACT', label: 'Kontrak' },
  { value: 'PART_TIME', label: 'Part-Time' },
  { value: 'INTERNSHIP', label: 'Magang (Internship)' },
] as const;

/**
 * Opsi Tingkat Pengalaman sesuai Enum Database Prisma (ExperienceLevel)
 */
export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: '', label: 'Semua Level' },
  { value: 'ENTRY_LEVEL', label: 'Entry Level / Fresh Grad' },
  { value: 'JUNIOR', label: 'Junior (1-2 Tahun)' },
  { value: 'MID_LEVEL', label: 'Mid-Level (2-4 Tahun)' },
  { value: 'SENIOR', label: 'Senior (4+ Tahun)' },
  { value: 'LEAD', label: 'Lead / Manager (5+ Tahun)' },
] as const;

/**
 * Opsi Status Lamaran sesuai Enum Database Prisma (ApplicationStatus)
 */
export const APPLICATION_STATUS_OPTIONS = [
  { value: 'SUBMITTED', label: 'Applied (Berkas Masuk)' },
  { value: 'SCREENING', label: 'Screening (Ditinjau)' },
  { value: 'INTERVIEW', label: 'Interview (Wawancara)' },
  { value: 'OFFERED', label: 'Accepted / Offered (Diterima)' },
  { value: 'REJECTED', label: 'Rejected (Belum Lolos)' },
] as const;
