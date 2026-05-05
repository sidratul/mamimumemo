import { z } from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.email('Email tidak valid'),
});

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
