import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Box, Text } from '../../theme/theme';

type UserListStateProps =
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

export function UserListState(props: UserListStateProps) {
  if (props.type === 'loading') {
    return (
      <Box paddingHorizontal="lg" paddingVertical="xxl" alignItems="center" gap="md">
        <ActivityIndicator color="#4F46E5" />
        <Text variant="bodySmall" color="textSecondary">Memuat daftar pengguna...</Text>
      </Box>
    );
  }

  if (props.type === 'error') {
    return (
      <Box paddingHorizontal="lg" paddingVertical="xxl" alignItems="center" gap="sm">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text variant="defaults" fontWeight="800" color="danger">
          Gagal Memuat Data
        </Text>
        <Text variant="bodySmall" color="textSecondary" textAlign="center">{props.message}</Text>
      </Box>
    );
  }

  return (
    <Box paddingHorizontal="lg" paddingVertical="xxxl" gap="sm" alignItems="center">
      <Box width={64} height={64} borderRadius="full" backgroundColor="background" alignItems="center" justifyContent="center" marginBottom="sm">
        <MaterialCommunityIcons name="account-search-outline" size={32} color="#94A3B8" />
      </Box>
      <Text variant="subtitle" fontWeight="800" color="textPrimary">Belum Ada Pengguna</Text>
      <Text variant="bodySmall" color="textSecondary" textAlign="center" style={{ maxWidth: 240 }}>
        Tidak ada user yang ditemukan. Tambahkan user baru untuk memulai.
      </Text>
    </Box>
  );
}
