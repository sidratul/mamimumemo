# Contracts

Kontrak layanan daycare antara daycare, parent, dan anak.

Source schema: `src/contracts/contracts.typedef.ts`

Status: **Exposed di GraphQL schema**

## Access

- Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola kontrak.
- Parent dapat membaca kontraknya sendiri melalui `parentContracts`.

## Queries

- `daycareContracts(daycareId: ObjectId!, status: ContractStatus): [Contract!]!`
- `parentContracts(parentId: ObjectId!, status: ContractStatus): [Contract!]!`
- `contract(id: ObjectId!): Contract`
- `activeContracts(daycareId: ObjectId!): [Contract!]!`

## Mutations

- `createContract(input: CreateContractInput!): Contract!`
- `updateContract(id: ObjectId!, input: UpdateContractInput!): Contract!`
- `updateContractStatus(id: ObjectId!, status: ContractStatus!): Contract!`
- `terminateContract(id: ObjectId!): Contract!`

## Schema Definitions

Types:

- `Contract`

Inputs:

- `CreateContractInput`
- `UpdateContractInput`

Enums:

- `ContractStatus`
- `ServiceType`

Scalars:

- Tidak ada.

## Notes

- `terminateContract` mengubah status menjadi terminated, bukan hard delete.
