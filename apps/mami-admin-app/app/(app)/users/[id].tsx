import { useLocalSearchParams } from 'expo-router';

import { UserDetailContainer } from '../../../containers/user-detail/UserDetailContainer';

export default function UserDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  return <UserDetailContainer id={params.id ?? ''} />;
}
