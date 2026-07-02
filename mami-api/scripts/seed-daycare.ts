/**
 * Seed one active daycare, its owner user, and OWNER membership.
 *
 * Usage:
 *   deno task seed:daycare
 */

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import UserModel from "@/users/users.schema.ts";
import DaycareModel from "@/daycare/daycare.schema.ts";
import DaycareMembershipModel from "@/daycare_memberships/daycare_memberships.schema.ts";
import { DaycareApprovalStatus } from "@/daycare/daycare.enum.ts";
import {
  DaycareMembershipAccess,
  DaycareMembershipStatus,
} from "@/daycare_memberships/daycare_memberships.enum.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

const SEED_DATA = {
  daycare: {
    name: "Saldira Daycare",
    city: "Jakarta",
    address: "Jl. Swadaya",
  },
  owner: {
    email: "admin@saldira.com",
    name: "Sidra",
    password: "Admin@2026",
  },
} as const;

async function seedDaycare() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    const password = await bcrypt.hash(SEED_DATA.owner.password, 10);
    const owner = await UserModel.findOneAndUpdate(
      { email: SEED_DATA.owner.email },
      {
        $set: {
          name: SEED_DATA.owner.name,
          email: SEED_DATA.owner.email,
          password,
          phone: "",
          systemRole: null,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await mongoose.connection.collection("users").updateOne(
      { _id: owner._id },
      { $unset: { role: "" } },
    );

    let daycare = await DaycareModel.findOne({
      "owner._id": owner._id,
      deletedAt: { $exists: false },
    });

    if (daycare) {
      daycare.set({
        ...SEED_DATA.daycare,
        owner: {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone || "",
        },
        isActive: true,
        approvedAt: daycare.approvedAt || new Date(),
        "approval.status": DaycareApprovalStatus.APPROVED,
        "approval.note": "Daycare dibuat melalui seeder.",
      });
      await daycare.save();
    } else {
      const now = new Date();
      daycare = await DaycareModel.create({
        ...SEED_DATA.daycare,
        logoUrl: "",
        description: "",
        owner: {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone || "",
        },
        legalDocuments: [],
        submittedAt: now,
        approvedAt: now,
        isActive: true,
        approval: {
          status: DaycareApprovalStatus.APPROVED,
          note: "Daycare dibuat melalui seeder.",
          reviewedBy: {
            userId: owner._id,
            name: owner.name,
          },
          reviewedAt: now,
          history: [{
            status: DaycareApprovalStatus.APPROVED,
            note: "Daycare dibuat melalui seeder.",
            changedBy: {
              userId: owner._id,
              name: owner.name,
            },
            changedAt: now,
          }],
        },
      });
    }

    await DaycareMembershipModel.findOneAndUpdate(
      {
        "user._id": owner._id,
        "daycare._id": daycare._id,
        access: DaycareMembershipAccess.OWNER,
      },
      {
        $set: {
          user: {
            _id: owner._id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone || "",
          },
          daycare: {
            _id: daycare._id,
            name: daycare.name,
          },
          access: DaycareMembershipAccess.OWNER,
          status: DaycareMembershipStatus.ACTIVE,
          notes: "Membership owner dari seeder.",
        },
        $setOnInsert: {
          joinedAt: new Date(),
        },
        $unset: {
          endedAt: 1,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    console.log("Daycare seed siap digunakan:");
    console.log(`Daycare: ${daycare.name}`);
    console.log(`Daycare ID: ${daycare._id}`);
    console.log(`Owner: ${owner.name}`);
    console.log(`Email: ${SEED_DATA.owner.email}`);
    console.log(`Password: ${SEED_DATA.owner.password}`);
  } catch (error) {
    console.error("Error seeding daycare:", error);
    Deno.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

await seedDaycare();
