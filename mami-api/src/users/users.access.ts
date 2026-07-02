import { DaycareMembershipAccess } from "@/daycare_memberships/daycare_memberships.enum.ts";
import { UserAccess } from "#shared/enums/enum.ts";

export function mapMembershipAccessToUserAccess(
  access: DaycareMembershipAccess,
): UserAccess {
  switch (access) {
    case DaycareMembershipAccess.OWNER:
      return UserAccess.OWNER;
    case DaycareMembershipAccess.ADMIN:
      return UserAccess.DAYCARE_ADMIN;
    case DaycareMembershipAccess.SITTER:
      return UserAccess.DAYCARE_SITTER;
  }
}
