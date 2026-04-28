import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '../../theme/theme';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { getUserCount, getUserDataVersion, listUsers, type AdminUser, type UserPersona } from '../../services/users';
import { UserListFooter } from './UserListFooter';
import { UserListHeader } from './UserListHeader';
import { UserListItem } from './UserListItem';
import { UserListState } from './UserListState';

const PAGE_SIZE = 20;

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
    <Box>
      <UserListHeader
        persona={persona}
        search={search}
        onChangePersona={setPersona}
        onChangeSearch={setSearch}
        onPressAdd={() => router.push('/(app)/users/create' as never)}
      />
      {loading ? <UserListState type="loading" /> : null}
      {!loading && error ? <UserListState type="error" message={error} /> : null}
      {!loading && !error && items.length === 0 ? <UserListState type="empty" /> : null}
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
        ListFooterComponent={<UserListFooter loading={loading} loadingMore={loadingMore} error={error} total={total} itemCount={items.length} />}
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
