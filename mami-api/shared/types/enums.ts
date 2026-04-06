// Shared enum types untuk Zod validation

// Activity Category
export const ActivityCategoryEnum = {
  MEAL: "meal",
  NAP: "nap",
  TOILETING: "toileting",
  CARE: "care",
  PLAY: "play",
  LEARNING: "learning",
  CREATIVE: "creative",
  PHYSICAL: "physical",
  OUTDOOR: "outdoor",
  ROUTINE: "routine",
  SOCIAL: "social",
  DEVELOPMENT: "development",
} as const;

export type ActivityCategory = typeof ActivityCategoryEnum[keyof typeof ActivityCategoryEnum];

// Meal Type
export const MealTypeEnum = {
  BREAKFAST: "breakfast",
  SNACK: "snack",
  LUNCH: "lunch",
  DINNER: "dinner",
} as const;

export type MealType = typeof MealTypeEnum[keyof typeof MealTypeEnum];

// Eaten Amount
export const EatenAmountEnum = {
  ALL: "all",
  SOME: "some",
  NONE: "none",
} as const;

export type EatenAmount = typeof EatenAmountEnum[keyof typeof EatenAmountEnum];

// Nap Quality
export const NapQualityEnum = {
  GOOD: "good",
  RESTLESS: "restless",
  SHORT: "short",
} as const;

export type NapQuality = typeof NapQualityEnum[keyof typeof NapQualityEnum];

// Toileting Type
export const ToiletingTypeEnum = {
  URINE: "urine",
  BOWEL: "bowel",
} as const;

export type ToiletingType = typeof ToiletingTypeEnum[keyof typeof ToiletingTypeEnum];

// Mood
export const MoodEnum = {
  HAPPY: "happy",
  SLEEPY: "sleepy",
  FUSSY: "fussy",
  ENERGETIC: "energetic",
  NEUTRAL: "neutral",
} as const;

export type Mood = typeof MoodEnum[keyof typeof MoodEnum];

// Intensity
export const IntensityEnum = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type Intensity = typeof IntensityEnum[keyof typeof IntensityEnum];

// Gender
export const GenderEnum = {
  MALE: "male",
  FEMALE: "female",
} as const;

export type Gender = typeof GenderEnum[keyof typeof GenderEnum];

// Relation
export const RelationEnum = {
  FATHER: "father",
  MOTHER: "mother",
  GUARDIAN: "guardian",
  GRANDFATHER: "grandfather",
  GRANDMOTHER: "grandmother",
  OTHER: "other",
} as const;

export type Relation = typeof RelationEnum[keyof typeof RelationEnum];

// Service Type
export const ServiceTypeEnum = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

export type ServiceType = typeof ServiceTypeEnum[keyof typeof ServiceTypeEnum];

// Contract Status
export const ContractStatusEnum = {
  ACTIVE: "active",
  EXPIRED: "expired",
  TERMINATED: "terminated",
} as const;

export type ContractStatus = typeof ContractStatusEnum[keyof typeof ContractStatusEnum];

// Medical Record Type
export const MedicalRecordTypeEnum = {
  ILLNESS: "illness",
  INJURY: "injury",
  CHRONIC_CONDITION: "chronic_condition",
  ALLERGY: "allergy",
  MEDICATION: "medication",
} as const;

export type MedicalRecordType = typeof MedicalRecordTypeEnum[keyof typeof MedicalRecordTypeEnum];

// Medical Record Status
export const MedicalRecordStatusEnum = {
  ACTIVE: "active",
  RECOVERED: "recovered",
  CHRONIC: "chronic",
  RECURRING: "recurring",
} as const;

export type MedicalRecordStatus = typeof MedicalRecordStatusEnum[keyof typeof MedicalRecordStatusEnum];

// Medical Record Severity
export const MedicalRecordSeverityEnum = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type MedicalRecordSeverity = typeof MedicalRecordSeverityEnum[keyof typeof MedicalRecordSeverityEnum];

// Activity Source
export const ActivitySourceEnum = {
  PARENT: "parent",
  GUARDIAN: "guardian",
  DAYCARE: "daycare",
} as const;

export type ActivitySource = typeof ActivitySourceEnum[keyof typeof ActivitySourceEnum];

// Guardian Permission
export const GuardianPermissionEnum = {
  VIEW_REPORTS: "view_reports",
  INPUT_ACTIVITY: "input_activity",
  INPUT_HEALTH: "input_health",
  ENROLL_DAYCARE: "enroll_daycare",
  EDIT_PROFILE: "edit_profile",
  MANAGE_GUARDIANS: "manage_guardians",
} as const;

export type GuardianPermission = typeof GuardianPermissionEnum[keyof typeof GuardianPermissionEnum];

// Day of Week (JavaScript standard: 0=Sunday, 1=Monday, ..., 6=Saturday)
export const DayOfWeekEnum = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export type DayOfWeek = typeof DayOfWeekEnum[keyof typeof DayOfWeekEnum];

// Shift Type
export const ShiftTypeEnum = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
  FULL: "full",
} as const;

export type ShiftType = typeof ShiftTypeEnum[keyof typeof ShiftTypeEnum];

// Sitter Role
export const SitterRoleEnum = {
  ANY: "any",
  SENIOR_SITTER: "senior_sitter",
  JUNIOR_SITTER: "junior_sitter",
} as const;

export type SitterRole = typeof SitterRoleEnum[keyof typeof SitterRoleEnum];

// Attendance Status
export const AttendanceStatusEnum = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EARLY_PICKUP: "early_pickup",
} as const;

export type AttendanceStatus = typeof AttendanceStatusEnum[keyof typeof AttendanceStatusEnum];

// Invoice Status
export const InvoiceStatusEnum = {
  PENDING: "pending",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

export type InvoiceStatus = typeof InvoiceStatusEnum[keyof typeof InvoiceStatusEnum];

// Staff Payment Status
export const StaffPaymentStatusEnum = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
} as const;

export type StaffPaymentStatus = typeof StaffPaymentStatusEnum[keyof typeof StaffPaymentStatusEnum];

// Notification Type
export const NotificationTypeEnum = {
  ATTENDANCE: "attendance",
  ACTIVITY: "activity",
  HEALTH: "health",
  INVOICE: "invoice",
  SCHEDULE: "schedule",
  GENERAL: "general",
} as const;

export type NotificationType = typeof NotificationTypeEnum[keyof typeof NotificationTypeEnum];
