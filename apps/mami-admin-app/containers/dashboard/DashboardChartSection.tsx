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
        <Text variant="bodySmall" fontWeight="600">{label}</Text>
        <Text style={{ fontWeight: '800', color, fontSize: 16 }}>{value}</Text>
      </Box>
      <Box height={12} borderRadius="full" style={{ backgroundColor: trackColor, overflow: 'hidden' }}>
        <Box height={12} borderRadius="full" style={{ width, backgroundColor: color }} />
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
}: DashboardChartSectionProps) {
  return (
    <Box 
      backgroundColor="surface" 
      borderRadius="lg" 
      padding="lg" 
      gap="lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
      }}
    >
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text variant="cardTitle">Status Pendaftaran</Text>
        <Box backgroundColor="background" padding="xs" borderRadius="sm">
          <MaterialIcons name="bar-chart" size={18} color={primaryColor} />
        </Box>
      </Box>
      
      <Box gap="md">
        <ChartRow
          label="SUBMITTED"
          value={loading ? '...' : String(submitted)}
          width={submittedWidth}
          color="#6366F1" // Indigo
          trackColor="#EEF2FF"
        />
        <ChartRow
          label="IN REVIEW"
          value={loading ? '...' : String(inReview)}
          width={inReviewWidth}
          color="#F59E0B" // Amber
          trackColor="#FFFBEB"
        />
        <ChartRow
          label="APPROVED"
          value={loading ? '...' : String(approved)}
          width={approvedWidth}
          color="#10B981" // Emerald
          trackColor="#ECFDF5"
        />
        <ChartRow
          label="REVISION"
          value={loading ? '...' : String(revision)}
          width={revisionWidth}
          color="#8B5CF6" // Violet
          trackColor="#F5F3FF"
        />
      </Box>
    </Box>
  );
}
