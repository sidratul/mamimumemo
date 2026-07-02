export const typeDefs = `
  type DaycareBrandingConfig {
    primaryColor: String
    secondaryColor: String
    logoUrl: String
  }

  type DaycareActivityCategoryConfig {
    categoryId: ObjectId!
    label: String
    color: String
    icon: String
    enabled: Boolean!
    sortOrder: Int
  }

  type DaycarePreferencesConfig {
    timezone: String!
    locale: String!
  }

  type DaycareConfig {
    daycareId: ObjectId!
    schemaVersion: Int!
    branding: DaycareBrandingConfig!
    activityCategories: [DaycareActivityCategoryConfig!]!
    preferences: DaycarePreferencesConfig!
    createdAt: Date
    updatedAt: Date
  }

  input UpdateDaycareBrandingInput {
    primaryColor: String
    secondaryColor: String
    logoUrl: String
  }

  input UpdateDaycareActivityCategoryInput {
    label: String
    color: String
    icon: String
    enabled: Boolean
    sortOrder: Int
  }

  extend type Query {
    daycareConfig(daycareId: ObjectId!): DaycareConfig!
  }

  extend type Mutation {
    updateDaycareBranding(daycareId: ObjectId!, input: UpdateDaycareBrandingInput!): DaycareConfig!
    updateDaycareActivityCategory(
      daycareId: ObjectId!
      categoryId: ObjectId!
      input: UpdateDaycareActivityCategoryInput!
    ): DaycareConfig!
  }
`;
