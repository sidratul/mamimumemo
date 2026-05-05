import { Redirect } from 'expo-router';
import { AuthScreen } from '@mami/ui';

import { useSession } from '../../../providers/session-provider';
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
    <AuthScreen
      heroTitle="Mami"
      heroSubtitle="Kelola operasional daycare dengan cepat dan rapi."
      heroLogoSource={require('../../../assets/images/logo-admin.png')}
      cardTitle="Login"
      cardSubtitle="Masuk ke panel admin.">
      <LoginForm />
    </AuthScreen>
  );
}
