import { DaycareApprovalHistory } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';

type ApprovalHistoryItemProps = {
  item: DaycareApprovalHistory;
};

export function ApprovalHistoryItem({ item }: ApprovalHistoryItemProps) {
  return (
    <Box backgroundColor="surface" borderColor="border" borderWidth={1} borderRadius="md" padding="md" gap="sm">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <ApprovalStatusBadge status={item.status} />
        <Text color="textSecondary">
          {new Date(item.changedAt).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Box>
      <Text>{item.note || 'Tidak ada catatan tambahan.'}</Text>
      <Text color="textSecondary">By: {item.changedBy}</Text>
    </Box>
  );
}
