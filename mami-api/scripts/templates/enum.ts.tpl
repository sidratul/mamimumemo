// Enum untuk __NAME__ 
export enum __NAME__Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// Array status untuk validasi dan referensi
export const __NAME_UPPER___STATUSES = [__NAME__Status.ACTIVE, __NAME__Status.INACTIVE] as const;

// Type untuk status
export type __NAME__StatusType = typeof __NAME_UPPER___STATUSES[number];