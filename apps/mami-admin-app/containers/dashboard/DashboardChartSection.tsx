import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { DimensionValue } from 'react-native';

import { Box, Text } from '../../theme/theme';

function ChartRow({
  label,
  value,
  width,
  color,
  trackColor,
}: {
  label: string;
  value: string;
  width: DimensionValue;
  color: string;
  trackColor: string;
}) {
  return (
    <Box gap="xs">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text>{label}</Text>
        <Text style={{ fontWeight: '700', color }}>{value}</Text>
      </Box>
      <Box height={10} borderRadius="md" style={{ backgroundColor: trackColor, overflow: 'hidden' }}>
        <Box height={10} borderRadius="md" style={{ width, backgroundColor: color }} />
      </Box>
    </Box>
  );
}

type DashboardChartSectionProps = {
  loading: boolean;
  submitted: number;
  submittedWidth: DimensionValue;
  inReview: number;
  inReviewWidth: DimensionValue;
  approved: number;
  approvedWidth: DimensionValue;
  revision: number;
  revisionWidth: DimensionValue;
  primaryColor: string;
  successColor: string;
};

export function DashboardChartSection({
  loading,
  submitted,
  submittedWidth,
  inReview,
  inReviewWidth,
  approved,
  approvedWidth,
  revision,
  revisionWidth,
  primaryColor,
  successColor,
}: DashboardChartSectionProps) {
  return (
    <Box backgroundColor="surface" borderRadius="md" borderWidth={1} borderColor="border" padding="lg" gap="md">
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text variant="cardValue">Approval Chart</Text>
        <MaterialIcons name="bar-chart" size={20} color={primaryColor} />
      </Box>
      <ChartRow
        label="Submitted"
        value={loading ? '...' : String(submitted)}
        width={submittedWidth}
        color="#4D96FF"
        trackColor="#E7F0FF"
      />
      <ChartRow
        label="In Review"
        value={loading ? '...' : String(inReview)}
        width={inReviewWidth}
        color="#F5A623"
        trackColor="#FFF1DB"
      />
      <ChartRow
        label="Approved"
        value={loading ? '...' : String(approved)}
        width={approvedWidth}
        color={successColor}
        trackColor="#E8F8EA"
      />
      <ChartRow
        label="Needs Revision"
        value={loading ? '...' : String(revision)}
        width={revisionWidth}
        color="#8B6DFF"
        trackColor="#F0EAFF"
      />
    </Box>
  );
}
