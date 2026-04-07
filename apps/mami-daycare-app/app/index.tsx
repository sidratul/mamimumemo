import { Redirect } from 'expo-router';

import { useSession } from '../providers/session-provider';

export default function IndexRoute() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return null;
  }

  return <Redirect href={session ? '/(daycare)' : '/(auth)/login'} />;
}
