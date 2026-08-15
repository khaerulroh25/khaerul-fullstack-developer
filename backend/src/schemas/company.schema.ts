import { z } from 'zod';

// Skema validasi pembuatan profil perusahaan baru
export const createCompanySchema = z.object({
  name: z.string().min(2, 'Nama perusahaan minimal 2 karakter').max(150).trim(),
  industry: z.string().min(2, 'Bidang industri minimal 2 karakter').max(100).trim(),
  location: z.string().min(2, 'Lokasi kantor minimal 2 karakter').max(150).trim(),
  logoUrl: z.string().url('Format URL logo tidak valid').optional().or(z.literal('')),
  website: z.string().url('Format URL website tidak valid').optional().or(z.literal('')),
  description: z.string().optional(),
});

// Skema validasi pembaruan profil perusahaan (semua field bersifat opsional)
export const updateCompanySchema = createCompanySchema.partial();

// Skema validasi parameter ID perusahaan pada URL
export const companyIdParamSchema = z.object({
  id: z.string().min(1, 'Company ID wajib diisi'),
});

// Ekspor tipe data TypeScript dari skema
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
