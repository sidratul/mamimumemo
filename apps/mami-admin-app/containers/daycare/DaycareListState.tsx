import { ActivityIndicator } from 'react-native-paper';

import { Box, Text } from '../../theme/theme';

type DaycareListStateProps =
  | {
      type: 'loading';
    }
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'empty';
    };

export function DaycareListState(props: DaycareListStateProps) {
  if (props.type === 'loading') {
    return (
      <Box paddingHorizontal="lg" paddingVertical="md" alignItems="center" gap="sm">
        <ActivityIndicator color="#E23A8A" />
        <Text color="textSecondary">Memuat daftar daycare...</Text>
      </Box>
    );
  }

  if (props.type === 'error') {
    return (
      <Box paddingHorizontal="lg" gap="xs">
        <Text color="danger" style={{ fontWeight: '700' }}>
          Gagal memuat data
        </Text>
        <Text color="textSecondary">{props.message}</Text>
      </Box>
    );
  }

  return (
    <Box paddingHorizontal="lg" paddingVertical="xl" gap="xs" alignItems="center">
      <Text variant="cardValue">Belum ada data</Text>
      <Text color="textSecondary">Tidak ada daycare yang cocok dengan filter saat ini.</Text>
    </Box>
  );
}
