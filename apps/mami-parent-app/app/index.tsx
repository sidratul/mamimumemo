import { Redirect } from 'expo-router';

import { useSession } from '../providers/session-provider';

export default function IndexScreen() {
  const { isAuthenticated } = useSession();
  return <Redirect href={isAuthenticated ? '/(app)/(tabs)/dashboard' : '/(public)/login'} />;
}
