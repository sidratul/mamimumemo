/**
 * Unit Tests for Authentication Module
 * 
 * Run with: deno test -A src/auth/auth.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { AuthService } from "./auth.service.ts";
import { connectTestDatabase, teardownTestDatabase, createTestUser } from "../../tests/test-utils.ts";
import { mockUsers } from "../../mocks/index.ts";

const authService = new AuthService();

// Test setup
Deno.test({
  name: "Auth Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    await t.step("Registration", async (step) => {
      await step.test("should register new user successfully", async () => {
        const input = createTestUser();
        
        const result = await authService.register(input);
        
        assertExists(result.id);
        assertEquals(result.message, "Registrasi berhasil");
      });
      
      await step.test("should fail when email already exists", async () => {
        const input = createTestUser();
        
        // First registration
        await authService.register(input);
        
        // Second registration with same email
        await assertRejects(
          async () => await authService.register(input),
          Error,
          "Email sudah terdaftar"
        );
      });
      
      await step.test("should fail with invalid email", async () => {
        const input = {
          ...createTestUser(),
          email: "invalid-email",
        };
        
        await assertRejects(
          async () => await authService.register(input),
          Error,
          "Invalid email"
        );
      });
      
      await step.test("should fail with short password", async () => {
        const input = {
          ...createTestUser(),
          password: "123", // Less than 6 characters
        };
        
        await assertRejects(
          async () => await authService.register(input),
          Error,
          "Password must be at least 6 characters"
        );
      });
    });
    
    await t.step("Login", async (step) => {
      await step.test("should login successfully", async () => {
        const input = createTestUser();
        
        // Register first
        await authService.register(input);
        
        // Login
        const result = await authService.login(input);
        
        assertExists(result.accessToken);
        assertExists(result.refreshToken);
        assertEquals(typeof result.accessToken, "string");
        assertEquals(typeof result.refreshToken, "string");
      });
      
      await step.test("should fail with wrong password", async () => {
        const input = createTestUser();
        
        // Register first
        await authService.register(input);
        
        // Login with wrong password
        await assertRejects(
          async () => await authService.login({ ...input, password: "wrong-password" }),
          Error,
          "Kredensial tidak valid"
        );
      });
      
      await step.test("should fail with non-existent email", async () => {
        const input = {
          email: "nonexistent@example.com",
          password: "password123",
        };
        
        await assertRejects(
          async () => await authService.login(input),
          Error,
          "Kredensial tidak valid"
        );
      });
    });
    
    await t.step("Profile", async (step) => {
      await step.test("should get user profile", async () => {
        // Create test user
        const input = createTestUser();
        await authService.register(input);
        
        // Login to ensure auth flow works before reading profile
        const loginResult = await authService.login(input);
        assertExists(loginResult.accessToken);
        
        // Create mock context with token
        const context = {
          user: {
            id: mockUsers.parent._id,
            name: mockUsers.parent.name,
            email: mockUsers.parent.email,
            role: mockUsers.parent.role,
          },
        };
        
        const profile = await authService.getProfile(context as any);
        
        assertExists(profile._id);
        assertEquals(profile.name, mockUsers.parent.name);
        assertEquals(profile.email, mockUsers.parent.email);
        assertEquals(profile.role, mockUsers.parent.role);
      });
      
      await step.test("should fail without authentication", async () => {
        const context = { user: null };
        
        await assertRejects(
          async () => await authService.getProfile(context as any),
          Error,
          "Akses tidak sah"
        );
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
