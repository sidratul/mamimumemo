import { useLocalSearchParams } from 'expo-router';

import { DaycareApprovalHistoryContainer } from '../../../../containers/daycare-admin';

export default function DaycareApprovalHistoryScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return <DaycareApprovalHistoryContainer id={id ?? ''} />;
}
