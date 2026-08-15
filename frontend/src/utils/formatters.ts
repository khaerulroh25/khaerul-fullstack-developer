/**
 * Modul Utilitas Pemformatan Data (Formatters)
 * Menyediakan fungsi murni (pure functions) yang konsisten dan dapat digunakan kembali
 * di seluruh modul aplikasi (JobCard, JobDetail, Tracker, dll).
 */

/**
 * Memformat rentang nominal gaji ke dalam standar format Rupiah (IDR)
 *
 * @param min - Nominal batas bawah gaji (opsional)
 * @param max - Nominal batas atas gaji (opsional)
 * @param isDisclosed - Status keterbukaan informasi gaji (default: true)
 * @param periodSuffix - Sufiks periode pembayaran (default: '/ bln')
 * @returns String representasi gaji yang siap ditampilkan ke UI
 *
 * @example
 * formatSalary(8000000, 12000000) // "Rp 8 Jt - 12 Jt / bln"
 * formatSalary(undefined, undefined, false) // "Gaji Kompetitif (Dirahasiakan)"
 */
export const formatSalary = (
  min?: number,
  max?: number,
  isDisclosed = true,
  periodSuffix = '/ bln'
): string => {
  if (!isDisclosed || (!min && !max)) {
    return 'Gaji Kompetitif (Dirahasiakan)';
  }

  const formatIDR = (val: number): string =>
    `Rp ${(val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;

  if (min && max) {
    return `${formatIDR(min)} - ${formatIDR(max)} ${periodSuffix}`;
  }
  if (min) {
    return `Mulai ${formatIDR(min)} ${periodSuffix}`;
  }
  return `Hingga ${formatIDR(max!)} ${periodSuffix}`;
};

/**
 * Mengonversi kode enum tipe pekerjaan (Job Type) ke label yang ramah pengguna
 *
 * @param type - Nilai enum tipe pekerjaan
 * @returns Label terbaca dalam Bahasa Indonesia / standar industri
 */
export const getJobTypeLabel = (type: string): string => {
  switch (type) {
    case 'FULL_TIME':
      return 'Full-Time';
    case 'PART_TIME':
      return 'Part-Time';
    case 'HYBRID':
      return 'Hybrid';
    case 'REMOTE':
      return '100% Remote';
    case 'CONTRACT':
      return 'Kontrak';
    case 'INTERNSHIP':
      return 'Magang (Internship)';
    default:
      return type;
  }
};

/**
 * Mengonversi kode tingkat pengalaman ke label deskriptif
 *
 * @param level - Nilai enum atau string pengalaman kerja
 * @returns Label pengalaman kerja terformat
 */
export const getExperienceLevelLabel = (level: string): string => {
  switch (level) {
    case 'ENTRY_LEVEL':
      return 'Entry Level / Fresh Grad';
    case 'JUNIOR':
      return 'Junior (1-2 Tahun)';
    case 'MID_LEVEL':
      return 'Mid-Level (2-4 Tahun)';
    case 'SENIOR':
      return 'Senior (4+ Tahun)';
    case 'LEAD':
      return 'Lead / Manager (5+ Tahun)';
    default:
      return level;
  }
};

/**
 * Memformat string tanggal ISO ke standar penanggalan lokal Indonesia
 *
 * @param dateString - String tanggal format ISO
 * @param includeTime - Opsi menampilkan jam dan menit
 * @returns Tanggal terformat (cth: "15 Agu 2026")
 */
export const formatDateID = (dateString: string, includeTime = false): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
  } catch {
    return dateString;
  }
};
