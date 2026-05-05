import { Button, InlineMessage } from '@mami/ui';

import { DaycareDetailSection } from './DaycareDetailSection';
import { ApprovalStatusBadge } from '../daycare/shared/ApprovalStatusBadge';
import { type ApprovalStatus } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';

type DaycareStatusSectionProps = {
  status: ApprovalStatus;
  submittedLabel: string;
  helperText?: string;
  onPressUpdate: () => void;
  canUpdate: boolean;
};

export function DaycareStatusSection({
  status,
  submittedLabel,
  helperText,
  onPressUpdate,
  canUpdate,
}: DaycareStatusSectionProps) {
  return (
    <DaycareDetailSection title="Status Daycare">
      <Box gap="sm">
        <Box alignItems="flex-start" gap="xs">
          <ApprovalStatusBadge status={status} />
          <Text color="textSecondary">Telah diajukan {submittedLabel}</Text>
        </Box>
        {helperText ? <InlineMessage tone="warning">{helperText}</InlineMessage> : null}
        <Button label="Update Status" onPress={onPressUpdate} disabled={!canUpdate} variant="secondary" />
      </Box>
    </DaycareDetailSection>
  );
}
