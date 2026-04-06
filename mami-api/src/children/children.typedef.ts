export const typeDefs = `
  type Child {
    id: ObjectId!
    ownerId: ObjectId!
    profile: ChildProfile!
    medical: ChildMedical!
    guardians: [Guardian!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type ChildProfile {
    name: String!
    birthDate: Date!
    photo: String
    gender: Gender!
  }

  enum Gender {
    MALE
    FEMALE
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

  type Guardian {
    user: UserRef!
    relation: Relation!
    permissions: [GuardianPermission!]!
    sharedAt: Date!
    sharedBy: SharedBy!
    active: Boolean!
  }

  type UserRef {
    userId: ObjectId!
    name: String!
    email: String!
    phone: String
    role: UserRole!
  }

  enum Relation {
    FATHER
    MOTHER
    GUARDIAN
    GRANDFATHER
    GRANDMOTHER
    OTHER
  }

  enum GuardianPermission {
    VIEW_REPORTS
    INPUT_ACTIVITY
    INPUT_HEALTH
    ENROLL_DAYCARE
    EDIT_PROFILE
    MANAGE_GUARDIANS
  }

  enum UserRole {
    SUPER_ADMIN
    DAYCARE_OWNER
    DAYCARE_ADMIN
    DAYCARE_SITTER
    PARENT
  }

  type SharedBy {
    userId: ObjectId!
    name: String!
    relation: String!
  }

  input CreateChildInput {
    profile: ChildProfileInput!
    medical: ChildMedicalInput
    guardians: [GuardianInput]
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

  input GuardianInput {
    userId: ObjectId!
    relation: Relation!
    permissions: [GuardianPermission!]!
  }

  input UpdateChildInput {
    profile: ChildProfileInput
    medical: ChildMedicalInput
    guardians: [GuardianInput]
  }

  input AddGuardianInput {
    userId: ObjectId!
    relation: Relation!
    permissions: [GuardianPermission!]!
  }

  input RemoveGuardianInput {
    guardianUserId: ObjectId!
  }

  extend type Query {
    "Get all children owned by current user"
    myChildren: [Child!]!
    
    "Get child by ID (owner or guardian can access)"
    child(id: ObjectId!): Child
    
    "Get children where user is guardian"
    childrenWhereIGuard: [Child!]!
  }

  extend type Mutation {
    "Create a new child"
    createChild(input: CreateChildInput!): Child!
    
    "Update child information"
    updateChild(id: ObjectId!, input: UpdateChildInput!): Child!
    
    "Add guardian to child"
    addGuardian(childId: ObjectId!, input: AddGuardianInput!): Child!
    
    "Remove guardian from child"
    removeGuardian(childId: ObjectId!, input: RemoveGuardianInput!): Child!
  }
`;
