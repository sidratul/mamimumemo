import { z } from 'zod';
import { SelectInput, TextField, type FormFieldProps, type SelectOption } from '@mami/ui';

import type { MasterActivityCategory } from '../../../services/operations/master-activities';

export const masterActivityFormSchema = z.object({
  name: z.string().min(1, 'Nama aktivitas wajib diisi.'),
  category: z.string().min(1, 'Kategori wajib dipilih.'),
  defaultDuration: z
    .string()
    .min(1, 'Durasi wajib diisi.')
    .refine((value) => Number(value) > 0, 'Durasi harus lebih dari 0 menit.'),
});

export type MasterActivityFormValue = z.infer<typeof masterActivityFormSchema>;

export const initialMasterActivityFormValue: MasterActivityFormValue = {
  name: '',
  category: 'PLAY',
  defaultDuration: '30',
};

export function createMasterActivityFormFields(
  categoryOptions: SelectOption[],
): FormFieldProps<MasterActivityFormValue> {
  return {
  name: {
    label: 'Nama Aktivitas',
    required: true,
    input: TextField,
    props: {
      placeholder: 'Contoh: Circle Time Pagi',
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      useBottomSheetInput: true,
    },
  },
  category: {
    label: 'Kategori',
    required: true,
    helperText: 'Default field config akan mengikuti kategori ini.',
    input: SelectInput,
    props: {
      placeholder: 'Pilih kategori',
      title: 'Kategori',
      options: categoryOptions,
    },
  },
  defaultDuration: {
    label: 'Durasi',
    required: true,
    helperText: 'Satuan menit.',
    input: TextField,
    props: {
      placeholder: '30',
      keyboardType: 'numeric',
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      useBottomSheetInput: true,
    },
  },
  };
}

export function normalizeMasterActivityCategory(value: string): MasterActivityCategory {
  return value as MasterActivityCategory;
}
