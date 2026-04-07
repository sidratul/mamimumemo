import DaycareModel from "./daycare.schema.ts";
import { ClientSession, FilterQuery } from "mongoose";
import { ObjectId } from "#shared/types/objectid.type.ts";
import { DaycareCreateData, DaycareDocShape, DaycareFilter, DaycareQueryOptions, DaycareRecord } from "./daycare.d.ts";

export class DaycareRepository {
  private buildFilter(filterInput: DaycareFilter = {}): FilterQuery<DaycareDocShape> {
    const { statuses, ownerIds, cities, isActive, search } = filterInput;
    const filter: FilterQuery<DaycareDocShape> = {
      deletedAt: { $exists: false },
    };

    if (statuses && statuses.length > 0) {
      filter["approval.status"] = { $in: statuses };
    }

    if (ownerIds && ownerIds.length > 0) {
      filter["owner._id"] = { $in: ownerIds };
    }

    if (cities && cities.length > 0) {
      filter.city = { $in: cities };
    }

    if (typeof isActive === "boolean") {
      filter.isActive = isActive;
    }

    if (search?.trim()) {
      const normalized = search.trim();
      filter.$or = [
        { name: { $regex: normalized, $options: "i" } },
        { city: { $regex: normalized, $options: "i" } },
        { "owner.name": { $regex: normalized, $options: "i" } },
        { "owner.email": { $regex: normalized, $options: "i" } },
        { address: { $regex: normalized, $options: "i" } },
      ];
    }

    return filter;
  }

  async list(options: DaycareQueryOptions = {}): Promise<DaycareRecord[]> {
    const { sort, page, limit, ...filterInput } = options;
    const filter = this.buildFilter(filterInput);

    let query = DaycareModel.find(filter);

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    if (sort?.sortBy) {
      const sortOrder = sort.sortType === "ASC" ? 1 : -1;
      query = query.sort([[sort.sortBy, sortOrder]]);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    return await query.lean<DaycareRecord[]>().exec();
  }

  async count(filter?: DaycareFilter) {
    return await DaycareModel.countDocuments(this.buildFilter(filter)).exec();
  }

  async findByIdForUpdate(id: ObjectId) {
    return await DaycareModel.findOne({ _id: id, deletedAt: { $exists: false } }).exec();
  }

  async findByIdIncludingDeletedForUpdate(id: ObjectId) {
    return await DaycareModel.findById(id).exec();
  }

  async hardDeleteById(id: ObjectId) {
    return await DaycareModel.findByIdAndDelete(id).exec();
  }

  async findViewById(id: ObjectId): Promise<DaycareRecord | null> {
    return await DaycareModel.findOne({
      _id: id,
      deletedAt: { $exists: false },
    }).lean<DaycareRecord | null>().exec();
  }

  async findViewByOwnerId(ownerId: ObjectId): Promise<DaycareRecord | null> {
    return await DaycareModel.findOne({
      "owner._id": ownerId,
      deletedAt: { $exists: false },
    }).sort({ createdAt: -1 }).lean<DaycareRecord | null>().exec();
  }

  async create(data: DaycareCreateData, options?: { session?: ClientSession }) {
    const [daycare] = await DaycareModel.create([data], options);
    return daycare;
  }
}
