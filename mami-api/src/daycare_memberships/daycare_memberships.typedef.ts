export const typeDefs = `
  enum DaycareMembershipAccess {
    OWNER
    ADMIN
    SITTER
  }

  enum DaycareMembershipStatus {
    ACTIVE
    INACTIVE
  }

  type DaycareMembershipDaycare {
    _id: ObjectId!
    id: ObjectId!
    name: String!
  }

  type DaycareMembership {
    _id: ObjectId!
    id: ObjectId!
    user: User!
    daycare: DaycareMembershipDaycare!
    access: DaycareMembershipAccess!
    status: DaycareMembershipStatus!
    joinedAt: Date!
    endedAt: Date
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }

  input DaycareMembershipUserDataInput {
    name: String!
    email: String!
    password: String!
    phone: String
  }

  input AddUserToDaycareInput {
    daycareId: ObjectId!
    access: DaycareMembershipAccess!
    userId: ObjectId
    userEmail: String
    userData: DaycareMembershipUserDataInput
    notes: String
  }

  extend type Query {
    daycareMemberships(daycareId: ObjectId!): [DaycareMembership!]!
    userDaycareMemberships(userId: ObjectId!): [DaycareMembership!]!
  }

  extend type Mutation {
    addUserToDaycare(input: AddUserToDaycareInput!): ActionResponse!
    deactivateDaycareMembership(id: ObjectId!): ActionResponse!
  }
`;
