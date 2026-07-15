export const typeDefs = `
  enum UserRole {
    SUPER_ADMIN
    DAYCARE_OWNER
    DAYCARE_ADMIN
    DAYCARE_SITTER
    PARENT
  }

  enum SystemRole {
    SUPER_ADMIN
  }

  enum UserAccess {
    SUPER_ADMIN
    PARENT
    OWNER
    DAYCARE_ADMIN
    DAYCARE_SITTER
  }

  type User {
    _id: ObjectId!
    id: ObjectId!
    name: String!
    email: String!
    phone: String
    systemRole: SystemRole
    accesses: [UserAccess!]!
    createdAt: Date
    updatedAt: Date
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    phone: String
    systemRole: SystemRole
  }

  input UpdateUserInput {
    name: String
    email: String
    phone: String
    systemRole: SystemRole
  }

  input UpdateUserPasswordInput {
    currentPassword: String
    newPassword: String!
  }

  input UserFilterInput {
    search: String
    accesses: [UserAccess!]
  }

  extend type Query {
    users(filter: UserFilterInput, sort: SortInput, pagination: PaginationInput): [User!]!
    userCount(filter: UserFilterInput): Int!
    user(id: ObjectId!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): ActionResponse!
    updateUser(id: ObjectId!, input: UpdateUserInput!): ActionResponse!
    updateUserPassword(id: ObjectId!, input: UpdateUserPasswordInput!): ActionResponse!
    deleteUser(id: ObjectId!): ActionResponse!
  }
`;
