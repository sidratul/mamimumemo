import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Button } from '@mami/ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { DetailSection } from './DetailSection';
import { type UserDaycareMembership } from '../../shared/user/types';
import { Box, Text } from '../../theme/theme';

const accessLabelMap: Record<UserDaycareMembership['access'], string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin Daycare',
  SITTER: 'Karyawan',
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
    <DetailSection 
      title="Membership Daycare"
      action={
        <Button
          label="Tambah"
          onPress={onAddPress}
          variant="primary"
          icon={<MaterialIcons name="add" size={16} color="#FFFFFF" />}
          style={{ height: 32, paddingHorizontal: 12, borderRadius: 8 }}
        />
      }
    >
      {memberships.length === 0 ? (
        <Text variant="bodySmall" color="textSecondary" paddingVertical="sm">
          User ini belum terhubung ke daycare mana pun.
        </Text>
      ) : (
        <Box gap="md">
          {memberships.map((membership) => (
            <Box
              key={membership._id}
              padding="md"
              gap="sm"
              style={{
                borderWidth: 1,
                borderColor: '#F1F5F9',
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 5,
                elevation: 1,
              }}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text fontWeight="800" color="textPrimary">{membership.daycare.name}</Text>
                <Box 
                  paddingHorizontal="sm" 
                  paddingVertical="xs" 
                  borderRadius="sm" 
                  backgroundColor="background"
                >
                  <Text variant="bodySmall" fontWeight="700" color="primary" fontSize={11}>
                    {statusLabelMap[membership.status].toUpperCase()}
                  </Text>
                </Box>
              </Box>
              
              <Box gap="xs">
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <MaterialCommunityIcons name="account-tie-outline" size={14} color="#94A3B8" />
                  <Text variant="bodySmall" color="textSecondary">
                    Role: <Text variant="bodySmall" fontWeight="700" color="textPrimary">{accessLabelMap[membership.access]}</Text>
                  </Text>
                </Box>
                {membership.notes ? (
                  <Box flexDirection="row" alignItems="center" gap="xs">
                    <MaterialCommunityIcons name="note-text-outline" size={14} color="#94A3B8" />
                    <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>{membership.notes}</Text>
                  </Box>
                ) : null}
              </Box>

              {membership.status === 'ACTIVE' ? (
                <Pressable onPress={() => onDeactivateMembership(membership._id)} style={{ alignSelf: 'flex-start' }}>
                  <Box flexDirection="row" alignItems="center" gap="xs" marginTop="xs" paddingVertical="xs">
                    <MaterialCommunityIcons name="close-circle-outline" size={14} color="#EF4444" />
                    <Text variant="bodySmall" fontWeight="700" color="danger">
                      {busyMembershipId === membership._id ? 'Memproses...' : 'Nonaktifkan membership'}
                    </Text>
                  </Box>
                </Pressable>
              ) : null}
            </Box>
          ))}
        </Box>
      )}
    </DetailSection>
  );
}
