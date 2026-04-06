import DaycareModel from "./daycare_admin.schema.ts";

export class DaycareAdminRepository {
  async list(params: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { status, search, limit = 20, offset = 0 } = params;
    const query: Record<string, unknown> = {};

    if (status) {
      query["approval.status"] = status;
    }

    if (search?.trim()) {
      const normalized = search.trim();
      query.$or = [
        { name: { $regex: normalized, $options: "i" } },
        { city: { $regex: normalized, $options: "i" } },
        { "owner.name": { $regex: normalized, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      DaycareModel.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
      DaycareModel.countDocuments(query).exec(),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return await DaycareModel.findById(id).exec();
  }

  async findByOwnerUserId(userId: string) {
    return await DaycareModel.findOne({ "owner.userId": userId }).sort({ createdAt: -1 }).exec();
  }

  async create(data: Record<string, unknown>) {
    const daycare = new DaycareModel(data);
    return await daycare.save();
  }

  async save(daycare: any) {
    return await daycare.save();
  }
}
