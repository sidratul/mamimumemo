export const typeDefs = `
  type MedicalRecord {
    id: ObjectId!
    childId: ObjectId!
    type: MedicalRecordType!
    name: String!
    diagnosis: String!
    symptoms: [String!]!
    startDate: Date!
    endDate: Date
    status: MedicalRecordStatus!
    severity: MedicalRecordSeverity!
    treatment: String
    medications: [MedicationRecord!]!
    doctor: Doctor
    attachments: [String!]!
    notes: String
    reportedBy: ReportedBy!
    createdAt: Date!
    updatedAt: Date!
  }

  enum MedicalRecordType {
    ILLNESS
    INJURY
    CHRONIC_CONDITION
    ALLERGY
    MEDICATION
  }

  enum MedicalRecordStatus {
    ACTIVE
    RECOVERED
    CHRONIC
    RECURRING
  }

  enum MedicalRecordSeverity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  type MedicationRecord {
    name: String!
    dosage: String!
    frequency: String!
    startDate: Date!
    endDate: Date
  }

  type Doctor {
    name: String!
    hospital: String
    phone: String
  }

  type ReportedBy {
    userId: ObjectId!
    name: String!
    relation: String!
  }

  input MedicationRecordInput {
    name: String!
    dosage: String!
    frequency: String!
    startDate: Date!
    endDate: Date
  }

  input DoctorInput {
    name: String!
    hospital: String
    phone: String
  }

  input ReportedByInput {
    userId: ObjectId!
    name: String!
    relation: String!
  }

  input CreateMedicalRecordInput {
    childId: ObjectId!
    type: MedicalRecordType!
    name: String!
    diagnosis: String!
    symptoms: [String!]
    startDate: Date!
    endDate: Date
    status: MedicalRecordStatus
    severity: MedicalRecordSeverity
    treatment: String
    medications: [MedicationRecordInput]
    doctor: DoctorInput
    attachments: [String!]
    notes: String
    reportedBy: ReportedByInput!
  }

  input UpdateMedicalRecordInput {
    type: MedicalRecordType
    name: String
    diagnosis: String
    symptoms: [String!]
    startDate: Date
    endDate: Date
    status: MedicalRecordStatus
    severity: MedicalRecordSeverity
    treatment: String
    medications: [MedicationRecordInput]
    doctor: DoctorInput
    attachments: [String!]
    notes: String
  }

  extend type Query {
    "Get medical records for a child"
    medicalRecords(childId: ObjectId!, status: MedicalRecordStatus): [MedicalRecord!]!
    
    "Get medical record by ID"
    medicalRecord(id: ObjectId!): MedicalRecord
    
    "Get active medical records for a child"
    activeMedicalRecords(childId: ObjectId!): [MedicalRecord!]!
  }

  extend type Mutation {
    "Create a new medical record"
    createMedicalRecord(input: CreateMedicalRecordInput!): MedicalRecord!
    
    "Update medical record"
    updateMedicalRecord(id: ObjectId!, input: UpdateMedicalRecordInput!): MedicalRecord!
    
    "Delete medical record"
    deleteMedicalRecord(id: ObjectId!): Boolean!
  }
`;
