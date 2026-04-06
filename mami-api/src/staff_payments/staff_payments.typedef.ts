export const typeDefs = `
  type StaffPayment {
    id: ObjectId!
    daycareId: ObjectId!
    staff: StaffRef!
    period: PaymentPeriod!
    daysWorked: Float!
    rate: Float!
    amount: Float!
    deductions: [Deduction!]!
    total: Float!
    status: StaffPaymentStatus!
    paidAt: Date
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }

  type StaffRef {
    userId: ObjectId!
    name: String!
    role: String!
  }

  type PaymentPeriod {
    start: Date!
    end: Date!
  }

  type Deduction {
    description: String!
    amount: Float!
  }

  enum StaffPaymentStatus {
    PENDING
    PAID
    CANCELLED
  }

  input StaffRefInput {
    userId: ObjectId!
    name: String!
    role: String!
  }

  input PaymentPeriodInput {
    start: Date!
    end: Date!
  }

  input DeductionInput {
    description: String!
    amount: Float!
  }

  input CreateStaffPaymentInput {
    daycareId: ObjectId!
    staff: StaffRefInput!
    period: PaymentPeriodInput!
    daysWorked: Float!
    rate: Float!
    amount: Float!
    deductions: [DeductionInput!]
    notes: String
  }

  input UpdateStaffPaymentInput {
    daysWorked: Float
    rate: Float
    amount: Float
    deductions: [DeductionInput!]
    status: StaffPaymentStatus
    notes: String
  }

  input MarkStaffPaymentAsPaidInput {
    paidAt: Date
  }

  extend type Query {
    "Get staff payments for a daycare"
    daycareStaffPayments(daycareId: ObjectId!, status: StaffPaymentStatus): [StaffPayment!]!
    
    "Get payments for a staff member"
    staffPayments(staffId: ObjectId!, status: StaffPaymentStatus): [StaffPayment!]!
    
    "Get staff payment by ID"
    staffPayment(id: ObjectId!): StaffPayment
    
    "Get pending payments"
    pendingStaffPayments(daycareId: ObjectId!): [StaffPayment!]!
  }

  extend type Mutation {
    "Create a new staff payment"
    createStaffPayment(input: CreateStaffPaymentInput!): StaffPayment!
    
    "Update staff payment"
    updateStaffPayment(id: ObjectId!, input: UpdateStaffPaymentInput!): StaffPayment!
    
    "Mark staff payment as paid"
    markStaffPaymentAsPaid(id: ObjectId!, input: MarkStaffPaymentAsPaidInput): StaffPayment!
    
    "Cancel staff payment"
    cancelStaffPayment(id: ObjectId!): StaffPayment!
  }
`;
