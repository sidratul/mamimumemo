import { z } from 'zod';

export const adminUserCreateSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  phone: z.string().min(1, 'Nomor telepon wajib diisi'),
  systemRole: z.enum(['NONE', 'SUPER_ADMIN']),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const adminDaycareCreateSchema = z.object({
  ownerName: z.string().min(1, 'Nama owner wajib diisi'),
  ownerEmail: z.string().min(1, 'Email owner wajib diisi').email('Format email owner tidak valid'),
  ownerPhone: z.string().default(''),
  ownerPassword: z.string().min(6, 'Password owner minimal 6 karakter'),
  daycareName: z.string().min(1, 'Nama daycare wajib diisi'),
  logoUrl: z.union([z.string().url('Logo URL harus valid'), z.literal('')]).default(''),
  city: z.string().min(1, 'Kota wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  description: z.string().default(''),
});
