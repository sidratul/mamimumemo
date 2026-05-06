export type ApprovalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'NEEDS_REVISION'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type DaycareApprovalHistory = {
  status: ApprovalStatus;
  note: string;
  changedAt: string;
  changedBy?: {
    name: string;
  } | null;
};

export type DaycareRecord = {
  _id: string;
  name: string;
  logoUrl?: string | null;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  city: string;
  address?: string | null;
  description?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  isActive: boolean;
  legalDocuments?: {
    type: string;
    url: string;
    verified: boolean;
  }[] | null;
  approval?: {
    status: ApprovalStatus;
    note?: string | null;
    history: DaycareApprovalHistory[];
  } | null;
};
