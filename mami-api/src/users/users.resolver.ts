import { AppContext } from "#shared/config/context.ts";
import { PaginationOptions, SortInput } from "#shared/index.ts";
import { ObjectId } from "#shared/types/objectid.type.ts";
import { UserQueryOptions } from "./users.d.ts";
import { UsersService } from "./users.service.ts";
import {
  createUserInput,
  listUsersInput,
  updateUserInput,
  updateUserPasswordInput,
  userCountInput,
} from "./users.validation.ts";

const usersService = new UsersService();

export const resolvers = {
  Query: {
    users: (
      _: unknown,
      args: { filter?: UserQueryOptions; sort?: SortInput; pagination?: PaginationOptions },
      context: AppContext,
    ) => {
      listUsersInput.parse(args);
      const options = {
        ...(args.filter ?? {}),
        ...(args.sort ? { sort: args.sort } : {}),
        ...(args.pagination ?? {}),
      };
      return usersService.listUsers(options, context);
    },
    userCount: (
      _: unknown,
      args: { filter?: UserQueryOptions },
      context: AppContext,
    ) => {
      userCountInput.parse(args);
      return usersService.countUsers(args.filter, context);
    },
    user: (_: unknown, { id }: { id: ObjectId }, context: AppContext) => {
      return usersService.getUser(id, context);
    },
  },
  Mutation: {
    createUser: (_: unknown, { input }: { input: typeof createUserInput._type }, context: AppContext) => {
      createUserInput.parse(input);
      return usersService.createUserAction(input, context);
    },
    updateUser: (
      _: unknown,
      { id, input }: { id: ObjectId; input: typeof updateUserInput._type },
      context: AppContext,
    ) => {
      updateUserInput.parse(input);
      return usersService.updateUser(id, input, context);
    },
    updateUserPassword: (
      _: unknown,
      { id, input }: { id: ObjectId; input: typeof updateUserPasswordInput._type },
      context: AppContext,
    ) => {
      updateUserPasswordInput.parse(input);
      return usersService.updateUserPassword(id, input, context);
    },
    deleteUser: (_: unknown, { id }: { id: ObjectId }, context: AppContext) => {
      return usersService.deleteUser(id, context);
    },
  },
};
