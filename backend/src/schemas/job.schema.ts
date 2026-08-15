import { z } from 'zod';
import { JobType, ExperienceLevel, JobStatus } from '@prisma/client';

// Skema validasi pembuatan postingan lowongan kerja baru
export const createJobSchema = z.object({
  companyId: z.string().min(1, 'Company ID wajib diisi'),
  title: z.string().min(3, 'Judul lowongan minimal 3 karakter').max(150).trim(),
  category: z.string().min(2, 'Kategori lowongan minimal 2 karakter').max(100).trim(),
  jobType: z.nativeEnum(JobType, {
    errorMap: () => ({ message: 'Tipe pekerjaan tidak valid' }),
  }).default(JobType.FULL_TIME),
  experienceLevel: z.nativeEnum(ExperienceLevel, {
    errorMap: () => ({ message: 'Tingkat pengalaman tidak valid' }),
  }).default(ExperienceLevel.MID_LEVEL),
  location: z.string().min(2, 'Lokasi pekerjaan minimal 2 karakter').max(150).trim(),
  salaryMin: z.number().int().nonnegative('Gaji minimal harus berupa bilangan positif').optional(),
  salaryMax: z.number().int().nonnegative('Gaji maksimal harus berupa bilangan positif').optional(),
  isSalaryDisclosed: z.boolean().default(true),
  description: z.string().min(10, 'Deskripsi lowongan minimal 10 karakter'),
  requirements: z.array(z.string().min(1)).min(1, 'Minimal sertakan 1 kualifikasi lowongan'),
  benefits: z.array(z.string().min(1)).default([]),
  status: z.nativeEnum(JobStatus).default(JobStatus.ACTIVE),
  deadline: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val || val.trim() === '') return undefined;
      const parsedDate = new Date(val);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }),
});

// Skema validasi pembaruan data lowongan kerja (semua field bersifat opsional)
export const updateJobSchema = createJobSchema.partial();

// Skema validasi query filter, pencarian, pengurutan, dan paginasi lowongan
export const filterJobQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  jobType: z.string().optional(),
  experienceLevel: z.string().optional(),
  location: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
  minSalary: z.string().optional().transform(val => (val ? parseInt(val, 10) : undefined)),
  maxSalary: z.string().optional().transform(val => (val ? parseInt(val, 10) : undefined)),
  companyId: z.string().optional(),
  page: z.string().optional().default('1').transform(val => Math.max(1, parseInt(val, 10) || 1)),
  limit: z.string().optional().default('10').transform(val => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
  sortBy: z.enum(['createdAt', 'salaryMax', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Skema validasi parameter ID lowongan kerja pada URL
export const jobIdParamSchema = z.object({
  id: z.string().min(1, 'Job ID wajib diisi'),
});

// Ekspor tipe data TypeScript dari skema
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type FilterJobQuery = z.infer<typeof filterJobQuerySchema>;
