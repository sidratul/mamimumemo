import mongoose, { ClientSession } from "mongoose";
import { AuthDoc } from "@/auth/auth.d.ts";

/**
 * The context that will be available in all resolvers.
 * It can be extended to include more properties.
 * In a real app, you would typically populate the user property
 * in the context creation logic based on a JWT or session.
 */
export class AppContext {
  user?: AuthDoc;
  private session?: ClientSession;

  constructor(user?: AuthDoc) {
    this.user = user;
  }

  public async getDbSession(): Promise<ClientSession> {
    if (!this.session) {
      this.session = await mongoose.startSession();
    }
    return this.session;
  }

  public async startTransaction(): Promise<void> {
    const session = await this.getDbSession();
    session.startTransaction();
  }

  public async commitTransaction(): Promise<void> {
    if (this.session?.inTransaction()) {
      await this.session.commitTransaction();
    }
  }

  public async abortTransaction(): Promise<void> {
    if (this.session?.inTransaction()) {
      await this.session.abortTransaction();
    }
  }

  public async endSession(): Promise<void> {
    if (this.session && !this.session.hasEnded) {
      await this.session.endSession();
    }
  }
}
