import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListFilterBar } from '@mami/ui';

import { Box, Text } from '../../theme/theme';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { getUserCount, getUserDataVersion, listUsers, type AdminUser, type UserPersona } from '../../services/users';
import { UserListItem } from './UserListItem';

const PAGE_SIZE = 20;

const personaOptions: Array<{ label: string; value: UserPersona | 'ALL' }> = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Parent', value: 'PARENT' },
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin', value: 'DAYCARE_ADMIN' },
  { label: 'Sitter', value: 'DAYCARE_SITTER' },
];

export function UserListContainer() {
  const router = useRouter();
  const [persona, setPersona] = useState<UserPersona | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [seenDataVersion, setSeenDataVersion] = useState(() => getUserDataVersion());
  const { items, total, loading, refreshing, loadingMore, error, refresh, loadMore } = usePaginatedResource<AdminUser>({
    pageSize: PAGE_SIZE,
    deps: [persona, search],
    loadPage: async (page, pageSize) => {
      const [nextItems, nextTotal] = await Promise.all([
        listUsers({ persona, search, page, limit: pageSize }),
        getUserCount({ persona, search }),
      ]);

      return {
        items: nextItems,
        total: nextTotal,
      };
    },
  });

  useFocusEffect(
    useCallback(() => {
      const nextVersion = getUserDataVersion();
      if (nextVersion !== seenDataVersion) {
        setSeenDataVersion(nextVersion);
        void refresh();
      }
    }, [refresh, seenDataVersion])
  );

  const header = (
    <Box gap="lg" paddingTop="md" paddingBottom="sm">
      <Box paddingHorizontal="lg" gap="xs">
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="md">
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#24324B' }}>Users</Text>
          <Button
            mode="contained"
            compact
            icon="plus"
            onPress={() => router.push('/(app)/users/create' as never)}
            contentStyle={{ height: 36, alignItems: 'center', justifyContent: 'center' }}
            labelStyle={{ marginVertical: 0, lineHeight: 16 }}
            style={{ borderRadius: 10 }}>
            Tambah
          </Button>
        </Box>
        <Text color="textSecondary">Kelola akun utama dan persona yang dimiliki setiap user.</Text>
      </Box>

      <ListFilterBar
        searchPlaceholder="Cari nama atau email user"
        searchValue={search}
        onSearchChange={setSearch}
        options={personaOptions}
        selectedValue={persona}
        onSelect={setPersona}
      />

      {loading ? (
        <Box paddingHorizontal="lg" paddingVertical="md" alignItems="center" gap="sm">
          <ActivityIndicator color="#4D96FF" />
          <Text color="textSecondary">Memuat daftar user...</Text>
        </Box>
      ) : null}

      {!loading && error ? (
        <Box paddingHorizontal="lg" gap="xs">
          <Text color="danger" style={{ fontWeight: '700' }}>Gagal memuat data</Text>
          <Text color="textSecondary">{error}</Text>
        </Box>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <Box paddingHorizontal="lg" paddingVertical="xl" gap="xs" alignItems="center">
          <Text variant="cardValue">Belum ada data</Text>
          <Text color="textSecondary">Tidak ada user yang cocok dengan filter saat ini.</Text>
        </Box>
      ) : null}
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FC' }} edges={['top', 'left', 'right']}>
      <FlatList
        data={loading || error ? [] : items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Box paddingHorizontal="lg">
            <UserListItem user={item} onPress={() => router.push({ pathname: '/(app)/users/[id]', params: { id: item.id } } as never)} />
          </Box>
        )}
        ListHeaderComponent={header}
        ListFooterComponent={
          <Box paddingVertical="lg" alignItems="center" gap="sm">
            {loadingMore ? <ActivityIndicator color="#4D96FF" /> : null}
            {!loading && !error && total > 0 ? (
              <Text color="textSecondary">
                Menampilkan 1 - {items.length} dari {total} data
              </Text>
            ) : null}
            <Box height={48} />
          </Box>
        }
        ItemSeparatorComponent={() => <Box height={12} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => void refresh()}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
      />
    </SafeAreaView>
  );
}
