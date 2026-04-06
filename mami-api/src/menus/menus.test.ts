/**
 * Unit Tests for Menus Module
 * 
 * Run with: deno test -A src/menus/menus.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { MenusService } from "./menus.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const menusService = new MenusService();

Deno.test({
  name: "Menus Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    await t.step("Create Menu", async (step) => {
      await step.test("should create menu successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          date: new Date().toISOString(),
          meals: [
            {
              type: "BREAKFAST",
              menu: "Nasi goreng ayam",
              ingredients: ["Nasi", "Ayam", "Telur", "Wortel"],
              allergens: ["Telur"],
              notes: "Pedas sedang",
            },
            {
              type: "LUNCH",
              menu: "Sup ikan",
              ingredients: ["Ikan", "Tahu", "Sayuran"],
              allergens: ["Ikan"],
              notes: "",
            },
          ],
        };
        
        const result = await menusService.createMenu(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.meals.length, 2);
      });
      
      await step.test("should create menu with allergens", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          date: new Date().toISOString(),
          meals: [
            {
              type: "SNACK",
              menu: "Buah potong",
              ingredients: ["Apel", "Jeruk", "Anggur"],
              allergens: [],
              notes: "Buah segar",
            },
          ],
        };
        
        const result = await menusService.createMenu(input, adminContext as any);
        
        assertEquals(result.meals[0].allergens.length, 0);
      });
      
      await step.test("should fail without meals", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          date: new Date().toISOString(),
          meals: [],
        };
        
        await assertRejects(
          async () => await menusService.createMenu(input, adminContext as any),
          Error,
          "Meals are required"
        );
      });
    });
    
    await t.step("Get Menu", async (step) => {
      await step.test("should get menu for date", async () => {
        const menu = await menusService.getMenu(mockDaycares.active._id, new Date(), adminContext as any);
        
        assertExists(menu);
        assertEquals(menu.meals.length, 2);
      });
      
      await step.test("should get menus for date range", async () => {
        const menus = await menusService.getMenus(
          mockDaycares.active._id,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date(),
          adminContext as any
        );
        
        assertEquals(Array.isArray(menus), true);
        assertExists(menus[0]);
      });
      
      await step.test("should get today's menu", async () => {
        const menu = await menusService.getTodayMenu(mockDaycares.active._id, adminContext as any);
        
        assertExists(menu);
      });
    });
    
    await t.step("Update Menu", async (step) => {
      const menu = await menusService.getMenu(mockDaycares.active._id, new Date(), adminContext as any);
      
      if (menu) {
        await step.test("should update menu successfully", async () => {
          const input = {
            meals: [
              {
                type: "BREAKFAST",
                menu: "Updated menu",
                ingredients: ["Updated"],
                allergens: [],
                notes: "Updated notes",
              },
            ],
          };
          
          const updated = await menusService.updateMenu(menu.id, input, adminContext as any);
          
          assertEquals(updated.meals[0].menu, "Updated menu");
        });
      }
    });
    
    await t.step("Delete Menu", async (step) => {
      const menu = await menusService.getMenu(mockDaycares.active._id, new Date(), adminContext as any);
      
      if (menu) {
        await step.test("should delete menu successfully", async () => {
          const result = await menusService.deleteMenu(menu.id, adminContext as any);
          
          assertEquals(result, true);
        });
        
        await step.test("should return null after delete", async () => {
          const deleted = await menusService.getMenu(mockDaycares.active._id, new Date(), adminContext as any);
          
          assertEquals(deleted, null);
        });
      }
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
