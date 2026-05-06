import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DaycareListFooter } from './DaycareListFooter';
import { DaycareListHeader } from './DaycareListHeader';
import { DaycareListItem } from './DaycareListItem';
import { DaycareListState } from './DaycareListState';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import { 
  getDaycareDataVersion, 
  listDaycares 
} from '../../services/daycare';
import { DaycareRecord, ApprovalStatus } from '../../shared/daycare/types';
import { Box } from '../../theme/theme';

const PAGE_SIZE = 20;

export function DaycareListContainer() {
  const router = useRouter();
  const [status, setStatus] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [seenDataVersion, setSeenDataVersion] = useState(() => getDaycareDataVersion());
  
  const { items, total, loading, refreshing, loadingMore, error, refresh, loadMore } = usePaginatedResource<DaycareRecord>({
    pageSize: PAGE_SIZE,
    deps: [status, search],
    loadPage: async (page, pageSize) => {
      const res = await listDaycares({ status, search, page, limit: pageSize });
      if (res.error) throw res.error;
      return {
        items: res.items,
        total: res.total,
      };
    },
  });

  useFocusEffect(
    useCallback(() => {
      const nextVersion = getDaycareDataVersion();
      if (nextVersion !== seenDataVersion) {
        setSeenDataVersion(nextVersion);
        void refresh();
      }
    }, [refresh, seenDataVersion])
  );

  const header = (
    <Box>
      <DaycareListHeader
        status={status}
        search={search}
        onChangeStatus={setStatus}
        onChangeSearch={setSearch}
        onPressAdd={() => router.push('/(app)/daycares/create' as never)}
      />
      {loading ? <DaycareListState type="loading" /> : null}
      {!loading && error ? <DaycareListState type="error" message={error} /> : null}
      {!loading && !error && items.length === 0 ? <DaycareListState type="empty" /> : null}
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['top', 'left', 'right']}>
      <FlatList
        data={loading || error ? [] : items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Box paddingHorizontal="lg">
            <DaycareListItem daycare={item} onPress={() => router.push({ pathname: '/(app)/daycares/[id]', params: { id: item._id } } as never)} />
          </Box>
        )}
        ListHeaderComponent={header}
        ListFooterComponent={<DaycareListFooter loading={loading} loadingMore={loadingMore} error={error} total={total} itemCount={items.length} />}
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
