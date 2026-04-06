import mongoose from "mongoose";

export async function connectToDatabase() {
  const mongoUri = Deno.env.get("MONGO_URI");
  if (!mongoUri) {
    console.error("MONGO_URI environment variable not set.");
    Deno.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("An unknown error occurred while connecting to MongoDB:", error);
    }
    Deno.exit(1);
  }
}
