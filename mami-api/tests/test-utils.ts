import { AppContext } from "../shared/config/context.ts";

export const TEST_CONFIG = {
  mongoUri: Deno.env.get("TEST_MONGO_URI") ||
    "mongodb://mami-admin:mami-password-2026@localhost:27017/mami-test?authSource=admin",
  jwtSecret: Deno.env.get("TEST_JWT_SECRET") || "test-secret-key",
  port: parseInt(Deno.env.get("TEST_PORT") || "8001"),
};

// Test database connection
import mongoose from "mongoose";

export async function connectTestDatabase() {
  try {
    await mongoose.connect(TEST_CONFIG.mongoUri);
    console.log("✅ Connected to test database");
  } catch (error) {
    console.error("❌ Failed to connect to test database:", error);
    throw error;
  }
}

export async function disconnectTestDatabase() {
  try {
    await mongoose.connection.close();
    console.log("✅ Disconnected from test database");
  } catch (error) {
    console.error("❌ Failed to disconnect:", error);
    throw error;
  }
}

export async function clearTestDatabase() {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log("✅ Cleared test database");
  } catch (error) {
    console.error("❌ Failed to clear test database:", error);
    throw error;
  }
}

export async function setupTestDatabase() {
  await connectTestDatabase();
}

export async function teardownTestDatabase() {
  await clearTestDatabase();
  await disconnectTestDatabase();
}

// Test utilities
export function createTestUser(overrides = {}) {
  return {
    name: "Test User",
    email: `test.${Date.now()}@example.com`,
    password: "password123",
    phone: "0812-3456-7890",
    role: "PARENT",
    ...overrides,
  };
}

export function createTestChild(overrides = {}) {
  return {
    profile: {
      name: "Test Child",
      birthDate: "2023-01-15",
      photo: "https://example.com/child.jpg",
      gender: "MALE",
    },
    medical: {
      allergies: [],
      medicalNotes: "",
      medications: [],
    },
    ...overrides,
  };
}

export function createTestActivity(overrides = {}) {
  return {
    activityName: "Test Activity",
    category: "PLAY",
    date: new Date().toISOString(),
    startTime: "10:00",
    endTime: "11:00",
    mood: "HAPPY",
    ...overrides,
  };
}

// Mock context for resolvers
export function createMockContext(user: any = null) {
  return Object.assign(new AppContext(user ?? undefined), {
    user,
    req: {
      headers: {
        authorization: user ? `Bearer ${user.token}` : "",
      },
    },
  });
}

// Assert helpers
export function assertExists(value: any, message?: string) {
  if (value === null || value === undefined) {
    throw new Error(message || `Expected value to exist, got ${value}`);
  }
}

export function assertId(value: any, message?: string) {
  if (typeof value !== "string" || value.length !== 24) {
    throw new Error(message || `Expected ObjectId, got ${value}`);
  }
}

export function assertDate(value: any, message?: string) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(message || `Expected date, got ${value}`);
  }
}

// Test data generators
export const generateTestData = {
  user: (index: number) => ({
    name: `Test User ${index}`,
    email: `test${index}@example.com`,
    password: "password123",
    phone: `0812-3456-789${index}`,
    role: "PARENT",
  }),
  
  child: (index: number) => ({
    profile: {
      name: `Test Child ${index}`,
      birthDate: `2023-01-${String(index).padStart(2, "0")}`,
      photo: `https://example.com/child${index}.jpg`,
      gender: index % 2 === 0 ? "MALE" : "FEMALE",
    },
    medical: {
      allergies: index % 3 === 0 ? ["Susu"] : [],
      medicalNotes: "",
      medications: [],
    },
  }),
  
  activity: (index: number) => ({
    activityName: `Activity ${index}`,
    category: ["MEAL", "NAP", "PLAY", "LEARNING"][index % 4],
    date: new Date().toISOString(),
    startTime: `${String(8 + index).padStart(2, "0")}:00`,
    endTime: `${String(9 + index).padStart(2, "0")}:00`,
    mood: ["HAPPY", "SLEEPY", "ENERGETIC"][index % 3],
  }),
};
