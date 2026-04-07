/**
 * Unit Tests for Authentication Module
 * 
 * Run with: deno test -A src/auth/auth.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "@std/assert";
import { AuthService } from "./auth.service.ts";
import { UsersService } from "@/users";
import UserModel from "@/users/users.schema.ts";
import { clearTestDatabase, connectTestDatabase, teardownTestDatabase, createMockContext, createTestUser } from "../../tests/test-utils.ts";

const authService = new AuthService();
const usersService = new UsersService();

// Test setup
Deno.test({
  name: "Auth Module",
  fn: async (t) => {
    await connectTestDatabase();
    await clearTestDatabase();
    
    await t.step("Registration", async (step) => {
      await step.step("should register new user successfully", async () => {
        const input = createTestUser();
        
        const user = await usersService.createUser(input);
        
        assertExists(user.id);
      });
      
      await step.step("should fail when email already exists", async () => {
        const input = createTestUser();
        
        // First registration
        await usersService.createUser(input);
        
        // Second registration with same email
        await assertRejects(
          async () => await usersService.createUser(input),
          Error,
          "sudah terdaftar"
        );
      });
      
      await step.step("should fail with invalid email", async () => {
        const input = {
          ...createTestUser(),
          email: "invalid-email",
        };
        
        await assertRejects(
          async () => await usersService.createUser(input),
          Error,
          "Invalid email"
        );
      });
      
      await step.step("should fail with short password", async () => {
        const input = {
          ...createTestUser(),
          password: "123", // Less than 6 characters
        };
        
        await assertRejects(
          async () => await usersService.createUser(input),
          Error,
          "Password must be at least 6 characters"
        );
      });
    });
    
    await t.step("Login", async (step) => {
      await step.step("should login successfully", async () => {
        const input = createTestUser();
        
        // Register first
        await usersService.createUser(input);
        
        // Login
        const result = await authService.login(input);
        
        assertExists(result.accessToken);
        assertExists(result.refreshToken);
        assertEquals(typeof result.accessToken, "string");
        assertEquals(typeof result.refreshToken, "string");
      });
      
      await step.step("should fail with wrong password", async () => {
        const input = createTestUser();
        
        // Register first
        await usersService.createUser(input);
        
        // Login with wrong password
        await assertRejects(
          async () => await authService.login({ ...input, password: "wrong-password" }),
          Error,
          "Kredensial tidak valid"
        );
      });
      
      await step.step("should fail with non-existent email", async () => {
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
      await step.step("should get user profile", async () => {
        const input = createTestUser();
        await usersService.createUser(input);        
        const user = await UserModel.findOne({ email: input.email }).exec();
        assertExists(user);

        const context = createMockContext(user);
        
        const profile = await authService.getProfile(context);
        
        assertExists(profile._id);
        assertEquals(profile.name, input.name);
        assertEquals(profile.email, input.email);
        assertEquals(profile.role, input.role);
      });
      
      await step.step("should fail without authentication", async () => {
        const context = createMockContext();
        
        await assertRejects(
          async () => await authService.getProfile(context),
          Error,
          "Authentication required"
        );
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
