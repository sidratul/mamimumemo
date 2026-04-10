import { useLocalSearchParams } from 'expo-router';

import { DaycareDetailContainer } from '../../../../containers/daycare-detail';

export default function DaycareDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return <DaycareDetailContainer id={id ?? ''} />;
}
