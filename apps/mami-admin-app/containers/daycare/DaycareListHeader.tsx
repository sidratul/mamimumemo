import { Button } from '@mami/ui';
import { ListFilterBar } from '@mami/ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { approvalStatusColorMap } from './shared/ApprovalStatusBadge';
import { Box, Text } from '../../theme/theme';
import { ApprovalStatus } from '../../shared/daycare/types';
import { getAvailableApprovalStatusOptions } from '../../shared/daycare/logic';

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
          <Text variant="title" fontSize={24} flex={1}>Daycare</Text>
          <Button
            label="Tambah Daycare"
            onPress={onPressAdd}
            variant="primary"
            icon={<MaterialIcons name="add" size={18} color="#FFFFFF" />}
            style={{ paddingHorizontal: 16, height: 40, borderRadius: 12 }}
          />
        </Box>
        <Text variant="subtitle">Kelola data daycare terdaftar</Text>
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
