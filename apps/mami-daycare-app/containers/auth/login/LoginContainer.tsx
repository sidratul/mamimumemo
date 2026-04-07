import { Pressable } from 'react-native';
import { router } from 'expo-router';

import { Box, Text } from '../../../theme/theme';
import { LoginForm } from './LoginForm';

export function LoginContainer() {
  return (
    <Box flex={1} backgroundColor="background" justifyContent="center" padding="xl" gap="lg">
      <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
        <Text style={{ fontSize: 28, fontWeight: '700' }}>Masuk</Text>
        <LoginForm />
      </Box>

      <Box flexDirection="row" justifyContent="center" alignItems="center" gap="xs">
        <Text color="textSecondary">Belum punya akun?</Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text color="primary" style={{ fontWeight: '700' }}>Daftar</Text>
        </Pressable>
      </Box>
    </Box>
  );
}
