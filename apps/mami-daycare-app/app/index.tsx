import { Redirect } from 'expo-router';

import { useSession } from '../providers/session-provider';

export default function IndexRoute() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return null;
  }

  // Always go to tabs if logged in, regardless of daycare status
  return <Redirect href={session ? '/(daycare)/(tabs)' : '/(auth)/login'} />;
}
