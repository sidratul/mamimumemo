import { GalleryRepository } from "./gallery.repository.ts";
import { createGalleryInput, updateGalleryInput } from "./gallery.validation.ts";
import { GraphQLError } from "graphql";
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { MESSAGES } from "#shared/enums/constant.ts";
import { UserRole } from "#shared/enums/enum.ts";

const galleryRepository = new GalleryRepository();

export class GalleryService {
  async getGallery(
    daycareId: string,
    childName: string | undefined,
    limit: number,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await galleryRepository.findByDaycare(daycareId, childName, limit);
  }

  async getGalleryItem(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await galleryRepository.findById(id);
  }

  async getGeneralGallery(daycareId: string, limit: number, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await galleryRepository.findGeneral(daycareId, limit);
  }

  async getChildGallery(
    daycareId: string,
    childName: string,
    limit: number,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    return await galleryRepository.findByChild(daycareId, childName, limit);
  }

  async createGallery(
    input: typeof createGalleryInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const allowedRoles = [
      UserRole.DAYCARE_ADMIN,
      UserRole.DAYCARE_OWNER,
      UserRole.SUPER_ADMIN,
      UserRole.DAYCARE_SITTER,
    ];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    const galleryData = {
      ...input,
      date: new Date(input.date),
      uploadedBy: {
        userId: context.user.id,
        name: context.user.name,
      },
    };

    return await galleryRepository.create(galleryData);
  }

  async updateGallery(
    id: string,
    input: typeof updateGalleryInput._type,
    context: AppContext
  ) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const gallery = await galleryRepository.findById(id);
    if (!gallery) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const allowedRoles = [
      UserRole.DAYCARE_ADMIN,
      UserRole.DAYCARE_OWNER,
      UserRole.SUPER_ADMIN,
      UserRole.DAYCARE_SITTER,
    ];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await galleryRepository.update(id, input);
  }

  async deleteGallery(id: string, context: AppContext) {
    isAuthenticated(context);
    if (!context.user) {
      throw new GraphQLError(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const gallery = await galleryRepository.findById(id);
    if (!gallery) {
      throw new GraphQLError(MESSAGES.GENERAL.NOT_FOUND);
    }

    const allowedRoles = [
      UserRole.DAYCARE_ADMIN,
      UserRole.DAYCARE_OWNER,
      UserRole.SUPER_ADMIN,
    ];
    if (!allowedRoles.includes(context.user.role as UserRole)) {
      throw new GraphQLError(MESSAGES.AUTH.FORBIDDEN);
    }

    return await galleryRepository.delete(id);
  }
}
