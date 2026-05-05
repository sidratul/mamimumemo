import { loginSchema as sharedLoginSchema } from '@mami/core';
import { z } from 'zod';

export const loginSchema = sharedLoginSchema;

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginInitialValues: LoginFormValues = {
  email: '',
  password: '',
};
