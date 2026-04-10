import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Button } from 'react-native-paper';

import { DaycareDetailSection } from './DaycareDetailSection';
import { type DaycareMembershipRecord } from '../../services/daycare-memberships/store';
import { Box, Text } from '../../theme/theme';

const personaLabelMap: Record<DaycareMembershipRecord['persona'], string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin Daycare',
  SITTER: 'Karyawan Daycare',
};

const statusLabelMap: Record<DaycareMembershipRecord['status'], string> = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Nonaktif',
};

type DaycareMembershipsSectionProps = {
  memberships: DaycareMembershipRecord[];
  busyMembershipId?: string;
  onAddPress: () => void;
  onDeactivateMembership: (membershipId: string) => void;
};

export function DaycareMembershipsSection({
  memberships,
  busyMembershipId,
  onAddPress,
  onDeactivateMembership,
}: DaycareMembershipsSectionProps) {
  return (
    <DaycareDetailSection
      title="Staff & Persona"
      action={
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
      }>
      {memberships.length === 0 ? (
        <Text color="textSecondary">Belum ada staff atau persona daycare lain.</Text>
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
              <Text style={{ fontWeight: '700', color: '#24324B' }}>{membership.user.name}</Text>
              <Text color="textSecondary">{membership.user.email}</Text>
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
    </DaycareDetailSection>
  );
}
