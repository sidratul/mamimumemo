import bcrypt from "bcrypt";
import { ClientSession, ProjectionType } from "mongoose";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { RoleType, UserRole } from "#shared/enums/enum.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { ObjectId } from "#shared/types/objectid.type.ts";
import { User, UserPersona, UserQueryOptions } from "./users.d.ts";
import usersRepository from "./users.repository.ts";
import { DaycareMembershipsRepository } from "@/daycare_memberships/daycare_memberships.repository.ts";
import { DaycareMembershipPersona } from "@/daycare_memberships/daycare_memberships.enum.ts";
import { mapMembershipPersonaToUserPersona } from "./users.persona.ts";
import { createUserInput, updateUserInput, updateUserPasswordInput } from "./users.validation.ts";

const daycareMembershipsRepository = new DaycareMembershipsRepository();

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
    const filter = await this.buildUserFilter(options);
    return await usersRepository.findAll(filter, options, projection);
  }

  async countUsers(filter: UserQueryOptions | undefined, context: AppContext) {
    this.requireSuperAdmin(context);
    return await usersRepository.count(await this.buildUserFilter(filter));
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

  async getUserPersonas(userId: ObjectId, fallbackRole?: RoleType): Promise<UserPersona[]> {
    const personas = new Set<UserPersona>();

    if (fallbackRole === UserRole.SUPER_ADMIN) {
      personas.add("SUPER_ADMIN");
    }

    if (fallbackRole === UserRole.PARENT) {
      personas.add("PARENT");
    }

    const memberships = await daycareMembershipsRepository.listByUserId(userId);
    for (const membership of memberships) {
      if (membership.status !== "ACTIVE") {
        continue;
      }
      personas.add(mapMembershipPersonaToUserPersona(membership.persona));
    }

    if (personas.size === 0 && fallbackRole) {
      if (fallbackRole === UserRole.DAYCARE_OWNER) {
        personas.add("OWNER");
      } else if (fallbackRole === UserRole.DAYCARE_ADMIN) {
        personas.add("DAYCARE_ADMIN");
      } else if (fallbackRole === UserRole.DAYCARE_SITTER) {
        personas.add("DAYCARE_SITTER");
      }
    }

    return [...personas];
  }

  private async buildUserFilter(options?: UserQueryOptions) {
    const filter: import("mongoose").FilterQuery<User> = {};
    const search = options?.search?.trim();

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const personas = options?.personas ?? [];
    if (personas.length === 0) {
      return filter;
    }

    const roleFilters: RoleType[] = [];
    const membershipPersonaFilters: DaycareMembershipPersona[] = [];

    for (const persona of personas) {
      if (persona === "SUPER_ADMIN") {
        roleFilters.push(UserRole.SUPER_ADMIN);
      } else if (persona === "PARENT") {
        roleFilters.push(UserRole.PARENT);
      } else if (persona === "OWNER") {
        membershipPersonaFilters.push(DaycareMembershipPersona.OWNER);
      } else if (persona === "DAYCARE_ADMIN") {
        membershipPersonaFilters.push(DaycareMembershipPersona.ADMIN);
      } else if (persona === "DAYCARE_SITTER") {
        membershipPersonaFilters.push(DaycareMembershipPersona.SITTER);
      }
    }

    const orFilters: import("mongoose").FilterQuery<User>[] = [];

    if (roleFilters.length > 0) {
      orFilters.push({ role: { $in: roleFilters } });
    }

    if (membershipPersonaFilters.length > 0) {
      const membershipUserIds = await daycareMembershipsRepository.findActiveUserIdsByPersonas(membershipPersonaFilters);
      if (membershipUserIds.length > 0) {
        orFilters.push({ _id: { $in: membershipUserIds } });
      }
    }

    if (orFilters.length === 0) {
      filter._id = { $in: [] };
      return filter;
    }

    if (orFilters.length === 1) {
      Object.assign(filter, orFilters[0]);
      return filter;
    }

    filter.$and = filter.$and ?? [];
    filter.$and.push({ $or: orFilters });
    return filter;
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
