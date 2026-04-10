import { Button } from 'react-native-paper';
import { ScreenSection } from '@mami/ui';

import { PasswordField } from '../../components/input';
import { Text } from '../../theme/theme';

type UserPasswordSectionProps = {
  password: string;
  loading: boolean;
  error?: string;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
};

export function UserPasswordSection({
  password,
  loading,
  error,
  onChangePassword,
  onSubmit,
}: UserPasswordSectionProps) {
  return (
    <ScreenSection>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Reset Password</Text>
      <PasswordField value={password} placeholder="Password baru" onChange={onChangePassword} />
      {error ? <Text color="danger">{error}</Text> : null}
      <Button mode="outlined" onPress={onSubmit} loading={loading} disabled={loading}>
        Update Password
      </Button>
    </ScreenSection>
  );
}
