import { Button } from '@mami/ui';

import { DetailSection } from './DetailSection';
import { RoleSelect, TextField } from '../../components/input';
import { ADMIN_MANAGED_ROLE_OPTIONS } from '../../components/input/RoleSelect';
import { getUserRoleLabel } from '../../shared/user/logic';
import { type UserRole } from '../../shared/user/types';
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
    <DetailSection title="Profil User">
      <Box gap="md">
        <TextField value={name} placeholder="Nama lengkap" onChange={onChangeName} />
        <TextField value={email} placeholder="Email" onChange={onChangeEmail} keyboardType="email-address" />
        <TextField value={phone} placeholder="Nomor telepon" onChange={onChangePhone} keyboardType="phone-pad" />
        
        {canManageRole ? (
          <Box gap="xs">
             <Text variant="bodySmall" fontWeight="700" color="textSecondary" marginLeft="xs">ROLE SISTEM</Text>
             <RoleSelect value={role} onChange={(value: string) => onChangeRole(value as UserRole)} options={ADMIN_MANAGED_ROLE_OPTIONS} />
          </Box>
        ) : (
          <Box gap="xs">
            <Text variant="bodySmall" fontWeight="700" color="textSecondary" marginLeft="xs">ROLE SISTEM</Text>
            <Box backgroundColor="background" borderRadius="md" borderColor="border" borderWidth={1} padding="md">
              <Text fontWeight="700">{getUserRoleLabel(role)}</Text>
            </Box>
            <Text variant="bodySmall" color="textSecondary">Role ini tidak bisa diubah oleh admin level ini.</Text>
          </Box>
        )}
        
        {error ? <Text color="danger" variant="bodySmall" fontWeight="700">{error}</Text> : null}
        
        <Button 
          label={saving ? 'Menyimpan...' : 'Simpan Perubahan'} 
          onPress={onSubmit} 
          disabled={saving} 
          variant="primary" 
          style={{ marginTop: 8 }}
        />
      </Box>
    </DetailSection>
  );
}
