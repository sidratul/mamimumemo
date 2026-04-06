export const typeDefs = `
  type __NAME__ {
    _id: ObjectId!
    name: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input Create__NAME__Input {
    name: String!
  }

  input Update__NAME__Input {
    name: String
  }

  input __NAME__FilterInput {
    search: String
  }

  extend type Query {
    __NAME_PLURAL__(filter: __NAME__FilterInput, sort: SortInput, pagination: PaginationInput): [__NAME__!]!
    __NAME_PLURAL__Count(filter: __NAME__FilterInput): Int!
    __NAME_CAMEL__(id: ObjectId!): __NAME__
  }

  extend type Mutation {
    create__NAME__(data: Create__NAME__Input!): ActionResponse!
    update__NAME__(id: ObjectId!, data: Update__NAME__Input!): ActionResponse!
    delete__NAME__(id: ObjectId!): ActionResponse!
  }
`;
