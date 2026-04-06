import { MenusRepository } from "./menus.repository.ts";
import { createMenuInput, updateMenuInput } from "./menus.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const menusRepository = new MenusRepository();

export class MenusService {
  async getMenu(daycareId: string, date: Date, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await menusRepository.findByDaycareAndDate(daycareId, date);
  }

  async getMenus(daycareId: string, startDate: Date, endDate: Date, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await menusRepository.findByDaycareAndDateRange(daycareId, startDate, endDate);
  }

  async getTodayMenu(daycareId: string, context: AppContext) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await this.getMenu(daycareId, today, context);
  }

  async createMenu(
    input: typeof createMenuInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const date = new Date(input.date);
    date.setHours(0, 0, 0, 0);

    return await menusRepository.upsert(input.daycareId, date, {
      daycareId: input.daycareId,
      date,
      meals: input.meals,
    });
  }

  async updateMenu(
    id: string,
    input: typeof updateMenuInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const menu = await menusRepository.findById(id);
    if (!menu) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await menusRepository.update(id, input);
  }

  async deleteMenu(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const menu = await menusRepository.findById(id);
    if (!menu) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await menusRepository.delete(id);
  }
}
