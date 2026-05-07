import { Redirect } from 'expo-router';

import { useSession } from '../../providers/session-provider';

export default function DaycareHomeScreen() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(daycare)/(tabs)" />;
}
