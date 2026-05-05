import { DynamicForm, TextField, type FormFieldProps } from '@mami/ui';

import { profileUpdateSchema, type ProfileUpdateValues } from './profile-update.schema';

export function ProfileUpdateForm({
  data,
  loading,
  onSubmit,
}: {
  data: ProfileUpdateValues;
  loading?: boolean;
  onSubmit: (values: ProfileUpdateValues) => Promise<void>;
}) {
  const fields: FormFieldProps<ProfileUpdateValues> = {
    name: {
      label: 'Nama',
      required: true,
      input: TextField,
      props: {
        placeholder: 'Nama parent',
      },
    },
    email: {
      label: 'Email',
      required: true,
      input: TextField,
      props: {
        placeholder: 'parent@mamimumemo.id',
        keyboardType: 'email-address',
      },
    },
  };

  return (
    <DynamicForm<ProfileUpdateValues>
      fields={fields}
      data={data}
      schema={profileUpdateSchema}
      submitLabel="Simpan"
      loading={loading}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
    />
  );
}
