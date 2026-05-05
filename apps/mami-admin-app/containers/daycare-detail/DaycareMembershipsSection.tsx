import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import { DaycareDetailSection } from './DaycareDetailSection';
import { type DaycareMembershipRecord } from '../../services/daycare-memberships/store';
import { Box, Text } from '../../theme/theme';

const personaLabelMap: Record<DaycareMembershipRecord['persona'], string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin Daycare',
  SITTER: 'Karyawan Daycare',
};

type DaycareMembershipsSectionProps = {
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  memberships: DaycareMembershipRecord[];
};

export function DaycareMembershipsSection({
  owner,
  memberships,
}: DaycareMembershipsSectionProps) {
  const staffMemberships = memberships.filter(
    (membership) =>
      membership.status === 'ACTIVE' &&
      membership.user.role !== 'SUPER_ADMIN' &&
      membership.user.id !== owner.id &&
      membership.persona !== 'OWNER'
  );

  return (
    <DaycareDetailSection title="Owner & Staff">
      <Box gap="sm">
        <Box
          paddingBottom="md"
          gap="xs"
          style={{ borderBottomWidth: 1, borderBottomColor: '#F1D6E4' }}>
          <Text style={{ fontWeight: '700', color: '#24324B' }}>{owner.name}</Text>
          <Text color="textSecondary">{owner.email}</Text>
          <Text color="textSecondary">Owner</Text>
          {owner.phone ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="phone-outline" size={14} color="#7A869A" />
              <Text color="textSecondary">{owner.phone}</Text>
            </View>
          ) : null}
        </Box>

        {staffMemberships.length === 0 ? (
          <Text color="textSecondary">Belum ada staff daycare lain yang aktif.</Text>
        ) : (
          staffMemberships.map((membership) => (
            <Box
              key={membership.id}
              paddingBottom="md"
              gap="xs"
              style={{ borderBottomWidth: 1, borderBottomColor: '#F1D6E4' }}>
              <Text style={{ fontWeight: '700', color: '#24324B' }}>{membership.user.name}</Text>
              <Text color="textSecondary">{membership.user.email}</Text>
              <Text color="textSecondary">{personaLabelMap[membership.persona]}</Text>
              {membership.user.phone ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialCommunityIcons name="phone-outline" size={14} color="#7A869A" />
                  <Text color="textSecondary">{membership.user.phone}</Text>
                </View>
              ) : null}
              {membership.notes ? <Text color="textSecondary">{membership.notes}</Text> : null}
            </Box>
          ))
        )}
      </Box>
    </DaycareDetailSection>
  );
}
