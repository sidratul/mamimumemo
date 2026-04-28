import { ActivityIndicator } from 'react-native-paper';

import { Box, Text } from '../../theme/theme';

type DaycareListFooterProps = {
  loading: boolean;
  loadingMore: boolean;
  error?: string;
  total: number;
  itemCount: number;
};

export function DaycareListFooter({
  loading,
  loadingMore,
  error,
  total,
  itemCount,
}: DaycareListFooterProps) {
  return (
    <Box paddingVertical="lg" alignItems="center" gap="sm">
      {loadingMore ? <ActivityIndicator color="#E23A8A" /> : null}
      {!loading && !error && total > 0 ? (
        <Text color="textSecondary">
          Menampilkan 1 - {itemCount} dari {total} data
        </Text>
      ) : null}
      <Box height={48} />
    </Box>
  );
}
