import { type AdminUser, type UserPersona } from '../../services/users';
import { Box, Text } from '../../theme/theme';
import { ScreenSection } from '@mami/ui';

const personaLabelMap: Record<UserPersona, string> = {
  SUPER_ADMIN: 'Superuser',
  PARENT: 'Parent',
  OWNER: 'Owner',
  DAYCARE_ADMIN: 'Admin Daycare',
  DAYCARE_SITTER: 'Karyawan Daycare',
};

const personaColorMap: Record<UserPersona, { text: string; background: string }> = {
  SUPER_ADMIN: { text: '#4D96FF', background: '#E7F0FF' },
  PARENT: { text: '#8B6DFF', background: '#F0EAFF' },
  OWNER: { text: '#34B27B', background: '#E7F7EF' },
  DAYCARE_ADMIN: { text: '#F5A623', background: '#FFF1DB' },
  DAYCARE_SITTER: { text: '#FF6FB5', background: '#FFE8F3' },
};

type UserSummarySectionProps = {
  user: AdminUser;
};

export function UserSummarySection({ user }: UserSummarySectionProps) {
  return (
    <ScreenSection>
      <Box flexDirection="row" justifyContent="space-between" gap="md">
        <Box flex={1} gap="xs">
          <Text color="textSecondary">Email</Text>
          <Text numberOfLines={1}>{user.email}</Text>
        </Box>
        <Box flex={1} gap="xs">
          <Text color="textSecondary">Phone</Text>
          <Text numberOfLines={1}>{user.phone || '-'}</Text>
        </Box>
      </Box>
      <Box gap="xs" marginTop="md">
        <Text color="textSecondary">Persona</Text>
        <Box flexDirection="row" flexWrap="wrap" gap="xs">
          {user.personas.length > 0 ? user.personas.map((persona) => (
            <Box
              key={persona}
              paddingHorizontal="sm"
              paddingVertical="xs"
              style={{
                borderRadius: 9,
                backgroundColor: personaColorMap[persona].background,
              }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: personaColorMap[persona].text }}>
                {personaLabelMap[persona]}
              </Text>
            </Box>
          )) : (
            <Text color="textSecondary">Belum ada persona tambahan.</Text>
          )}
        </Box>
      </Box>
    </ScreenSection>
  );
}
