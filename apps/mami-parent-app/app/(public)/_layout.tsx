import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../providers/session-provider';

export default function PublicLayout() {
  const { isAuthenticated } = useSession();

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
