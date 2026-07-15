import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers as healthResolvers } from "@/health/health.resolver.ts";
import { typeDefs as healthTypeDefs } from "@/health/health.typedef.ts";
import { resolvers as AuthResolvers } from "@/auth/auth.resolver.ts";
import { typeDefs as AuthTypeDefs } from "@/auth/auth.typedef.ts";
import { resolvers as UsersResolvers } from "@/users/users.resolver.ts";
import { typeDefs as UsersTypeDefs } from "@/users/users.typedef.ts";
import { resolvers as ChildrenResolvers } from "@/children/children.resolver.ts";
import { typeDefs as ChildrenTypeDefs } from "@/children/children.typedef.ts";
import { resolvers as MedicalRecordsResolvers } from "@/medical_records/medical_records.resolver.ts";
import { typeDefs as MedicalRecordsTypeDefs } from "@/medical_records/medical_records.typedef.ts";
import { resolvers as ActivitiesResolvers } from "@/activities/activities.resolver.ts";
import { typeDefs as ActivitiesTypeDefs } from "@/activities/activities.typedef.ts";
import { resolvers as ParentsResolvers } from "@/parents/parents.resolver.ts";
import { typeDefs as ParentsTypeDefs } from "@/parents/parents.typedef.ts";
import { resolvers as ChildrenDaycareResolvers } from "@/children_daycare/children_daycare.resolver.ts";
import { typeDefs as ChildrenDaycareTypeDefs } from "@/children_daycare/children_daycare.typedef.ts";
import { resolvers as ContractsResolvers } from "@/contracts/contracts.resolver.ts";
import { typeDefs as ContractsTypeDefs } from "@/contracts/contracts.typedef.ts";
import { resolvers as MasterActivitiesResolvers } from "@/master_activities/master_activities.resolver.ts";
import { typeDefs as MasterActivitiesTypeDefs } from "@/master_activities/master_activities.typedef.ts";
import { resolvers as DaycareActivitiesResolvers } from "@/daycare_activities/daycare_activities.resolver.ts";
import { typeDefs as DaycareActivitiesTypeDefs } from "@/daycare_activities/daycare_activities.typedef.ts";
import { resolvers as DailyCareRecordsResolvers } from "@/daily_care_records/daily_care_records.resolver.ts";
import { typeDefs as DailyCareRecordsTypeDefs } from "@/daily_care_records/daily_care_records.typedef.ts";
import { resolvers as ScheduleTemplatesResolvers } from "@/schedule_templates/schedule_templates.resolver.ts";
import { typeDefs as ScheduleTemplatesTypeDefs } from "@/schedule_templates/schedule_templates.typedef.ts";
import { resolvers as WeeklySchedulesResolvers } from "@/weekly_schedules/weekly_schedules.resolver.ts";
import { typeDefs as WeeklySchedulesTypeDefs } from "@/weekly_schedules/weekly_schedules.typedef.ts";
import { resolvers as InvoicesResolvers } from "@/invoices/invoices.resolver.ts";
import { typeDefs as InvoicesTypeDefs } from "@/invoices/invoices.typedef.ts";
import { resolvers as StaffPaymentsResolvers } from "@/staff_payments/staff_payments.resolver.ts";
import { typeDefs as StaffPaymentsTypeDefs } from "@/staff_payments/staff_payments.typedef.ts";
import { resolvers as MenusResolvers } from "@/menus/menus.resolver.ts";
import { typeDefs as MenusTypeDefs } from "@/menus/menus.typedef.ts";
import { resolvers as GalleryResolvers } from "@/gallery/gallery.resolver.ts";
import { typeDefs as GalleryTypeDefs } from "@/gallery/gallery.typedef.ts";
import { resolvers as NotificationsResolvers } from "@/notifications/notifications.resolver.ts";
import { typeDefs as NotificationsTypeDefs } from "@/notifications/notifications.typedef.ts";
import { resolvers as DaycareResolvers } from "@/daycare/daycare.resolver.ts";
import { typeDefs as DaycareTypeDefs } from "@/daycare/daycare.typedef.ts";
import { resolvers as DaycareMembershipResolvers } from "@/daycare_memberships/daycare_memberships.resolver.ts";
import { typeDefs as DaycareMembershipTypeDefs } from "@/daycare_memberships/daycare_memberships.typedef.ts";
import { resolvers as ActivityCategoryResolvers } from "@/activity_categories/activity_categories.resolver.ts";
import { typeDefs as ActivityCategoryTypeDefs } from "@/activity_categories/activity_categories.typedef.ts";
import { resolvers as DaycareConfigResolvers } from "@/daycare_configs/daycare_configs.resolver.ts";
import { typeDefs as DaycareConfigTypeDefs } from "@/daycare_configs/daycare_configs.typedef.ts";
// SCAFFOLD_IMPORT
import { scalarResolvers } from "#shared/scalar/scalar.resolver.ts";
import { sharedTypeDefs, baseTypeDefs } from "#shared/types/shared.type.ts";
import { connectToDatabase } from "#shared/database/mongo.ts";
import { createAuthContext, getAuthenticatedUserFromRequest } from "#shared/config/auth-context.ts";
import { AppContext } from "#shared/config/context.ts";
import UploadsService from "@/uploads/uploads.service.ts";

// Connect to the database
await connectToDatabase();

const resolveMongoId = (source: { id?: unknown; _id?: unknown }) => {
  if (source.id) {
    return source.id;
  }

  if (source._id && typeof source._id === "object" && "toString" in source._id) {
    return source._id.toString();
  }

  return source._id ?? null;
};

const mongoIdResolvers = {
  Activity: { id: resolveMongoId },
  ActivityCategoryDefinition: { id: resolveMongoId },
  Child: { id: resolveMongoId },
  ChildrenDaycare: { id: resolveMongoId },
  Contract: { id: resolveMongoId },
  DailyCareRecord: { id: resolveMongoId },
  Daycare: { id: resolveMongoId },
  DaycareActivity: { id: resolveMongoId },
  DaycareMembership: { id: resolveMongoId },
  DaycareMembershipDaycare: { id: resolveMongoId },
  Gallery: { id: resolveMongoId },
  Invoice: { id: resolveMongoId },
  MasterActivity: { id: resolveMongoId },
  MedicalRecord: { id: resolveMongoId },
  Menu: { id: resolveMongoId },
  Notification: { id: resolveMongoId },
  Parent: { id: resolveMongoId },
  ScheduleTemplate: { id: resolveMongoId },
  StaffPayment: { id: resolveMongoId },
  User: { id: resolveMongoId },
  WeeklySchedule: { id: resolveMongoId },
};

const schema = makeExecutableSchema({
  resolvers: [
    scalarResolvers,
    mongoIdResolvers,
    healthResolvers,
    AuthResolvers,
    UsersResolvers,
    ChildrenResolvers,
    MedicalRecordsResolvers,
    ActivitiesResolvers,
    ParentsResolvers,
    ChildrenDaycareResolvers,
    ContractsResolvers,
    MasterActivitiesResolvers,
    DaycareActivitiesResolvers,
    DailyCareRecordsResolvers,
    ScheduleTemplatesResolvers,
    WeeklySchedulesResolvers,
    InvoicesResolvers,
    StaffPaymentsResolvers,
    MenusResolvers,
    GalleryResolvers,
    NotificationsResolvers,
    DaycareResolvers,
    DaycareMembershipResolvers,
    ActivityCategoryResolvers,
    DaycareConfigResolvers,
    // SCAFFOLD_RESOLVER
  ],
  typeDefs: [
    ...sharedTypeDefs,
    baseTypeDefs,
    healthTypeDefs,
    AuthTypeDefs,
    UsersTypeDefs,
    ChildrenTypeDefs,
    MedicalRecordsTypeDefs,
    ActivitiesTypeDefs,
    ParentsTypeDefs,
    ChildrenDaycareTypeDefs,
    ContractsTypeDefs,
    MasterActivitiesTypeDefs,
    DaycareActivitiesTypeDefs,
    DailyCareRecordsTypeDefs,
    ScheduleTemplatesTypeDefs,
    WeeklySchedulesTypeDefs,
    InvoicesTypeDefs,
    StaffPaymentsTypeDefs,
    MenusTypeDefs,
    GalleryTypeDefs,
    NotificationsTypeDefs,
    DaycareTypeDefs,
    DaycareMembershipTypeDefs,
    ActivityCategoryTypeDefs,
    DaycareConfigTypeDefs,
    // SCAFFOLD_TYPEDEF
  ],
});

const yoga = createYoga({
  schema,
  maskedErrors: false,
  context: async (ctx) => {
    const { user } = await createAuthContext(ctx);
    return new AppContext(user);
  },
});

const port = Number(Deno.env.get("PORT") ?? 8000);
const uploadsService = new UploadsService();

Deno.serve({
  handler: async (request) => {
    const url = new URL(request.url);

    if (url.pathname === "/uploads" && request.method === "POST") {
      const user = await getAuthenticatedUserFromRequest(request);
      if (!user) {
        return new Response(JSON.stringify({ message: "Authentication required." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const formData = await request.formData();
      const file = formData.get("file");
      const folder = String(formData.get("folder") || "").trim();
      const filename = String(formData.get("filename") || "").trim() || undefined;
      const visibilityValue = String(formData.get("visibility") || "public").trim();
      const visibility = visibilityValue === "private" ? "private" : "public";

      if (!(file instanceof File) || !folder) {
        return new Response(JSON.stringify({ message: "file dan folder wajib diisi." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const uploaded = await uploadsService.uploadFile({ file, folder, filename, visibility });
        return new Response(JSON.stringify(uploaded), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload gagal.";
        return new Response(JSON.stringify({ message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return yoga.fetch(request);
  },
  port,
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}${yoga.graphqlEndpoint}`);
  },
});
