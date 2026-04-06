import { MenusService } from "./menus.service.ts";
import { createMenuInput, updateMenuInput } from "./menus.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const menusService = new MenusService();

export const resolvers = {
  Query: {
    menu: (
      _: unknown,
      { daycareId, date }: { daycareId: string; date: Date },
      context: AppContext
    ) => {
      return menusService.getMenu(daycareId, date, context);
    },
    menus: (
      _: unknown,
      { daycareId, startDate, endDate }: { daycareId: string; startDate: Date; endDate: Date },
      context: AppContext
    ) => {
      return menusService.getMenus(daycareId, startDate, endDate, context);
    },
    todayMenu: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext
    ) => {
      return menusService.getTodayMenu(daycareId, context);
    },
  },
  Mutation: {
    createMenu: (
      _: unknown,
      { input }: { input: typeof createMenuInput._type },
      context: AppContext
    ) => {
      createMenuInput.parse(input);
      return menusService.createMenu(input, context);
    },
    updateMenu: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateMenuInput._type },
      context: AppContext
    ) => {
      updateMenuInput.parse(input);
      return menusService.updateMenu(id, input, context);
    },
    deleteMenu: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return menusService.deleteMenu(id, context);
    },
  },
};
