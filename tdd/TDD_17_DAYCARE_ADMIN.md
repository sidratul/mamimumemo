# TDD - Module 17: Daycare Admin (System Admin)

**Purpose:** System admin mengelola daftar daycare dan approval pendaftaran daycare baru.

---

## 📋 Overview

Module ini dipakai oleh role **SUPER_ADMIN / SYSTEM_ADMIN** untuk:
- Melihat seluruh daftar daycare
- Mereview pengajuan pendaftaran daycare
- Mengubah status approval daycare
- Menonaktifkan daycare bermasalah

---

## 🧩 Status Workflow

```typescript
enum DaycareApprovalStatus {
  DRAFT,          // Data belum submit final oleh pemilik daycare
  SUBMITTED,      // Sudah submit, menunggu review admin
  IN_REVIEW,      // Sedang direview admin system
  NEEDS_REVISION, // Perlu perbaikan dokumen/data
  APPROVED,       // Disetujui, daycare aktif operasional
  REJECTED,       // Ditolak permanen
  SUSPENDED       // Sudah pernah approved tapi dibekukan sementara
}
```

### Status Transition Rules

1. `DRAFT -> SUBMITTED`
2. `SUBMITTED -> IN_REVIEW`
3. `IN_REVIEW -> APPROVED`
4. `IN_REVIEW -> NEEDS_REVISION`
5. `IN_REVIEW -> REJECTED`
6. `NEEDS_REVISION -> SUBMITTED`
7. `APPROVED -> SUSPENDED`
8. `SUSPENDED -> APPROVED`

---

## 🔍 Queries

### **GetSystemDaycares**

**Purpose:** Daftar semua daycare untuk admin system (dengan filter status).

**Variables:**
```json
{
  "status": "SUBMITTED",
  "search": "mami",
  "limit": 20,
  "offset": 0
}
```

**Query:**
```graphql
query GetSystemDaycares($status: DaycareApprovalStatus, $search: String, $limit: Int, $offset: Int) {
  systemDaycares(status: $status, search: $search, limit: $limit, offset: $offset) {
    items {
      id
      name
      lid
      owner {
        id
        name
        email
        phone
      }
      address
      city
      submittedAt
      approvedAt
      approvalStatus
      isActive
    }
    total
  }
}
```

**Frontend Fields:**

| Field | Type | UI Component | Usage |
|-------|------|-------------|-------|
| `name` | String | Daycare row title | Nama daycare |
| `lid` | String | Tag/badge | ID unik daycare |
| `owner.name` | String | Subtext | Pemilik daycare |
| `approvalStatus` | Enum | Status chip | Warna status |
| `submittedAt` | Date | Meta info | SLA review |

---

### **GetSystemDaycareDetail**

**Purpose:** Detail daycare untuk halaman review approval.

**Variables:**
```json
{
  "id": "65daycare123..."
}
```

**Query:**
```graphql
query GetSystemDaycareDetail($id: ObjectId!) {
  systemDaycare(id: $id) {
    id
    name
    lid
    description
    address
    city
    owner {
      id
      name
      email
      phone
    }
    legalDocuments {
      type
      url
      verified
    }
    approval {
      status
      note
      reviewedBy {
        id
        name
      }
      reviewedAt
      history {
        status
        note
        changedBy {
          id
          name
        }
        changedAt
      }
    }
  }
}
```

---

## ✏️ Mutations

### **SubmitDaycareRegistration**

**Purpose:** Owner submit daycare registration ke admin system.

**Mutation:**
```graphql
mutation SubmitDaycareRegistration($id: ObjectId!) {
  submitDaycareRegistration(id: $id) {
    id
    approvalStatus
    submittedAt
  }
}
```

---

### **UpdateDaycareApprovalStatus**

**Purpose:** System admin update status review daycare.

**Variables:**
```json
{
  "id": "65daycare123...",
  "input": {
    "status": "IN_REVIEW",
    "note": "Dokumen sedang diverifikasi tim legal"
  }
}
```

**Mutation:**
```graphql
mutation UpdateDaycareApprovalStatus($id: ObjectId!, $input: UpdateDaycareApprovalInput!) {
  updateDaycareApprovalStatus(id: $id, input: $input) {
    id
    approval {
      status
      note
      reviewedAt
      reviewedBy {
        id
        name
      }
    }
  }
}
```

**Allowed Input Status by Admin:**
- `IN_REVIEW`
- `NEEDS_REVISION`
- `APPROVED`
- `REJECTED`
- `SUSPENDED`

---

## 🎨 UI Components

### **SystemDaycareListItem**
- Menampilkan: nama daycare, owner, status chip, tanggal submit.
- CTA: `Review`, `Approve`, `Needs Revision`, `Reject`.

### **DaycareApprovalActionSheet**
- Pilih status target + wajib isi catatan untuk `NEEDS_REVISION` dan `REJECTED`.

---

## 📱 Screens

| Screen | Components | Route | Permissions |
|--------|-----------|-------|-------------|
| Daycare Queue | DaycareFilterBar, SystemDaycareList | `/admin/daycares` | SUPER_ADMIN |
| Daycare Detail Review | DaycareProfileCard, DocumentsList, ApprovalTimeline | `/admin/daycares/:id` | SUPER_ADMIN |
| Approval History | ApprovalHistoryList | `/admin/daycares/:id/history` | SUPER_ADMIN |

---

## 🔐 Permission Matrix

| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT |
|---------|-------------|---------------|---------------|----------------|--------|
| List all daycares | ✅ | ❌ | ❌ | ❌ | ❌ |
| Review daycare registration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update approval status | ✅ | ❌ | ❌ | ❌ | ❌ |
| Submit own daycare registration | ❌ | ✅ | ❌ | ❌ | ❌ |
| View own daycare approval status | ❌ | ✅ | ✅ | ❌ | ❌ |

---

## 🧪 Test Cases

1. Submit registration dari `DRAFT` mengubah status ke `SUBMITTED`.
2. Admin ubah `SUBMITTED -> IN_REVIEW` sukses.
3. Admin ubah `IN_REVIEW -> APPROVED` mengisi `approvedAt`.
4. Admin ubah `IN_REVIEW -> NEEDS_REVISION` wajib `note`.
5. Admin tidak bisa ubah langsung `DRAFT -> APPROVED` (invalid transition).
6. Non-admin tidak bisa akses query `systemDaycares`.

---

**Status:** Draft v1 - Ready for implementation
