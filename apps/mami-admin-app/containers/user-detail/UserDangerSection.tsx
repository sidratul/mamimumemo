import { Button, ScreenSection, useConfirm } from '@mami/ui';

import { Text } from '../../theme/theme';

type UserDangerSectionProps = {
  userName: string;
  loading: boolean;
  onConfirmDelete: () => void;
};

export function UserDangerSection({ userName, loading, onConfirmDelete }: UserDangerSectionProps) {
  const { showConfirm } = useConfirm();

  return (
    <ScreenSection gap={8}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Danger Zone</Text>
      <Text color="textSecondary">Hapus user secara permanen dari sistem.</Text>
      <Button
        label={loading ? 'Menghapus...' : 'Hapus User'}
        variant="danger"
        disabled={loading}
        onPress={() => {
          showConfirm({
            title: 'Hapus User',
            description: `Yakin ingin menghapus ${userName}?`,
            confirmLabel: 'Hapus',
            cancelLabel: 'Batal',
            onConfirm: onConfirmDelete,
          });
        }}
      />
    </ScreenSection>
  );
}
