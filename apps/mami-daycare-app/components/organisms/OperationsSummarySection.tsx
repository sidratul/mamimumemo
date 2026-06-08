import { Box } from '../../theme/theme';
import { OperationsSummaryCard } from '../molecules/OperationsSummaryCard';

type OperationsSummarySectionProps = {
  childCount: number;
  parentCount: number;
};

export function OperationsSummarySection({ childCount, parentCount }: OperationsSummarySectionProps) {
  return (
    <Box flexDirection="row" gap="md">
      <OperationsSummaryCard label="Anak" value={childCount} icon="baby-face" color="#4F46E5" />
      <OperationsSummaryCard label="Orang Tua" value={parentCount} icon="account-group" color="#10B981" />
    </Box>
  );
}
