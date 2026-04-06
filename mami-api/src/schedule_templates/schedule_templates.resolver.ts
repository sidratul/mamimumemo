import { ScheduleTemplatesService } from "./schedule_templates.service.ts";
import { createScheduleTemplateInput, updateScheduleTemplateInput } from "./schedule_templates.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const scheduleTemplatesService = new ScheduleTemplatesService();

export const resolvers = {
  Query: {
    scheduleTemplates: (
      _: unknown,
      { daycareId, active }: { daycareId: string; active?: boolean },
      context: AppContext
    ) => {
      return scheduleTemplatesService.getScheduleTemplates(daycareId, active, context);
    },
    scheduleTemplate: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return scheduleTemplatesService.getScheduleTemplate(id, context);
    },
    templatesForDay: (
      _: unknown,
      { daycareId, dayOfWeek }: { daycareId: string; dayOfWeek: number },
      context: AppContext
    ) => {
      return scheduleTemplatesService.getTemplatesForDay(daycareId, dayOfWeek, context);
    },
  },
  Mutation: {
    createScheduleTemplate: (
      _: unknown,
      { input }: { input: typeof createScheduleTemplateInput._type },
      context: AppContext
    ) => {
      createScheduleTemplateInput.parse(input);
      return scheduleTemplatesService.createScheduleTemplate(input, context);
    },
    updateScheduleTemplate: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateScheduleTemplateInput._type },
      context: AppContext
    ) => {
      updateScheduleTemplateInput.parse(input);
      return scheduleTemplatesService.updateScheduleTemplate(id, input, context);
    },
    deactivateScheduleTemplate: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return scheduleTemplatesService.deactivateScheduleTemplate(id, context);
    },
  },
};
