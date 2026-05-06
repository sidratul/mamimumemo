import { Button, InlineMessage } from '@mami/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DaycareDetailSection } from './DaycareDetailSection';
import { ApprovalStatusBadge } from '../daycare/shared/ApprovalStatusBadge';
import { type ApprovalStatus } from '../../shared/daycare/types';
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
    <DaycareDetailSection title="Status Persetujuan">
      <Box 
        padding="md" 
        gap="md"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#F1F5F9',
        }}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box gap="xs">
            <ApprovalStatusBadge status={status} />
            <Text variant="bodySmall" color="textSecondary">Diajukan: {submittedLabel}</Text>
          </Box>
          <MaterialCommunityIcons name="shield-check-outline" size={24} color="#4F46E5" style={{ opacity: 0.2 }} />
        </Box>

        {helperText ? (
          <Box backgroundColor="background" padding="sm" borderRadius="sm" borderLeftWidth={4} borderLeftColor="primary">
            <Text variant="bodySmall" color="textSecondary" lineHeight={18}>{helperText}</Text>
          </Box>
        ) : null}

        <Button 
          label="Perbarui Status" 
          onPress={onPressUpdate} 
          disabled={!canUpdate} 
          variant="secondary"
          style={{ height: 44, borderRadius: 12 }}
          icon={<MaterialCommunityIcons name="square-edit-outline" size={18} color="#4F46E5" />}
        />
      </Box>
    </DaycareDetailSection>
  );
}
