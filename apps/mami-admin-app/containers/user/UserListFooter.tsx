import { ActivityIndicator } from 'react-native-paper';

import { Box, Text } from '../../theme/theme';

type UserListFooterProps = {
  loading: boolean;
  loadingMore: boolean;
  error?: string;
  total: number;
  itemCount: number;
};

export function UserListFooter({
  loading,
  loadingMore,
  error,
  total,
  itemCount,
}: UserListFooterProps) {
  return (
    <Box paddingVertical="lg" alignItems="center" gap="sm">
      {loadingMore ? <ActivityIndicator color="#4D96FF" /> : null}
      {!loading && !error && total > 0 ? (
        <Text color="textSecondary">
          Menampilkan 1 - {itemCount} dari {total} data
        </Text>
      ) : null}
      <Box height={48} />
    </Box>
  );
}
