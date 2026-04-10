import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const adminUserCreateSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  phone: z.string().min(1, 'Nomor telepon wajib diisi'),
  role: z.enum(['SUPER_ADMIN', 'DAYCARE_ADMIN']),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const daycareRegistrationDaycareStepSchema = z.object({
  daycareName: z.string().min(1, 'Nama daycare wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
});

export const daycareRegistrationOwnerStepSchema = z.object({
  ownerName: z.string().min(1, 'Nama owner wajib diisi'),
  ownerEmail: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  ownerPhone: z.string().min(1, 'Nomor telepon wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const daycareStatusUpdateSchema = z.object({
  status: z.string().min(1, 'Status wajib dipilih'),
  note: z.string().min(1, 'Catatan wajib diisi'),
});

export const daycareActivityTextSchema = z.object({
  activityName: z.string().min(1, 'Nama aktivitas wajib diisi'),
  startTime: z
    .string()
    .min(1, 'Jam mulai wajib diisi')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Gunakan format jam HH:mm'),
  description: z.string().optional().default(''),
});

export const daycareEnrollmentSchema = z.object({
  parentName: z.string().min(1, 'Nama parent wajib diisi'),
  parentEmail: z.string().min(1, 'Email parent wajib diisi').email('Format email parent tidak valid'),
  parentPhone: z.string().min(1, 'Nomor telepon wajib diisi'),
  parentPassword: z.string().min(6, 'Password minimal 6 karakter'),
  parentNotes: z.string().optional().default(''),
  childName: z.string().min(1, 'Nama anak wajib diisi'),
  childBirthDate: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Gunakan format YYYY-MM-DD'),
  childGender: z.enum(['MALE', 'FEMALE']),
  childNotes: z.string().optional().default(''),
});

export const daycareParentNotesSchema = z.object({
  notes: z.string().optional().default(''),
});

export const daycareChildEditSchema = z.object({
  name: z.string().min(1, 'Nama child wajib diisi'),
  birthDate: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Gunakan format YYYY-MM-DD'),
  notes: z.string().optional().default(''),
});
