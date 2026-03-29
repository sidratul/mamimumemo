import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SectionCard } from '../../components/common/SectionCard';
import { BulletList } from '../../components/common/BulletList';
import { Box, Text } from '../../theme/theme';

export function RoleAccessContainer() {
  return (
    <ScreenContainer>
      <Box gap="xs">
        <Text variant="title">Role & Access</Text>
        <Text variant="subtitle">Kontrol role system-level untuk semua aplikasi.</Text>
      </Box>

      <SectionCard title="Supported Roles">
        <BulletList
          items={[
            'SUPER_ADMIN',
            'DAYCARE_OWNER',
            'DAYCARE_ADMIN',
            'DAYCARE_SITTER',
            'PARENT',
          ]}
        />
      </SectionCard>

      <SectionCard title="Planned Actions">
        <BulletList
          items={[
            'Assign role to user',
            'Revoke role from user',
            'Set active role policy per app',
          ]}
        />
      </SectionCard>
    </ScreenContainer>
  );
}
