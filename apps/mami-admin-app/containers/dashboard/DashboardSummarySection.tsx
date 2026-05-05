import { StatCard } from '@mami/ui';

import { Box } from '../../theme/theme';

type DashboardSummarySectionProps = {
  loading: boolean;
  submitted: number;
  inReview: number;
  approved: number;
};

export function DashboardSummarySection({
  loading,
  submitted,
  inReview,
  approved,
}: DashboardSummarySectionProps) {
  return (
    <Box gap="md">
      <StatCard label="Submitted" value={loading ? '...' : String(submitted)} helperText="Menunggu mulai direview" />
      <StatCard label="In Review" value={loading ? '...' : String(inReview)} helperText="Sedang diproses admin" />
      <StatCard label="Approved" value={loading ? '...' : String(approved)} helperText="Sudah aktif" />
    </Box>
  );
}
