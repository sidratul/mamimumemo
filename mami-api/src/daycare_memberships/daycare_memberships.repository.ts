import { ClientSession, ProjectionType } from "mongoose";
import { ObjectId } from "#shared/index.ts";
import DaycareMembershipModel from "./daycare_memberships.schema.ts";
import { DaycareMembershipDocShape, DaycareMembershipRecord } from "./daycare_memberships.d.ts";
import { DaycareMembershipPersona, DaycareMembershipStatus } from "./daycare_memberships.enum.ts";

export class DaycareMembershipsRepository {
  async create(
    data: Omit<DaycareMembershipDocShape, "createdAt" | "updatedAt">,
    options?: { session?: ClientSession },
  ) {
    const [membership] = await DaycareMembershipModel.create([data], options);
    return membership;
  }

  async findViewById(
    id: ObjectId,
    projection?: ProjectionType<DaycareMembershipDocShape>,
  ): Promise<DaycareMembershipRecord | null> {
    let query = DaycareMembershipModel.findById(id);
    if (projection && Object.keys(projection).length > 0) {
      query = query.select(projection);
    }
    return await query.lean<DaycareMembershipRecord | null>().exec();
  }

  async findActiveByUserId(userId: ObjectId): Promise<DaycareMembershipRecord | null> {
    return await DaycareMembershipModel.findOne({
      "user._id": userId,
      status: DaycareMembershipStatus.ACTIVE,
    }).sort({ createdAt: -1 }).lean<DaycareMembershipRecord | null>().exec();
  }

  async findActiveByUserAndDaycare(userId: ObjectId, daycareId: ObjectId): Promise<DaycareMembershipRecord | null> {
    return await DaycareMembershipModel.findOne({
      "user._id": userId,
      "daycare._id": daycareId,
      status: DaycareMembershipStatus.ACTIVE,
    }).sort({ createdAt: -1 }).lean<DaycareMembershipRecord | null>().exec();
  }

  async findActiveOwnerByDaycareId(daycareId: ObjectId): Promise<DaycareMembershipRecord | null> {
    return await DaycareMembershipModel.findOne({
      "daycare._id": daycareId,
      persona: DaycareMembershipPersona.OWNER,
      status: DaycareMembershipStatus.ACTIVE,
    }).sort({ createdAt: -1 }).lean<DaycareMembershipRecord | null>().exec();
  }

  async listByDaycareId(
    daycareId: ObjectId,
    projection?: ProjectionType<DaycareMembershipDocShape>,
  ): Promise<DaycareMembershipRecord[]> {
    let query = DaycareMembershipModel.find({
      "daycare._id": daycareId,
    }).sort({ createdAt: -1 });

    if (projection && Object.keys(projection).length > 0) {
      query = query.select(projection);
    }

    return await query.lean<DaycareMembershipRecord[]>().exec();
  }

  async listByUserId(userId: ObjectId): Promise<DaycareMembershipRecord[]> {
    return await DaycareMembershipModel.find({
      "user._id": userId,
    }).sort({ createdAt: -1 }).lean<DaycareMembershipRecord[]>().exec();
  }

  async deactivate(id: ObjectId) {
    return await DaycareMembershipModel.findByIdAndUpdate(
      id,
      {
        status: DaycareMembershipStatus.INACTIVE,
        endedAt: new Date(),
      },
      { new: true },
    ).exec();
  }

  async deleteByDaycareId(daycareId: ObjectId, options?: { session?: ClientSession }) {
    const result = await DaycareMembershipModel.deleteMany({
      "daycare._id": daycareId,
    }, options);
    return result.deletedCount ?? 0;
  }

  async deleteByUserId(userId: ObjectId, options?: { session?: ClientSession }) {
    const result = await DaycareMembershipModel.deleteMany({
      "user._id": userId,
    }, options);
    return result.deletedCount ?? 0;
  }
}
