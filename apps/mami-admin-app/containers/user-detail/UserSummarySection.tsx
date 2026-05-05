import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type AdminUser, type UserAccess } from '../../services/users';
import { Box, Text } from '../../theme/theme';

const accessLabelMap: Record<UserAccess, string> = {
  SUPER_ADMIN: 'Superuser',
  PARENT: 'Parent',
  OWNER: 'Owner',
  DAYCARE_ADMIN: 'Admin Daycare',
  DAYCARE_SITTER: 'Karyawan',
};

const accessColorMap: Record<UserAccess, { text: string; background: string }> = {
  SUPER_ADMIN: { text: '#4F46E5', background: '#EEF2FF' }, // Indigo
  PARENT: { text: '#8B5CF6', background: '#F5F3FF' }, // Violet
  OWNER: { text: '#10B981', background: '#ECFDF5' }, // Emerald
  DAYCARE_ADMIN: { text: '#F59E0B', background: '#FFFBEB' }, // Amber
  DAYCARE_SITTER: { text: '#EC4899', background: '#FDF2F8' }, // Pink
};

type UserSummarySectionProps = {
  user: AdminUser;
};

export function UserSummarySection({ user }: UserSummarySectionProps) {
  return (
    <Box flexDirection="row" gap="lg" alignItems="center" paddingHorizontal="xs">
      <Box
        width={64}
        height={64}
        borderRadius="full"
        alignItems="center"
        justifyContent="center"
        backgroundColor="background"
        style={{ borderWidth: 1, borderColor: '#F1F5F9' }}>
        <MaterialCommunityIcons name="account-circle-outline" size={36} color="#94A3B8" />
      </Box>

      <Box flex={1} gap="xs">
        <Text variant="subtitle" fontWeight="800" fontSize={20} color="textPrimary">{user.name}</Text>
        <Box flexDirection="row" flexWrap="wrap" gap="xs">
          {user.accesses.length > 0 ? user.accesses.map((access) => (
            <Box
              key={access}
              paddingHorizontal="sm"
              paddingVertical="xs"
              style={{
                borderRadius: 8,
                backgroundColor: accessColorMap[access].background,
              }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: accessColorMap[access].text, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                {accessLabelMap[access]}
              </Text>
            </Box>
          )) : (
            <Box
              paddingHorizontal="sm"
              paddingVertical="xs"
              style={{
                borderRadius: 8,
                backgroundColor: '#F1F5F9',
              }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                AKSES UTAMA
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
