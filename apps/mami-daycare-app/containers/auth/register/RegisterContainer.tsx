import { Redirect } from 'expo-router';
import { AuthScreen } from '@mami/ui';

import { useSession } from '../../../providers/session-provider';
import { RegisterForm } from './RegisterForm';

export function RegisterContainer() {
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
      cardTitle="Daftar Daycare"
      cardSubtitle="Buat akun owner dan daycare dalam satu alur."
    >
      <RegisterForm />
    </AuthScreen>
  );
}
