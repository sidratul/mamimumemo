import { DynamicForm, PasswordField, TextAreaField, TextField, type FormFieldProps } from '@mami/ui';
import { adminDaycareCreateSchema } from '@mami/core';

import { DaycareCreateLogoField } from './DaycareCreateLogoField';
import { Box, Text } from '../../theme/theme';

export type DaycareCreateFormData = {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerPassword: string;
  daycareName: string;
  logoUrl: string;
  city: string;
  address: string;
  description: string;
};

type DaycareCreateFormSectionProps = {
  loading: boolean;
  error?: string;
  uploadingLogo: boolean;
  onPickLogo: () => Promise<string | null>;
  onSubmit: (values: DaycareCreateFormData) => void | Promise<void>;
};

export function DaycareCreateFormSection({
  loading,
  error,
  uploadingLogo,
  onPickLogo,
  onSubmit,
}: DaycareCreateFormSectionProps) {
  const fields: FormFieldProps<DaycareCreateFormData> = {
    ownerName: {
      section: 'Data Pemilik (Owner)',
      label: 'Nama Lengkap',
      required: true,
      input: TextField,
      props: { placeholder: 'Contoh: Ahmad Subardjo' },
    },
    ownerEmail: {
      label: 'Email Aktif',
      required: true,
      input: TextField,
      props: { placeholder: 'owner@email.com', keyboardType: 'email-address' },
    },
    ownerPhone: {
      label: 'Nomor Telepon',
      input: TextField,
      props: { placeholder: '0812xxxx', keyboardType: 'phone-pad' },
    },
    ownerPassword: {
      label: 'Password Akun',
      required: true,
      input: PasswordField,
      props: { placeholder: 'Min. 6 karakter' },
    },
    daycareName: {
      section: 'Informasi Daycare',
      label: 'Nama Daycare',
      required: true,
      input: TextField,
      props: { placeholder: 'Contoh: Daycare Mentari Pagi' },
    },
    logoUrl: {
      label: 'Logo Unit',
      section: 'Informasi Daycare',
      input: (props) => <DaycareCreateLogoField {...props} uploading={uploadingLogo} onPickLogo={onPickLogo} />,
    },
    city: {
      label: 'Kota/Kabupaten',
      required: true,
      input: TextField,
      props: { placeholder: 'Contoh: Jakarta Selatan' },
    },
    address: {
      label: 'Alamat Lengkap',
      required: true,
      input: TextAreaField,
      props: { placeholder: 'Jl. Melati No. 123...', numberOfLines: 3 },
    },
    description: {
      label: 'Deskripsi Singkat',
      input: TextAreaField,
      props: { placeholder: 'Ceritakan sedikit tentang daycare ini...', numberOfLines: 4 },
    },
  };

  return (
    <Box gap="lg">
      <DynamicForm<DaycareCreateFormData>
        fields={fields}
        defaultValue={{
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
          ownerPassword: '',
          daycareName: '',
          logoUrl: '',
          city: '',
          address: '',
          description: '',
        }}
        schema={adminDaycareCreateSchema}
        submitLabel="Daftarkan Daycare Sekarang"
        loading={loading}
        inputsContainerStyle={{ gap: 20 }}
        onSubmit={onSubmit}
      />
      {error ? (
        <Box padding="md" backgroundColor="danger" borderRadius="md" style={{ opacity: 0.1 }}>
          <Text color="danger" fontWeight="700">{error}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
