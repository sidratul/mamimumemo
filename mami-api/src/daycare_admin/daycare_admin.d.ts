export type DaycareApprovalStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "NEEDS_REVISION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type DaycareOwnerRef = {
  userId: string;
  name: string;
  email: string;
  phone?: string;
};

export type DaycareLegalDocument = {
  type: string;
  url: string;
  verified: boolean;
};

export type DaycareApprovalHistoryActor = {
  userId?: string;
  name: string;
};

export type DaycareApprovalHistory = {
  status: DaycareApprovalStatus;
  note?: string;
  changedBy: DaycareApprovalHistoryActor;
  changedAt: Date;
};

export type DaycareApproval = {
  status: DaycareApprovalStatus;
  note?: string;
  reviewedBy?: DaycareApprovalHistoryActor;
  reviewedAt?: Date;
  history: DaycareApprovalHistory[];
};

export type DaycareDocShape = {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  owner: DaycareOwnerRef;
  legalDocuments: DaycareLegalDocument[];
  submittedAt?: Date;
  approvedAt?: Date;
  isActive: boolean;
  approval: DaycareApproval;
  createdAt: Date;
  updatedAt: Date;
};
