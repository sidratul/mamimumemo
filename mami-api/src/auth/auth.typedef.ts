export const typeDefs = `
  type AuthResponse {
    accessToken: String!
    refreshToken: String!
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
    login(input: LoginInput!): AuthResponse!
    refreshToken(input: RefreshTokenInput!): AuthResponse!
  }
`;
