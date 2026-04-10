import { Button } from 'react-native-paper';
import { ScreenHeader } from '@mami/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../../providers/session-provider';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Box, Text } from '../../theme/theme';

export function SettingsContainer() {
  const { signOut } = useSession();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScreenContainer>
        <ScreenHeader title="Settings" subtitle="Area konfigurasi admin." />

        <Box paddingHorizontal="lg">
          <Box backgroundColor="surface" borderRadius="md" borderWidth={1} borderColor="border" padding="lg" gap="lg">
            <Text color="textSecondary">Keluar dari sesi admin yang sedang aktif di device ini.</Text>
            <Button mode="contained" buttonColor="#4D96FF" textColor="#FFFFFF" onPress={() => void signOut()}>
              Keluar
            </Button>
          </Box>
        </Box>
      </ScreenContainer>
    </SafeAreaView>
  );
}
