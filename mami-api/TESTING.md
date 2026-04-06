# Testing Guide

**Purpose:** Panduan lengkap untuk testing Mami API

---

## 🚀 Quick Start

### **Run All Tests**
```bash
deno test -A
```

### **Run Specific Test File**
```bash
deno test -A src/auth/auth.test.ts
deno test -A src/children/children.test.ts
```

### **Run Tests with Filter**
```bash
deno test -A --filter "should register"
deno test -A --filter "Auth Module"
```

### **Run Tests with Coverage**
```bash
deno test -A --coverage=cov_profile
deno coverage cov_profile --lcov > cov.lcov
```

---

## 📁 Test Structure

```
mami-api/
├── mocks/
│   └── index.ts              # Mock data untuk semua modules
├── tests/
│   └── test-utils.ts         # Test utilities & helpers
├── src/
│   ├── auth/
│   │   ├── auth.test.ts      # Auth module tests
│   │   └── ...
│   ├── children/
│   │   ├── children.test.ts  # Children module tests
│   │   └── ...
│   └── ...
└── deno.jsonc                # Test configuration
```

---

## 🎯 Test Organization

### **Unit Tests**
- Test individual functions/methods
- Mock external dependencies
- Fast execution

**Example:**
```typescript
Deno.test("should register new user", async () => {
  const input = createTestUser();
  const result = await authService.register(input);
  assertExists(result.id);
});
```

### **Integration Tests**
- Test module interactions
- Use test database
- Slower but more realistic

**Example:**
```typescript
Deno.test("should create child with guardian", async () => {
  const child = await childrenService.createChild(input, context);
  const withGuardian = await addGuardian(child.id, guardianInput);
  assertEquals(withGuardian.guardians.length, 2);
});
```

---

## 📝 Writing Tests

### **Test Structure**
```typescript
import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { createTestUser } from "../../tests/test-utils.ts";

Deno.test({
  name: "Module Name",
  fn: async (t) => {
    // Setup
    await connectTestDatabase();
    
    await t.step("Feature 1", async (step) => {
      await step.test("should do something", async () => {
        // Test logic
      });
    });
    
    // Teardown
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
```

### **Common Assertions**
```typescript
import { 
  assertEquals,      // Equal values
  assertExists,      // Value exists
  assertRejects,     // Async function throws
  assertInstanceOf,  // Instance of class
  assertArrayIncludes, // Array includes value
} from "https://deno.land/std@0.224.0/testing/asserts.ts";
```

---

## 🎭 Using Mock Data

### **Import Mock Data**
```typescript
import { mockUsers, mockChildren } from "../../mocks/index.ts";

Deno.test("should use mock user", () => {
  const user = mockUsers.parent;
  assertEquals(user.role, "PARENT");
});
```

### **Create Test Data**
```typescript
import { createTestUser, createTestChild } from "../../tests/test-utils.ts";

Deno.test("should create with test data", async () => {
  const user = createTestUser();
  const child = createTestChild();
  
  // Use in tests
});
```

### **Customize Test Data**
```typescript
const user = createTestUser({
  name: "Custom Name",
  role: "DAYCARE_ADMIN",
});

const child = createTestChild({
  profile: {
    name: "Custom Child",
    gender: "FEMALE",
  },
  medical: {
    allergies: ["Susu"],
  },
});
```

---

## 🔧 Test Utilities

### **Database Helpers**
```typescript
import { 
  connectTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "../../tests/test-utils.ts";

Deno.test("should use test DB", async () => {
  await connectTestDatabase();
  // ... tests
  await teardownTestDatabase();
});
```

### **Context Helpers**
```typescript
import { createMockContext } from "../../tests/test-utils.ts";

Deno.test("should use mock context", async () => {
  const user = { id: "123", role: "PARENT" };
  const context = createMockContext(user);
  
  // Use in resolver tests
});
```

### **Assert Helpers**
```typescript
import { assertId, assertDate, assertExists } from "../../tests/test-utils.ts";

Deno.test("should validate response", () => {
  const response = { id: "65abc...", createdAt: "2026-01-01" };
  
  assertId(response.id);
  assertDate(response.createdAt);
  assertExists(response);
});
```

---

## 📊 Test Coverage

### **Generate Coverage Report**
```bash
# Run tests with coverage
deno test -A --coverage=cov_profile

# Generate HTML report
deno coverage cov_profile --html

# Generate LCOV report
deno coverage cov_profile --lcov > cov.lcov
```

### **View Coverage**
```bash
# Open HTML report
open coverage/index.html
```

---

## 🎯 Best Practices

### **1. Test Naming**
```typescript
// ✅ Good
Deno.test("should register new user successfully");
Deno.test("should fail when email already exists");

// ❌ Bad
Deno.test("test 1");
Deno.test("register test");
```

### **2. Test Isolation**
```typescript
// ✅ Good - Each test creates its own data
Deno.test("should create user", async () => {
  const user = createTestUser();
  // ...
});

// ❌ Bad - Tests depend on each other
let userId;
Deno.test("create user", async () => {
  userId = await createUser();
});
Deno.test("update user", async () => {
  await updateUser(userId); // Depends on previous test
});
```

### **3. Test Cleanup**
```typescript
// ✅ Good - Cleanup after tests
Deno.test({
  name: "should create data",
  fn: async () => {
    await connectTestDatabase();
    // ... tests
    await teardownTestDatabase();
  },
});
```

### **4. Test Data**
```typescript
// ✅ Good - Use test data generators
const user = createTestUser();
const child = createTestChild();

// ❌ Bad - Hardcoded data
const user = {
  name: "Test",
  email: "test@test.com",
  // ...
};
```

---

## 🐛 Debugging Tests

### **Run with Logs**
```bash
deno test -A --allow-read --allow-env --log-level=debug
```

### **Run Single Test**
```bash
deno test -A --filter "exact test name"
```

### **Watch Mode** (with deno nodemon equivalent)
```bash
# Install denon
deno install --allow-all --unstable https://deno.land/x/denon@2.5.0/denon.ts

# Run tests on file changes
denon test -A
```

---

## 📋 Test Checklist

Before committing tests:

- [ ] All tests pass
- [ ] Test coverage > 80%
- [ ] Test names are descriptive
- [ ] Tests are isolated
- [ ] Mock data is used appropriately
- [ ] Cleanup is performed
- [ ] Edge cases are covered
- [ ] Error cases are tested

---

## 🎓 Example Test Suite

```typescript
import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { createTestUser } from "../../tests/test-utils.ts";

Deno.test({
  name: "Complete Module Test",
  fn: async (t) => {
    await connectTestDatabase();
    
    // Create tests
    await t.step("Create", async () => {
      await t.test("should create successfully");
      await t.test("should fail with invalid data");
    });
    
    // Read tests
    await t.step("Read", async () => {
      await t.test("should get by ID");
      await t.test("should get all");
      await t.test("should fail for non-existent");
    });
    
    // Update tests
    await t.step("Update", async () => {
      await t.test("should update successfully");
      await t.test("should fail for non-existent");
    });
    
    // Delete tests
    await t.step("Delete", async () => {
      await t.test("should delete successfully");
      await t.test("should fail for non-existent");
    });
    
    await teardownTestDatabase();
  },
});
```

---

**Last Updated:** 2026-02-23  
**Version:** 1.0  
**Status:** Ready for testing
