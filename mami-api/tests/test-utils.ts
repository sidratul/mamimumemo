import { AppContext } from "../shared/config/context.ts";
import { UserRole } from "../shared/enums/enum.ts";
import { AuthDoc } from "../src/auth/auth.d.ts";

export const TEST_CONFIG = {
  mongoUri: Deno.env.get("TEST_MONGO_URI") ||
    "mongodb://mami-admin:mami-password-2026@localhost:27017/mami-test?authSource=admin",
  jwtSecret: Deno.env.get("TEST_JWT_SECRET") || "test-secret-key",
  port: parseInt(Deno.env.get("TEST_PORT") || "8001"),
};

Deno.env.set("JWT_SECRET", Deno.env.get("JWT_SECRET") || TEST_CONFIG.jwtSecret);
Deno.env.set("JWT_ACCESS_SECRET", Deno.env.get("JWT_ACCESS_SECRET") || TEST_CONFIG.jwtSecret);
Deno.env.set("JWT_REFRESH_SECRET", Deno.env.get("JWT_REFRESH_SECRET") || TEST_CONFIG.jwtSecret);

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
    role: UserRole.PARENT,
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
type MockContextUser = Partial<AuthDoc> & {
  id?: string;
  token?: string;
};

export type MockAppContext = AppContext & {
  req: {
    headers: {
      authorization: string;
    };
  };
};

export function createMockContext(user: MockContextUser | null = null): MockAppContext {
  return Object.assign(new AppContext((user ?? undefined) as AuthDoc | undefined), {
    user: (user ?? undefined) as AuthDoc | undefined,
    req: {
      headers: {
        authorization: user ? `Bearer ${user.token}` : "",
      },
    },
  }) as MockAppContext;
}

export function createContextFromUser(user: MockContextUser): MockAppContext {
  return createMockContext({
    ...user,
    id: user.id || user._id?.toString?.() || "",
  });
}

export function createRoleContext(
  role: UserRole,
  overrides: Partial<MockContextUser> = {},
): MockAppContext {
  return createMockContext({
    id: overrides.id || "mock-user-id",
    name: overrides.name || "Mock User",
    email: overrides.email || "mock.user@example.com",
    phone: overrides.phone,
    role,
    token: overrides.token,
    ...overrides,
  });
}

export function createSuperAdminContext(overrides: Partial<MockContextUser> = {}) {
  return createRoleContext(UserRole.SUPER_ADMIN, overrides);
}

export function createDaycareOwnerContext(overrides: Partial<MockContextUser> = {}) {
  return createRoleContext(UserRole.DAYCARE_OWNER, overrides);
}

// Assert helpers
export function assertExists(value: unknown, message?: string) {
  if (value === null || value === undefined) {
    throw new Error(message || `Expected value to exist, got ${value}`);
  }
}

export function assertId(value: unknown, message?: string) {
  if (typeof value !== "string" || value.length !== 24) {
    throw new Error(message || `Expected ObjectId, got ${value}`);
  }
}

export function assertDate(value: unknown, message?: string) {
  if (!(value instanceof Date) && typeof value !== "string" && typeof value !== "number") {
    throw new Error(message || `Expected date-like value, got ${String(value)}`);
  }

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
    role: UserRole.PARENT,
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
