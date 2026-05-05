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
      heroTitle="mamimumemo"
      heroSubtitle="Setiap cerita kecil si buah hati, jadi Memo ceria buat Mamimu."
      heroLogoSource={require('../../../assets/images/logo-admin.png')}
      cardTitle="Halo, Admin!"
      cardSubtitle="Masuk untuk mulai mengelola hari ini.">
      <LoginForm />
    </AuthScreen>
  );
}
