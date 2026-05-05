import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPageHeader } from '../../components/common/AppPageHeader';
import { ADMIN_MANAGED_ROLE_OPTIONS } from '../../components/input/RoleSelect';
import { createUser, type UserRole } from '../../services/users';
import { UserCreateFormSection } from './UserCreateFormSection';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['left', 'right', 'bottom']}>
      <AppPageHeader title="Tambah User" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
        <UserCreateFormSection loading={loading} error={error} roleOptions={ADMIN_MANAGED_ROLE_OPTIONS} onSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
