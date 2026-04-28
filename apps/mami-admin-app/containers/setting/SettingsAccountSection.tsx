import { Button } from 'react-native-paper';
import { ScreenSection } from '@mami/ui';

import { Text } from '../../theme/theme';

type SettingsAccountSectionProps = {
  onSignOut: () => void | Promise<void>;
};

export function SettingsAccountSection({ onSignOut }: SettingsAccountSectionProps) {
  return (
    <ScreenSection>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Akun</Text>
      <Text color="textSecondary">Keluar dari sesi admin yang sedang aktif di device ini.</Text>
      <Button mode="contained" buttonColor="#4D96FF" textColor="#FFFFFF" onPress={() => void onSignOut()}>
        Keluar
      </Button>
    </ScreenSection>
  );
}
