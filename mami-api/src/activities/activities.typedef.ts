export const typeDefs = `
  type Activity {
    id: ObjectId!
    childId: ObjectId!
    daycareId: ObjectId
    masterActivityId: ObjectId
    activityName: String!
    category: ActivityCategory!
    date: Date!
    startTime: String!
    endTime: String
    duration: Int
    calculatedDuration: Int
    
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
    
    # Metadata
    source: ActivitySource!
    loggedBy: LoggedBy!
    visibleTo: [ActivityUser!]
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }

  enum ActivityCategory {
    MEAL
    NAP
    TOILETING
    CARE
    PLAY
    LEARNING
    CREATIVE
    PHYSICAL
    OUTDOOR
    ROUTINE
    SOCIAL
    DEVELOPMENT
  }

  enum MealType {
    BREAKFAST
    SNACK
    LUNCH
    DINNER
  }

  enum EatenAmount {
    ALL
    SOME
    NONE
  }

  enum NapQuality {
    GOOD
    RESTLESS
    SHORT
  }

  enum ToiletingType {
    URINE
    BOWEL
  }

  enum Mood {
    HAPPY
    SLEEPY
    FUSSY
    ENERGETIC
    NEUTRAL
  }

  enum Intensity {
    LOW
    MEDIUM
    HIGH
  }

  enum ActivitySource {
    PARENT
    GUARDIAN
    DAYCARE
  }

  type LoggedBy {
    userId: ObjectId!
    name: String!
    relation: String!
    role: UserRole!
  }

  type ActivityUser {
    id: ObjectId!
    name: String!
    email: String!
    phone: String
    role: UserRole!
  }

  type ActivityTimeline {
    date: Date!
    activities: [Activity!]!
    daycareActivities: [DaycareActivity!]
  }

  type DaycareActivity {
    activityName: String!
    category: ActivityCategory!
    startTime: String!
    endTime: String!
    source: String!
  }

  input LoggedByInput {
    userId: ObjectId!
    name: String!
    relation: String!
    role: UserRole!
  }

  input CreateActivityInput {
    childId: ObjectId!
    daycareId: ObjectId
    masterActivityId: ObjectId
    activityName: String!
    category: ActivityCategory!
    date: Date!
    startTime: String!
    endTime: String
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
    visibleTo: [ObjectId!]
    notes: String
  }

  input UpdateActivityInput {
    activityName: String
    category: ActivityCategory
    date: Date
    startTime: String
    endTime: String
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
    notes: String
  }

  input ActivityTimelineInput {
    childId: ObjectId!
    startDate: Date!
    endDate: Date!
    includeDaycare: Boolean
  }

  extend type Query {
    "Get activities for a child"
    childActivities(childId: ObjectId!, date: Date, category: ActivityCategory): [Activity!]!
    
    "Get activity by ID"
    activity(id: ObjectId!): Activity
    
    "Get activity timeline (parent + daycare)"
    activityTimeline(input: ActivityTimelineInput!): ActivityTimeline!
    
    "Get my activities (activities I logged)"
    myActivities(date: Date): [Activity!]!
  }

  extend type Mutation {
    "Create a new activity"
    createActivity(input: CreateActivityInput!): Activity!
    
    "Update activity"
    updateActivity(id: ObjectId!, input: UpdateActivityInput!): Activity!
    
    "Delete activity"
    deleteActivity(id: ObjectId!): Boolean!
  }
`;
