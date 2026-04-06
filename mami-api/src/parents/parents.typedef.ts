export const typeDefs = `
  type Parent {
    id: ObjectId!
    daycareId: ObjectId!
    user: ParentUser!
    customData: ParentCustomData!
    childrenIds: [ObjectId!]!
    enrolledAt: Date!
    active: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type ParentUser {
    userId: ObjectId!
    name: String!
    email: String!
    phone: String!
    role: UserRole!
  }

  type ParentCustomData {
    deskripsi: String
    emergencyContact: EmergencyContact
    pickupAuthorization: [PickupAuthorization!]!
    notes: String
  }

  type EmergencyContact {
    name: String!
    phone: String!
    relation: String!
  }

  type PickupAuthorization {
    name: String!
    phone: String!
    relation: String!
  }

  input EmergencyContactInput {
    name: String!
    phone: String!
    relation: String!
  }

  input PickupAuthorizationInput {
    name: String!
    phone: String!
    relation: String!
  }

  input ParentCustomDataInput {
    deskripsi: String
    emergencyContact: EmergencyContactInput
    pickupAuthorization: [PickupAuthorizationInput!]
    notes: String
  }

  input ParentUserInput {
    userId: ObjectId!
    name: String!
    email: String!
    phone: String!
    role: UserRole!
  }

  input CreateParentInput {
    daycareId: ObjectId!
    user: ParentUserInput!
    customData: ParentCustomDataInput
    childrenIds: [ObjectId!]
  }

  input UpdateParentInput {
    customData: ParentCustomDataInput
    childrenIds: [ObjectId!]
    active: Boolean
  }

  extend type Query {
    "Get all parents for a daycare"
    daycareParents(daycareId: ObjectId!, active: Boolean): [Parent!]!
    
    "Get parent by ID"
    parent(id: ObjectId!): Parent
    
    "Get parent by user ID and daycare"
    parentByUser(daycareId: ObjectId!, userId: ObjectId!): Parent
  }

  extend type Mutation {
    "Create a new parent in daycare"
    createParent(input: CreateParentInput!): Parent!
    
    "Update parent information"
    updateParent(id: ObjectId!, input: UpdateParentInput!): Parent!
    
    "Deactivate parent (soft delete)"
    deactivateParent(id: ObjectId!): Parent!
  }
`;
