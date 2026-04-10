export const approvalStatuses = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  NEEDS_REVISION: 'NEEDS_REVISION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type ApprovalStatus = (typeof approvalStatuses)[keyof typeof approvalStatuses];

export const approvalStatusLabelMap: Record<ApprovalStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In Review',
  NEEDS_REVISION: 'Needs Revision',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

export function getApprovalStatusLabel(status: ApprovalStatus) {
  return approvalStatusLabelMap[status];
}
