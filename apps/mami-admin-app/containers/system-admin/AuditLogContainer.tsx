import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SectionCard } from '../../components/common/SectionCard';
import { BulletList } from '../../components/common/BulletList';
import { Box, Text } from '../../theme/theme';

export function AuditLogContainer() {
  return (
    <ScreenContainer>
      <Box gap="xs">
        <Text variant="title">Audit Log</Text>
        <Text variant="subtitle">Riwayat aksi admin untuk perubahan status dan akses.</Text>
      </Box>

      <SectionCard title="Tracked Events">
        <BulletList
          items={[
            'Daycare approval status updated',
            'Role assignment changed',
            'System setting modified',
          ]}
        />
      </SectionCard>

      <SectionCard title="Filters">
        <BulletList items={['Date range', 'Actor', 'Action type', 'Target daycare/user']} />
      </SectionCard>
    </ScreenContainer>
  );
}
