export const typeDefs = `
  type MasterActivity {
    id: ObjectId!
    daycareId: ObjectId!
    name: String!
    category: ActivityCategory!
    defaultDuration: Int!
    icon: String
    color: String
    active: Boolean!
    fieldConfig: FieldConfig!
    createdBy: CreatedBy!
    createdAt: Date!
    updatedAt: Date!
  }

  type FieldConfig {
    mealType: Boolean!
    menu: Boolean!
    eaten: Boolean!
    quality: Boolean!
    toiletingType: Boolean!
    toiletingNotes: Boolean!
    mood: Boolean!
    photos: Boolean!
    description: Boolean!
    intensity: Boolean!
    location: Boolean!
    materials: Boolean!
  }

  type CreatedBy {
    userId: ObjectId!
    name: String!
    role: UserRole!
  }

  input FieldConfigInput {
    mealType: Boolean
    menu: Boolean
    eaten: Boolean
    quality: Boolean
    toiletingType: Boolean
    toiletingNotes: Boolean
    mood: Boolean
    photos: Boolean
    description: Boolean
    intensity: Boolean
    location: Boolean
    materials: Boolean
  }

  input CreateMasterActivityInput {
    daycareId: ObjectId!
    name: String!
    category: ActivityCategory!
    defaultDuration: Int
    icon: String
    color: String
    fieldConfig: FieldConfigInput
  }

  input UpdateMasterActivityInput {
    name: String
    category: ActivityCategory
    defaultDuration: Int
    icon: String
    color: String
    active: Boolean
    fieldConfig: FieldConfigInput
  }

  extend type Query {
    "Get master activities for a daycare"
    masterActivities(daycareId: ObjectId!, active: Boolean, category: ActivityCategory): [MasterActivity!]!
    
    "Get master activity by ID"
    masterActivity(id: ObjectId!): MasterActivity
    
    "Get default field config for category"
    defaultFieldConfig(category: ActivityCategory!): FieldConfig!
  }

  extend type Mutation {
    "Create a new master activity"
    createMasterActivity(input: CreateMasterActivityInput!): MasterActivity!
    
    "Update master activity"
    updateMasterActivity(id: ObjectId!, input: UpdateMasterActivityInput!): MasterActivity!
    
    "Deactivate master activity"
    deactivateMasterActivity(id: ObjectId!): MasterActivity!
  }
`;
