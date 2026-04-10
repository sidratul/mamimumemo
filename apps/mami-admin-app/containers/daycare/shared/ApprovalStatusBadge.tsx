import { Chip } from 'react-native-paper';

import { ApprovalStatus } from '../../../services/daycare-admin';

export const approvalStatusLabelMap: Record<ApprovalStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'Review',
  NEEDS_REVISION: 'Revisi',
  APPROVED: 'Approve',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

export const approvalStatusColorMap: Record<ApprovalStatus, string> = {
  DRAFT: '#24324B',
  SUBMITTED: '#4D96FF',
  IN_REVIEW: '#F5A623',
  NEEDS_REVISION: '#8B6DFF',
  APPROVED: '#34B27B',
  REJECTED: '#FF4D4D',
  SUSPENDED: '#24324B',
};

type ApprovalStatusBadgeProps = {
  status: ApprovalStatus;
};

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  return (
    <Chip
      compact
      style={{
        backgroundColor: `${approvalStatusColorMap[status]}1A`,
        borderRadius: 9,
      }}
      textStyle={{
        color: approvalStatusColorMap[status],
        fontWeight: status === 'SUBMITTED' ? '500' : '600',
        fontSize: 12,
      }}>
      {approvalStatusLabelMap[status]}
    </Chip>
  );
}
