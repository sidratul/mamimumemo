export enum DaycareMembershipPersona {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  SITTER = "SITTER",
}

export const DAYCARE_MEMBERSHIP_PERSONAS = [
  DaycareMembershipPersona.OWNER,
  DaycareMembershipPersona.ADMIN,
  DaycareMembershipPersona.SITTER,
] as const;

export enum DaycareMembershipStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const DAYCARE_MEMBERSHIP_STATUSES = [
  DaycareMembershipStatus.ACTIVE,
  DaycareMembershipStatus.INACTIVE,
] as const;
