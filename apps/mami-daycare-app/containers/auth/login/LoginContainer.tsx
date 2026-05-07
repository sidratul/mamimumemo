import { Pressable } from 'react-native';
import { Redirect, router } from 'expo-router';
import { AuthScreen } from '@mami/ui';

import { Box, Text } from '../../../theme/theme';
import { useSession } from '../../../providers/session-provider';
import { LoginForm } from './LoginForm';

export function LoginContainer() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return null;
  }

  if (session) {
    return <Redirect href="/(daycare)/(tabs)" />;
  }

  return (
    <AuthScreen
      heroTitle="mamimumemo"
      heroSubtitle="Setiap cerita kecil si buah hati, jadi Memo ceria buat Mamimu."
      heroLogoSource={require('../../../assets/images/daycare_logo_clean.png')}
      cardTitle="Halo, Pengelola!"
      cardSubtitle="Masuk untuk memantau keceriaan hari ini.">
      <Box gap="xl">
        <LoginForm />
        
        <Box flexDirection="row" justifyContent="center" alignItems="center" gap="xs">
          <Text variant="bodySmall" color="textSecondary">Belum punya akun?</Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text variant="bodySmall" color="primary" style={{ fontWeight: '800' }}>Daftar Sekarang</Text>
          </Pressable>
        </Box>
      </Box>
    </AuthScreen>
  );
}
