export const typeDefs = `
  enum DaycareMembershipPersona {
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
    name: String!
  }

  type DaycareMembership {
    _id: ObjectId!
    user: User!
    daycare: DaycareMembershipDaycare!
    persona: DaycareMembershipPersona!
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
    persona: DaycareMembershipPersona!
    userId: ObjectId
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
