# Medical Records

Rekam medis anak: sakit, cedera, alergi, medication, dan kondisi kronis.

Source schema: `src/medical_records/medical_records.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Semua operasi butuh login.
- Akses bergantung pada relasi user terhadap child.
- Delete hanya oleh reporter record.

## Queries

- `medicalRecords(childId: ObjectId!, status: MedicalRecordStatus): [MedicalRecord!]!`
- `medicalRecord(id: ObjectId!): MedicalRecord`
- `activeMedicalRecords(childId: ObjectId!): [MedicalRecord!]!`

## Mutations

- `createMedicalRecord(input: CreateMedicalRecordInput!): MedicalRecord!`
- `updateMedicalRecord(id: ObjectId!, input: UpdateMedicalRecordInput!): MedicalRecord!`
- `deleteMedicalRecord(id: ObjectId!): Boolean!`

## Schema Definitions

Types:

- `Doctor`
- `MedicalRecord`
- `MedicationRecord`
- `ReportedBy`

Inputs:

- `CreateMedicalRecordInput`
- `DoctorInput`
- `MedicationRecordInput`
- `ReportedByInput`
- `UpdateMedicalRecordInput`

Enums:

- `MedicalRecordSeverity`
- `MedicalRecordStatus`
- `MedicalRecordType`

Scalars:

- Tidak ada.

## Notes

- Attachment divalidasi sebagai URL.
