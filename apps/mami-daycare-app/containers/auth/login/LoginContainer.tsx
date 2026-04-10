import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, ScreenSection } from '@mami/ui';

import { Box, Text } from '../../../theme/theme';
import { LoginForm } from './LoginForm';

export function LoginContainer() {
  return (
    <Box flex={1} backgroundColor="background" justifyContent="center" padding="xl" gap="lg">
      <ScreenSection padded={false}>
        <ScreenHeader title="Masuk" subtitle="Lanjutkan ke dashboard daycare." />
        <LoginForm />
      </ScreenSection>

      <Box flexDirection="row" justifyContent="center" alignItems="center" gap="xs">
        <Text color="textSecondary">Belum punya akun?</Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text color="primary" style={{ fontWeight: '700' }}>Daftar</Text>
        </Pressable>
      </Box>
    </Box>
  );
}
