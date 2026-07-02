import { DailyCareRecordsRepository } from "./daily_care_records.repository.ts";
import {
  createDailyCareRecordInput,
  updateDailyCareRecordInput,
  checkInChildInput,
  checkOutChildInput,
  logDailyActivityInput,
  applyScheduleTemplateInput,
} from "./daily_care_records.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { ActivityCategoriesService } from "@/activity_categories/activity_categories.service.ts";
import ChildrenDaycareModel from "@/children_daycare/children_daycare.schema.ts";
import { ScheduleTemplatesRepository } from "@/schedule_templates/schedule_templates.repository.ts";

const dailyCareRecordsRepository = new DailyCareRecordsRepository();
const activityCategoriesService = new ActivityCategoriesService();
const scheduleTemplatesRepository = new ScheduleTemplatesRepository();

export class DailyCareRecordsService {
  private readonly daycareAccessRoles = [
    UserRole.DAYCARE_ADMIN,
    UserRole.DAYCARE_OWNER,
    UserRole.SUPER_ADMIN,
    UserRole.DAYCARE_SITTER,
  ];

  async getDailyCareRecord(
    daycareId: string,
    date: Date,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireDaycareAccess(context);

    return await dailyCareRecordsRepository.findByDaycareAndDate(daycareId, date);
  }

  async getDailyCareRecords(
    daycareId: string,
    startDate: Date,
    endDate: Date,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can view all records
    this.requireDaycareAccess(context);

    return await dailyCareRecordsRepository.findByDaycareAndDateRange(daycareId, startDate, endDate);
  }

  async getChildDailyRecords(
    childId: string,
    startDate: Date,
    endDate: Date,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireDaycareAccess(context);

    return await dailyCareRecordsRepository.findByChildIdAndDateRange(childId, startDate, endDate);
  }

  async getTodayDailyCare(daycareId: string, context: AppContext) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await this.getDailyCareRecord(daycareId, today, context);
  }

  async createDailyCareRecord(
    input: typeof createDailyCareRecordInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Only daycare staff can create daily care records
    this.requireDaycareAccess(context);
    const parsed = createDailyCareRecordInput.parse(input);
    await Promise.all([
      ...(parsed.plannedActivities ?? []).map((activity) =>
        activityCategoriesService.getDefaultFieldConfig(activity.category)
      ),
      ...parsed.children.flatMap((child) =>
        (child.activities ?? []).map((activity) =>
          activityCategoriesService.getDefaultFieldConfig(activity.category)
        )
      ),
    ]);

    const date = new Date(parsed.date);
    date.setHours(0, 0, 0, 0);

    // Use upsert to create or update
    return await dailyCareRecordsRepository.upsert(parsed.daycareId, date, {
      daycareId: parsed.daycareId,
      date,
      plannedActivities: parsed.plannedActivities || [],
      appliedTemplate: undefined,
      children: parsed.children,
    });
  }

  async updateDailyCareRecord(
    id: string,
    input: typeof updateDailyCareRecordInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireDaycareAccess(context);
    const parsed = updateDailyCareRecordInput.parse(input);
    await Promise.all([
      ...(parsed.plannedActivities ?? []).map((activity) =>
        activityCategoriesService.getDefaultFieldConfig(activity.category)
      ),
      ...(parsed.children ?? []).flatMap((child) =>
        (child.activities ?? []).map((activity) =>
          activityCategoriesService.getDefaultFieldConfig(activity.category)
        )
      ),
    ]);
    return await dailyCareRecordsRepository.update(id, parsed);
  }

  async applyScheduleTemplate(
    input: typeof applyScheduleTemplateInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireDaycareAccess(context);

    const template = await scheduleTemplatesRepository.findById(input.templateId);
    if (!template) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const date = new Date(input.date);
    date.setHours(0, 0, 0, 0);

    const plannedActivities = template.activities.map((activity) => ({
      masterActivityId: activity.masterActivityId,
      activityName: activity.activityName,
      category: activity.category,
      startTime: activity.startTime,
      endTime: activity.endTime,
      duration: activity.duration,
      defaultSitterRole: activity.defaultSitterRole,
    }));

    return await dailyCareRecordsRepository.upsert(input.daycareId, date, {
      daycareId: input.daycareId,
      date,
      appliedTemplate: {
        templateId: template._id,
        templateName: template.name,
        appliedAt: new Date(),
      },
      plannedActivities,
    });
  }

  async checkInChild(
    input: typeof checkInChildInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireDaycareAccess(context);

    const date = new Date(input.date);
    date.setHours(0, 0, 0, 0);

    // Get or create daily care record
    let record = await dailyCareRecordsRepository.findByDaycareAndDate(input.daycareId, date);

    if (!record) {
      // Create new record
      record = await dailyCareRecordsRepository.create({
        daycareId: input.daycareId,
        date,
        children: [],
      });
    }

    const recordChildren = record.children as Array<{
      childId: { toString(): string };
    }> & {
      push(value: unknown): number;
    };

    // Check if child already exists in record
    const childExists = recordChildren.some(
      (c) => c.childId.toString() === input.childId
    );

    if (!childExists) {
      const child = await ChildrenDaycareModel.findById(input.childId).exec();
      if (!child) {
        throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
      }

      // Add child to record
      recordChildren.push({
        childId: input.childId,
        childName: child.profile.name,
        childPhoto: child.profile.photo || child.customData?.customPhoto || "",
        attendance: {
          checkIn: input.checkIn,
          status: "present",
        },
        assignedSitters: [],
        activities: [],
        notes: "",
      });
      await record.save();
    } else {
      // Update attendance
      await dailyCareRecordsRepository.updateChildAttendance(
        input.daycareId,
        date,
        input.childId,
        {
          checkIn: input.checkIn,
          status: "present",
        }
      );
    }

    const updatedRecord = await dailyCareRecordsRepository.findByDaycareAndDate(input.daycareId, date);
    if (!updatedRecord) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return updatedRecord;
  }

  async checkOutChild(
    input: typeof checkOutChildInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    this.requireDaycareAccess(context);

    const date = new Date(input.date);
    date.setHours(0, 0, 0, 0);

    await dailyCareRecordsRepository.updateChildAttendance(
      input.daycareId,
      date,
      input.childId,
      {
        checkOut: input.checkOut,
        status: "present",
      }
    );

    const updatedRecord = await dailyCareRecordsRepository.findByDaycareAndDate(input.daycareId, date);
    if (!updatedRecord) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return updatedRecord;
  }

  async logDailyActivity(
    input: typeof logDailyActivityInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [UserRole.DAYCARE_ADMIN, UserRole.DAYCARE_OWNER, UserRole.SUPER_ADMIN, UserRole.DAYCARE_SITTER];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
    const parsed = logDailyActivityInput.parse(input);
    await activityCategoriesService.getDefaultFieldConfig(parsed.activity.category);

    const date = new Date(parsed.date);
    date.setHours(0, 0, 0, 0);

    const activity = {
      ...parsed.activity,
      loggedBy: {
        userId: context.user.id,
        name: context.user.name,
      },
      loggedAt: new Date(),
    };

    const currentRecord = await dailyCareRecordsRepository.findByDaycareAndDate(parsed.daycareId, date);
    this.requireChildAccess(context, currentRecord, parsed.childId);

    await dailyCareRecordsRepository.addChildActivity(
      parsed.daycareId,
      date,
      parsed.childId,
      activity
    );

    const updatedRecord = await dailyCareRecordsRepository.findByDaycareAndDate(parsed.daycareId, date);
    if (!updatedRecord) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    return updatedRecord;
  }

  private requireDaycareAccess(context: AppContext) {
    if (!context.user || !this.daycareAccessRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }

  private requireChildAccess(
    context: AppContext,
    record: Awaited<ReturnType<DailyCareRecordsRepository["findByDaycareAndDate"]>> | null,
    childId: string,
  ) {
    if (!context.user || context.user.role !== UserRole.DAYCARE_SITTER) {
      return;
    }

    const children = (record?.children ?? []) as Array<{
      childId?: { toString(): string } | string;
      assignedSitters?: Array<{ userId?: { toString(): string } | string }>;
    }>;

    const childRecord = children.find((child) => {
      if (!child.childId) return false;
      return typeof child.childId === "string"
        ? child.childId === childId
        : child.childId.toString() === childId;
    });

    const assigned = childRecord?.assignedSitters?.some((sitter) => {
      if (!sitter.userId) return false;
      return typeof sitter.userId === "string"
        ? sitter.userId === context.user?.id
        : sitter.userId.toString() === context.user?.id;
    });

    if (!assigned) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }
  }
}
