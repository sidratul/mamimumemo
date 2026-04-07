import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, ScrollView } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';

import { DaycareListItem } from '../../components/daycare-admin';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { listDaycares, type AdminDaycare, type ApprovalStatus } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';

export function DaycareQueueContainer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: ApprovalStatus | 'ALL' }>();
  const [status, setStatus] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<AdminDaycare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusOptions = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'In Review', value: 'IN_REVIEW' },
    { label: 'Revision', value: 'NEEDS_REVISION' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Suspended', value: 'SUSPENDED' },
  ];

  useEffect(() => {
    if (params.status && statusOptions.some((option) => option.value === params.status)) {
      setStatus(params.status);
    }
  }, [params.status]);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const nextItems = await listDaycares({ status, search });
      setItems(nextItems);
    } catch (nextError) {
      setItems([]);
      setError(nextError instanceof Error ? nextError.message : 'Gagal mengambil daftar daycare.');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useFocusEffect(
    useCallback(() => {
      void loadItems();
    }, [loadItems])
  );

  return (
    <ScreenContainer>
      <Text variant="title">Daycare</Text>

      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="sm">
        <TextInput mode="outlined" placeholder="Cari nama daycare, kota, atau owner" value={search} onChangeText={setSearch} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Box flexDirection="row" gap="sm">
            {statusOptions.map((option) => {
              const active = status === option.value;

              return (
                <Pressable key={option.value} onPress={() => setStatus(option.value as ApprovalStatus | 'ALL')}>
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
            <Text color="textSecondary">Memuat daycare queue...</Text>
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
            <Text color="textSecondary">Tidak ada daycare yang cocok dengan filter saat ini.</Text>
          </Box>
        ) : null}

        {!loading && !error
          ? items.map((item) => (
              <DaycareListItem
                key={item.id}
                daycare={item}
                onPress={() => router.push({ pathname: '/(app)/daycares/[id]', params: { id: item.id } })}
              />
            ))
          : null}
      </Box>
    </ScreenContainer>
  );
}
