import { useLocalSearchParams } from 'expo-router';

import { UserDetailContainer } from '../../../containers/users';

export default function UserDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  return <UserDetailContainer id={params.id ?? ''} />;
}
