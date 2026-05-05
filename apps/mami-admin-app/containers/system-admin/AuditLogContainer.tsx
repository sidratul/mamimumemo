import { Screen, ScreenSection, TextMuted } from '@mami/ui';
import { BulletList } from '../../components/common/BulletList';
import { Text } from '../../theme/theme';

export function AuditLogContainer() {
  return (
    <Screen title="Audit Log" subtitle="Riwayat aksi admin untuk perubahan status dan akses.">
      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Tracked Events</Text>
        <BulletList
          items={[
            'Daycare approval status updated',
            'Role assignment changed',
            'System setting modified',
          ]}
        />
      </ScreenSection>

      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Filters</Text>
        <TextMuted>Placeholder scope untuk filter audit log yang nanti dipasang ke query GraphQL.</TextMuted>
        <BulletList items={['Date range', 'Actor', 'Action type', 'Target daycare/user']} />
      </ScreenSection>
    </Screen>
  );
}
