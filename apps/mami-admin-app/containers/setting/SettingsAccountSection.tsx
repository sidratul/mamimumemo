import { Button, ScreenSection, TextMuted, useConfirm } from '@mami/ui';

import { Text } from '../../theme/theme';

type SettingsAccountSectionProps = {
  onSignOut: () => void | Promise<void>;
};

export function SettingsAccountSection({ onSignOut }: SettingsAccountSectionProps) {
  const { showConfirm } = useConfirm();

  return (
    <ScreenSection>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Akun</Text>
      <TextMuted>Keluar dari sesi admin yang sedang aktif di device ini.</TextMuted>
      <Button
        label="Keluar"
        onPress={() => {
          showConfirm({
            title: 'Keluar',
            description: 'Yakin ingin keluar dari sesi admin ini?',
            confirmLabel: 'Keluar',
            cancelLabel: 'Batal',
            onConfirm: onSignOut,
          });
        }}
      />
    </ScreenSection>
  );
}
