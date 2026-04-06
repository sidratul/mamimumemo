export const typeDefs = `
  enum UserRole {
    SUPER_ADMIN
    DAYCARE_OWNER
    DAYCARE_ADMIN
    DAYCARE_SITTER
    PARENT
  }

  type User {
    _id: ObjectId!
    name: String!
    email: String!
    phone: String
    role: UserRole
    createdAt: Date
    updatedAt: Date
  }

  type AuthResponse {
    accessToken: String!
    refreshToken: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String
    role: UserRole
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RefreshTokenInput {
    refreshToken: String!
  }

  extend type Query {
    profile: User!
  }

  extend type Mutation {
    register(input: RegisterInput!): ActionResponse!
    login(input: LoginInput!): AuthResponse!
    refreshToken(input: RefreshTokenInput!): AuthResponse!
  }
`;
