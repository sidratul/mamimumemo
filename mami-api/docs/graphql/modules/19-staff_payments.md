# Staff Payments

Pembayaran staff daycare per periode kerja.

Source schema: `src/staff_payments/staff_payments.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola pembayaran.
- Staff dapat membaca pembayaran miliknya melalui `staffPayments`.

## Queries

- `daycareStaffPayments(daycareId: ObjectId!, status: StaffPaymentStatus): [StaffPayment!]!`
- `staffPayments(staffId: ObjectId!, status: StaffPaymentStatus): [StaffPayment!]!`
- `staffPayment(id: ObjectId!): StaffPayment`
- `pendingStaffPayments(daycareId: ObjectId!): [StaffPayment!]!`

## Mutations

- `createStaffPayment(input: CreateStaffPaymentInput!): StaffPayment!`
- `updateStaffPayment(id: ObjectId!, input: UpdateStaffPaymentInput!): StaffPayment!`
- `markStaffPaymentAsPaid(id: ObjectId!, input: MarkStaffPaymentAsPaidInput): StaffPayment!`
- `cancelStaffPayment(id: ObjectId!): StaffPayment!`

## Schema Definitions

Types:

- `Deduction`
- `PaymentPeriod`
- `StaffPayment`
- `StaffRef`

Inputs:

- `CreateStaffPaymentInput`
- `DeductionInput`
- `MarkStaffPaymentAsPaidInput`
- `PaymentPeriodInput`
- `StaffRefInput`
- `UpdateStaffPaymentInput`

Enums:

- `StaffPaymentStatus`

Scalars:

- Tidak ada.

## Notes

- Cancel mengubah status pembayaran, bukan hard delete.
