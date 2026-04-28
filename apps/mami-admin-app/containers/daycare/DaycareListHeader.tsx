import { Button } from 'react-native-paper';
import { ListFilterBar } from '@mami/ui';

import { approvalStatusColorMap } from './shared/ApprovalStatusBadge';
import { type ApprovalStatus } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';

type DaycareListHeaderProps = {
  status: ApprovalStatus | 'ALL';
  search: string;
  onChangeStatus: (value: ApprovalStatus | 'ALL') => void;
  onChangeSearch: (value: string) => void;
  onPressAdd: () => void;
};

const statusOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Submitted', value: 'SUBMITTED', color: approvalStatusColorMap.SUBMITTED },
  { label: 'Review', value: 'IN_REVIEW', color: approvalStatusColorMap.IN_REVIEW },
  { label: 'Revisi', value: 'NEEDS_REVISION', color: approvalStatusColorMap.NEEDS_REVISION },
  { label: 'Approve', value: 'APPROVED', color: approvalStatusColorMap.APPROVED },
  { label: 'Rejected', value: 'REJECTED', color: approvalStatusColorMap.REJECTED },
  { label: 'Suspended', value: 'SUSPENDED', color: approvalStatusColorMap.SUSPENDED },
];

export function DaycareListHeader({
  status,
  search,
  onChangeStatus,
  onChangeSearch,
  onPressAdd,
}: DaycareListHeaderProps) {
  return (
    <Box gap="lg" paddingTop="md" paddingBottom="sm">
      <Box paddingHorizontal="lg" gap="xs">
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="md">
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#24324B' }}>Daycare</Text>
          <Button
            mode="contained"
            compact
            icon="plus"
            onPress={onPressAdd}
            contentStyle={{ height: 36, alignItems: 'center', justifyContent: 'center' }}
            labelStyle={{ marginVertical: 0, lineHeight: 16 }}
            style={{ borderRadius: 10 }}>
            Tambah
          </Button>
        </Box>
        <Text color="textSecondary">Kelola data daycare terdaftar</Text>
      </Box>

      <ListFilterBar
        searchPlaceholder="Cari nama daycare atau owner..."
        searchValue={search}
        onSearchChange={onChangeSearch}
        options={statusOptions}
        selectedValue={status}
        onSelect={(value) => onChangeStatus(value as ApprovalStatus | 'ALL')}
      />
    </Box>
  );
}
