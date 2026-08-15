import { z } from 'zod';
import { Role } from '@prisma/client';

// Skema validasi pendaftaran pengguna baru (Register)
export const registerSchema = z.object({
  email: z.string().email('Format email tidak valid').trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password minimal harus 8 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .regex(/[a-zA-Z]/, 'Password harus mengandung minimal satu huruf')
    .regex(/[0-9]/, 'Password harus mengandung minimal satu angka'),
  fullName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .trim(),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Role harus salah satu dari: JOB_SEEKER, RECRUITER, ADMIN' }),
  }).default(Role.JOB_SEEKER),
  phone: z.string().optional(),
  avatarUrl: z.string().url('Format URL avatar tidak valid').optional().or(z.literal('')),
});

// Skema validasi masuk pengguna (Login)
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid').trim().toLowerCase(),
  password: z.string().min(1, 'Password wajib diisi'),
});

// Ekspor tipe data TypeScript dari skema
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
