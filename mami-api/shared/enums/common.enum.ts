// Enum untuk role pengguna
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// Array role untuk validasi dan referensi
export const USER_ROLES = [UserRole.USER, UserRole.ADMIN] as const;

// Type untuk role
export type RoleType = typeof USER_ROLES[number];

// Enum untuk status respons
export enum ResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
}

// Pesan-pesan umum
export const MESSAGES = {
  // Auth Messages
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    REGISTER_SUCCESS: "Registration successful",
    LOGOUT_SUCCESS: "Logout successful",
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_EXISTS: "User with this email already exists",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID: "Invalid token",
  },
  
  // General Messages
  GENERAL: {
    SUCCESS: "Operation completed successfully",
    ERROR: "An error occurred",
    NOT_FOUND: "Resource not found",
    SERVER_ERROR: "Internal server error",
    VALIDATION_ERROR: "Validation failed",
  },
  
  // User Messages
  USER: {
    PROFILE_FETCHED: "User profile fetched successfully",
    PROFILE_UPDATED: "User profile updated successfully",
    PASSWORD_CHANGED: "Password changed successfully",
  }
};

// Konfigurasi umum
export const CONFIG = {
  JWT: {
    EXPIRES_IN: "1h",
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
  }
};

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