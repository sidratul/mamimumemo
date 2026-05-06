import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

import { Box, Text, useAppTheme } from '../../theme/theme';
import { useSession } from '../../providers/session-provider';
import { SettingsAccountSection } from './SettingsAccountSection';

export function SettingsContainer() {
  const { signOut } = useSession();
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box gap="lg" paddingTop="md" paddingBottom="sm">
          <Box paddingHorizontal="lg" gap="xs">
            <Text variant="title" fontSize={24}>Pengaturan</Text>
            <Text variant="subtitle">Kelola preferensi aplikasi dan akun admin.</Text>
          </Box>
        </Box>

        <Box paddingHorizontal="lg" gap="xl">
          <SettingsAccountSection onSignOut={() => void signOut()} />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
