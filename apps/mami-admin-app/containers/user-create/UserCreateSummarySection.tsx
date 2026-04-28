import { ScreenSection } from '@mami/ui';

import { Text } from '../../theme/theme';

export function UserCreateSummarySection() {
  return (
    <ScreenSection gap={8}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Ringkasan</Text>
      <Text variant="subtitle">Admin app hanya membuat user `Super Admin` dan `Daycare Admin` secara manual.</Text>
    </ScreenSection>
  );
}
