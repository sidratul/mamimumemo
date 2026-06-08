import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Box, Text } from '../../../theme/theme';

export function ActivitiesReportsSection() {
  return (
    <Box paddingHorizontal="xs" gap="sm">
      <Box
        borderRadius="xl"
        padding="lg"
        gap="sm"
        style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'flex-start' }}
      >
        <Box
          width={52}
          height={52}
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' }}
        >
          <MaterialCommunityIcons name="clipboard-text-outline" size={24} color="#94A3B8" />
        </Box>
        <Text fontWeight="800" fontSize={16} color="textPrimary">Laporan harian belum ada</Text>
        <Text variant="bodySmall" color="textSecondary">
          Saat sitter mulai mencatat aktivitas dan observasi anak, ringkasannya akan muncul di sini.
        </Text>
      </Box>
    </Box>
  );
}
