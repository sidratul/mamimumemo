import { GalleryService } from "./gallery.service.ts";
import { createGalleryInput, updateGalleryInput } from "./gallery.validation.ts";
import { AppContext } from "#shared/config/context.ts";

const galleryService = new GalleryService();

export const resolvers = {
  Query: {
    gallery: (
      _: unknown,
      { daycareId, childName, limit }: { daycareId: string; childName?: string; limit?: number },
      context: AppContext
    ) => {
      return galleryService.getGallery(daycareId, childName, limit || 20, context);
    },
    galleryItem: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return galleryService.getGalleryItem(id, context);
    },
    generalGallery: (
      _: unknown,
      { daycareId }: { daycareId: string },
      context: AppContext
    ) => {
      return galleryService.getGeneralGallery(daycareId, 20, context);
    },
    childGallery: (
      _: unknown,
      { daycareId, childName }: { daycareId: string; childName: string },
      context: AppContext
    ) => {
      return galleryService.getChildGallery(daycareId, childName, 20, context);
    },
  },
  Mutation: {
    createGallery: (
      _: unknown,
      { input }: { input: typeof createGalleryInput._type },
      context: AppContext
    ) => {
      createGalleryInput.parse(input);
      return galleryService.createGallery(input, context);
    },
    updateGallery: (
      _: unknown,
      { id, input }: { id: string; input: typeof updateGalleryInput._type },
      context: AppContext
    ) => {
      updateGalleryInput.parse(input);
      return galleryService.updateGallery(id, input, context);
    },
    deleteGallery: (
      _: unknown,
      { id }: { id: string },
      context: AppContext
    ) => {
      return galleryService.deleteGallery(id, context);
    },
  },
};
