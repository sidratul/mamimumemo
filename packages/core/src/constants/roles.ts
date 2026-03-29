export const userRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DAYCARE_OWNER: 'DAYCARE_OWNER',
  DAYCARE_ADMIN: 'DAYCARE_ADMIN',
  DAYCARE_SITTER: 'DAYCARE_SITTER',
  PARENT: 'PARENT',
} as const;

export type UserRole = (typeof userRoles)[keyof typeof userRoles];

export const appRoleMap = {
  admin: [userRoles.SUPER_ADMIN],
  owner: [userRoles.DAYCARE_OWNER],
  daycare: [userRoles.DAYCARE_ADMIN, userRoles.DAYCARE_SITTER],
  parent: [userRoles.PARENT],
} as const;
