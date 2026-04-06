export const typeDefs = `
  type Invoice {
    id: ObjectId!
    daycareId: ObjectId!
    contractId: ObjectId!
    parent: ParentRef!
    period: InvoicePeriod!
    items: [InvoiceItem!]!
    total: Float!
    status: InvoiceStatus!
    dueDate: Date!
    paidAt: Date
    notes: String
    isOverdue: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type ParentRef {
    userId: ObjectId!
    name: String!
    email: String!
  }

  type InvoicePeriod {
    start: Date!
    end: Date!
  }

  type InvoiceItem {
    description: String!
    quantity: Float!
    unitPrice: Float!
    subtotal: Float!
  }

  enum InvoiceStatus {
    PENDING
    PAID
    OVERDUE
    CANCELLED
  }

  input ParentRefInput {
    userId: ObjectId!
    name: String!
    email: String!
  }

  input InvoicePeriodInput {
    start: Date!
    end: Date!
  }

  input InvoiceItemInput {
    description: String!
    quantity: Float!
    unitPrice: Float!
    subtotal: Float!
  }

  input CreateInvoiceInput {
    daycareId: ObjectId!
    contractId: ObjectId!
    parent: ParentRefInput!
    period: InvoicePeriodInput!
    items: [InvoiceItemInput!]!
    total: Float!
    dueDate: Date!
    notes: String
  }

  input UpdateInvoiceInput {
    items: [InvoiceItemInput!]
    total: Float
    status: InvoiceStatus
    dueDate: Date
    notes: String
  }

  input MarkAsPaidInput {
    paidAt: Date
  }

  extend type Query {
    "Get invoices for a daycare"
    daycareInvoices(daycareId: ObjectId!, status: InvoiceStatus): [Invoice!]!
    
    "Get invoices for a parent"
    parentInvoices(parentId: ObjectId!, status: InvoiceStatus): [Invoice!]!
    
    "Get invoice by ID"
    invoice(id: ObjectId!): Invoice
    
    "Get overdue invoices"
    overdueInvoices(daycareId: ObjectId!): [Invoice!]!
  }

  extend type Mutation {
    "Create a new invoice"
    createInvoice(input: CreateInvoiceInput!): Invoice!
    
    "Update invoice"
    updateInvoice(id: ObjectId!, input: UpdateInvoiceInput!): Invoice!
    
    "Mark invoice as paid"
    markInvoiceAsPaid(id: ObjectId!, input: MarkAsPaidInput): Invoice!
    
    "Cancel invoice"
    cancelInvoice(id: ObjectId!): Invoice!
  }
`;
