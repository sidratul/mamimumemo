import { getApprovalStatusLabel as getSharedApprovalStatusLabel } from '@mami/core';
import { DaycareRecord, ApprovalStatus } from './types';

export const allowedNextStatuses: Record<ApprovalStatus, ApprovalStatus[]> = {
  DRAFT: [],
  SUBMITTED: ['IN_REVIEW'],
  IN_REVIEW: ['SUBMITTED', 'APPROVED', 'NEEDS_REVISION', 'REJECTED'],
  NEEDS_REVISION: ['IN_REVIEW'],
  APPROVED: ['IN_REVIEW', 'SUSPENDED'],
  REJECTED: ['IN_REVIEW'],
  SUSPENDED: ['APPROVED'],
};

export function getApprovalStatusLabel(status: ApprovalStatus) {
  return getSharedApprovalStatusLabel(status as any);
}

export function getAvailableApprovalStatusOptions(status: ApprovalStatus) {
  return allowedNextStatuses[status].map((value) => ({
    label: getApprovalStatusLabel(value),
    value,
  }));
}

export function getApprovalStatusHelperText(status: ApprovalStatus) {
  switch (status) {
    case 'SUBMITTED':
      return 'Kembalikan daycare ke status pengajuan awal.';
    case 'IN_REVIEW':
      return 'Pindahkan daycare ke tahap review aktif oleh admin.';
    case 'APPROVED':
      return 'Aktifkan daycare dan izinkan operasional berjalan.';
    case 'NEEDS_REVISION':
      return 'Minta owner melengkapi atau memperbaiki data pendaftaran.';
    case 'REJECTED':
      return 'Tolak pendaftaran daycare secara final.';
    case 'SUSPENDED':
      return 'Nonaktifkan daycare yang sebelumnya sudah approved.';
    default:
      return '';
  }
}

export function mapDaycare(node: DaycareRecord): DaycareRecord {
  return node;
}
