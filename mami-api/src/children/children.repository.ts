import ChildModel from "./children.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class ChildrenRepository {
  async findByOwnerId(ownerId: string) {
    return await ChildModel.find({ ownerId }).populate("guardians.user.userId").exec();
  }

  async findById(id: string) {
    return await ChildModel.findById(id)
      .populate("guardians.user.userId")
      .populate("ownerId")
      .exec();
  }

  async findByGuardianId(userId: string) {
    return await ChildModel.find({
      "guardians.user.userId": userId,
      "guardians.active": true,
    }).exec();
  }

  async create(data: any) {
    const child = new ChildModel(data);
    return await child.save();
  }

  async update(id: string, data: any) {
    return await ChildModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async addGuardian(childId: string, guardianData: any) {
    return await ChildModel.findByIdAndUpdate(
      childId,
      { $push: { guardians: guardianData } },
      { new: true }
    ).exec();
  }

  async removeGuardian(childId: string, guardianUserId: string) {
    return await ChildModel.findByIdAndUpdate(
      childId,
      { $pull: { guardians: { "user.userId": guardianUserId } } },
      { new: true }
    ).exec();
  }

  async userHasAccess(childId: string, userId: string): Promise<boolean> {
    const child = await this.findById(childId);
    if (!child) return false;
    
    // Owner always has access
    if (child.ownerId.toString() === userId) return true;
    
    // Check if user is a guardian
    const isGuardian = child.guardians.some(
      (g: any) => g.user.userId.toString() === userId && g.active
    );
    
    return isGuardian;
  }
}
