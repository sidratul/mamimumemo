import { Button, useConfirm } from '@mami/ui';

import { DetailSection } from './DetailSection';
import { Text } from '../../theme/theme';

type UserDangerSectionProps = {
  userName: string;
  loading: boolean;
  onConfirmDelete: () => void;
};

export function UserDangerSection({ userName, loading, onConfirmDelete }: UserDangerSectionProps) {
  const { showConfirm } = useConfirm();

  return (
    <DetailSection title="Zona Bahaya">
      <Text variant="bodySmall" color="textSecondary" marginBottom="sm">
        Menghapus user ini akan menghilangkan semua akses dan keanggotaan daycare secara permanen.
      </Text>
      <Button
        label={loading ? 'Menghapus...' : 'Hapus User Secara Permanen'}
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
    </DetailSection>
  );
}
