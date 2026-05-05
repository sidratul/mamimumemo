import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { Box, Text } from '../../theme/theme';
import { type AdminUser, type UserPersona } from '../../services/users';

const personaLabelMap: Record<UserPersona, string> = {
  SUPER_ADMIN: 'Superuser',
  PARENT: 'Parent',
  OWNER: 'Owner',
  DAYCARE_ADMIN: 'Admin Daycare',
  DAYCARE_SITTER: 'Karyawan',
};

const personaColorMap: Record<UserPersona, { text: string; background: string }> = {
  SUPER_ADMIN: { text: '#4F46E5', background: '#EEF2FF' }, // Indigo
  PARENT: { text: '#8B5CF6', background: '#F5F3FF' }, // Violet
  OWNER: { text: '#10B981', background: '#ECFDF5' }, // Emerald
  DAYCARE_ADMIN: { text: '#F59E0B', background: '#FFFBEB' }, // Amber
  DAYCARE_SITTER: { text: '#EC4899', background: '#FDF2F8' }, // Pink
};

type UserListItemProps = {
  user: AdminUser;
  onPress: () => void;
};

export function UserListItem({ user, onPress }: UserListItemProps) {
  return (
    <Box
      backgroundColor="surface"
      borderRadius="lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F1F5F9',
      }}>
      <Pressable onPress={onPress} android_ripple={{ color: '#F1F5F9' }}>
        <Box flexDirection="row" alignItems="center" padding="md" gap="md">
          <Box
            width={52}
            height={52}
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
            backgroundColor="background"
            style={{ borderWidth: 1, borderColor: '#F1F5F9' }}>
            <MaterialCommunityIcons name="account-circle-outline" size={28} color="#64748B" />
          </Box>

          <Box flex={1} gap="xs">
            <Text variant="defaults" fontWeight="800" color="textPrimary" numberOfLines={1}>
              {user.name}
            </Text>

            <Box flexDirection="row" alignItems="center" gap="xs">
              <MaterialCommunityIcons name="email-outline" size={14} color="#94A3B8" />
              <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
                {user.email}
              </Text>
            </Box>

            <Box flexDirection="row" flexWrap="wrap" gap="xs" marginTop="xs">
              {user.personas.length > 0 ? user.personas.map((persona) => (
                <Box
                  key={persona}
                  paddingHorizontal="sm"
                  paddingVertical="xs"
                  style={{
                    borderRadius: 8,
                    backgroundColor: personaColorMap[persona].background,
                  }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: personaColorMap[persona].text, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    {personaLabelMap[persona]}
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
                    AKUN
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
        </Box>
      </Pressable>
    </Box>
  );
}
