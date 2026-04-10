import { Avatar, Divider } from 'react-native-paper';
import { formatDateTimeId } from '@mami/core';

import { DaycareDetailSection } from './DaycareDetailSection';
import { ApprovalStatusBadge } from '../daycare/shared/ApprovalStatusBadge';
import { type DaycareApprovalHistory } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';

type DaycareHistorySectionProps = {
  history: DaycareApprovalHistory[];
  getInitials: (name: string) => string;
};

export function DaycareHistorySection({ history, getInitials }: DaycareHistorySectionProps) {
  return (
    <DaycareDetailSection title="Riwayat">
      <Box
        backgroundColor="background"
        style={{ borderWidth: 1, borderColor: '#E8ECF4', overflow: 'hidden', borderRadius: 10 }}>
        {history.length === 0 ? (
          <Box padding="md">
            <Text color="textSecondary">Belum ada riwayat approval.</Text>
          </Box>
        ) : (
          history.map((item, index) => (
            <Box key={`${item.changedAt}-${index}`}>
              {index > 0 ? <Divider /> : null}
              <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" padding="md" gap="sm">
                <Box flexDirection="row" gap="sm" flex={1}>
                  <Avatar.Text
                    size={38}
                    label={getInitials(item.changedBy)}
                    style={{ backgroundColor: '#EEF3FF' }}
                    labelStyle={{ color: '#4D96FF', fontSize: 13, fontWeight: '700' }}
                  />
                  <Box flex={1} gap="xs">
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#24324B' }}>{item.changedBy}</Text>
                    <Box alignItems="flex-start">
                      <ApprovalStatusBadge status={item.status} />
                    </Box>
                    {item.note ? (
                      <Text color="textSecondary" style={{ lineHeight: 20 }}>
                        {item.note}
                      </Text>
                    ) : null}
                  </Box>
                </Box>
                <Text color="textSecondary" style={{ fontSize: 12 }}>
                  {formatDateTimeId(item.changedAt)}
                </Text>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </DaycareDetailSection>
  );
}
