import mongoose, { ClientSession } from "mongoose";
import { AppContext } from "#shared/config/context.ts";

export async function runInTransaction<T>(
  _context: AppContext,
  callback: (session?: ClientSession) => Promise<T>,
): Promise<T> {
  const supportsTransactions = await canUseTransactions();
  if (!supportsTransactions) {
    return await callback();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    if (session.inTransaction()) {
      await session.commitTransaction();
    }
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (!session.hasEnded) {
      await session.endSession();
    }
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
