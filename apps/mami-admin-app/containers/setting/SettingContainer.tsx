import { Pressable } from 'react-native';

import { useSession } from '../../providers/session-provider';
import { Box, Text } from '../../theme/theme';

export function SettingsContainer() {
  const { signOut } = useSession();

  return (
    <Box flex={1} backgroundColor="background" padding="xl" gap="lg" paddingTop="xxl">
      <Text variant="title">Settings</Text>
      <Text variant="subtitle">Area konfigurasi admin.</Text>

      <Pressable onPress={() => void signOut()}>
        <Box backgroundColor="danger" padding="lg" borderRadius="md" alignItems="center">
          <Text variant="buttonLabel">Keluar</Text>
        </Box>
      </Pressable>
    </Box>
  );
}
