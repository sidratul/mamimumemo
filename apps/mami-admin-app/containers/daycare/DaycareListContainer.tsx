import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListFilterBar } from '@mami/ui';

import { approvalStatusColorMap } from './shared/ApprovalStatusBadge';
import { DaycareListItem } from './DaycareListItem';
import { usePaginatedResource } from '../../hooks/use-paginated-resource';
import {
  getDaycareCount,
  getDaycareDataVersion,
  listDaycares,
  type AdminDaycare,
  type ApprovalStatus,
} from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';

const PAGE_SIZE = 20;

export function DaycareListContainer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: ApprovalStatus | 'ALL' }>();
  const [status, setStatus] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [seenDataVersion, setSeenDataVersion] = useState(() => getDaycareDataVersion());
  const { items, total, loading, refreshing, loadingMore, error, refresh, loadMore } = usePaginatedResource<AdminDaycare>({
    pageSize: PAGE_SIZE,
    deps: [status, search],
    loadPage: async (page, pageSize) => {
      const [nextItems, nextTotal] = await Promise.all([
        listDaycares({ status, search, page, limit: pageSize }),
        getDaycareCount({ status, search }),
      ]);

      return {
        items: nextItems,
        total: nextTotal,
      };
    },
  });

  const statusOptions = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Submitted', value: 'SUBMITTED', color: approvalStatusColorMap.SUBMITTED },
    { label: 'Review', value: 'IN_REVIEW', color: approvalStatusColorMap.IN_REVIEW },
    { label: 'Revisi', value: 'NEEDS_REVISION', color: approvalStatusColorMap.NEEDS_REVISION },
    { label: 'Approve', value: 'APPROVED', color: approvalStatusColorMap.APPROVED },
    { label: 'Rejected', value: 'REJECTED', color: approvalStatusColorMap.REJECTED },
    { label: 'Suspended', value: 'SUSPENDED', color: approvalStatusColorMap.SUSPENDED },
  ];

  useEffect(() => {
    if (params.status && statusOptions.some((option) => option.value === params.status)) {
      setStatus(params.status);
    }
  }, [params.status]);

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
    <Box gap="lg" paddingTop="md" paddingBottom="sm">
      <Box paddingHorizontal="lg" gap="xs">
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="md">
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#24324B' }}>Daycare</Text>
          <Button
            mode="contained"
            compact
            icon="plus"
            onPress={() => router.push('/(app)/daycares/create' as never)}
            contentStyle={{ height: 36, alignItems: 'center', justifyContent: 'center' }}
            labelStyle={{ marginVertical: 0, lineHeight: 16 }}
            style={{ borderRadius: 10 }}>
            Tambah
          </Button>
        </Box>
        <Text color="textSecondary">Kelola data daycare terdaftar</Text>
      </Box>

      <ListFilterBar
        searchPlaceholder="Cari nama daycare atau owner..."
        searchValue={search}
        onSearchChange={setSearch}
        options={statusOptions}
        selectedValue={status}
        onSelect={(value) => setStatus(value as ApprovalStatus | 'ALL')}
      />

      {loading ? (
        <Box paddingHorizontal="lg" paddingVertical="md" alignItems="center" gap="sm">
          <ActivityIndicator color="#E23A8A" />
          <Text color="textSecondary">Memuat daftar daycare...</Text>
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
          <Text color="textSecondary">Tidak ada daycare yang cocok dengan filter saat ini.</Text>
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
            <DaycareListItem
              daycare={item}
              onPress={() => router.push({ pathname: '/(app)/daycares/[id]', params: { id: item.id } })}
            />
          </Box>
        )}
        ListHeaderComponent={header}
        ListFooterComponent={
          <Box paddingVertical="lg" alignItems="center" gap="sm">
            {loadingMore ? <ActivityIndicator color="#E23A8A" /> : null}
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
