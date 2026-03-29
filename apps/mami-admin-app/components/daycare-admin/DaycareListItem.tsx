import { Pressable } from 'react-native';

import { AdminDaycare } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';

type DaycareListItemProps = {
  daycare: AdminDaycare;
  onPress: () => void;
};

export function DaycareListItem({ daycare, onPress }: DaycareListItemProps) {
  const submittedLabel = daycare.submittedAt
    ? new Date(daycare.submittedAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Belum disubmit';

  return (
    <Pressable onPress={onPress}>
      <Box backgroundColor="surface" borderWidth={1} borderColor="border" borderRadius="lg" padding="lg" gap="md">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box flex={1} gap="xs" paddingRight="md">
            <Text variant="cardValue">{daycare.name}</Text>
            <Text color="textSecondary">{daycare.lid} • {daycare.city}</Text>
          </Box>
          <ApprovalStatusBadge status={daycare.approvalStatus} />
        </Box>

        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box gap="xs">
            <Text color="textSecondary">Owner</Text>
            <Text>{daycare.ownerName}</Text>
          </Box>
          <Box alignItems="flex-end" gap="xs">
            <Text color="textSecondary">Submitted</Text>
            <Text>{submittedLabel}</Text>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
}
