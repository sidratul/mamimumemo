import { FilterQuery, UpdateQuery } from "mongoose";
import { Auth, AuthDoc, AuthQueryOptions } from "./auth.d.ts";
import AuthModel from "./auth.schema.ts";
import { ObjectId } from "#shared/index.ts";

class AuthRepository {
  public async create(auth: Partial<Auth>): Promise<AuthDoc> {
    return await AuthModel.create(auth);
  }

  public async find(filter: FilterQuery<Auth>): Promise<AuthDoc | null> {
    return await AuthModel.findOne(filter);
  }

  public async findById(id: ObjectId): Promise<AuthDoc | null> {
    return await AuthModel.findById(id);
  }

  public async update(id: ObjectId, updateData: UpdateQuery<Auth>): Promise<AuthDoc | null> {
    return await AuthModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  public async delete(id: ObjectId): Promise<boolean> {
    const result = await AuthModel.findByIdAndDelete(id);
    return !!result;
  }

  public async findAll(options: AuthQueryOptions = {}): Promise<AuthDoc[]> {
    const { search, sort, page, limit } = options;
    const filter: FilterQuery<Auth> = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = AuthModel.find(filter);

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

  public async count(options: AuthQueryOptions = {}): Promise<number> {
    const { search } = options;
    const filter: FilterQuery<Auth> = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    return await AuthModel.countDocuments(filter);
  }
}

export default new AuthRepository();
