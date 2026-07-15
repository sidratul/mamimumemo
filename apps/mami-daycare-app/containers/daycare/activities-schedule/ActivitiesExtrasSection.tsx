import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@mami/ui';
import { router } from 'expo-router';

import { Box, Text } from '../../../theme/theme';

const DUMMY_EXTRA_ACTIVITIES = [
  {
    id: 'extra-1',
    title: 'Minum obat',
    subtitle: 'Alma Putri · 10:15',
    note: 'Vitamin sesuai titipan orang tua.',
  },
  {
    id: 'extra-2',
    title: 'Ke toilet',
    subtitle: 'Budi Santoso · 11:05',
    note: 'Pendamping: Ibu Siti.',
  },
];

export function ActivitiesExtrasSection() {
  return (
    <Box paddingHorizontal="xs" gap="sm">
      <Box
        borderRadius="xl"
        padding="md"
        gap="sm"
        style={{ backgroundColor: '#FFF4ED', borderWidth: 1, borderColor: '#F5D0C5' }}
      >
        <Text fontWeight="800" fontSize={16} color="textPrimary">Aktivitas Tambahan</Text>
        <Text variant="bodySmall" color="textSecondary">
          Aktivitas di luar jadwal utama, seperti obat, toilet, atau catatan khusus.
        </Text>
        <Button
          label="Tambah Aktivitas"
          variant="secondary"
          style={{ alignSelf: 'flex-start', borderRadius: 16 }}
          onPress={() => router.push('/(daycare)/daily-record-create')}
        />
      </Box>

      {DUMMY_EXTRA_ACTIVITIES.map((item) => (
        <Box
          key={item.id}
          backgroundColor="surface"
          borderRadius="xl"
          padding="md"
          gap="xs"
          style={{ borderWidth: 1, borderColor: '#E2E8F0' }}
        >
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="sm">
            <Text fontWeight="800" fontSize={15} color="textPrimary">{item.title}</Text>
            <MaterialCommunityIcons name="dots-horizontal" size={18} color="#94A3B8" />
          </Box>
          <Text variant="bodySmall" color="textSecondary">{item.subtitle}</Text>
          <Text variant="bodySmall" color="textSecondary">{item.note}</Text>
        </Box>
      ))}
    </Box>
  );
}
