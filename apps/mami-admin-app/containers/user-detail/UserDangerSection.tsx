import { Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { ScreenSection } from '@mami/ui';

import { Text } from '../../theme/theme';

type UserDangerSectionProps = {
  userName: string;
  loading: boolean;
  onConfirmDelete: () => void;
};

export function UserDangerSection({ userName, loading, onConfirmDelete }: UserDangerSectionProps) {
  return (
    <ScreenSection gap={8}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Danger Zone</Text>
      <Text color="textSecondary">Hapus user secara permanen dari sistem.</Text>
      <Button
        mode="contained"
        buttonColor="#FF4D4D"
        textColor="#FFFFFF"
        loading={loading}
        disabled={loading}
        onPress={() => {
          Alert.alert('Hapus User', `Yakin ingin menghapus ${userName}?`, [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: onConfirmDelete },
          ]);
        }}>
        Hapus User
      </Button>
    </ScreenSection>
  );
}
