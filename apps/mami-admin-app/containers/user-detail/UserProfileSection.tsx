import { Button } from 'react-native-paper';
import { ScreenSection } from '@mami/ui';

import { RoleSelect, TextField } from '../../components/input';
import { ADMIN_MANAGED_ROLE_OPTIONS } from '../../components/input/RoleSelect';
import { getUserRoleLabel, type UserRole } from '../../services/users';
import { Box, Text } from '../../theme/theme';

type UserProfileSectionProps = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  canManageRole: boolean;
  saving: boolean;
  error?: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeRole: (value: UserRole) => void;
  onSubmit: () => void;
};

export function UserProfileSection({
  name,
  email,
  phone,
  role,
  canManageRole,
  saving,
  error,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangeRole,
  onSubmit,
}: UserProfileSectionProps) {
  return (
    <ScreenSection>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Profil User</Text>
      <TextField value={name} placeholder="Nama lengkap" onChange={onChangeName} />
      <TextField value={email} placeholder="Email" onChange={onChangeEmail} keyboardType="email-address" />
      <TextField value={phone} placeholder="Nomor telepon" onChange={onChangePhone} keyboardType="phone-pad" />
      {canManageRole ? (
        <RoleSelect value={role} onChange={(value) => onChangeRole(value as UserRole)} options={ADMIN_MANAGED_ROLE_OPTIONS} />
      ) : (
        <Box gap="xs">
          <Text color="textSecondary">Role</Text>
          <Box backgroundColor="background" borderRadius="md" borderColor="border" borderWidth={1} padding="md">
            <Text>{getUserRoleLabel(role)}</Text>
          </Box>
          <Text color="textSecondary">Role akun ini bukan sumber kebenaran utama untuk persona. Persona daycare ditentukan lewat membership.</Text>
        </Box>
      )}
      {error ? <Text color="danger">{error}</Text> : null}
      <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
        Simpan Perubahan
      </Button>
    </ScreenSection>
  );
}
