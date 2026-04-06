import { z } from "zod";

// Defines the schema for environment variables
const envSchema = z.object({
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  PORT: z.coerce.number().positive().default(8000),
});

// Validate environment variables on startup
try {
  envSchema.parse(Deno.env.toObject());
  console.log("Environment variables validated successfully.");
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error("Invalid environment variables:", e.errors);
  } else {
    console.error("An unexpected error occurred during environment variable validation:", e);
  }
  Deno.exit(1);
}
