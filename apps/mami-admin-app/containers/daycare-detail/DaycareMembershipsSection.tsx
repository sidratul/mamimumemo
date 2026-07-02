import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Button } from '@mami/ui';

import { DaycareDetailSection } from './DaycareDetailSection';
import { type DaycareMembershipRecord } from '../../services/membership';
import { Box, Text } from '../../theme/theme';

const accessLabelMap: Record<DaycareMembershipRecord['access'], string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin Daycare',
  SITTER: 'Karyawan',
};

type DaycareMembershipsSectionProps = {
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  memberships: DaycareMembershipRecord[];
  onAddPress: () => void;
};

export function DaycareMembershipsSection({
  owner,
  memberships,
  onAddPress,
}: DaycareMembershipsSectionProps) {
  const staffMemberships = memberships.filter(
    (membership) =>
      membership.status === 'ACTIVE' &&
      membership.user._id !== owner._id &&
      membership.access !== 'OWNER'
  );

  return (
    <DaycareDetailSection
      title="Owner & Staff"
      action={<Button label="Tambah Staff" onPress={onAddPress} />}
    >
      <Box gap="md">
        {/* Owner Card */}
        <Box
          padding="md"
          gap="xs"
          style={{ 
            borderRadius: 16, 
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#F1F5F9',
            borderLeftWidth: 4,
            borderLeftColor: '#4F46E5' 
          }}>
          <Text variant="subtitle" fontWeight="800" color="textPrimary">{owner.name}</Text>
          <Box gap="xxs">
            <Text variant="bodySmall" color="textSecondary">{owner.email}</Text>
            <Box flexDirection="row" alignItems="center" gap="xs">
              <Box paddingHorizontal="sm" paddingVertical="xxs" borderRadius="sm" backgroundColor="background">
                <Text variant="bodySmall" fontWeight="800" color="primary" fontSize={10}>OWNER</Text>
              </Box>
              {owner.phone ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialCommunityIcons name="phone-outline" size={12} color="#64748B" />
                  <Text variant="bodySmall" color="textSecondary">{owner.phone}</Text>
                </View>
              ) : null}
            </Box>
          </Box>
        </Box>

        {/* Staff List */}
        {staffMemberships.length > 0 ? (
          staffMemberships.map((membership) => (
            <Box
              key={membership._id}
              padding="md"
              gap="xs"
              style={{ 
                borderRadius: 16, 
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#F1F5F9'
              }}>
              <Text variant="subtitle" fontWeight="800" color="textPrimary">{membership.user.name}</Text>
              <Box gap="xxs">
                <Text variant="bodySmall" color="textSecondary">{membership.user.email}</Text>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Box paddingHorizontal="sm" paddingVertical="xxs" borderRadius="sm" backgroundColor="border">
                    <Text variant="bodySmall" fontWeight="800" color="textSecondary" fontSize={10}>
                      {accessLabelMap[membership.access].toUpperCase()}
                    </Text>
                  </Box>
                  {membership.user.phone ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MaterialCommunityIcons name="phone-outline" size={12} color="#64748B" />
                      <Text variant="bodySmall" color="textSecondary">{membership.user.phone}</Text>
                    </View>
                  ) : null}
                </Box>
                {membership.notes ? (
                   <Text variant="bodySmall" color="textSecondary" style={{ fontStyle: 'italic' }} marginTop="xs">"{membership.notes}"</Text>
                ) : null}
              </Box>
            </Box>
          ))
        ) : (
          <Box padding="md" alignItems="center">
            <Text variant="bodySmall" color="textSecondary">Belum ada staff tambahan.</Text>
          </Box>
        )}
      </Box>
    </DaycareDetailSection>
  );
}
