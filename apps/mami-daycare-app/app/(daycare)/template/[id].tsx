import { useLocalSearchParams } from 'expo-router';

import { DaycareTemplateDetailContainer } from '../../../containers/daycare/template/DaycareTemplateDetailContainer';

export default function DaycareTemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <DaycareTemplateDetailContainer templateId={id || ''} />;
}
