import mongoose from "mongoose";

const MONGO_URI = Deno.env.get("MONGO_URI") ||
  "mongodb://localhost:27017/mami-db";

function renameActivityReference(expression: unknown) {
  return {
    $map: {
      input: { $ifNull: [expression, []] },
      as: "activity",
      in: {
        $arrayToObject: {
          $filter: {
            input: {
              $objectToArray: {
                $mergeObjects: [
                  "$$activity",
                  { daycareActivityId: "$$activity.masterActivityId" },
                ],
              },
            },
            as: "field",
            cond: { $ne: ["$$field.k", "masterActivityId"] },
          },
        },
      },
    },
  };
}

async function migrate() {
  await mongoose.connect(MONGO_URI);

  try {
    const database = mongoose.connection.db!;
    const legacyMasters = database.collection("masteractivities");
    const daycareActivities = database.collection("daycareactivities");
    const legacyDocuments = await legacyMasters.find({
      daycareId: { $exists: true },
    }).toArray();

    if (legacyDocuments.length > 0) {
      await daycareActivities.bulkWrite(
        legacyDocuments.map((document) => ({
          updateOne: {
            filter: { _id: document._id },
            update: {
              $setOnInsert: {
                ...document,
                sourceMasterActivityId: null,
                sourceMasterVersion: null,
              },
            },
            upsert: true,
          },
        })),
        { ordered: false },
      );
    }

    await database.collection("activities").updateMany(
      { masterActivityId: { $exists: true } },
      { $rename: { masterActivityId: "daycareActivityId" } },
    );

    await database.collection("scheduletemplates").updateMany(
      { "activities.masterActivityId": { $exists: true } },
      [{ $set: { activities: renameActivityReference("$activities") } }],
    );

    await database.collection("dailycarerecords").updateMany(
      {
        $or: [
          { "plannedActivities.masterActivityId": { $exists: true } },
          { "children.activities.masterActivityId": { $exists: true } },
        ],
      },
      [{
        $set: {
          plannedActivities: renameActivityReference("$plannedActivities"),
          children: {
            $map: {
              input: { $ifNull: ["$children", []] },
              as: "child",
              in: {
                $mergeObjects: [
                  "$$child",
                  {
                    activities: renameActivityReference(
                      "$$child.activities",
                    ),
                  },
                ],
              },
            },
          },
        },
      }],
    );

    await database.collection("weeklyschedules").updateMany(
      {
        "days.childAssignments.activities.masterActivityId": { $exists: true },
      },
      [{
        $set: {
          days: {
            $map: {
              input: { $ifNull: ["$days", []] },
              as: "day",
              in: {
                $mergeObjects: [
                  "$$day",
                  {
                    childAssignments: {
                      $map: {
                        input: {
                          $ifNull: ["$$day.childAssignments", []],
                        },
                        as: "child",
                        in: {
                          $mergeObjects: [
                            "$$child",
                            {
                              activities: renameActivityReference(
                                "$$child.activities",
                              ),
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      }],
    );

    const cleanup = await legacyMasters.deleteMany({
      daycareId: { $exists: true },
    });
    console.log(
      `Moved ${legacyDocuments.length} tenant activities and removed ${cleanup.deletedCount} legacy master documents.`,
    );
  } finally {
    await mongoose.connection.close();
  }
}

await migrate();
