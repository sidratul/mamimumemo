export const typeDefs = `
  enum DaycareApprovalStatus {
    DRAFT
    SUBMITTED
    IN_REVIEW
    NEEDS_REVISION
    APPROVED
    REJECTED
    SUSPENDED
  }

  type DaycareLegalDocument {
    type: String!
    url: String!
    verified: Boolean!
  }

  type DaycareApprovalActor {
    userId: ObjectId
    name: String!
  }

  type DaycareApprovalHistory {
    status: DaycareApprovalStatus!
    note: String
    changedBy: DaycareApprovalActor!
    changedAt: Date!
  }

  type DaycareApproval {
    status: DaycareApprovalStatus!
    note: String
    reviewedBy: DaycareApprovalActor
    reviewedAt: Date
    history: [DaycareApprovalHistory!]!
  }

  type Daycare {
    _id: ObjectId!
    id: ObjectId!
    name: String!
    description: String
    address: String!
    city: String!
    owner: User!
    legalDocuments: [DaycareLegalDocument!]!
    submittedAt: Date
    approvedAt: Date
    isActive: Boolean!
    approval: DaycareApproval!
    createdAt: Date!
    updatedAt: Date!
  }

  input DaycareLegalDocumentInput {
    type: String!
    url: String!
    verified: Boolean
  }

  input RegisterDaycareOwnerInput {
    name: String!
    email: String!
    password: String!
    phone: String
  }

  input RegisterDaycareDataInput {
    name: String!
    description: String
    address: String!
    city: String!
    legalDocuments: [DaycareLegalDocumentInput!]
  }

  input RegisterDaycareInput {
    owner: RegisterDaycareOwnerInput!
    daycare: RegisterDaycareDataInput!
  }

  input UpdateDaycareDocumentsInput {
    legalDocuments: [DaycareLegalDocumentInput!]!
  }

  input UpdateDaycareApprovalInput {
    status: DaycareApprovalStatus!
    note: String
  }

  input PurgeDaycareInput {
    deleteOwner: Boolean
  }

  input DaycareFilterInput {
    statuses: [DaycareApprovalStatus!]
    ownerIds: [ObjectId!]
    cities: [String!]
    isActive: Boolean
    search: String
  }

  extend type Query {
    daycares(filter: DaycareFilterInput, sort: SortInput, pagination: PaginationInput): [Daycare!]!
    daycareCount(filter: DaycareFilterInput): Int!
    daycare(id: ObjectId!): Daycare
    myDaycareRegistration: Daycare
  }

  extend type Mutation {
    registerDaycare(input: RegisterDaycareInput!): ActionResponse!
    updateDaycareDocuments(id: ObjectId!, input: UpdateDaycareDocumentsInput!): ActionResponse!
    updateDaycareApprovalStatus(id: ObjectId!, input: UpdateDaycareApprovalInput!): ActionResponse!
    deleteDaycare(id: ObjectId!): ActionResponse!
    purgeDaycare(id: ObjectId!, input: PurgeDaycareInput): ActionResponse!
  }
`;
