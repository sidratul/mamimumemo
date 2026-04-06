/**
 * Unit Tests for Gallery Module
 * 
 * Run with: deno test -A src/gallery/gallery.test.ts
 */

import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert";
import { GalleryService } from "./gallery.service.ts";
import { connectTestDatabase, teardownTestDatabase, createMockContext } from "../../tests/test-utils.ts";
import { mockUsers, mockDaycares } from "../../mocks/index.ts";

const galleryService = new GalleryService();

Deno.test({
  name: "Gallery Module",
  fn: async (t) => {
    await connectTestDatabase();
    
    const adminContext = createMockContext({
      id: mockUsers.daycareAdmin._id,
      name: mockUsers.daycareAdmin.name,
      role: mockUsers.daycareAdmin.role,
    });
    
    await t.step("Create Gallery", async (step) => {
      await step.test("should create gallery successfully", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          childName: "Budi",
          photos: [
            "https://example.com/photo1.jpg",
            "https://example.com/photo2.jpg",
          ],
          caption: "Main bersama di taman",
          date: new Date().toISOString(),
          event: "Outdoor Play",
        };
        
        const result = await galleryService.createGallery(input, adminContext as any);
        
        assertExists(result.id);
        assertEquals(result.photos.length, 2);
        assertEquals(result.caption, "Main bersama di taman");
      });
      
      await step.test("should create general gallery (no child)", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          childName: "",
          photos: ["https://example.com/general.jpg"],
          caption: "Kegiatan daycare",
          date: new Date().toISOString(),
          event: "",
        };
        
        const result = await galleryService.createGallery(input, adminContext as any);
        
        assertEquals(result.childName, "");
      });
      
      await step.test("should fail without photos", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          childName: "Test",
          photos: [],
          caption: "Test",
          date: new Date().toISOString(),
          event: "",
        };
        
        await assertRejects(
          async () => await galleryService.createGallery(input, adminContext as any),
          Error,
          "Photos are required"
        );
      });
      
      await step.test("should fail with invalid photo URL", async () => {
        const input = {
          daycareId: mockDaycares.active._id,
          childName: "Test",
          photos: ["invalid-url"],
          caption: "Test",
          date: new Date().toISOString(),
          event: "",
        };
        
        await assertRejects(
          async () => await galleryService.createGallery(input, adminContext as any),
          Error,
          "Must be a valid URL"
        );
      });
    });
    
    await t.step("Get Gallery", async (step) => {
      await step.test("should get all gallery items", async () => {
        const gallery = await galleryService.getGallery(mockDaycares.active._id, undefined, undefined, adminContext as any);
        
        assertEquals(Array.isArray(gallery), true);
        assertEquals(gallery.length, 2);
      });
      
      await step.test("should get gallery for specific child", async () => {
        const gallery = await galleryService.getGallery(mockDaycares.active._id, "Budi", undefined, adminContext as any);
        
        assertEquals(Array.isArray(gallery), true);
        assertExists(gallery[0]);
      });
      
      await step.test("should get general gallery", async () => {
        const gallery = await galleryService.getGeneralGallery(mockDaycares.active._id, adminContext as any);
        
        assertEquals(Array.isArray(gallery), true);
      });
      
      await step.test("should get child gallery", async () => {
        const gallery = await galleryService.getChildGallery(mockDaycares.active._id, "Budi", adminContext as any);
        
        assertEquals(Array.isArray(gallery), true);
        assertEquals(gallery[0].childName, "Budi");
      });
    });
    
    await t.step("Update Gallery", async (step) => {
      const gallery = await galleryService.getGallery(mockDaycares.active._id, undefined, undefined, adminContext as any);
      const galleryId = gallery[0].id;
      
      await step.test("should update gallery successfully", async () => {
        const input = {
          caption: "Updated caption",
          event: "Updated event",
        };
        
        const updated = await galleryService.updateGallery(galleryId, input, adminContext as any);
        
        assertEquals(updated.caption, "Updated caption");
        assertEquals(updated.event, "Updated event");
      });
      
      await step.test("should update photos", async () => {
        const input = {
          photos: [
            "https://example.com/new1.jpg",
            "https://example.com/new2.jpg",
            "https://example.com/new3.jpg",
          ],
        };
        
        const updated = await galleryService.updateGallery(galleryId, input, adminContext as any);
        
        assertEquals(updated.photos.length, 3);
      });
    });
    
    await t.step("Delete Gallery", async (step) => {
      const gallery = await galleryService.getGallery(mockDaycares.active._id, undefined, undefined, adminContext as any);
      const galleryId = gallery[0].id;
      
      await step.test("should delete gallery successfully", async () => {
        const result = await galleryService.deleteGallery(galleryId, adminContext as any);
        
        assertEquals(result, true);
      });
      
      await step.test("should not show after delete", async () => {
        const gallery = await galleryService.getGallery(mockDaycares.active._id, undefined, undefined, adminContext as any);
        
        assertEquals(gallery.length, 1);
      });
    });
    
    await teardownTestDatabase();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
