import { Screen, ScreenSection, TextMuted } from '@mami/ui';
import { BulletList } from '../../components/common/BulletList';
import { Text } from '../../theme/theme';

export function RoleAccessContainer() {
  return (
    <Screen title="Role & Access" subtitle="Kontrol role system-level untuk semua aplikasi.">
      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Supported Roles</Text>
        <BulletList
          items={[
            'SUPER_ADMIN',
            'DAYCARE_OWNER',
            'DAYCARE_ADMIN',
            'DAYCARE_SITTER',
            'PARENT',
          ]}
        />
      </ScreenSection>

      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Planned Actions</Text>
        <TextMuted>Placeholder kontrol akses ini nanti lebih tepat dibaca dari schema/permission GraphQL, bukan hardcoded screen-local.</TextMuted>
        <BulletList
          items={[
            'Assign role to user',
            'Revoke role from user',
            'Set active role policy per app',
          ]}
        />
      </ScreenSection>
    </Screen>
  );
}
