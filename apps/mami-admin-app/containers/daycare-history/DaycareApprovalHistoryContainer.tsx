import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { formatDateTimeId } from '@mami/core';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { getDaycareById, type DaycareApprovalHistory, type ApprovalStatus } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';
import { ApprovalStatusBadge } from '../daycare/shared/ApprovalStatusBadge';

type DaycareApprovalHistoryContainerProps = {
  id: string;
};

export function DaycareApprovalHistoryContainer({ id }: DaycareApprovalHistoryContainerProps) {
  const [daycareName, setDaycareName] = useState('');
  const [history, setHistory] = useState<DaycareApprovalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError('');
        const data = await getDaycareById(id);
        if (!data) {
          setDaycareName('Unknown Daycare');
          setHistory([]);
          return;
        }

        setDaycareName(data.name);
        setHistory(data.history);
      } catch (nextError) {
        setDaycareName('Unknown Daycare');
        setHistory([]);
        setError(nextError instanceof Error ? nextError.message : 'Gagal memuat riwayat approval.');
      } finally {
        setLoading(false);
      }
    }

    void run();
  }, [id]);

  return (
    <ScreenContainer>
      <Box gap="xs">
        <Text variant="title">Approval History</Text>
        <Text variant="subtitle">{daycareName}</Text>
      </Box>

      <Box gap="sm">
        {loading ? (
          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="xl" alignItems="center" gap="sm">
            <ActivityIndicator color="#E23A8A" />
            <Text color="textSecondary">Memuat riwayat approval...</Text>
          </Box>
        ) : null}

        {!loading && error ? (
          <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="xs">
            <Text color="danger" style={{ fontWeight: '700' }}>Riwayat tidak tersedia</Text>
            <Text color="textSecondary">{error}</Text>
          </Box>
        ) : null}

        {!loading && !error && history.length === 0 ? <Text color="textSecondary">Belum ada riwayat.</Text> : null}

        {!loading && !error
          ? history.map((item, idx) => (
              <Box key={`${item.status}-${item.changedAt}-${idx}`} backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="md" padding="md" gap="sm">
                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                  <ApprovalStatusBadge status={item.status as ApprovalStatus} />
                  <Text color="textSecondary">{formatDateTimeId(item.changedAt)}</Text>
                </Box>
                <Text>{item.note || 'Tidak ada catatan tambahan.'}</Text>
                <Text color="textSecondary">By: {item.changedBy}</Text>
              </Box>
            ))
          : null}
      </Box>
    </ScreenContainer>
  );
}
