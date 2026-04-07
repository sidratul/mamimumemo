import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ActivityIndicator, TextInput } from 'react-native-paper';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Box, Text } from '../../theme/theme';
import { getUserCount, listUsers, type AdminUser, type UserRole } from '../../services/users';

const roleOptions: Array<{ label: string; value: UserRole | 'ALL' }> = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Owner', value: 'DAYCARE_OWNER' },
  { label: 'Daycare Admin', value: 'DAYCARE_ADMIN' },
  { label: 'Sitter', value: 'DAYCARE_SITTER' },
  { label: 'Parent', value: 'PARENT' },
];

const roleLabelMap: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  DAYCARE_OWNER: 'Daycare Owner',
  DAYCARE_ADMIN: 'Daycare Admin',
  DAYCARE_SITTER: 'Daycare Sitter',
  PARENT: 'Parent',
};

function UserListItem({ user }: { user: AdminUser }) {
  return (
    <Box
      backgroundColor="surface"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
      padding="lg"
      gap="md"
      style={{ shadowColor: '#E8B8D2', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 2 }}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="md">
        <Box flex={1} gap="sm">
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#3A1130' }}>{user.name}</Text>
          <Text color="textSecondary" numberOfLines={1} style={{ fontSize: 14 }}>
            {user.email}
          </Text>
          {user.phone ? (
            <Text color="textSecondary" numberOfLines={1} style={{ fontSize: 13 }}>
              {user.phone}
            </Text>
          ) : null}
        </Box>
        <Box backgroundColor="background" borderRadius="xl" paddingHorizontal="md" paddingVertical="sm" style={{ maxWidth: 132 }}>
          <Text style={{ color: '#8A4C73', fontWeight: '700' }}>{roleLabelMap[user.role]}</Text>
        </Box>
      </Box>
    </Box>
  );
}

export function UsersContainer() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [nextItems, nextTotal] = await Promise.all([
        listUsers({ role, search }),
        getUserCount({ role, search }),
      ]);
      setItems(nextItems);
      setTotal(nextTotal);
    } catch (nextError) {
      setItems([]);
      setTotal(0);
      setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil daftar user.');
    } finally {
      setLoading(false);
    }
  }, [role, search]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useFocusEffect(
    useCallback(() => {
      void loadUsers();
    }, [loadUsers])
  );

  return (
    <ScreenContainer>
      <Box gap="xs">
        <Text variant="title">Users</Text>
        <Text variant="subtitle">Manajemen user system-level untuk admin app.</Text>
      </Box>

      <Box
        backgroundColor="surface"
        borderRadius="lg"
        borderWidth={1}
        borderColor="border"
        padding="lg"
        gap="md"
        style={{ shadowColor: '#E8B8D2', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 2 }}>
        <Box gap="xs">
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#3A1130' }}>Directory</Text>
          <Text color="textSecondary">Cari user, filter role, lalu masuk ke detail untuk edit atau reset password.</Text>
        </Box>

        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box gap="xs">
            <Text color="textSecondary">Total user</Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#3A1130' }}>{total}</Text>
          </Box>

          <Pressable onPress={() => router.push('/(app)/users/create' as never)}>
            <Box backgroundColor="primary" paddingHorizontal="lg" paddingVertical="md" borderRadius="xl" alignItems="center" justifyContent="center">
              <Text variant="buttonLabel">Tambah User</Text>
            </Box>
          </Pressable>
        </Box>
      </Box>

      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="sm">
        <TextInput mode="outlined" placeholder="Cari nama atau email user" value={search} onChangeText={setSearch} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Box flexDirection="row" gap="sm">
            {roleOptions.map((option) => {
              const active = role === option.value;

              return (
                <Pressable key={option.value} onPress={() => setRole(option.value)}>
                  <Box
                    paddingHorizontal="md"
                    paddingVertical="sm"
                    borderRadius="xl"
                    borderWidth={1}
                    borderColor={active ? 'primary' : 'border'}
                    backgroundColor={active ? 'primary' : 'surface'}>
                    <Text style={{ color: active ? '#FFFFFF' : '#8A4C73', fontWeight: '700' }}>{option.label}</Text>
                  </Box>
                </Pressable>
              );
            })}
          </Box>
        </ScrollView>
      </Box>

      <Box gap="md">
        {loading ? (
          <Box
            backgroundColor="surface"
            borderRadius="lg"
            borderWidth={1}
            borderColor="border"
            padding="xl"
            alignItems="center"
            gap="sm">
            <ActivityIndicator color="#E23A8A" />
            <Text color="textSecondary">Memuat daftar user...</Text>
          </Box>
        ) : null}

        {!loading && error ? (
          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="xs">
            <Text color="danger" style={{ fontWeight: '700' }}>Gagal memuat data</Text>
            <Text color="textSecondary">{error}</Text>
          </Box>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <Box
            backgroundColor="surface"
            borderRadius="lg"
            borderWidth={1}
            borderColor="border"
            padding="xl"
            gap="xs"
            alignItems="center">
            <Text variant="cardValue">Belum ada data</Text>
            <Text color="textSecondary">Tidak ada user yang cocok dengan filter saat ini.</Text>
          </Box>
        ) : null}

        {!loading && !error
          ? items.map((item) => (
              <Pressable key={item.id} onPress={() => router.push({ pathname: '/(app)/users/[id]', params: { id: item.id } } as never)}>
                <UserListItem user={item} />
              </Pressable>
            ))
          : null}
      </Box>
    </ScreenContainer>
  );
}
