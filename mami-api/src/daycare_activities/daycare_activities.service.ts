import { ClientSession } from "mongoose";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { UserRole } from "#shared/enums/enum.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { ActivityCategoriesService } from "@/activity_categories/activity_categories.service.ts";
import { MasterActivitiesRepository } from "@/master_activities/master_activities.repository.ts";
import { DaycareActivitiesRepository } from "./daycare_activities.repository.ts";
import {
  adoptMasterActivityInput,
  createDaycareActivityInput,
  updateDaycareActivityInput,
} from "./daycare_activities.validation.ts";

type ActivityActor = {
  userId: string | { toString(): string };
  name: string;
  role: string;
};

type DaycareIdLike = string | { toString(): string };

const repository = new DaycareActivitiesRepository();
const masterRepository = new MasterActivitiesRepository();
const categoriesService = new ActivityCategoriesService();

export class DaycareActivitiesService {
  async list(
    daycareId: string,
    active: boolean | undefined,
    context: AppContext,
  ) {
    this.requireRead(daycareId, context);
    return await repository.list(daycareId, active);
  }

  async get(id: string, context: AppContext) {
    isAuthenticated(context);
    const activity = await repository.findById(id);
    if (!activity) {
      throw new GraphQLError("Aktivitas daycare tidak ditemukan.");
    }
    this.requireRead(activity.daycareId.toString(), context);
    return activity;
  }

  async create(
    input: typeof createDaycareActivityInput._type,
    context: AppContext,
  ) {
    const parsed = createDaycareActivityInput.parse(input);
    this.requireWrite(parsed.daycareId, context);
    const defaultConfig = await categoriesService.getDefaultFieldConfig(
      parsed.category,
    );
    return await repository.create({
      ...parsed,
      fieldConfig: parsed.fieldConfig ?? defaultConfig,
      createdBy: this.contextActor(context),
    });
  }

  async adopt(
    input: typeof adoptMasterActivityInput._type,
    context: AppContext,
  ) {
    const parsed = adoptMasterActivityInput.parse(input);
    this.requireWrite(parsed.daycareId, context);
    return await this.adoptForDaycare(
      parsed.daycareId,
      parsed.masterActivityId,
      this.contextActor(context),
    );
  }

  async update(
    id: string,
    input: typeof updateDaycareActivityInput._type,
    context: AppContext,
  ) {
    const activity = await repository.findById(id);
    if (!activity) {
      throw new GraphQLError("Aktivitas daycare tidak ditemukan.");
    }
    this.requireWrite(activity.daycareId.toString(), context);
    const parsed = updateDaycareActivityInput.parse(input);
    if (parsed.category) {
      await categoriesService.getDefaultFieldConfig(parsed.category);
    }
    return await repository.update(id, parsed);
  }

  async deactivate(id: string, context: AppContext) {
    const activity = await repository.findById(id);
    if (!activity) {
      throw new GraphQLError("Aktivitas daycare tidak ditemukan.");
    }
    this.requireWrite(activity.daycareId.toString(), context);
    return await repository.deactivate(id);
  }

  async bootstrapStarters(
    daycareId: string,
    actor: ActivityActor,
    options?: { session?: ClientSession },
  ) {
    const starters = await masterRepository.list({
      active: true,
      isStarter: true,
    });
    return await Promise.all(
      starters.map((master) =>
        this.adoptForDaycare(
          daycareId,
          master._id.toString(),
          actor,
          options,
        )
      ),
    );
  }

  async assertBelongToDaycare(daycareId: string, ids: (string | undefined)[]) {
    const uniqueIds = [
      ...new Set(ids.filter((id): id is string => Boolean(id))),
    ];
    if (uniqueIds.length === 0) {
      return;
    }
    const count = await repository.countActiveByIds(daycareId, uniqueIds);
    if (count !== uniqueIds.length) {
      throw new GraphQLError(
        "Aktivitas tidak aktif atau bukan milik daycare tersebut.",
      );
    }
  }

  private async adoptForDaycare(
    daycareId: string,
    masterActivityId: string,
    actor: ActivityActor,
    options?: { session?: ClientSession },
  ) {
    const existing = await repository.findBySource(
      daycareId,
      masterActivityId,
      options,
    );
    if (existing) {
      return existing;
    }
    const master = await masterRepository.findById(masterActivityId);
    if (!master || !master.active) {
      throw new GraphQLError(
        "Master aktivitas tidak ditemukan atau tidak aktif.",
      );
    }
    await categoriesService.getDefaultFieldConfig(master.category);

    try {
      return await repository.create({
        daycareId,
        sourceMasterActivityId: master._id,
        sourceMasterVersion: master.version,
        name: master.name,
        description: master.description ?? "",
        category: master.category,
        defaultDuration: master.defaultDuration,
        icon: master.icon ?? "",
        color: master.color ?? "",
        active: true,
        fieldConfig: master.fieldConfig,
        createdBy: actor,
      }, options);
    } catch (error) {
      if (
        error && typeof error === "object" &&
        "code" in error && error.code === 11000
      ) {
        const adopted = await repository.findBySource(
          daycareId,
          masterActivityId,
          options,
        );
        if (adopted) {
          return adopted;
        }
      }
      throw error;
    }
  }

  private contextActor(context: AppContext): ActivityActor {
    if (!context.user) {
      throw new GraphQLError("Authentication required.");
    }
    return {
      userId: context.user._id,
      name: context.user.name,
      role: context.user.role ?? UserRole.PARENT,
    };
  }

  private requireRead(daycareId: DaycareIdLike, context: AppContext) {
    isAuthenticated(context);
    if (context.user?.role === UserRole.SUPER_ADMIN) {
      return;
    }
    if (context.user?.daycareId?.toString() !== daycareId.toString()) {
      throw new GraphQLError("Akses ditolak.");
    }
  }

  private requireWrite(daycareId: DaycareIdLike, context: AppContext) {
    this.requireRead(daycareId, context);
    const allowed = [
      UserRole.SUPER_ADMIN,
      UserRole.DAYCARE_OWNER,
      UserRole.DAYCARE_ADMIN,
    ];
    if (!context.user?.role || !allowed.includes(context.user.role)) {
      throw new GraphQLError("Akses ditolak.");
    }
  }
}
