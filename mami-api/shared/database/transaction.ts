import mongoose, { ClientSession } from "mongoose";
import { AppContext } from "#shared/config/context.ts";

export async function runInTransaction<T>(
  context: AppContext,
  callback: (session?: ClientSession) => Promise<T>,
): Promise<T> {
  const supportsTransactions = await canUseTransactions();
  if (!supportsTransactions) {
    return await callback();
  }

  await context.startTransaction();

  try {
    const session = await context.getDbSession();
    const result = await callback(session);
    await context.commitTransaction();
    return result;
  } catch (error) {
    await context.abortTransaction();
    throw error;
  } finally {
    await context.endSession();
  }
}

async function canUseTransactions() {
  const db = mongoose.connection.db;
  if (!db) {
    return false;
  }

  try {
    const hello = await db.admin().command({ hello: 1 }) as {
      setName?: string;
      msg?: string;
    };
    return Boolean(hello.setName || hello.msg === "isdbgrid");
  } catch {
    return false;
  }
}
