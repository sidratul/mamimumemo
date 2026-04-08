import { Chip } from 'react-native-paper';

import { ApprovalStatus } from '../../services/daycare-admin';

const labelMap: Record<ApprovalStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In Review',
  NEEDS_REVISION: 'Needs Revision',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

const colorMap: Record<ApprovalStatus, string> = {
  DRAFT: '#8A6A56',
  SUBMITTED: '#F15A29',
  IN_REVIEW: '#4DA7DB',
  NEEDS_REVISION: '#F7B500',
  APPROVED: '#74B72E',
  REJECTED: '#D64545',
  SUSPENDED: '#6B7280',
};

type ApprovalStatusBadgeProps = {
  status: ApprovalStatus;
};

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  return (
    <Chip
      compact
      style={{ backgroundColor: `${colorMap[status]}14`, borderColor: `${colorMap[status]}33`, borderWidth: 1 }}
      textStyle={{ color: colorMap[status], fontWeight: '700' }}>
      {labelMap[status]}
    </Chip>
  );
}
