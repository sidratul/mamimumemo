import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type ComponentProps } from 'react';

import { Box, Text } from '../../theme/theme';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

function SummaryCard({
  title,
  value,
  note,
  icon,
  iconColor,
}: {
  title: string;
  value: string;
  note: string;
  icon: MaterialIconName;
  iconColor: string;
}) {
  return (
    <Box backgroundColor="surface" borderRadius="md" borderWidth={1} borderColor="border" padding="lg" gap="xs">
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text variant="cardTitle">{title}</Text>
        <MaterialIcons name={icon} size={18} color={iconColor} />
      </Box>
      <Text variant="cardValue">{value}</Text>
      <Text color="textSecondary">{note}</Text>
    </Box>
  );
}

type DashboardSummarySectionProps = {
  loading: boolean;
  submitted: number;
  inReview: number;
  approved: number;
  primaryColor: string;
  successColor: string;
};

export function DashboardSummarySection({
  loading,
  submitted,
  inReview,
  approved,
  primaryColor,
  successColor,
}: DashboardSummarySectionProps) {
  return (
    <Box gap="md">
      <SummaryCard
        title="Submitted"
        value={loading ? '...' : String(submitted)}
        note="Menunggu mulai direview"
        icon="mark-email-unread"
        iconColor={primaryColor}
      />
      <SummaryCard
        title="In Review"
        value={loading ? '...' : String(inReview)}
        note="Sedang diproses admin"
        icon="fact-check"
        iconColor="#F5A623"
      />
      <SummaryCard
        title="Approved"
        value={loading ? '...' : String(approved)}
        note="Sudah aktif"
        icon="verified-user"
        iconColor={successColor}
      />
    </Box>
  );
}
