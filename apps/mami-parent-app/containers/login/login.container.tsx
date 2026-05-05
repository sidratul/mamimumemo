import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthScreen, useToast } from '@mami/ui';

import { useSession } from '../../providers/session-provider';
import { LoginForm } from './login.form';
import type { LoginFormValues } from './login.schema';

export function LoginContainer() {
  const router = useRouter();
  const { signIn } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: LoginFormValues) {
    try {
      setLoading(true);
      await signIn(values);
      router.replace('/(app)/(tabs)/dashboard');
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Login gagal. Silakan coba lagi.',
        tone: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      heroTitle="Mami"
      heroSubtitle="Pantau aktivitas anak dan laporan daycare dari satu tempat."
      heroLogoSource={require('../../../mami-admin-app/assets/images/logo-admin.png')}
      cardTitle="Login"
      cardSubtitle="Masuk ke akun parent.">
      <LoginForm loading={loading} onSubmit={handleSubmit} />
    </AuthScreen>
  );
}
