import { Button } from '@mami/ui';

import { DetailSection } from './DetailSection';
import { RoleSelect, TextField } from '../../components/input';
import { ADMIN_MANAGED_ROLE_OPTIONS } from '../../components/input/RoleSelect';
import { type SystemRoleSelection } from '../../shared/user/types';
import { Box, Text } from '../../theme/theme';

type UserProfileSectionProps = {
  name: string;
  email: string;
  phone: string;
  systemRole: SystemRoleSelection;
  saving: boolean;
  error?: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeSystemRole: (value: SystemRoleSelection) => void;
  onSubmit: () => void;
};

export function UserProfileSection({
  name,
  email,
  phone,
  systemRole,
  saving,
  error,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangeSystemRole,
  onSubmit,
}: UserProfileSectionProps) {
  return (
    <DetailSection title="Profil User">
      <Box gap="md">
        <TextField value={name} placeholder="Nama lengkap" onChange={onChangeName} />
        <TextField value={email} placeholder="Email" onChange={onChangeEmail} keyboardType="email-address" />
        <TextField value={phone} placeholder="Nomor telepon" onChange={onChangePhone} keyboardType="phone-pad" />
        
        <Box gap="xs">
          <Text variant="bodySmall" fontWeight="700" color="textSecondary" marginLeft="xs">ROLE SISTEM</Text>
          <RoleSelect
            value={systemRole}
            onChange={(value: string) => onChangeSystemRole(value as SystemRoleSelection)}
            options={ADMIN_MANAGED_ROLE_OPTIONS}
          />
        </Box>
        
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
