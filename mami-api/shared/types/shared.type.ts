import { paginationTypeDef } from "./pagination.type.ts";
import { sortTypeDef } from "./sort.type.ts";

// Scalar type definitions (ObjectId dan Date)
const scalarTypeDefs = `
  scalar ObjectId
  scalar Date
`;

export const sharedTypeDefs = [
  scalarTypeDefs,
  paginationTypeDef,
  sortTypeDef,
];

export const baseTypeDefs = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type ActionResponse {
    id: ObjectId
    message: String
  }
`;