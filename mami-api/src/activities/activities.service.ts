import { ActivitiesRepository } from "./activities.repository.ts";
import { createActivityInput, updateActivityInput } from "./activities.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { ChildrenRepository } from "@/children/children.repository.ts";

const activitiesRepository = new ActivitiesRepository();
const childrenRepository = new ChildrenRepository();

export class ActivitiesService {
  async getChildActivities(
    childId: string,
    date: Date | undefined,
    category: string | undefined,
    context: AppContext
  ) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const hasAccess = await activitiesRepository.userHasAccess(childId, user.id);
    if (!hasAccess) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const filters: any = {};
    if (date) filters.date = date;
    if (category) filters.category = category;

    return await activitiesRepository.findByChildId(childId, filters);
  }

  async getActivity(id: string, context: AppContext) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const activity = await activitiesRepository.findById(id);
    if (!activity) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const hasAccess = await activitiesRepository.userHasAccess(
      activity.childId.toString(),
      user.id,
    );
    if (!hasAccess) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return activity;
  }

  async getActivityTimeline(
    childId: string,
    startDate: Date,
    endDate: Date,
    includeDaycare: boolean,
    context: AppContext
  ) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const hasAccess = await activitiesRepository.userHasAccess(childId, user.id);
    if (!hasAccess) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const activities = await activitiesRepository.findTimeline(
      childId,
      startDate,
      endDate,
      includeDaycare
    );

    // Group activities by date
    const timelineByDate: Record<string, { date: string; activities: unknown[]; daycareActivities: unknown[] }> = {};
    
    for (const activity of activities) {
      const dateKey = activity.date.toISOString().split("T")[0];
      
      if (!timelineByDate[dateKey]) {
        timelineByDate[dateKey] = {
          date: dateKey,
          activities: [],
          daycareActivities: [],
        };
      }
      
      timelineByDate[dateKey].activities.push(activity);
    }

    // Convert to array and sort by date
    return Object.values(timelineByDate).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getMyActivities(date: Date | undefined, context: AppContext) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await activitiesRepository.findByUserId(user.id, date);
  }

  async createActivity(
    input: typeof createActivityInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const hasAccess = await activitiesRepository.userHasAccess(input.childId, user.id);
    if (!hasAccess) {
      throw new GraphQLError("You don't have permission to add activities for this child");
    }

    // Get child to determine relation
    const child = await childrenRepository.findById(input.childId);
    if (!child) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    // Find user's guardian record
    const guardian = child.guardians.find((g) => g.user.userId.toString() === user.id);

    const activityData: typeof createActivityInput._type & {
      source: "daycare" | "parent";
      loggedBy: {
        userId: string;
        name: string;
        relation: string;
        role: UserRole | undefined;
      };
      visibleTo: string[];
      duration?: number;
    } = {
      ...input,
      source: user.role === UserRole.DAYCARE_SITTER || user.role === UserRole.DAYCARE_ADMIN
        ? "daycare"
        : "parent",
      loggedBy: {
        userId: user.id,
        name: user.name,
        relation: guardian?.relation || "parent",
        role: user.role,
      },
      visibleTo: input.visibleTo || child.guardians
        .filter((g) => g.active)
        .map((g) => g.user.userId.toString()),
    };

    // Auto-calculate duration if startTime and endTime provided
    if (input.startTime && input.endTime) {
      const start = new Date(`2000-01-01 ${input.startTime}`);
      const end = new Date(`2000-01-01 ${input.endTime}`);
      activityData.duration = Math.round((end.getTime() - start.getTime()) / 60000);
    }

    return await activitiesRepository.create(activityData);
  }

  async updateActivity(
    id: string,
    input: typeof updateActivityInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const isOwner = await activitiesRepository.isActivityOwner(id, user.id);
    if (!isOwner) {
      throw new GraphQLError("You can only update your own activities");
    }

    // Auto-calculate duration if startTime and endTime provided
    const updateData: typeof updateActivityInput._type & { duration?: number } = { ...input };
    if (updateData.startTime && updateData.endTime) {
      const start = new Date(`2000-01-01 ${updateData.startTime}`);
      const end = new Date(`2000-01-01 ${updateData.endTime}`);
      updateData.duration = Math.round((end.getTime() - start.getTime()) / 60000);
    }

    return await activitiesRepository.update(id, updateData);
  }

  async deleteActivity(id: string, context: AppContext) {
    isAuthenticated(context);
    const user = context.user;
    if (!user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const isOwner = await activitiesRepository.isActivityOwner(id, user.id);
    if (!isOwner) {
      throw new GraphQLError("You can only delete your own activities");
    }

    return await activitiesRepository.delete(id);
  }
}
