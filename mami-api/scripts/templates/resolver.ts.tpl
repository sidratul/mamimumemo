import __NAME__Service from "./__NAME_LOWER__.service.ts";
import { AppContext, AdminGuard, AuthGuard, ObjectId, SortOptions, PaginationOptions } from "#shared/index.ts";
// import { validate } from "#shared/utils/validation.ts"; // Uncomment if you create this file
import { create__NAME__Schema, update__NAME__Schema, Create__NAME__Input, Update__NAME__Input } from "./__NAME_LOWER__.validation.ts";
import { __NAME__Filter } from "./__NAME_LOWER__.d.ts";

export const resolvers = {
  Query: {
    __NAME_PLURAL__: async (_: unknown, { filter, sort, pagination }: { filter?: __NAME__Filter; sort?: SortOptions; pagination?: PaginationOptions }, context: AppContext) => {
      await AuthGuard(context);
      const options = { ...filter, ...sort, ...pagination };
      return await __NAME__Service.getAll(options);
    },

    __NAME_PLURAL__Count: async (_: unknown, { filter }: { filter?: __NAME__Filter }, context: AppContext) => {
      await AuthGuard(context);
      return await __NAME__Service.count(filter);
    },
    
    __NAME_CAMEL__: async (_: unknown, { id }: { id: ObjectId }, context: AppContext) => {
      await AuthGuard(context);
      return await __NAME__Service.getById(id);
    },
  },
  
  Mutation: {
    create__NAME__: async (_: unknown, { data }: { data: Create__NAME__Input }, context: AppContext) => {
      await AdminGuard(context);
      // const validatedData = await validate(data, create__NAME__Schema); // Uncomment if you create validation util
      const __NAME_CAMEL__ = await __NAME__Service.create(data);
      return {
        id: __NAME_CAMEL__._id,
        message: '__NAME__ created successfully',
      };
    },
    
    update__NAME__: async (_: unknown, { id, data }: { id: ObjectId, data: Update__NAME__Input }, context: AppContext) => {
      await AdminGuard(context);
      // const validatedData = await validate(data, update__NAME__Schema); // Uncomment if you create validation util
      const __NAME_CAMEL__ = await __NAME__Service.update(id, data);
      return {
        id: __NAME_CAMEL__._id,
        message: '__NAME__ updated successfully',
      };
    },
    
    delete__NAME__: async (_: unknown, { id }: { id: ObjectId }, context: AppContext) => {
      await AdminGuard(context);
      await __NAME__Service.delete(id);
      return {
        id: id,
        message: '__NAME__ deleted successfully',
      };
    },
  },
};
