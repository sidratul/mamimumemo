import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../providers/session-provider';

export default function AppLayout() {
  const { isLoading, token } = useSession();

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="daycares/index" />
      <Stack.Screen name="daycares/[id]/index" />
      <Stack.Screen name="daycares/[id]/history" />
      <Stack.Screen name="users/create" />
      <Stack.Screen name="users/[id]" />
      <Stack.Screen name="modules/index" />
      <Stack.Screen name="modules/role-access" />
      <Stack.Screen name="modules/audit-log" />
    </Stack>
  );
}
