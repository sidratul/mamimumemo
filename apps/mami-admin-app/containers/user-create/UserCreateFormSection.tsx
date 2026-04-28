import { DynamicForm, PasswordField, TextField, type FormFieldProps, ScreenSection } from '@mami/ui';
import { adminUserCreateSchema } from '@mami/core';

import { RoleSelect } from '../../components/input';
import { Text } from '../../theme/theme';
import { type UserRole } from '../../services/users';

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
      input: TextField,
      props: { placeholder: 'Nama lengkap' },
    },
    email: {
      label: 'Email',
      input: TextField,
      props: { placeholder: 'Email', keyboardType: 'email-address' },
    },
    phone: {
      label: 'Nomor telepon',
      input: TextField,
      props: { placeholder: 'Nomor telepon', keyboardType: 'phone-pad' },
    },
    role: {
      label: 'Role',
      input: (props) => UserRoleField(roleOptions, props),
    },
    password: {
      label: 'Password',
      input: PasswordField,
      props: { placeholder: 'Password' },
    },
  };

  return (
    <ScreenSection>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Informasi Akun</Text>
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
        submitLabel="Simpan User"
        loading={loading}
        onSubmit={onSubmit}
      />
      <Text color="textSecondary">User yang dibuat manual dari admin app hanya untuk Super Admin dan Daycare Admin.</Text>
      {error ? <Text color="danger">{error}</Text> : null}
    </ScreenSection>
  );
}
