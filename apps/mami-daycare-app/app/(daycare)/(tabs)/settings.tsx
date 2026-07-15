import { ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useConfirm, Button } from '@mami/ui';

import { Box, Text, useAppTheme } from '../../../theme/theme';
import { useSession } from '../../../providers/session-provider';
import { ServerApiSettings } from '../../../containers/app-config/ServerApiSettings';

type MenuItem = {
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  route: string;
};

const menuItems: MenuItem[] = [
  {
    label: 'Label Kategori',
    description: 'Sesuaikan label dan warna kategori aktivitas.',
    icon: 'tag-multiple-outline',
    route: '/(daycare)/category-config',
  },
  {
    label: 'Orang Tua',
    description: 'Kelola akun parent dan kontak keluarga.',
    icon: 'account-heart-outline',
    route: '/(daycare)/parents',
  },
  {
    label: 'Aktivitas',
    description: 'Buat daftar master activity yang bisa dipakai oleh daycare.',
    icon: 'calendar-check-outline',
    route: '/(daycare)/master-activities',
  },
  {
    label: 'Template',
    description: 'Atur pola aktivitas utama untuk hari tertentu.',
    icon: 'shape-outline',
    route: '/(daycare)/template',
  },
  {
    label: 'Daily Record',
    description: 'Terapkan template ke tanggal tertentu.',
    icon: 'calendar-plus',
    route: '/(daycare)/daily-record-create',
  },
];

function MenuRow({ item }: { item: MenuItem }) {
  const theme = useAppTheme();

  return (
    <Pressable onPress={() => router.push(item.route as never)}>
      <Box
        flexDirection="row"
        alignItems="center"
        gap="md"
        paddingVertical="md"
        borderBottomWidth={1}
        borderBottomColor="border"
      >
        <Box
          width={44}
          height={44}
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: '#F8F4FF' }}
        >
          <MaterialCommunityIcons name={item.icon} size={22} color={theme.colors.primary} />
        </Box>
        <Box flex={1} gap="xxs">
          <Text fontWeight="800" color="textPrimary">{item.label}</Text>
          <Text variant="bodySmall" color="textSecondary">{item.description}</Text>
        </Box>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
      </Box>
    </Pressable>
  );
}

export default function DaycareSettingsScreen() {
  const { signOut } = useSession();
  const { showConfirm } = useConfirm();

  return (
    <Box flex={1} backgroundColor="surface">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 120, gap: 24 }}
      >
        <Box gap="xs">
          <Text fontSize={24} fontWeight="800" color="textPrimary">Menu</Text>
          <Text variant="bodySmall" color="textSecondary">Kelola aktivitas dan pengaturan daycare dari sini.</Text>
        </Box>

        <Box>
          {menuItems.map((item) => (
            <MenuRow key={item.label} item={item} />
          ))}
        </Box>

        <ServerApiSettings />

        <Box gap="sm">
          <Text variant="bodySmall" color="textSecondary" fontWeight="800">Akun</Text>
          <Button
            label="Keluar Aplikasi"
            variant="danger"
            style={{ height: 46, borderRadius: 14 }}
            onPress={() => {
              showConfirm({
                title: 'Keluar',
                description: 'Yakin ingin keluar dari akun daycare ini?',
                confirmLabel: 'Keluar',
                cancelLabel: 'Batal',
                onConfirm: () => void signOut(),
              });
            }}
          />
        </Box>
      </ScrollView>
    </Box>
  );
}
