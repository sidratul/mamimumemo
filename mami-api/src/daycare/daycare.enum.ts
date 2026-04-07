export enum DaycareApprovalStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN_REVIEW",
  NEEDS_REVISION = "NEEDS_REVISION",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export const DAYCARE_APPROVAL_STATUSES = Object.values(DaycareApprovalStatus);
