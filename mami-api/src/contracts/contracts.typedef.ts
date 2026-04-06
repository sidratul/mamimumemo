export const typeDefs = `
  type Contract {
    id: ObjectId!
    daycareId: ObjectId!
    parentId: ObjectId!
    childIds: [ObjectId!]!
    serviceType: ServiceType!
    price: Float!
    startDate: Date!
    endDate: Date!
    status: ContractStatus!
    terms: String
    isExpired: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  enum ServiceType {
    DAILY
    WEEKLY
    MONTHLY
  }

  enum ContractStatus {
    ACTIVE
    EXPIRED
    TERMINATED
  }

  input CreateContractInput {
    daycareId: ObjectId!
    parentId: ObjectId!
    childIds: [ObjectId!]!
    serviceType: ServiceType!
    price: Float!
    startDate: Date!
    endDate: Date!
    terms: String
  }

  input UpdateContractInput {
    serviceType: ServiceType
    price: Float
    startDate: Date
    endDate: Date
    status: ContractStatus
    terms: String
  }

  extend type Query {
    "Get contracts for a daycare"
    daycareContracts(daycareId: ObjectId!, status: ContractStatus): [Contract!]!
    
    "Get contracts for a parent"
    parentContracts(parentId: ObjectId!, status: ContractStatus): [Contract!]!
    
    "Get contract by ID"
    contract(id: ObjectId!): Contract
    
    "Get active contracts only"
    activeContracts(daycareId: ObjectId!): [Contract!]!
  }

  extend type Mutation {
    "Create a new contract"
    createContract(input: CreateContractInput!): Contract!
    
    "Update contract"
    updateContract(id: ObjectId!, input: UpdateContractInput!): Contract!
    
    "Update contract status"
    updateContractStatus(id: ObjectId!, status: ContractStatus!): Contract!
    
    "Terminate contract"
    terminateContract(id: ObjectId!): Contract!
  }
`;
