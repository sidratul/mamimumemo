// Enum untuk role pengguna
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  DAYCARE_OWNER = "DAYCARE_OWNER",
  DAYCARE_ADMIN = "DAYCARE_ADMIN",
  DAYCARE_SITTER = "DAYCARE_SITTER",
  PARENT = "PARENT",
}

// Array role untuk validasi dan referensi
export const USER_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.DAYCARE_OWNER,
  UserRole.DAYCARE_ADMIN,
  UserRole.DAYCARE_SITTER,
  UserRole.PARENT,
] as const;

// Type untuk role
export type RoleType = typeof USER_ROLES[number];

// Enum untuk status respons
export enum ResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
}

// Status HTTP
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}