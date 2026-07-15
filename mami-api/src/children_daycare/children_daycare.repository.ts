import mongoose from "mongoose";
import { Types } from "mongoose";
import ChildrenDaycareModel from "./children_daycare.schema.ts";

export class ChildrenDaycareRepository {
  async findByDaycareId(daycareId: string, active?: boolean) {
    const query: Record<string, unknown> = { daycareId };
    if (active !== undefined) {
      query.active = active;
    }
    return await ChildrenDaycareModel.find(query)
      .populate("parentId")
      .populate("globalChildId")
      .exec();
  }

  async findById(id: string) {
    return await ChildrenDaycareModel.findById(id)
      .populate("parentId")
      .populate("globalChildId")
      .exec();
  }

  async findByGlobalChildIdAndDaycare(daycareId: string, globalChildId: string) {
    return await ChildrenDaycareModel.findOne({
      daycareId,
      globalChildId,
    }).populate("parentId").exec();
  }

  async findByParentIdAndDaycare(daycareId: string, parentId: string) {
    return await ChildrenDaycareModel.find({
      daycareId,
      parentId,
    }).exec();
  }

  async create(data: Record<string, unknown>) {
    const child = new ChildrenDaycareModel(data);
    return await child.save();
  }

  async attachToParent(parentId: string, childId: unknown) {
    const ParentModel = mongoose.model("Parent");
    await ParentModel.findByIdAndUpdate(parentId, {
      $addToSet: { childrenIds: childId },
    }).exec();
  }

  async detachFromParents(childId: unknown) {
    const ParentModel = mongoose.model("Parent");
    await ParentModel.updateMany({}, {
      $pull: { childrenIds: childId },
    }).exec();
  }

  async update(id: string, data: Record<string, unknown>) {
    return await ChildrenDaycareModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deactivate(id: string) {
    return await ChildrenDaycareModel.findByIdAndUpdate(
      id,
      { active: false, exitedAt: new Date() },
      { new: true }
    ).exec();
  }

  async hasOperationalReferences(id: string) {
    const childId = new Types.ObjectId(id);
    const DailyCareRecordModel = mongoose.model("DailyCareRecord");
    const WeeklyScheduleModel = mongoose.model("WeeklySchedule");
    const ActivityModel = mongoose.model("Activity");
    const MedicalRecordModel = mongoose.model("MedicalRecord");
    const ContractModel = mongoose.model("Contract");

    const [
      dailyRecords,
      weeklySchedules,
      activities,
      medicalRecords,
      contracts,
    ] = await Promise.all([
      DailyCareRecordModel.exists({ "children.childId": childId }),
      WeeklyScheduleModel.exists({ "days.childAssignments.childId": childId }),
      ActivityModel.exists({ childId }),
      MedicalRecordModel.exists({ childId }),
      ContractModel.exists({ childIds: childId }),
    ]);

    return Boolean(dailyRecords || weeklySchedules || activities || medicalRecords || contracts);
  }

  async hardDelete(id: string) {
    return await ChildrenDaycareModel.findByIdAndDelete(id).exec();
  }

  async daycareExists(daycareId: string): Promise<boolean> {
    const DaycareModel = mongoose.model("Daycare");
    const daycare = await DaycareModel.findById(daycareId).exec();
    return !!daycare;
  }

  async parentExists(parentId: string): Promise<boolean> {
    const ParentModel = mongoose.model("Parent");
    const parent = await ParentModel.findById(parentId).exec();
    return !!parent;
  }
}
