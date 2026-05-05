import {
  DynamicForm,
  PasswordField,
  TextField,
  TextMuted,
  type FormFieldProps,
  type InputComponentProps,
} from '@mami/ui';
import { adminUserCreateSchema } from '@mami/core';
import { View } from 'react-native';

import { RoleSelect } from '../../components/input';
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
      required: true,
      input: TextField,
      props: { placeholder: 'Nama lengkap' },
    },
    email: {
      label: 'Email',
      required: true,
      input: TextField,
      props: { placeholder: 'Email', keyboardType: 'email-address' },
    },
    phone: {
      label: 'Nomor telepon',
      required: true,
      input: TextField,
      props: { placeholder: 'Nomor telepon', keyboardType: 'phone-pad' },
    },
    role: {
      label: 'Role',
      required: true,
      input: (props: InputComponentProps<UserRole>) => UserRoleField(roleOptions, props),
    },
    password: {
      label: 'Password',
      required: true,
      input: PasswordField,
      props: { placeholder: 'Password' },
    },
  };

  return (
    <View style={{ gap: 12 }}>
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
      <TextMuted>User yang dibuat manual dari admin app hanya untuk Super Admin dan Daycare Admin.</TextMuted>
      {error ? <TextMuted>{error}</TextMuted> : null}
    </View>
  );
}
