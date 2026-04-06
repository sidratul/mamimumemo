export const typeDefs = `
  type ChildrenDaycare {
    id: ObjectId!
    daycareId: ObjectId!
    parentId: ObjectId!
    globalChildId: ObjectId
    profile: ChildProfile!
    medical: ChildMedical!
    preferences: ChildPreferences!
    customData: ChildCustomData!
    enrolledAt: Date!
    exitedAt: Date
    active: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type ChildProfile {
    name: String!
    birthDate: Date!
    photo: String
    gender: Gender!
  }

  type ChildMedical {
    allergies: [String!]!
    medicalNotes: String
    medications: [Medication!]!
  }

  type Medication {
    name: String!
    dosage: String!
    schedule: String!
  }

  type ChildPreferences {
    favoriteFoods: [String!]!
    favoriteActivities: [String!]!
    comfortItems: [String!]!
    napRoutine: String
  }

  type ChildCustomData {
    customName: String
    customPhoto: String
    notes: String
  }

  input ChildProfileInput {
    name: String!
    birthDate: Date!
    photo: String
    gender: Gender!
  }

  input ChildMedicalInput {
    allergies: [String!]
    medicalNotes: String
    medications: [MedicationInput]
  }

  input MedicationInput {
    name: String!
    dosage: String!
    schedule: String!
  }

  input ChildPreferencesInput {
    favoriteFoods: [String!]
    favoriteActivities: [String!]
    comfortItems: [String!]
    napRoutine: String
  }

  input ChildCustomDataInput {
    customName: String
    customPhoto: String
    notes: String
  }

  input CreateChildrenDaycareInput {
    daycareId: ObjectId!
    parentId: ObjectId!
    globalChildId: ObjectId
    profile: ChildProfileInput!
    medical: ChildMedicalInput
    preferences: ChildPreferencesInput
    customData: ChildCustomDataInput
  }

  input UpdateChildrenDaycareInput {
    profile: ChildProfileInput
    medical: ChildMedicalInput
    preferences: ChildPreferencesInput
    customData: ChildCustomDataInput
    exitedAt: Date
    active: Boolean
  }

  extend type Query {
    "Get all children for a daycare"
    daycareChildren(daycareId: ObjectId!, active: Boolean): [ChildrenDaycare!]!
    
    "Get child by ID"
    childrenDaycare(id: ObjectId!): ChildrenDaycare
    
    "Get child by global ID and daycare"
    childByGlobalId(daycareId: ObjectId!, globalChildId: ObjectId!): ChildrenDaycare
    
    "Get children for a parent in a daycare"
    parentChildren(daycareId: ObjectId!, parentId: ObjectId!): [ChildrenDaycare!]!
  }

  extend type Mutation {
    "Create a new child in daycare"
    createChildrenDaycare(input: CreateChildrenDaycareInput!): ChildrenDaycare!
    
    "Update child information"
    updateChildrenDaycare(id: ObjectId!, input: UpdateChildrenDaycareInput!): ChildrenDaycare!
    
    "Deactivate child (soft delete)"
    deactivateChildrenDaycare(id: ObjectId!): ChildrenDaycare!
  }
`;
