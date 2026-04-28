import { DynamicForm, PasswordField, TextAreaField, TextField, type FormFieldProps } from '@mami/ui';
import { adminDaycareCreateSchema } from '@mami/core';

import { Text } from '../../theme/theme';
import { DaycareCreateLogoField } from './DaycareCreateLogoField';

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
      section: 'Data Owner',
      label: 'Nama owner',
      required: true,
      input: TextField,
      props: { placeholder: 'Nama owner' },
    },
    ownerEmail: {
      label: 'Email owner',
      required: true,
      input: TextField,
      props: { placeholder: 'Email owner', keyboardType: 'email-address' },
    },
    ownerPhone: {
      label: 'Nomor telepon owner',
      input: TextField,
      props: { placeholder: 'Nomor telepon owner', keyboardType: 'phone-pad' },
    },
    ownerPassword: {
      label: 'Password owner',
      required: true,
      input: PasswordField,
      props: { placeholder: 'Password owner' },
    },
    daycareName: {
      section: 'Data Daycare',
      label: 'Nama daycare',
      required: true,
      input: TextField,
      props: { placeholder: 'Nama daycare' },
    },
    logoUrl: {
      label: 'Logo daycare',
      section: 'Data Daycare',
      input: (props) => <DaycareCreateLogoField {...props} uploading={uploadingLogo} onPickLogo={onPickLogo} />,
    },
    city: {
      label: 'Kota',
      required: true,
      input: TextField,
      props: { placeholder: 'Kota' },
    },
    address: {
      label: 'Alamat lengkap',
      required: true,
      input: TextAreaField,
      props: { placeholder: 'Alamat lengkap', numberOfLines: 3 },
    },
    description: {
      label: 'Deskripsi daycare',
      input: TextAreaField,
      props: { placeholder: 'Deskripsi daycare', numberOfLines: 4 },
    },
  };

  return (
    <>
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
        submitLabel="Daftarkan Daycare"
        loading={loading}
        inputsContainerStyle={{ gap: 12 }}
        onSubmit={onSubmit}
      />
      {error ? <Text color="danger">{error}</Text> : null}
    </>
  );
}
