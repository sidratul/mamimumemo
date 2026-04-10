import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      <Box
        backgroundColor="background"
        padding="md"
        gap="sm"
        style={{ borderWidth: 1, borderColor: '#E8ECF4', borderRadius: 10 }}>
        <Box alignItems="flex-start" gap="xs">
          <ApprovalStatusBadge status={status} />
          <Text color="textSecondary">Telah diajukan {submittedLabel}</Text>
        </Box>
        {helperText ? (
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            padding="sm"
            style={{ backgroundColor: '#FFF6E5', borderRadius: 8 }}>
            <Box flexDirection="row" alignItems="center" gap="xs" flex={1}>
              <MaterialCommunityIcons name="alert-outline" size={16} color="#D18B00" />
              <Text style={{ color: '#7A5A00' }}>{helperText}</Text>
            </Box>
          </Box>
        ) : null}
        <Button mode="outlined" onPress={onPressUpdate} disabled={!canUpdate}>
          Update Status
        </Button>
      </Box>
    </DaycareDetailSection>
  );
}
