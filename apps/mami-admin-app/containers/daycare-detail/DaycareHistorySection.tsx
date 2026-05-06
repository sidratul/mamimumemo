import { Avatar, Divider } from 'react-native-paper';
import { formatDateTimeId } from '@mami/core';

import { DaycareDetailSection } from './DaycareDetailSection';
import { ApprovalStatusBadge } from '../daycare/shared/ApprovalStatusBadge';
import { type DaycareApprovalHistory } from '../../shared/daycare/types';
import { Box, Text } from '../../theme/theme';

type DaycareHistorySectionProps = {
  history: DaycareApprovalHistory[];
  getInitials: (name: string) => string;
};

export function DaycareHistorySection({ history, getInitials }: DaycareHistorySectionProps) {
  return (
    <DaycareDetailSection title="Riwayat Perubahan">
      <Box gap="md">
        {history.length > 0 ? (
          history.map((item, index) => (
            <Box key={index} gap="md">
              <Box flexDirection="row" gap="md" alignItems="flex-start">
                <Avatar.Text 
                  size={40} 
                  label={getInitials(item.changedBy?.name || 'System')} 
                  style={{ backgroundColor: '#EEF2FF' }}
                  labelStyle={{ color: '#4F46E5', fontWeight: '800' }}
                />
                <Box flex={1} gap="xs">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text variant="subtitle" fontWeight="800" fontSize={14} color="textPrimary">
                      {item.changedBy?.name || 'System'}
                    </Text>
                    <Text variant="bodySmall" color="textSecondary" style={{ fontSize: 11 }}>
                      {formatDateTimeId(item.changedAt)}
                    </Text>
                  </Box>
                  <Box flexDirection="row" alignItems="center" gap="sm">
                    <ApprovalStatusBadge status={item.status} />
                  </Box>
                  {item.note ? (
                    <Box backgroundColor="background" padding="sm" borderRadius="sm" marginTop="xs">
                      <Text variant="bodySmall" color="textSecondary">{item.note}</Text>
                    </Box>
                  ) : null}
                </Box>
              </Box>
              {index < history.length - 1 ? <Divider style={{ backgroundColor: '#F1F5F9' }} /> : null}
            </Box>
          ))
        ) : (
          <Box padding="md" alignItems="center">
            <Text variant="bodySmall" color="textSecondary">Belum ada riwayat perubahan.</Text>
          </Box>
        )}
      </Box>
    </DaycareDetailSection>
  );
}
