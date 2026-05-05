import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../providers/session-provider';

export default function AppLayout() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return <Redirect href="/(public)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile-update" />
    </Stack>
  );
}
