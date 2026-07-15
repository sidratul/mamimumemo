# Invoices

Tagihan daycare untuk parent berdasarkan kontrak dan periode.

Source schema: `src/invoices/invoices.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola invoice.
- Parent dapat membaca invoice miliknya melalui `parentInvoices`.

## Queries

- `daycareInvoices(daycareId: ObjectId!, status: InvoiceStatus): [Invoice!]!`
- `parentInvoices(parentId: ObjectId!, status: InvoiceStatus): [Invoice!]!`
- `invoice(id: ObjectId!): Invoice`
- `overdueInvoices(daycareId: ObjectId!): [Invoice!]!`

## Mutations

- `createInvoice(input: CreateInvoiceInput!): Invoice!`
- `updateInvoice(id: ObjectId!, input: UpdateInvoiceInput!): Invoice!`
- `markInvoiceAsPaid(id: ObjectId!, input: MarkAsPaidInput): Invoice!`
- `cancelInvoice(id: ObjectId!): Invoice!`

## Schema Definitions

Types:

- `Invoice`
- `InvoiceItem`
- `InvoicePeriod`
- `ParentRef`

Inputs:

- `CreateInvoiceInput`
- `InvoiceItemInput`
- `InvoicePeriodInput`
- `MarkAsPaidInput`
- `ParentRefInput`
- `UpdateInvoiceInput`

Enums:

- `InvoiceStatus`

Scalars:

- Tidak ada.

## Notes

- `markInvoiceAsPaid` mengisi `paidAt`; `cancelInvoice` mengubah status, bukan hard delete.
