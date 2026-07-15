export const typeDefs = `
  type MasterActivity {
    id: ObjectId!
    name: String!
    description: String
    category: String!
    defaultDuration: Int!
    icon: String
    color: String
    active: Boolean!
    version: Int!
    isStarter: Boolean!
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
    drinkName: Boolean!
    drinkAmountMl: Boolean!
    hygieneType: Boolean!
    medicationName: Boolean!
    medicationDose: Boolean!
    medicationUnit: Boolean!
    administeredAt: Boolean!
    parentConsent: Boolean!
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
    drinkName: Boolean
    drinkAmountMl: Boolean
    hygieneType: Boolean
    medicationName: Boolean
    medicationDose: Boolean
    medicationUnit: Boolean
    administeredAt: Boolean
    parentConsent: Boolean
  }

  input CreateMasterActivityInput {
    name: String!
    description: String
    category: String!
    defaultDuration: Int
    icon: String
    color: String
    fieldConfig: FieldConfigInput
    isStarter: Boolean
  }

  input UpdateMasterActivityInput {
    name: String
    description: String
    category: String
    defaultDuration: Int
    icon: String
    color: String
    active: Boolean
    fieldConfig: FieldConfigInput
    isStarter: Boolean
  }

  extend type Query {
    "Get global master activity catalog"
    masterActivities(active: Boolean, category: String, isStarter: Boolean): [MasterActivity!]!
    
    "Get master activity by ID"
    masterActivity(id: ObjectId!): MasterActivity
    
    "Get default field config for category"
    defaultFieldConfig(category: String!): FieldConfig!
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
