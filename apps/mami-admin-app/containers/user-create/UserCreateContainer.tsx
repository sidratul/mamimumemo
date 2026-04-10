import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DynamicForm, PasswordField, TextField, type FormFieldProps, ScreenHeader, ScreenSection } from '@mami/ui';
import { adminUserCreateSchema } from '@mami/core';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { RoleSelect } from '../../components/input';
import { ADMIN_MANAGED_ROLE_OPTIONS } from '../../components/input/RoleSelect';
import { createUser, type UserRole } from '../../services/users';
import { Text } from '../../theme/theme';

type UserCreateFormData = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
};

const UserRoleField = (props: {
  value?: UserRole;
  placeholder?: string;
  onChange: (value: UserRole) => void;
  disabled?: boolean;
}) => (
  <RoleSelect
    value={props.value}
    placeholder={props.placeholder}
    onChange={(value) => props.onChange(value as UserRole)}
    disabled={props.disabled}
    options={ADMIN_MANAGED_ROLE_OPTIONS}
  />
);

export function UserCreateContainer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      input: UserRoleField,
    },
    password: {
      label: 'Password',
      input: PasswordField,
      props: { placeholder: 'Password' },
    },
  };

  async function handleSubmit(values: UserCreateFormData) {
    try {
      setLoading(true);
      setError('');
      const result = await createUser({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
        role: values.role,
      });
      router.replace({ pathname: '/(app)/users/[id]', params: { id: result.id } } as never);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Gagal membuat user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Tambah User" subtitle="Buat akun baru untuk sistem admin dan operasional daycare." onBack={() => router.back()} />

      <ScreenSection gap={8}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Ringkasan</Text>
        <Text variant="subtitle">Admin app hanya membuat user `Super Admin` dan `Daycare Admin` secara manual.</Text>
      </ScreenSection>

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
          onSubmit={handleSubmit}
        />
        <Text color="textSecondary">User yang dibuat manual dari admin app hanya untuk Super Admin dan Daycare Admin.</Text>

        {error ? <Text color="danger">{error}</Text> : null}
      </ScreenSection>
    </ScreenContainer>
  );
}
