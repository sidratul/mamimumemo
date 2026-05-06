import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, useConfirm } from '@mami/ui';

import { Box, Text } from '../../theme/theme';

type SettingsAccountSectionProps = {
  onSignOut: () => void | Promise<void>;
};

export function SettingsAccountSection({ onSignOut }: SettingsAccountSectionProps) {
  const { showConfirm } = useConfirm();

  return (
    <Box gap="md">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="md"
        paddingBottom="sm"
        borderBottomWidth={1}
        borderBottomColor="border">
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Akun Admin
        </Text>
      </Box>

      <Box 
        padding="md" 
        gap="md"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#F1F5F9',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 10,
          elevation: 1,
        }}
      >
        <Box flexDirection="row" alignItems="center" gap="md">
          <Box 
            width={48} 
            height={48} 
            borderRadius="full" 
            backgroundColor="background" 
            alignItems="center" 
            justifyContent="center"
          >
            <MaterialCommunityIcons name="logout-variant" size={24} color="#EF4444" />
          </Box>
          <Box flex={1}>
            <Text fontWeight="800" color="textPrimary">Sesi Login</Text>
            <Text variant="bodySmall" color="textSecondary">Keluar dari sesi admin yang sedang aktif di perangkat ini.</Text>
          </Box>
        </Box>

        <Button
          label="Keluar Aplikasi"
          variant="danger"
          style={{ height: 44, borderRadius: 12 }}
          onPress={() => {
            showConfirm({
              title: 'Keluar',
              description: 'Yakin ingin keluar dari sesi admin ini?',
              confirmLabel: 'Keluar',
              cancelLabel: 'Batal',
              onConfirm: onSignOut,
            });
          }}
        />
      </Box>
    </Box>
  );
}
