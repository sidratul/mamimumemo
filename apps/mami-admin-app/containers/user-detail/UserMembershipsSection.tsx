import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { ScreenSection } from '@mami/ui';

import { type UserDaycareMembership } from '../../services/users';
import { Box, Text } from '../../theme/theme';

const personaLabelMap: Record<UserDaycareMembership['persona'], string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin Daycare',
  SITTER: 'Karyawan Daycare',
};

const statusLabelMap: Record<UserDaycareMembership['status'], string> = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Nonaktif',
};

type UserMembershipsSectionProps = {
  memberships: UserDaycareMembership[];
  onAddPress: () => void;
  onDeactivateMembership: (membershipId: string) => void;
  busyMembershipId?: string;
};

export function UserMembershipsSection({
  memberships,
  onAddPress,
  onDeactivateMembership,
  busyMembershipId,
}: UserMembershipsSectionProps) {
  return (
    <ScreenSection>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="md">
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Membership Daycare</Text>
        <Button
          mode="contained"
          compact
          icon="plus"
          onPress={onAddPress}
          contentStyle={{ height: 32, alignItems: 'center', justifyContent: 'center' }}
          labelStyle={{ marginVertical: 0, lineHeight: 14 }}
          style={{ borderRadius: 10 }}>
          Tambah
        </Button>
      </Box>

      {memberships.length === 0 ? (
        <Text color="textSecondary">User ini belum terhubung ke daycare mana pun.</Text>
      ) : (
        <Box gap="sm">
          {memberships.map((membership) => (
            <Box
              key={membership.id}
              padding="md"
              gap="xs"
              style={{
                borderWidth: 1,
                borderColor: '#E8ECF4',
                borderRadius: 10,
                backgroundColor: '#F7F9FC',
              }}>
              <Text style={{ fontWeight: '700', color: '#24324B' }}>{membership.daycare.name}</Text>
              <Text color="textSecondary">
                {personaLabelMap[membership.persona]} · {statusLabelMap[membership.status]}
              </Text>
              {membership.notes ? <Text color="textSecondary">{membership.notes}</Text> : null}
              {membership.status === 'ACTIVE' ? (
                <Pressable onPress={() => onDeactivateMembership(membership.id)}>
                  <Box flexDirection="row" alignItems="center" gap="xs" marginTop="xs">
                    <MaterialCommunityIcons name="close-circle-outline" size={16} color="#FF4D4D" />
                    <Text color="danger">
                      {busyMembershipId === membership.id ? 'Memproses...' : 'Nonaktifkan membership'}
                    </Text>
                  </Box>
                </Pressable>
              ) : null}
            </Box>
          ))}
        </Box>
      )}
    </ScreenSection>
  );
}
