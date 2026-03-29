export function getApprovalStatusColor(status: string) {
  switch (status) {
    case 'APPROVED':
      return '#1F9D63';
    case 'IN_REVIEW':
      return '#2563EB';
    case 'NEEDS_REVISION':
      return '#D97706';
    case 'REJECTED':
      return '#C6285A';
    case 'SUSPENDED':
      return '#6B7280';
    case 'SUBMITTED':
      return '#7C3AED';
    default:
      return '#8A4C73';
  }
}
