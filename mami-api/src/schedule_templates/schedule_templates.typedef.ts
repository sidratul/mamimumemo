export const typeDefs = `
  type ScheduleTemplate {
    id: ObjectId!
    daycareId: ObjectId!
    name: String!
    dayOfWeek: [Int!]!
    activities: [TemplateActivity!]!
    active: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type TemplateActivity {
    masterActivityId: ObjectId
    activityName: String!
    startTime: String!
    endTime: String!
    duration: Int
    category: ActivityCategory!
    defaultSitterRole: SitterRole!
  }

  enum SitterRole {
    ANY
    SENIOR_SITTER
    JUNIOR_SITTER
  }

  input TemplateActivityInput {
    masterActivityId: ObjectId
    activityName: String!
    startTime: String!
    endTime: String!
    duration: Int
    category: ActivityCategory!
    defaultSitterRole: SitterRole
  }

  input CreateScheduleTemplateInput {
    daycareId: ObjectId!
    name: String!
    dayOfWeek: [Int!]!
    activities: [TemplateActivityInput!]!
  }

  input UpdateScheduleTemplateInput {
    name: String
    dayOfWeek: [Int!]
    activities: [TemplateActivityInput!]
    active: Boolean
  }

  extend type Query {
    "Get schedule templates for a daycare"
    scheduleTemplates(daycareId: ObjectId!, active: Boolean): [ScheduleTemplate!]!
    
    "Get schedule template by ID"
    scheduleTemplate(id: ObjectId!): ScheduleTemplate
    
    "Get templates for a specific day (0=Sunday, 6=Saturday)"
    templatesForDay(daycareId: ObjectId!, dayOfWeek: Int!): [ScheduleTemplate!]!
  }

  extend type Mutation {
    "Create a new schedule template"
    createScheduleTemplate(input: CreateScheduleTemplateInput!): ScheduleTemplate!
    
    "Update schedule template"
    updateScheduleTemplate(id: ObjectId!, input: UpdateScheduleTemplateInput!): ScheduleTemplate!
    
    "Deactivate schedule template"
    deactivateScheduleTemplate(id: ObjectId!): ScheduleTemplate!
  }
`;
