import bcrypt from "bcrypt";
import { ClientSession, ProjectionType } from "mongoose";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { RoleType, UserRole } from "#shared/enums/enum.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { ObjectId } from "#shared/types/objectid.type.ts";
import { User, UserQueryOptions } from "./users.d.ts";
import usersRepository from "./users.repository.ts";
import { createUserInput, updateUserInput, updateUserPasswordInput } from "./users.validation.ts";

export class UsersService {
  async createUser(
    input: typeof createUserInput._type,
    options?: { session?: ClientSession },
  ) {
    const existingUserOrNull = await usersRepository.find({ email: input.email });
    if (existingUserOrNull) {
      throw new GraphQLError(MESSAGES.AUTH.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    return await usersRepository.create({
      ...input,
      phone: input.phone || "",
      password: hashedPassword,
      role: (input.role || UserRole.PARENT) as RoleType,
    }, options);
  }

  async findUserByEmail(email: string, projection?: ProjectionType<User>) {
    return await usersRepository.find({ email }, projection);
  }

  async findUserById(id: ObjectId, projection?: ProjectionType<User>) {
    return await usersRepository.findById(id, projection);
  }

  async listUsers(options: UserQueryOptions, context: AppContext, projection?: ProjectionType<User>) {
    this.requireSuperAdmin(context);
    return await usersRepository.findAll(options, projection);
  }

  async countUsers(filter: UserQueryOptions | undefined, context: AppContext) {
    this.requireSuperAdmin(context);
    return await usersRepository.count(filter);
  }

  async getUser(id: ObjectId, context: AppContext, projection?: ProjectionType<User>) {
    this.requireSuperAdmin(context);
    const user = await usersRepository.findById(id, projection);
    if (!user) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }
    return user;
  }

  async createUserAction(input: typeof createUserInput._type, context: AppContext) {
    this.requireSuperAdmin(context);
    const user = await this.createUser(input);
    return {
      id: user.id,
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
    };
  }

  async updateUser(id: ObjectId, input: typeof updateUserInput._type, context: AppContext) {
    this.requireSuperAdminOrSelf(id, context);
    const existingUser = await usersRepository.findById(id);
    if (!existingUser) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    if (input.email && input.email !== existingUser.email) {
      const duplicateUser = await usersRepository.find({ email: input.email });
      if (duplicateUser && duplicateUser.id !== existingUser.id) {
        throw new GraphQLError(MESSAGES.AUTH.EMAIL_EXISTS);
      }
    }

    const updateData = context.user?.role === UserRole.SUPER_ADMIN
      ? input
      : { name: input.name, phone: input.phone };
    const user = await usersRepository.update(existingUser._id, updateData);
    if (!user) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return {
      id: user.id,
      message: "Data pengguna berhasil diperbarui.",
    };
  }

  async updateUserPassword(id: ObjectId, input: typeof updateUserPasswordInput._type, context: AppContext) {
    this.requireSuperAdminOrSelf(id, context);
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const isSuperAdmin = context.user?.role === UserRole.SUPER_ADMIN;
    if (!isSuperAdmin) {
      const currentPassword = input.currentPassword || "";
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new GraphQLError(MESSAGES.AUTH.INVALID_CREDENTIALS);
      }
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    const updatedUser = await usersRepository.update(user._id, { password: hashedPassword });
    if (!updatedUser) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return {
      id: updatedUser.id,
      message: "Password pengguna berhasil diperbarui.",
    };
  }

  async deleteUser(id: ObjectId, context: AppContext) {
    this.requireSuperAdmin(context);
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    await usersRepository.delete(user._id);
    return {
      id: user.id,
      message: "Pengguna berhasil dihapus.",
    };
  }

  async deleteUserByIdOrEmail(
    input: { id?: ObjectId; email?: string },
    options?: { session?: ClientSession },
  ) {
    return await usersRepository.deleteByIdOrEmail(input, options);
  }

  private requireSuperAdmin(context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }
    if (context.user.role !== UserRole.SUPER_ADMIN) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }

  private requireSuperAdminOrSelf(userId: ObjectId, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const isSuperAdmin = context.user.role === UserRole.SUPER_ADMIN;
    const normalizedUserId = userId.toString();
    const isSelf = context.user.id === normalizedUserId || context.user._id?.toString() === normalizedUserId;
    if (!isSuperAdmin && !isSelf) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }
}

export default UsersService;
