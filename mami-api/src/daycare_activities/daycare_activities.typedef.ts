export const typeDefs = `
  type DaycareActivity {
    id: ObjectId!
    daycareId: ObjectId!
    sourceMasterActivityId: ObjectId
    sourceMasterVersion: Int
    name: String!
    description: String
    category: String!
    defaultDuration: Int!
    icon: String
    color: String
    active: Boolean!
    fieldConfig: FieldConfig!
    createdBy: CreatedBy!
    createdAt: Date
    updatedAt: Date
  }

  input CreateDaycareActivityInput {
    daycareId: ObjectId!
    name: String!
    description: String
    category: String!
    defaultDuration: Int
    icon: String
    color: String
    fieldConfig: FieldConfigInput
  }

  input UpdateDaycareActivityInput {
    name: String
    description: String
    category: String
    defaultDuration: Int
    icon: String
    color: String
    active: Boolean
    fieldConfig: FieldConfigInput
  }

  input AdoptMasterActivityInput {
    daycareId: ObjectId!
    masterActivityId: ObjectId!
  }

  extend type Query {
    daycareActivities(daycareId: ObjectId!, active: Boolean): [DaycareActivity!]!
    daycareActivity(id: ObjectId!): DaycareActivity!
  }

  extend type Mutation {
    createDaycareActivity(input: CreateDaycareActivityInput!): DaycareActivity!
    adoptMasterActivity(input: AdoptMasterActivityInput!): DaycareActivity!
    updateDaycareActivity(id: ObjectId!, input: UpdateDaycareActivityInput!): DaycareActivity!
    deactivateDaycareActivity(id: ObjectId!): DaycareActivity!
  }
`;
