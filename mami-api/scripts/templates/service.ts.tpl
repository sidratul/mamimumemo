import __NAME__Repository from "./__NAME_LOWER__.repository.ts";
import { __NAME__Doc, __NAME__QueryOptions } from "./__NAME_LOWER__.d.ts";
import { Create__NAME__Input, Update__NAME__Input } from "./__NAME_LOWER__.validation.ts";
import { NotFoundError, ObjectId } from "#shared/index.ts";

class __NAME__Service {
  public async create(data: Create__NAME__Input): Promise<__NAME__Doc> {
    // Add any business logic before creation
    return await __NAME__Repository.create(data);
  }

  public async getAll(options: __NAME__QueryOptions): Promise<__NAME__Doc[]> {
    return await __NAME__Repository.findAll(options);
  }

  public async count(options: __NAME__QueryOptions): Promise<number> {
    return await __NAME__Repository.count(options);
  }

  public async getById(id: ObjectId): Promise<__NAME__Doc> {
    const __NAME_CAMEL__ = await __NAME__Repository.findById(id);
    if (!__NAME_CAMEL__) {
      throw new NotFoundError("__NAME__ not found");
    }
    return __NAME_CAMEL__;
  }

  public async update(id: ObjectId, data: Update__NAME__Input): Promise<__NAME__Doc> {
    const __NAME_CAMEL__ = await __NAME__Repository.update(id, data);
    if (!__NAME_CAMEL__) {
      throw new NotFoundError("__NAME__ not found");
    }
    return __NAME_CAMEL__;
  }

  public async delete(id: ObjectId): Promise<boolean> {
    const success = await __NAME__Repository.delete(id);
    if (!success) {
      throw new NotFoundError("__NAME__ not found");
    }
    return true;
  }
}

export default new __NAME__Service();
