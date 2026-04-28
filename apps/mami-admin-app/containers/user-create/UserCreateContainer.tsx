import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AppPageHeader } from '../../components/common/AppPageHeader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { ADMIN_MANAGED_ROLE_OPTIONS } from '../../components/input/RoleSelect';
import { createUser, type UserRole } from '../../services/users';
import { UserCreateFormSection } from './UserCreateFormSection';
import { UserCreateSummarySection } from './UserCreateSummarySection';

type UserCreateFormData = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
};

export function UserCreateContainer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      <AppPageHeader title="Tambah User" onBack={() => router.back()} />

      <UserCreateSummarySection />
      <UserCreateFormSection loading={loading} error={error} roleOptions={ADMIN_MANAGED_ROLE_OPTIONS} onSubmit={handleSubmit} />
    </ScreenContainer>
  );
}
