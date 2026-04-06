import { GraphQLScalarType, Kind } from "graphql";
import { Types } from "mongoose";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    if (!(value instanceof Types.ObjectId)) {
      // Fallback for values that are already strings
      if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
        return value;
      }
      throw new Error(`ObjectIdScalar can only serialize ObjectId values, received ${typeof value}`);
    }
    return value.toHexString();
  },
  parseValue(value: unknown): Types.ObjectId {
    if (typeof value !== "string" || !Types.ObjectId.isValid(value)) {
      throw new Error(`ObjectIdScalar can only parse valid ObjectId strings, received ${value}`);
    }
    return new Types.ObjectId(value);
  },
  parseLiteral(ast): Types.ObjectId {
    if (ast.kind !== Kind.STRING || !Types.ObjectId.isValid(ast.value)) {
      throw new Error("ObjectIdScalar can only parse string literals");
    }
    return new Types.ObjectId(ast.value);
  },
});
