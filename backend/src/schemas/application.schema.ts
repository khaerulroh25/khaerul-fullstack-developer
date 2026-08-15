import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

// Skema validasi pembuatan lamaran pekerjaan baru
export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID wajib diisi'),
  applicantName: z.string().min(2, 'Nama lengkap pelamar minimal 2 karakter').max(100).trim(),
  applicantEmail: z.string().email('Format email pelamar tidak valid').trim().toLowerCase(),
  applicantPhone: z.string().min(8, 'Nomor telepon pelamar minimal 8 karakter').max(20).trim(),
  linkedinUrl: z.string().url('Format URL LinkedIn tidak valid').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Format URL Portofolio tidak valid').optional().or(z.literal('')),
  resumeUrl: z.string().min(3, 'Tautan CV / Resume wajib diisi'),
  coverLetter: z.string().optional(),
  expectedSalary: z.number().int().nonnegative('Ekspektasi gaji harus berupa bilangan positif').optional(),
  noticePeriod: z.string().optional(),
});

// Skema validasi pembaruan status lamaran pekerjaan
export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus, {
    errorMap: () => ({
      message: 'Status harus salah satu dari: SUBMITTED, SCREENING, INTERVIEW, OFFERED, REJECTED',
    }),
  }),
  recruiterNotes: z.string().optional(),
  comment: z.string().optional(),
});

// Skema validasi query filter dan paginasi daftar lamaran
export const filterApplicationQuerySchema = z.object({
  jobId: z.string().optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  applicantEmail: z.string().optional(),
  page: z.string().optional().default('1').transform(val => Math.max(1, parseInt(val, 10) || 1)),
  limit: z.string().optional().default('10').transform(val => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
});

// Skema validasi parameter ID lamaran pada URL
export const applicationIdParamSchema = z.object({
  id: z.string().min(1, 'Application ID wajib diisi'),
});

// Ekspor tipe data TypeScript dari skema
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type FilterApplicationQuery = z.infer<typeof filterApplicationQuerySchema>;
