import { Screen, ScreenSection, TextMuted } from '@mami/ui';
import { BulletList } from '../../components/common/BulletList';
import { Text } from '../../theme/theme';

export function RoleAccessContainer() {
  return (
    <Screen title="Role & Access" subtitle="Ringkasan sumber akses user di seluruh aplikasi.">
      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Akses Sistem</Text>
        <BulletList items={['SUPER_ADMIN']} />
      </ScreenSection>

      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Akses Daycare</Text>
        <TextMuted>Akses ini berasal dari membership daycare, bukan dari user.</TextMuted>
        <BulletList items={['OWNER', 'ADMIN', 'SITTER']} />
      </ScreenSection>

      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Akses Parent</Text>
        <TextMuted>Akses parent berasal dari record parent aktif pada daycare.</TextMuted>
        <BulletList
          items={['PARENT']}
        />
      </ScreenSection>
    </Screen>
  );
}
