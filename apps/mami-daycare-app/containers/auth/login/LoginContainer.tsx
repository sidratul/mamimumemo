import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { AuthScreen } from '@mami/ui';

import { Box, Text } from '../../../theme/theme';
import { LoginForm } from './LoginForm';

export function LoginContainer() {
  return (
    <AuthScreen
      heroTitle="Mami"
      heroSubtitle="Lanjutkan ke dashboard daycare dan operasional harian."
      heroLogoSource={require('../../../../mami-admin-app/assets/images/logo-admin.png')}
      cardTitle="Login"
      cardSubtitle="Masuk ke akun daycare.">
      <Box gap="md">
        <LoginForm />
      </Box>
      <Box flexDirection="row" justifyContent="center" alignItems="center" gap="xs">
        <Text color="textSecondary">Belum punya akun?</Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text color="primary" style={{ fontWeight: '700' }}>Daftar</Text>
        </Pressable>
      </Box>
    </AuthScreen>
  );
}
