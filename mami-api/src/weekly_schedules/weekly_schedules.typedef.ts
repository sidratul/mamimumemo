export const typeDefs = `
  type WeeklySchedule {
    id: ObjectId!
    daycareId: ObjectId!
    weekStart: Date!
    weekEnd: Date!
    days: [WeeklyScheduleDay!]!
    isPast: Boolean!
    isCurrent: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type WeeklyScheduleDay {
    date: Date!
    dayOfWeek: Int!
    templateId: ObjectId
    childAssignments: [ChildAssignment!]!
  }

  type ChildAssignment {
    childId: ObjectId!
    childName: String!
    childPhoto: String
    assignedSitters: [SitterAssignment!]!
    activities: [WeeklyActivity!]!
  }

  type SitterAssignment {
    userId: ObjectId!
    name: String!
    shift: ShiftType!
  }

  type WeeklyActivity {
    masterActivityId: ObjectId
    activityName: String!
    startTime: String!
    endTime: String!
    category: ActivityCategory!
    assignedSitters: [UserRef!]
    notes: String
  }

  type UserRef {
    userId: ObjectId!
    name: String!
  }

  input WeeklyActivityInput {
    masterActivityId: ObjectId
    activityName: String!
    startTime: String!
    endTime: String!
    category: ActivityCategory!
    assignedSitters: [UserRefInput!]
    notes: String
  }

  input ChildAssignmentInput {
    childId: ObjectId!
    childName: String!
    childPhoto: String
    assignedSitters: [SitterAssignmentInput!]
    activities: [WeeklyActivityInput!]
  }

  input SitterAssignmentInput {
    userId: ObjectId!
    name: String!
    shift: ShiftType!
  }

  input WeeklyScheduleDayInput {
    date: Date!
    dayOfWeek: Int!
    templateId: ObjectId
    childAssignments: [ChildAssignmentInput!]
  }

  input CreateWeeklyScheduleInput {
    daycareId: ObjectId!
    weekStart: Date!
    weekEnd: Date!
    days: [WeeklyScheduleDayInput!]!
  }

  input UpdateWeeklyScheduleInput {
    days: [WeeklyScheduleDayInput!]
  }

  input AssignSitterInput {
    daycareId: ObjectId!
    weekStart: Date!
    date: Date!
    childId: ObjectId!
    sitters: [SitterAssignmentInput!]!
  }

  extend type Query {
    "Get weekly schedule for a date range"
    weeklySchedule(daycareId: ObjectId!, weekStart: Date!): WeeklySchedule
    
    "Get current week schedule"
    currentWeekSchedule(daycareId: ObjectId!): WeeklySchedule
    
    "Get schedule for a specific date"
    scheduleForDate(daycareId: ObjectId!, date: Date!): WeeklyScheduleDay
    
    "Get child's schedule for a week"
    childSchedule(childId: ObjectId!, weekStart: Date!): WeeklySchedule
  }

  extend type Mutation {
    "Create a new weekly schedule"
    createWeeklySchedule(input: CreateWeeklyScheduleInput!): WeeklySchedule!
    
    "Update weekly schedule"
    updateWeeklySchedule(id: ObjectId!, input: UpdateWeeklyScheduleInput!): WeeklySchedule!
    
    "Assign sitter to child for a specific date"
    assignSitter(input: AssignSitterInput!): WeeklySchedule!
  }
`;
