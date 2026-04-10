import { DaycareMembershipPersona } from "@/daycare_memberships/daycare_memberships.enum.ts";
import { UserPersona } from "./users.d.ts";

export function mapMembershipPersonaToUserPersona(persona: DaycareMembershipPersona): UserPersona {
  switch (persona) {
    case DaycareMembershipPersona.OWNER:
      return "OWNER";
    case DaycareMembershipPersona.ADMIN:
      return "DAYCARE_ADMIN";
    case DaycareMembershipPersona.SITTER:
      return "DAYCARE_SITTER";
  }
}
