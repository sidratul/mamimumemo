import GalleryModel from "./gallery.schema.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { MESSAGES } from "#shared/enums/constant.ts";

export class GalleryRepository {
  async findByDaycare(daycareId: string, childName?: string, limit: number = 20) {
    const query: any = { daycareId };
    if (childName !== undefined) {
      query.childName = childName;
    }
    return await GalleryModel.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .exec();
  }

  async findGeneral(daycareId: string, limit: number = 20) {
    return await GalleryModel.find({
      daycareId,
      childName: { $exists: false },
    })
      .sort({ date: -1 })
      .limit(limit)
      .exec();
  }

  async findByChild(daycareId: string, childName: string, limit: number = 20) {
    return await GalleryModel.find({
      daycareId,
      childName,
    })
      .sort({ date: -1 })
      .limit(limit)
      .exec();
  }

  async findById(id: string) {
    return await GalleryModel.findById(id).exec();
  }

  async create(data: any) {
    const gallery = new GalleryModel(data);
    return await gallery.save();
  }

  async update(id: string, data: any) {
    return await GalleryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    const result = await GalleryModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
