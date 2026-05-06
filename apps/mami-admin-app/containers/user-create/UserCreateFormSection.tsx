import {
  DynamicForm,
  PasswordField,
  TextField,
  type FormFieldProps,
  type InputComponentProps,
} from '@mami/ui';
import { adminUserCreateSchema } from '@mami/core';

import { RoleSelect } from '../../components/input';
import { type UserRole } from '../../shared/user/types';
import { Box, Text } from '../../theme/theme';

type RoleOption = {
  label: string;
  value: string;
};

type UserCreateFormData = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
};

type UserCreateFormSectionProps = {
  loading: boolean;
  error?: string;
  roleOptions: RoleOption[];
  onSubmit: (values: UserCreateFormData) => void | Promise<void>;
};

const UserRoleField = (
  roleOptions: RoleOption[],
  props: {
    value?: UserRole;
    placeholder?: string;
    onChange: (value: UserRole) => void;
    disabled?: boolean;
  }
) => (
  <RoleSelect
    value={props.value}
    placeholder={props.placeholder}
    onChange={(value) => props.onChange(value as UserRole)}
    disabled={props.disabled}
    options={roleOptions}
  />
);

export function UserCreateFormSection({
  loading,
  error,
  roleOptions,
  onSubmit,
}: UserCreateFormSectionProps) {
  const fields: FormFieldProps<UserCreateFormData> = {
    name: {
      label: 'Nama lengkap',
      required: true,
      input: TextField,
      props: { placeholder: 'Contoh: Budi Santoso' },
    },
    email: {
      label: 'Email',
      required: true,
      input: TextField,
      props: { placeholder: 'user@email.com', keyboardType: 'email-address' },
    },
    phone: {
      label: 'Nomor telepon',
      required: true,
      input: TextField,
      props: { placeholder: '0812xxxx', keyboardType: 'phone-pad' },
    },
    role: {
      label: 'Akses Sistem',
      required: true,
      input: (props: InputComponentProps<UserRole>) => UserRoleField(roleOptions, props),
    },
    password: {
      label: 'Password Sementara',
      required: true,
      input: PasswordField,
      props: { placeholder: 'Min. 6 karakter' },
    },
  };

  return (
    <Box gap="lg">
      <DynamicForm<UserCreateFormData>
        fields={fields}
        defaultValue={{
          name: '',
          email: '',
          phone: '',
          role: 'DAYCARE_ADMIN',
          password: '',
        }}
        schema={adminUserCreateSchema}
        submitLabel="Daftarkan Pengguna"
        loading={loading}
        onSubmit={onSubmit}
      />
      
      <Box paddingHorizontal="xs" gap="sm">
        <Text variant="bodySmall" color="textSecondary" style={{ fontStyle: 'italic' }}>
          User yang dibuat manual dari panel admin akan memiliki akses otoritas (Super Admin atau Admin Daycare). Untuk Parent/Sitter, tambahkan melalui detail Daycare.
        </Text>
        {error ? (
          <Box backgroundColor="danger" padding="sm" borderRadius="sm" style={{ opacity: 0.1 }}>
            <Text color="danger" fontWeight="700">{error}</Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
