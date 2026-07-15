import mongoose from "mongoose";
import ParentModel from "@/parents/parents.schema.ts";
import ChildrenDaycareModel from "@/children_daycare/children_daycare.schema.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

async function repairParentChildren() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const parents = await ParentModel.find({ active: true }).exec();
    let updated = 0;

    for (const parent of parents) {
      const children = await ChildrenDaycareModel.find({
        parentId: parent._id,
        active: true,
      }).select("_id").exec();

      const childIds = children.map((child) => child._id);
      await ParentModel.findByIdAndUpdate(parent._id, {
        $set: { childrenIds: childIds },
      }).exec();
      updated += 1;
    }

    console.log(`Repaired childrenIds for ${updated} parent(s).`);
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error repairing parent children:", error);
    await mongoose.connection.close();
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await repairParentChildren();
}
