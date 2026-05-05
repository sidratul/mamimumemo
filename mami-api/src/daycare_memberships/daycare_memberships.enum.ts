export enum DaycareMembershipAccess {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  SITTER = "SITTER",
}

export const DAYCARE_MEMBERSHIP_ACCESSES = [
  DaycareMembershipAccess.OWNER,
  DaycareMembershipAccess.ADMIN,
  DaycareMembershipAccess.SITTER,
] as const;

export enum DaycareMembershipStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const DAYCARE_MEMBERSHIP_STATUSES = [
  DaycareMembershipStatus.ACTIVE,
  DaycareMembershipStatus.INACTIVE,
] as const;
