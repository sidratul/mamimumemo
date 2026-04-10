export const userRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DAYCARE_OWNER: 'DAYCARE_OWNER',
  DAYCARE_ADMIN: 'DAYCARE_ADMIN',
  DAYCARE_SITTER: 'DAYCARE_SITTER',
  PARENT: 'PARENT',
} as const;

export type UserRole = (typeof userRoles)[keyof typeof userRoles];

export const userRoleLabelMap: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  DAYCARE_OWNER: 'Daycare Owner',
  DAYCARE_ADMIN: 'Daycare Admin',
  DAYCARE_SITTER: 'Daycare Sitter',
  PARENT: 'Parent',
};

export function getUserRoleLabel(role: UserRole) {
  return userRoleLabelMap[role];
}

export const appRoleMap = {
  admin: [userRoles.SUPER_ADMIN],
  owner: [userRoles.DAYCARE_OWNER],
  daycare: [userRoles.DAYCARE_ADMIN, userRoles.DAYCARE_SITTER],
  parent: [userRoles.PARENT],
} as const;
