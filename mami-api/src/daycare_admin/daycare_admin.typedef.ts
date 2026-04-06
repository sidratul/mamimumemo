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

  type DaycareOwnerRef {
    userId: ObjectId!
    name: String!
    email: String!
    phone: String
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
    id: ObjectId!
    name: String!
    description: String
    address: String!
    city: String!
    owner: DaycareOwnerRef!
    legalDocuments: [DaycareLegalDocument!]!
    submittedAt: Date
    approvedAt: Date
    isActive: Boolean!
    approval: DaycareApproval!
    approvalStatus: DaycareApprovalStatus!
    approvalNote: String
    ownerName: String!
    ownerEmail: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type SystemDaycareListResponse {
    items: [Daycare!]!
    total: Int!
  }

  input DaycareLegalDocumentInput {
    type: String!
    url: String!
    verified: Boolean
  }

  input CreateDaycareDraftInput {
    name: String!
    description: String
    address: String!
    city: String!
    legalDocuments: [DaycareLegalDocumentInput!]
  }

  input UpdateDaycareApprovalInput {
    status: DaycareApprovalStatus!
    note: String
  }

  extend type Query {
    systemDaycares(
      status: DaycareApprovalStatus
      search: String
      limit: Int
      offset: Int
    ): SystemDaycareListResponse!
    systemDaycare(id: ObjectId!): Daycare
    myDaycareRegistration: Daycare
  }

  extend type Mutation {
    createDaycareDraft(input: CreateDaycareDraftInput!): Daycare!
    submitDaycareRegistration(id: ObjectId!): Daycare!
    updateDaycareApprovalStatus(id: ObjectId!, input: UpdateDaycareApprovalInput!): Daycare!
  }
`;
