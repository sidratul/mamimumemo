import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Surface } from 'react-native-paper';

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
  SUPER_ADMIN: { text: '#4D96FF', background: '#E7F0FF' },
  PARENT: { text: '#8B6DFF', background: '#F0EAFF' },
  OWNER: { text: '#34B27B', background: '#E7F7EF' },
  DAYCARE_ADMIN: { text: '#F5A623', background: '#FFF1DB' },
  DAYCARE_SITTER: { text: '#FF6FB5', background: '#FFE8F3' },
};

type UserListItemProps = {
  user: AdminUser;
  onPress: () => void;
};

export function UserListItem({ user, onPress }: UserListItemProps) {
  return (
    <Surface
      elevation={0}
      style={{
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8ECF4',
      }}>
      <Pressable onPress={onPress}>
        <Box flexDirection="row" alignItems="flex-start" padding="md" gap="md">
          <Box
            width={56}
            height={56}
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
            style={{ backgroundColor: '#EEF3FF' }}>
            <MaterialCommunityIcons name="account-outline" size={26} color="#4D96FF" />
          </Box>

          <Box flex={1} gap="sm">
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#24324B' }} numberOfLines={2}>
              {user.name}
            </Text>

            <Box gap="xs">
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons name="email-outline" size={14} color="#7A869A" />
                <Text color="textSecondary" numberOfLines={1} style={{ fontSize: 13 }}>
                  {user.email}
                </Text>
              </Box>
              {user.phone ? (
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <MaterialCommunityIcons name="phone-outline" size={14} color="#7A869A" />
                  <Text color="textSecondary" numberOfLines={1} style={{ fontSize: 13 }}>
                    {user.phone}
                  </Text>
                </Box>
              ) : null}
            </Box>

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
                <Box
                  paddingHorizontal="sm"
                  paddingVertical="xs"
                  style={{
                    borderRadius: 9,
                    backgroundColor: '#EEF3FF',
                  }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#4D96FF' }}>
                    Akun
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Pressable>
    </Surface>
  );
}
