import { Redirect } from 'expo-router';

import { useSession } from '../providers/session-provider';

export default function IndexRoute() {
  const { isLoading, token } = useSession();

  if (isLoading) {
    return null;
  }

  if (token) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
