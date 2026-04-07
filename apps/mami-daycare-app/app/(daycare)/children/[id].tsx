import { useLocalSearchParams } from 'expo-router';

import { ChildDetailContainer } from '../../../containers/daycare/child-detail';

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ChildDetailContainer id={id || ''} />;
}
