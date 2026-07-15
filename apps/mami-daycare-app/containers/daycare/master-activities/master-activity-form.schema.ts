import { z } from 'zod';
import { SelectInput, TextAreaField, TextField, type FormFieldProps, type SelectOption } from '@mami/ui';

import type { MasterActivityCategory } from '../../../services/operations/master-activities';
import { MasterActivityCategoryInput } from './master-activity-category-input';

export const masterActivityFormSchema = z.object({
  name: z.string().min(1, 'Nama aktivitas wajib diisi.'),
  description: z.string().optional(),
  category: z.string().min(1, 'Kategori wajib dipilih.'),
  defaultDuration: z
    .string()
    .min(1, 'Durasi wajib diisi.')
    .refine((value) => Number(value) > 0, 'Durasi harus lebih dari 0 menit.'),
});

export type MasterActivityFormValue = z.infer<typeof masterActivityFormSchema>;

export const initialMasterActivityFormValue: MasterActivityFormValue = {
  name: '',
  description: '',
  category: 'PLAY',
  defaultDuration: '30',
};

export function createMasterActivityFormFields(
  categoryOptions: SelectOption[],
  options: { inlineCategoryOptions?: boolean; useBottomSheetInput?: boolean } = {},
): FormFieldProps<MasterActivityFormValue> {
  const useBottomSheetInput = options.useBottomSheetInput ?? true;
  const categoryInput = options.inlineCategoryOptions ? MasterActivityCategoryInput : SelectInput;

  return {
  category: {
    label: 'Kategori',
    required: true,
    helperText: 'Default field config akan mengikuti kategori ini.',
    input: categoryInput,
    props: {
      placeholder: 'Pilih kategori',
      title: 'Kategori',
      options: categoryOptions,
    },
  },
  name: {
    label: 'Nama Aktivitas',
    required: true,
    input: TextField,
    props: {
      placeholder: 'Contoh: Circle Time Pagi',
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      useBottomSheetInput,
    },
  },
  description: {
    label: 'Deskripsi',
    helperText: 'Opsional. Jelaskan aktivitas ini untuk staff daycare.',
    input: TextAreaField,
    props: {
      placeholder: 'Contoh: Anak duduk melingkar, menyapa teman, dan membahas kegiatan hari ini.',
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      numberOfLines: 3,
      useBottomSheetInput,
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
      useBottomSheetInput,
    },
  },
  };
}

export function normalizeMasterActivityCategory(value: string): MasterActivityCategory {
  return value as MasterActivityCategory;
}
