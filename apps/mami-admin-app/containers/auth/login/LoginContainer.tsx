import { Redirect } from 'expo-router';
import { Image } from 'react-native';

import { useSession } from '../../../providers/session-provider';
import { Box, Text } from '../../../theme/theme';
import { LoginForm } from './LoginForm';

export function LoginContainer() {
  const { isLoading, token } = useSession();

  if (isLoading) {
    return null;
  }

  if (token) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Box flex={1} backgroundColor="background" justifyContent="center" padding="xl" gap="lg" paddingTop="xxl">
      <Box gap="md">
        <Image
          source={require('../../../assets/images/legacy-logo.png')}
          style={{ width: 128, height: 128, resizeMode: 'contain', alignSelf: 'center' }}
        />
        <Box gap="xs">
          <Text variant="title">Mami Admin</Text>
          <Text variant="subtitle">Masuk untuk mengelola operasional daycare harian.</Text>
        </Box>
      </Box>

      <Box
        backgroundColor="surface"
        borderRadius="lg"
        borderWidth={1}
        borderColor="border"
        padding="lg"
        gap="md">
        <LoginForm />
      </Box>
    </Box>
  );
}
