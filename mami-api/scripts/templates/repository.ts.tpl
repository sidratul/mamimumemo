import { FilterQuery, UpdateQuery } from "mongoose";
import { __NAME__, __NAME__Doc, __NAME__QueryOptions } from "./__NAME_LOWER__.d.ts";
import __NAME__Model from "./__NAME_LOWER__.schema.ts";
import { ObjectId } from "#shared/index.ts";

class __NAME__Repository {
  public async create(__NAME_CAMEL__: Partial<__NAME__>): Promise<__NAME__Doc> {
    return await __NAME__Model.create(__NAME_CAMEL__);
  }

  public async find(filter: FilterQuery<__NAME__>): Promise<__NAME__Doc | null> {
    return await __NAME__Model.findOne(filter);
  }

  public async findById(id: ObjectId): Promise<__NAME__Doc | null> {
    return await __NAME__Model.findById(id);
  }

  public async update(id: ObjectId, updateData: UpdateQuery<__NAME__>): Promise<__NAME__Doc | null> {
    return await __NAME__Model.findByIdAndUpdate(id, updateData, { new: true });
  }

  public async delete(id: ObjectId): Promise<boolean> {
    const result = await __NAME__Model.findByIdAndDelete(id);
    return !!result;
  }

  public async findAll(options: __NAME__QueryOptions = {}): Promise<__NAME__Doc[]> {
    const { search, sort, page, limit } = options;
    const filter: FilterQuery<__NAME__> = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = __NAME__Model.find(filter);

    if (page && limit) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    if (sort && sort.sortBy) {
      query = query.sort({ [sort.sortBy]: sort.sortType === 'ASC' ? 1 : -1 });
    } else {
      query = query.sort({ name: 1 });
    }

    return await query.exec();
  }

  public async count(options: __NAME__QueryOptions = {}): Promise<number> {
    const { search } = options;
    const filter: FilterQuery<__NAME__> = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    return await __NAME__Model.countDocuments(filter);
  }
}

export default new __NAME__Repository();
