export const typeDefs = `
  type DailyCareRecord {
    id: ObjectId!
    daycareId: ObjectId!
    date: Date!
    children: [ChildDailyRecord!]!
    totalChildren: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type ChildDailyRecord {
    childId: ObjectId!
    childName: String!
    childPhoto: String
    attendance: Attendance
    assignedSitters: [AssignedSitter!]!
    activities: [DailyActivity!]!
    notes: String
  }

  type Attendance {
    checkIn: CheckIn!
    checkOut: CheckOut
    status: AttendanceStatus!
  }

  type CheckIn {
    time: String!
    photo: String!
    by: UserRef!
  }

  type CheckOut {
    time: String!
    photo: String!
    by: UserRef!
  }

  type UserRef {
    userId: ObjectId!
    name: String!
  }

  type AssignedSitter {
    userId: ObjectId!
    name: String!
    shift: ShiftType!
  }

  enum ShiftType {
    MORNING
    AFTERNOON
    FULL
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    EARLY_PICKUP
  }

  type DailyActivity {
    masterActivityId: ObjectId
    activityName: String!
    category: ActivityCategory!
    startTime: String!
    endTime: String
    duration: Int
    
    # Dynamic fields
    mealType: MealType
    menu: String
    eaten: EatenAmount
    quality: NapQuality
    toiletingType: ToiletingType
    toiletingNotes: String
    mood: Mood
    photos: [String!]!
    description: String
    intensity: Intensity
    location: String
    materials: String
    
    loggedBy: UserRef!
    loggedAt: Date!
  }

  input CheckInInput {
    time: String!
    photo: String!
    by: UserRefInput!
  }

  input CheckOutInput {
    time: String!
    photo: String!
    by: UserRefInput!
  }

  input UserRefInput {
    userId: ObjectId!
    name: String!
  }

  input DailyActivityInput {
    masterActivityId: ObjectId
    activityName: String!
    category: ActivityCategory!
    startTime: String!
    endTime: String
    duration: Int
    mealType: MealType
    menu: String
    eaten: EatenAmount
    quality: NapQuality
    toiletingType: ToiletingType
    toiletingNotes: String
    mood: Mood
    photos: [String!]
    description: String
    intensity: Intensity
    location: String
    materials: String
  }

  input AssignedSitterInput {
    userId: ObjectId!
    name: String!
    shift: ShiftType!
  }

  input ChildDailyRecordInput {
    childId: ObjectId!
    childName: String!
    childPhoto: String
    attendance: AttendanceInput
    assignedSitters: [AssignedSitterInput!]
    activities: [DailyActivityInput!]
    notes: String
  }

  input AttendanceInput {
    checkIn: CheckInInput!
    checkOut: CheckOutInput
    status: AttendanceStatus
  }

  input CreateDailyCareRecordInput {
    daycareId: ObjectId!
    date: Date!
    children: [ChildDailyRecordInput!]!
  }

  input UpdateDailyCareRecordInput {
    children: [ChildDailyRecordInput!]
  }

  input CheckInChildInput {
    daycareId: ObjectId!
    childId: ObjectId!
    date: Date!
    checkIn: CheckInInput!
  }

  input CheckOutChildInput {
    daycareId: ObjectId!
    childId: ObjectId!
    date: Date!
    checkOut: CheckOutInput!
  }

  input LogDailyActivityInput {
    daycareId: ObjectId!
    childId: ObjectId!
    date: Date!
    activity: DailyActivityInput!
  }

  extend type Query {
    "Get daily care record by date"
    dailyCareRecord(daycareId: ObjectId!, date: Date!): DailyCareRecord
    
    "Get daily care records for a date range"
    dailyCareRecords(daycareId: ObjectId!, startDate: Date!, endDate: Date!): [DailyCareRecord!]!
    
    "Get child's daily records"
    childDailyRecords(childId: ObjectId!, startDate: Date!, endDate: Date!): [DailyCareRecord!]!
    
    "Get today's daily care record"
    todayDailyCare(daycareId: ObjectId!): DailyCareRecord
  }

  extend type Mutation {
    "Create or update daily care record"
    createDailyCareRecord(input: CreateDailyCareRecordInput!): DailyCareRecord!
    
    "Update daily care record"
    updateDailyCareRecord(id: ObjectId!, input: UpdateDailyCareRecordInput!): DailyCareRecord!
    
    "Check in child"
    checkInChild(input: CheckInChildInput!): DailyCareRecord!
    
    "Check out child"
    checkOutChild(input: CheckOutChildInput!): DailyCareRecord!
    
    "Log activity for child"
    logDailyActivity(input: LogDailyActivityInput!): DailyCareRecord!
  }
`;
