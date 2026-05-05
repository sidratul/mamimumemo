import { DaycareMembershipAccess } from "@/daycare_memberships/daycare_memberships.enum.ts";
import { UserAccess } from "./users.d.ts";

export function mapMembershipAccessToUserAccess(access: DaycareMembershipAccess): UserAccess {
  switch (access) {
    case DaycareMembershipAccess.OWNER:
      return "OWNER";
    case DaycareMembershipAccess.ADMIN:
      return "DAYCARE_ADMIN";
    case DaycareMembershipAccess.SITTER:
      return "DAYCARE_SITTER";
  }
}
