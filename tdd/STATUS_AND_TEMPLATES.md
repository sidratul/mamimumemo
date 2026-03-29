# TDD Status And Templates

Dokumen ini sekarang dipakai sebagai panduan format, bukan lagi sebagai sumber angka progres. Sumber status utama ada di `INDEX.md`.

## Status Singkat

- Modul 1-17 sudah memiliki dokumen referensi di repo.
- Kedalaman dokumen berbeda per modul.
- `INDEX.md` adalah sumber kebenaran untuk status dokumentasi saat ini.

## Aturan Status

Gunakan label berikut saat memperbarui TDD:

- `Detailed` - Query/mutation, contoh variable, response, field mapping, screen, dan permission matrix cukup lengkap
- `Concise` - Tujuan, query/mutation utama, dan field penting sudah ada tetapi contoh tidak selengkap detailed
- `Quick reference` - Ringkasan singkat lintas modul
- `Draft` - Masih awal dan perlu validasi ulang

## Template Modul

```markdown
# TDD - Module XX: [Module Name]

**Purpose:** [Brief description]

---

## Overview
[Short context and business rules]

## Queries
### QueryName
**Purpose:** [What it does]

**Variables:**
```json
{
  "param": "value"
}
```

**Query:**
```graphql
query QueryName($param: Type!) {
  field
}
```

**Frontend Fields:**
| Field | Type | UI Component | Usage |
|-------|------|-------------|-------|
| ... | ... | ... | ... |

## Mutations
### MutationName
**Purpose:** [What it changes]

**Variables:**
```json
{
  "input": {
    "field": "value"
  }
}
```

**Mutation:**
```graphql
mutation MutationName($input: InputType!) {
  mutation(input: $input) {
    id
  }
}
```

**Frontend Input Fields:**
| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| ... | ... | ... | ... | ... |

## Screens
| Screen | Components | Route | Permissions |
|--------|-----------|-------|-------------|
| ... | ... | ... | ... |

## Permission Matrix
| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT |
|---------|-------------|---------------|---------------|----------------|--------|
| ... | ... | ... | ... | ... | ... |
```

## Maintenance Checklist

- Pastikan nama query/mutation sesuai schema GraphQL aktual
- Samakan role names dengan `packages/core` dan `mami-api/shared/enums`
- Jika modul punya implementasi mobile, cocokkan route dan UI dengan app terkait
- Saat mengubah status dokumen, update `INDEX.md` lebih dulu
