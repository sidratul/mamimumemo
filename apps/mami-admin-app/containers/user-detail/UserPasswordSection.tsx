import { Button } from '@mami/ui';

import { DetailSection } from './DetailSection';
import { PasswordField } from '../../components/input';
import { Box, Text } from '../../theme/theme';

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
    <DetailSection title="Keamanan Akun">
      <Box gap="md">
        <PasswordField value={password} placeholder="Password baru" onChange={onChangePassword} />
        {error ? <Text color="danger" variant="bodySmall" fontWeight="700">{error}</Text> : null}
        <Button 
          label={loading ? 'Memperbarui...' : 'Update Password'} 
          onPress={onSubmit} 
          variant="secondary" 
          disabled={loading} 
        />
      </Box>
    </DetailSection>
  );
}
