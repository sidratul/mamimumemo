export const typeDefs = `
  enum ActivityCategoryBehaviorType {
    MEAL
    DRINK
    NAP
    TOILETING
    HYGIENE
    MEDICATION
    CARE
    PLAY
    LEARNING
    GENERIC
  }

  type ActivityCategoryDefinition {
    _id: ObjectId!
    id: ObjectId!
    code: String!
    defaultLabel: String!
    label: String!
    behaviorType: ActivityCategoryBehaviorType!
    defaultColor: String
    color: String
    defaultIcon: String
    icon: String
    defaultFieldConfig: FieldConfig!
    sortOrder: Int!
    resolvedSortOrder: Int!
    isActive: Boolean!
    enabled: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateActivityCategoryDefinitionInput {
    code: String!
    defaultLabel: String!
    behaviorType: ActivityCategoryBehaviorType
    defaultColor: String
    defaultIcon: String
    defaultFieldConfig: FieldConfigInput
    sortOrder: Int
  }

  input UpdateActivityCategoryDefinitionInput {
    defaultLabel: String
    behaviorType: ActivityCategoryBehaviorType
    defaultColor: String
    defaultIcon: String
    defaultFieldConfig: FieldConfigInput
    sortOrder: Int
    isActive: Boolean
  }

  extend type Query {
    activityCategories(daycareId: ObjectId, active: Boolean): [ActivityCategoryDefinition!]!
  }

  extend type Mutation {
    createActivityCategory(input: CreateActivityCategoryDefinitionInput!): ActivityCategoryDefinition!
    updateActivityCategory(id: ObjectId!, input: UpdateActivityCategoryDefinitionInput!): ActivityCategoryDefinition!
  }
`;
