import { ObjectIdScalar } from "./objectid.scalar.ts";
import { DateScalar } from "./date.scalar.ts";

export const scalarResolvers = {
  ObjectId: ObjectIdScalar,
  Date: DateScalar,
};