import { ClientSession, FilterQuery, ProjectionType, UpdateQuery } from "mongoose";
import { ObjectId } from "#shared/index.ts";
import UserModel from "./users.schema.ts";
import { RoleType } from "#shared/enums/enum.ts";
import { User, UserDoc, UserQueryOptions } from "./users.d.ts";

class UsersRepository {
  public async create(user: Partial<User>, options?: { session?: ClientSession }): Promise<UserDoc> {
    const [createdUser] = await UserModel.create([user], options);
    return createdUser;
  }

  public async find(filter: FilterQuery<User>, projection?: ProjectionType<User>): Promise<UserDoc | null> {
    let query = UserModel.findOne(filter);
    if (projection && Object.keys(projection).length > 0) {
      query = query.select(projection);
    }
    return await query;
  }

  public async findById(id: ObjectId, projection?: ProjectionType<User>): Promise<UserDoc | null> {
    let query = UserModel.findById(id);
    if (projection && Object.keys(projection).length > 0) {
      query = query.select(projection);
    }
    return await query;
  }

  public async update(id: ObjectId, updateData: UpdateQuery<User>): Promise<UserDoc | null> {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  public async delete(id: ObjectId): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  public async deleteByIdOrEmail(
    input: { id?: ObjectId; email?: string },
    options?: { session?: ClientSession },
  ): Promise<number> {
    const filters: FilterQuery<User>[] = [];

    if (input.id) {
      filters.push({ _id: input.id });
    }

    if (input.email) {
      filters.push({ email: input.email });
    }

    if (filters.length === 0) {
      return 0;
    }

    const result = await UserModel.deleteMany(
      filters.length === 1 ? filters[0] : { $or: filters },
      options,
    );

    return result.deletedCount ?? 0;
  }

  public async findAll(
    filter: FilterQuery<User> = {},
    options: Omit<UserQueryOptions, "personas"> = {},
    projection?: ProjectionType<User>,
  ): Promise<UserDoc[]> {
    const { sort, page, limit } = options;
    let query = UserModel.find(filter);

    if (page && limit) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    if (sort && sort.sortBy) {
      query = query.sort({ [sort.sortBy]: sort.sortType === "ASC" ? 1 : -1 });
    } else {
      query = query.sort({ name: 1 });
    }

    if (projection && Object.keys(projection).length > 0) {
      query = query.select(projection);
    }

    return await query.exec();
  }

  public async count(filter: FilterQuery<User> = {}): Promise<number> {
    return await UserModel.countDocuments(filter);
  }
}

export default new UsersRepository();
