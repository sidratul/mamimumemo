import { GraphQLScalarType, Kind } from "graphql";

export const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString(); // Convert outgoing Date to ISO String
    }
    if (typeof value === 'string') {
        // If it's already a string, assume it's in correct format
        return value;
    }
    throw new Error("GraphQL Date Scalar serializer expected a `Date` object or a date string");
  },
  parseValue(value: unknown): Date {
    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date value: ${value}`);
      }
      return date; // Convert incoming ISO string or timestamp to Date
    }
    throw new Error(
      "GraphQL Date Scalar parser expected a `string` or `number`"
    );
  },
  parseLiteral(ast): Date {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      const date = new Date(ast.value); // Convert hard-coded AST string or int to Date
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date value: ${ast.value}`);
      }
      return date;
    }
    // Invalid hard-coded value (not an integer or string)
    throw new Error("Date literal must be a string or integer.");
  },
});
