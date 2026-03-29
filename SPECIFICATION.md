# Daycare Management System - Specification Document

## 1. Overview

### 1.1 Product Vision
Sistem manajemen daycare multi-tenant yang memungkinkan berbagai daycare untuk mengelola operasional mereka, sementara orang tua dapat memantau perkembangan dan riwayat kesehatan anak secara real-time.

### 1.2 Problem Statement
- Orang tua kesulitan memantau aktivitas dan perkembangan anak di daycare
- Daycare membutuhkan sistem terpusat untuk mengelola data anak, staff, dan operasional
- Tidak ada riwayat kesehatan dan aktivitas anak yang terdokumentasi dengan baik

### 1.3 Target Users
- Daycare (sebagai business user)
- Orang tua/wali (sebagai end user)

---

## 2. User Roles & Permissions

| Role | Deskripsi | Akses |
|------|-----------|-------|
| **Super Admin** | Pemilik sistem | Kelola semua daycare, invoice sistem |
| **Daycare Owner** | Pemilik daycare | Lihat laporan keuangan, kelola daycare |
| **Daycare Admin** | Administrator daycare | Kelola data anak, orang tua, staff, jadwal |
| **Sitter/Guru** | Caretaker | Input aktivitas, attendance, report harian |
| **Orang Tua/Wali** | Parent/Guardian | Pantau anak, input aktivitas mandiri, riwayat kesehatan |

---

## 3. Technical Stack

### 3.1 Mobile Application
| Component | Technology |
|-----------|------------|
| Framework | Expo (React Native) |
| Codebase | Single codebase untuk iOS & Android |
| Language | Indonesian only |

### 3.2 Backend
| Component | Technology |
|-----------|------------|
| Runtime | Deno |
| API | GraphQL |
| Deployment | Deno Deploy |

### 3.3 Database
| Component | Technology |
|-----------|------------|
| Database | MongoDB Atlas |
| Model | Multi-tenant (shared + isolated collections) |

### 3.4 Authentication
| Component | Technology |
|-----------|------------|
| Method | Email + Password |
| Token | JWT + Refresh Token |
| Multi-device | Supported (beberapa device) |

### 3.5 Notifications
| Type | Implementation |
|------|----------------|
| Push Notification | FCM/APNs |
| In-app Notification | Real-time |
| Email | Phase 2 |

---

## 4. API Implementation (Deno + GraphQL)

### 4.1 Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Deno 2.x |
| GraphQL Server | graphql-yoga |
| Database ORM | Mongoose (MongoDB) |
| Validation | Zod |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Schema Tools | @graphql-tools/schema |

### 4.2 Project Structure

```
mami-api/
├── src/                      # Application code (modules)
│   ├── auth/                 # Authentication module
│   ├── children/             # Children module
│   ├── parents/              # Parents module
│   ├── children_daycare/     # Children daycare module
│   ├── contracts/            # Contracts module
│   ├── daily_care_records/   # Daily care module
│   ├── activities/           # Activities (parent input)
│   ├── medical_records/      # Medical records
│   ├── master_activities/    # Master activities
│   ├── schedules/            # Schedules & templates
│   ├── invoices/             # Invoices
│   └── health/               # Health check module
├── shared/                   # Framework core
│   ├── config/               # App configuration
│   │   ├── context.ts        # AppContext class
│   │   ├── auth-context.ts   # JWT auth context
│   │   └── env.ts            # Environment validation
│   ├── database/             # Database connection
│   │   └── mongo.ts          # Mongoose connection
│   ├── enums/                # Shared enums & constants
│   ├── guards/               # Authorization guards
│   ├── scalar/               # Custom GraphQL scalars
│   ├── types/                # Shared type definitions
│   └── utils/                # Utility functions
│       └── jwt.ts            # JWT token utilities
├── scripts/                  # Scaffolding scripts
│   ├── templates/            # Module templates
│   └── scaffold.ts           # Module generator
├── deno.jsonc                # Deno configuration
├── import_map.json           # Path aliases (@/, #shared/)
├── main.ts                   # Entry point
└── README.md
```

### 4.3 Module Structure (Pattern)

Setiap modul di `src/` mengikuti pattern yang sama:

```
src/<module_name>/
├── <module>.schema.ts        # Mongoose schema
├── <module>.typedef.ts       # GraphQL type definitions
├── <module>.resolver.ts      # GraphQL resolvers
├── <module>.service.ts       # Business logic
├── <module>.repository.ts    # Database queries
├── <module>.validation.ts    # Zod validation schemas
└── <module>.d.ts             # TypeScript types
```

### 4.4 Example: Children Module

**Schema (`src/children/children.schema.ts`):**
```typescript
import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema({
  user: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    role: { type: String, enum: ["parent", "guardian"] },
  },
  relation: { type: String, enum: ["father", "mother", "guardian"] },
  permissions: [{
    type: String,
    enum: [
      "view_reports",
      "input_activity",
      "input_health",
      "enroll_daycare",
      "edit_profile",
      "manage_guardians",
    ],
  }],
  sharedAt: Date,
  sharedBy: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    relation: String,
  },
  active: Boolean,
});

const childrenSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profile: {
    name: String,
    birthDate: Date,
    photo: String,
    gender: { type: String, enum: ["male", "female"] },
  },
  medical: {
    allergies: [String],
    medicalNotes: String,
    medications: [{
      name: String,
      dosage: String,
      schedule: String,
    }],
  },
  guardians: [guardianSchema],
}, { timestamps: true });

export default mongoose.model("Child", childrenSchema);
```

**Type Definitions (`src/children/children.typedef.ts`):**
```graphql
type Child {
  id: ObjectId!
  ownerId: ObjectId!
  profile: ChildProfile!
  medical: ChildMedical!
  guardians: [Guardian!]!
  createdAt: Date!
  updatedAt: Date!
}

type ChildProfile {
  name: String!
  birthDate: Date!
  photo: String
  gender: Gender!
}

enum Gender {
  MALE
  FEMALE
}

type ChildMedical {
  allergies: [String!]!
  medicalNotes: String
  medications: [Medication!]!
}

type Medication {
  name: String!
  dosage: String!
  schedule: String!
}

type Guardian {
  user: UserRef!
  relation: Relation!
  permissions: [GuardianPermission!]!
  sharedAt: Date!
  sharedBy: SharedBy!
  active: Boolean!
}

type UserRef {
  userId: ObjectId!
  name: String!
  email: String!
  phone: String
  role: UserRole!
}

enum Relation {
  FATHER
  MOTHER
  GUARDIAN
}

enum GuardianPermission {
  VIEW_REPORTS
  INPUT_ACTIVITY
  INPUT_HEALTH
  ENROLL_DAYCARE
  EDIT_PROFILE
  MANAGE_GUARDIANS
}

type SharedBy {
  userId: ObjectId!
  name: String!
  relation: String!
}

input CreateChildInput {
  profile: ChildProfileInput!
  medical: ChildMedicalInput
  guardians: [GuardianInput]
}

input ChildProfileInput {
  name: String!
  birthDate: Date!
  photo: String
  gender: Gender!
}

input ChildMedicalInput {
  allergies: [String!]
  medicalNotes: String
  medications: [MedicationInput]
}

input GuardianInput {
  userId: ObjectId!
  relation: Relation!
  permissions: [GuardianPermission!]!
}

extend type Query {
  myChildren: [Child!]!
  child(id: ObjectId!): Child
}

extend type Mutation {
  createChild(input: CreateChildInput!): Child!
  updateChild(id: ObjectId!, input: UpdateChildInput!): Child!
  addGuardian(childId: ObjectId!, input: GuardianInput!): Child!
  removeGuardian(childId: ObjectId!, guardianUserId: ObjectId!): Child!
}
```

### 4.5 Path Aliases

```json
{
  "@/": "./src/",
  "#shared/": "./shared/"
}
```

**Contoh penggunaan:**
```typescript
// Import dari modul aplikasi lain
import { ChildService } from "@/children/children.service.ts";

// Import dari shared framework
import { AppContext } from "#shared/config/context.ts";
import { isAuthenticated } from "#shared/guards/authorization.guard.ts";
import { createToken } from "#shared/utils/jwt.ts";
```

### 4.6 Scaffolding Module Baru

Untuk membuat modul baru, gunakan task `g`:

```bash
# Generate modul children
deno task g children

# Generate modul activities
deno task g activities

# Generate modul daily_care_records
deno task g daily_care_records
```

Ini akan membuat semua file yang diperlukan dengan pattern yang sudah ada.

---

## 5. Data Model

### 5.1 Design Principles
1. **Minimize relations** - Gunakan subdocument sebisa mungkin
2. **Snapshot data** - Data di `parents` dan `children_daycare` adalah snapshot, tidak terpengaruh update user
3. **Denormalized** - Copy data yang diperlukan untuk menghindari join
4. **Multi-tenant isolation** - Setiap daycare punya data terisolasi
5. **Subdocument pattern** - Reference ke user disimpan sebagai subdocument dengan data penting:
   - `userId`, `name`, `email`, `phone`, `role`
   - Data tidak konsisten jika user update profil (trade-off untuk performa)
   - Lebih cepat load karena tidak perlu populate/join
6. **Global vs Daycare Children** - 
   - `children` (global) = Data anak yang dimiliki parent, belum tentu enroll daycare
   - `children_daycare` = Data anak di daycare tertentu (snapshot)
   - `globalChildId` = Optional link ke global children (null jika anak hanya ada di daycare ini)

### 4.2 Collection Structure

#### Shared Schemas (Reusable Subdocuments)

**User References (`shared/schemas/user-refs.schema.ts`)**

Schema reusable untuk user references di semua collection:

```typescript
// userRefSchema - User lengkap dengan role
{
  userId: ObjectId
  name: String
  email: String
  phone: String
  role: String
}

// staffRefSchema - Staff reference
{
  userId: ObjectId
  name: String
  role: String
}

// parentRefSchema - Parent reference
{
  userId: ObjectId
  name: String
  email: String
  phone: String
}

// guardianUserRefSchema - Guardian reference
{
  userId: ObjectId
  name: String
  email: String
  phone: String
  role: "parent" | "guardian"
}

// simpleUserRefSchema - Simple reference (tanpa email/phone)
{
  userId: ObjectId
  name: String
}

// assignedUserRefSchema - Assigned user dengan shift
{
  userId: ObjectId
  name: String
  shift: "morning" | "afternoon" | "full"
}
```

**Usage Examples:**
- `createdBy` → `userRefSchema`
- `loggedBy`, `uploadedBy` → `simpleUserRefSchema`
- `assignedSitters` → `assignedUserRefSchema`
- `parent` (di invoices) → `parentRefSchema`
- `staff` (di staff_payments) → `staffRefSchema`

#### 1. Global Collections (Shared)

**User & Authentication**
```
users
├── _id
├── email
├── password (hashed)
├── name
├── phone
├── roles: [super_admin, daycare_owner, daycare_admin, daycare_sitter, parent]
├── refreshToken
├── createdAt
└── updatedAt
```

**Children & Guardians (Parent-Managed)**
```
children
├── _id
├── ownerId (userId dari parent yang membuat data anak ini)
├── profile: {
│     name
│     birthDate
│     photo
│     gender: [male, female]
│   }
├── medical: {
│     allergies: [string]
│     medicalNotes: string
│     medications: [{ name, dosage, schedule }]
│   }
├── guardians: [{
│     user: {
│       userId
│       name
│       email
│       phone
│       role: [parent, guardian]
│     }
│     relation: [father, mother, guardian]
│     permissions: [
│       "view_reports"
│       "input_activity"
│       "input_health"
│       "enroll_daycare"
│       "edit_profile"
│       "manage_guardians"
│     ]
│     sharedAt
│     sharedBy: { userId, name, relation }
│     active: boolean
│   }]
├── createdAt
└── updatedAt

medical_records
├── _id
├── childId (reference ke collection children)
├── type: [illness, injury, chronic_condition, allergy, medication]
├── name: string (contoh: "Demam Berdarah", "Asma")
├── diagnosis: string
├── symptoms: [string]
├── startDate
├── endDate (null jika masih aktif)
├── status: [active, recovered, chronic, recurring]
├── severity: [low, medium, high, critical]
├── treatment: string
├── medications: [{ name, dosage, frequency, startDate, endDate }]
├── doctor: { name, hospital, phone }
├── attachments: [url]
├── notes: string
├── reportedBy: { userId, name, relation }
├── createdAt
└── updatedAt

activities
├── _id
├── childId (reference ke collection children)
├── daycareId (null jika activity tanpa daycare / di rumah)
├── masterActivityId (optional, reference ke master_activities)
├── activityName: string
├── category: [meal, nap, toileting, care, play, learning, creative, physical, outdoor, routine, social, development]
├── date
├── startTime
├── endTime
├── duration (auto-calculated)
├── │
├── │── Dynamic fields (optional, sesuai kebutuhan)
├── mealType: [breakfast, snack, lunch, dinner]
├── menu: string
├── eaten: [all, some, none]
├── quality: [good, restless, short]
├── toiletingType: [urine, bowel]
├── toiletingNotes: string
├── mood: [happy, sleepy, fussy, energetic, neutral]
├── photos: [url]
├── description: string
├── intensity: [low, medium, high]
├── location: string
├── materials: string
├── │
├── source: [parent, guardian, daycare]
├── loggedBy: { userId, name, relation, role }
├── visibleTo: [userId]
├── notes: string
├── createdAt
└── updatedAt
```

#### 2. Daycare Collections (Multi-Tenant)

**Daycare Master Data**
```
daycares
├── _id
├── name
├── address
├── phone
├── email
├── owner: { userId, name, email, phone, role }
├── status: [pending, active, suspended]
├── createdAt
└── updatedAt

master_activities
├── _id
├── daycareId
├── name (free text, contoh: "Makan Pagi Ceria")
├── category: [meal, nap, toileting, care, play, learning, creative, physical, outdoor, routine, social, development]
├── defaultDuration: number (menit)
├── icon: string (optional)
├── color: string (optional)
├── active: boolean
├── fieldConfig: {
│     mealType: boolean
│     menu: boolean
│     eaten: boolean
│     quality: boolean
│     toiletingType: boolean
│     toiletingNotes: boolean
│     mood: boolean
│     photos: boolean
│     description: boolean
│     intensity: boolean
│     location: boolean
│     materials: boolean
│   }
├── createdBy: { userId, name, role }
└── createdAt
```

**Parents & Children (Daycare Snapshot)**
```
parents
├── _id
├── daycareId
├── user: { userId, name, email, phone, role: parent }
├── customData: {
│     deskripsi: string (no rekening, catatan)
│     emergencyContact: { name, phone, relation }
│     pickupAuthorization: [{ name, phone, relation }]
│     notes: string
│   }
├── childrenIds: [childId] (reference ke children_daycare)
├── enrolledAt
├── active: boolean
└── updatedAt

children_daycare
├── _id
├── daycareId
├── parentId (reference ke parents)
├── globalChildId (reference ke children, optional)
├── profile: { name, birthDate, photo, gender }
├── medical: { allergies, medicalNotes, medications }
├── preferences: { favoriteFoods, favoriteActivities, comfortItems, napRoutine }
├── customData: { customName, customPhoto, notes }
├── enrolledAt
├── exitedAt
└── active: boolean
```

**Contracts & Services**
```
contracts
├── _id
├── daycareId
├── parentId (reference ke parents)
├── childIds: [childId] (reference ke children_daycare)
├── serviceType: [daily, weekly, monthly]
├── price
├── startDate
├── endDate
├── status: [active, expired, terminated]
├── terms: string
├── createdAt
└── updatedAt

services
├── _id
├── daycareId
├── name: [daily, weekly, monthly]
├── price
├── description
└── active
```

**Daily Operations**
```
daily_care_records
├── _id
├── daycareId
├── date
├── children: [{
│     childId (reference ke children_daycare)
│     childName (snapshot)
│     childPhoto (snapshot)
│     attendance: {
│       checkIn: { time, photo, by: { userId, name } }
│       checkOut: { time, photo, by: { userId, name } }
│       status: [present, absent, late, early_pickup]
│     }
│     assignedSitters: [{ userId, name, shift }]
│     activities: [{
│       _id
│       masterActivityId
│       activityName
│       category
│       startTime
│       endTime
│       duration
│       mealType, menu, eaten (jika meal)
│       quality (jika nap)
│       toiletingType, toiletingNotes (jika toileting)
│       mood, photos, description
│       intensity, location, materials
│       loggedBy: { userId, name }
│       loggedAt
│     }]
│     notes: string
│   }]
└── createdAt

schedule_templates
├── _id
├── daycareId
├── name (contoh: "Routine Harian")
├── dayOfWeek: [monday, tuesday, ...]
├── activities: [{
│     masterActivityId
│     activityName
│     startTime
│     endTime
│     duration
│     category
│     defaultSitterRole: [any, senior_sitter, junior_sitter]
│   }]
└── active

weekly_schedules
├── _id
├── daycareId
├── weekStart
├── weekEnd
├── days: [{
│     date
│     dayOfWeek
│     templateId (optional)
│     childAssignments: [{
│       childName
│       childPhoto
│       assignedSitters: [{ userId, name, shift }]
│       activities: [{
│         masterActivityId
│         activityName
│         startTime
│         endTime
│         category
│         notes
│       }]
│     }]
│   }]
└── createdAt
```

**Health Records (Daycare)**
```
health_records
├── _id
├── daycareId (null jika input mandiri orang tua)
├── childId (reference ke children_daycare)
├── childName
├── childPhoto
├── type: [illness, medication, injury, checkup, allergy_reaction]
├── description
├── severity: [low, medium, high]
├── date
├── reportedBy: { userId, name, role }
├── attachments: [url]
├── followUp: string
└── visibleToParent: boolean
```

**Finance & Admin**
```
invoices
├── _id
├── daycareId
├── contractId
├── parent: { userId, name, email }
├── period: { start, end }
├── items: [{ description, quantity, unitPrice, subtotal }]
├── total
├── status: [pending, paid, overdue, cancelled]
├── dueDate
├── paidAt
└── notes

staff_payments
├── _id
├── daycareId
├── staff: { userId, name, role }
├── period: { start, end }
├── daysWorked
├── rate
├── amount
├── deductions: [{ description, amount }]
├── total
├── status: [pending, paid]
├── paidAt
└── notes
```

**Menus & Gallery**
```
menus
├── _id
├── daycareId
├── date
├── meals: [{
│     type: [breakfast, snack, lunch, dinner]
│     menu
│     ingredients: [string]
│     allergens: [string]
│     notes
│   }]
└── createdAt

gallery
├── _id
├── daycareId
├── childName (optional, null = general)
├── photos: [url]
├── caption
├── date
├── event: string (optional)
└── uploadedBy: { userId, name }
```

**Notifications**
```
notifications
├── _id
├── daycareId
├── userId (recipient)
├── type: [attendance, activity, health, invoice, schedule, general]
├── title
├── message
├── data: { any }
├── read: boolean
├── readAt
├── createdAt
└── expiresAt
```

---

## 5. Data Relationships

### 5.1 Global Children vs Daycare Children Model

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED COLLECTIONS                        │
│                                                             │
│  ┌─────────────┐         ┌─────────────────────────────┐   │
│  │    users    │         │        children             │   │
│  │  (all users)│         │  (global, parent-owned)     │   │
│  │             │         │                             │   │
│  │ • parent    │◄────────┤ • ownerId (parent userId)   │   │
│  │ • guardian  │  guard  │ • profile (name, birthDate) │   │
│  │ • sitter    │  ians   │ • medical (allergies, etc)  │   │
│  │ • admin     │         │ • guardians: [users]        │   │
│  └─────────────┘         └──────────────┬──────────────┘   │
│                                         │                   │
│  ┌─────────────────────────────────┐    │                   │
│  │     medical_records             │◄───┘                   │
│  │  (riwayat penyakit anak)        │                        │
│  │                                 │                        │
│  │ • childId                       │                        │
│  │ • type (illness, injury, etc)   │                        │
│  │ • name, diagnosis, symptoms     │                        │
│  │ • startDate, endDate, status    │                        │
│  │ • medications, attachments      │                        │
│  └─────────────────────────────────┘                        │
│                                                             │
│  ┌─────────────────────────────────┐    │                   │
│  │       activities                │◄───┘                   │
│  │  (activity parent/guardian)     │                        │
│  │                                 │                        │
│  │ • childId                       │                        │
│  │ • daycareId (null = di rumah)   │                        │
│  │ • activityName, category        │                        │
│  │ • startTime, endTime            │                        │
│  │ • dynamic fields (meal, nap)    │                        │
│  │ • source: parent/guardian       │                        │
│  │ • loggedBy                      │                        │
│  └─────────────────────────────────┘                        │
└─────────────────────────────────────────┼──────────────────┘
                                          │
                                          │ optional link
                                          │ (jika enroll daycare)
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│              MULTI-TENANT COLLECTIONS (per daycare)          │
│                                                             │
│  ┌─────────────┐         ┌─────────────────────────────┐   │
│  │   parents   │────────►│    children_daycare         │   │
│  │  (snapshot  │  1:n    │   (snapshot per daycare)    │   │
│  │   user)     │         │                             │   │
│  │             │         │ • globalChildId (optional)  │   │
│  │ • user data │         │   └─ link ke global children│   │
│  │ • customData│         │                             │   │
│  │   (rekning, │         │ • profile (snapshot)        │   │
│  │    notes)   │         │ • medical (snapshot)        │   │
│  └──────┬──────┘         │ • preferences (daycare-spec)│   │
│         │                │ • customData (custom name,  │   │
│         │                │              photo, notes)  │   │
│         │                └──────────────┬──────────────┘   │
│         │                               │                   │
│         │         ┌─────────────────────┘                   │
│         │         │ 1:n                                     │
│         ▼         ▼                                         │
│    ┌─────────────────────┐                                  │
│    │     contracts       │                                  │
│    │  (service agreement)│                                  │
│    │                     │                                  │
│    │ • parentId          │                                  │
│    │ • childIds: []      │                                  │
│    │ • serviceType       │                                  │
│    └─────────────────────┘                                  │
│                                                             │
│         ┌─────────────────────────────────┐                 │
│         │                                 │                 │
│         ▼                                 ▼                 │
│  ┌─────────────────┐            ┌─────────────────┐         │
│  │ daily_care_     │            │ health_records  │         │
│  │ records         │            │  (daycare)      │         │
│  │  (daycare)      │            │                 │         │
│  │                 │            │ • childId       │         │
│  │ • childId       │            │ • type          │         │
│  │ • activities    │            │ • reportedBy    │         │
│  │ • attendance    │            └─────────────────┘         │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Activity Sources

Ada **2 sumber activity** yang bisa dilihat dalam satu timeline:

```
┌─────────────────────────────────────────────────────────────┐
│                    Activity Timeline                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  activities (global, parent/guardian input)          │   │
│  │  - Activity di rumah, weekend, liburan               │   │
│  │  - daycareId: null                                   │   │
│  │  - source: parent / guardian                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                         +                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  daily_care_records.activities (daycare input)       │   │
│  │  - Activity saat anak di daycare                     │   │
│  │  - daycareId: daycare_xxx                            │   │
│  │  - source: daycare                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                         =                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  COMPLETE TIMELINE (semua activity anak)             │   │
│  │  - Query: activities + daily_care_records            │   │
│  │  - Filter by childId, date range                     │   │
│  │  - Sort by date, startTime                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Contoh Query:**
```javascript
// Ambil semua activity anak (parent + daycare)
const activities = await db.activities.find({
  childId: "child_001",
  date: { $gte: startDate, $lte: endDate }
});

const dailyCareRecords = await db.daily_care_records.find({
  daycareId: { $in: daycareIds },
  date: { $gte: startDate, $lte: endDate },
  "children.childId": "child_001"
});

// Merge & sort by date/time
const timeline = [...activities, ...dailyCareActivities].sort(
  (a, b) => new Date(a.startTime) - new Date(b.startTime)
);
```

### 5.3 Guardians & Permissions

Setiap child bisa punya **multiple guardians** dengan **permissions** berbeda:

```json
{
  "childId": "child_001",
  "ownerId": "user_001",  // Parent yang buat child ini
  "guardians": [
    {
      "user": {
        "userId": "user_002",
        "name": "Ayah Budi",
        "email": "ayah@example.com",
        "phone": "0812-xxx",
        "role": "parent"
      },
      "relation": "father",
      "permissions": [
        "view_reports",
        "input_health",
        "enroll_daycare",
        "attendance",
        "edit_profile",
        "manage_guardians"
      ],
      "sharedAt": "2026-01-01",
      "sharedBy": {
        "userId": "user_001",
        "name": "Ibu Budi",
        "relation": "mother"
      },
      "active": true
    },
    {
      "user": {
        "userId": "user_003",
        "name": "Nenek Budi",
        "email": "nenek@example.com",
        "phone": "0813-xxx",
        "role": "guardian"
      },
      "relation": "grandmother",
      "permissions": [
        "view_reports",
        "attendance"
      ],
      "sharedAt": "2026-01-15",
      "sharedBy": {
        "userId": "user_001",
        "name": "Ibu Budi",
        "relation": "mother"
      },
      "active": true
    }
  ]
}
```

**Permission Levels:**

| Permission | Deskripsi | Contoh Use Case |
|------------|-----------|-----------------|
| `view_reports` | Lihat daily report, activities, attendance | Nenek ingin lihat aktivitas cucu |
| `input_health` | Input health records (sakit, obat, alergi) | Ayah input riwayat sakit anak |
| `enroll_daycare` | Enroll child ke daycare | Ibu daftarkan anak ke daycare |
| `attendance` | Check-in/out anak | Ayah antar & jemput anak |
| `edit_profile` | Edit profile child (nama, foto, medical) | Ibu update foto anak |
| `manage_guardians` | Tambah/hapus guardian lain | Ibu tambah guardian baru |

**Default Permissions:**
- **Owner** (parent yang buat child): Semua permissions
- **Guardian** (ditambah oleh owner): Permissions sesuai yang diberikan owner

### 5.4 Medical Records (Riwayat Penyakit)

`medical_records` menyimpan riwayat kesehatan anak secara lengkap:

**Contoh Data:**
```json
{
  "_id": "medrec_001",
  "childId": "child_001",
  "type": "illness",
  "name": "Demam Berdarah",
  "diagnosis": "DBD Grade II",
  "symptoms": [
    "Demam tinggi 3 hari",
    "Bintik merah di lengan",
    "Mual muntah",
    "Sakit kepala"
  ],
  "startDate": "2026-01-10",
  "endDate": "2026-01-20",
  "status": "recovered",
  "severity": "high",
  "treatment": "Rawat inap 3 hari, infus, paracetamol",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "10mg/kgBB",
      "frequency": "3x sehari",
      "startDate": "2026-01-10",
      "endDate": "2026-01-17"
    },
    {
      "name": "Oralit",
      "dosage": "1 gelas",
      "frequency": "Setiap muntah",
      "startDate": "2026-01-10",
      "endDate": "2026-01-15"
    }
  ],
  "doctor": {
    "name": "Dr. Andi, Sp.A",
    "hospital": "RS Anak Bunda",
    "phone": "021-1234-5678"
  },
  "attachments": [
    "https://storage.example.com/lab-result-001.jpg",
    "https://storage.example.com/resep-001.jpg"
  ],
  "notes": "Perbanyak minum, istirahat 1 minggu",
  "reportedBy": {
    "userId": "user_001",
    "name": "Ibu Budi",
    "relation": "mother"
  },
  "createdAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-01-20T15:00:00Z"
}
```

**Record Types:**

| Type | Deskripsi | Contoh |
|------|-----------|--------|
| `illness` | Penyakit/sakit | Demam Berdarah, Flu, Campak |
| `injury` | Cedera | Patah tulang, Luka bakar |
| `chronic_condition` | Kondisi kronis | Asma, Diabetes, Epilepsi |
| `allergy` | Alergi (bisa dari medical_records atau children.allergies) | Alergi kacang, Alergi susu |
| `medication` | Pengobatan rutin | Vitamin, Obat asma inhaler |

**Status:**

| Status | Deskripsi |
|--------|-----------|
| `active` | Masih sakit/pengobatan |
| `recovered` | Sudah sembuh |
| `chronic` | Kondisi kronis (permanen) |
| `recurring` | Kambuhan (bisa muncul lagi) |

**Use Case:**
1. Parent input riwayat sakit anak → Daycare bisa lihat saat anak enroll
2. Guardian input health record → Owner & guardian lain bisa lihat
3. Daycare update health record saat anak sakit di daycare → Parent dapat notifikasi

### 5.5 Kenapa Ada 2 Collection Anak?

| Collection | Tujuan | Siapa yang Buat | Kapan |
|------------|--------|-----------------|-------|
| **children** (global) | Data anak yang dimiliki orang tua | Parent/user | Saat parent daftar anak di sistem, sebelum enroll daycare |
| **children_daycare** | Data anak di daycare tertentu | Daycare admin / Parent | Saat enroll ke daycare |

### 5.6 Flow Enrollment

```
Scenario 1: Parent daftar anak → Enroll daycare

1. Parent buat anak di global children
   └── children: { ownerId: parent_001, name: "Budi", allergies: [...] }
        ↓
2. Parent enroll ke daycare
   └── parents: created (snapshot parent di daycare)
   └── children_daycare: {
         globalChildId: children_001,  ← link ke global
         profile: { ...snapshot... },
         customData: { customName: "Budi Kecil" }
       }
        ↓
3. Contract dibuat
   └── contracts: { parentId, childIds: [children_daycare_001] }


Scenario 2: Daycare daftarkan anak langsung (tanpa global children)

1. Daycare admin input data anak baru
   └── parents: created (jika parent belum ada)
   └── children_daycare: {
         globalChildId: null,  ← tidak ada link ke global
         profile: { name: "Ani", ... },
         customData: { ... }
       }
        ↓
2. Contract dibuat
   └── contracts: { parentId, childIds: [children_daycare_002] }
```

### 5.7 Activity Timeline (Parent + Daycare)

**Use Case: Activity dari berbagai sumber dalam satu timeline**

```
┌──────────────────────────────────────────────────────────────┐
│ Scenario: Anak "Budi" enroll daycare + activity di rumah     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Senin, 20 Feb 2026                                           │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 07:00  │ 🏠 activities (parent)                          │ │
│ │        │ Makan Pagi (input oleh: Ibu)                    │ │
│ │        │ source: parent, daycareId: null                 │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 08:00  │ 🏫 daily_care_records (daycare)                 │ │
│ │        │ Check-in (foto drop-off)                        │ │
│ │        │ source: daycare, daycareId: daycare_ceria       │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 08:30  │ 🏫 daily_care_records (daycare)                 │ │
│ │        │ Makan Pagi Ceria (input oleh: Sitter Ani)       │ │
│ │        │ source: daycare, daycareId: daycare_ceria       │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 12:00  │ 🏫 daily_care_records (daycare)                 │ │
│ │        │ Tidur Siang (input oleh: Sitter Ani)            │ │
│ │        │ source: daycare, daycareId: daycare_ceria       │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 17:00  │ 🏫 daily_care_records (daycare)                 │ │
│ │        │ Check-out (foto pick-up)                        │ │
│ │        │ source: daycare, daycareId: daycare_ceria       │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 18:00  │ 🏠 activities (parent)                          │ │
│ │        │ Mandi Malam (input oleh: Ayah)                  │ │
│ │        │ source: parent, daycareId: null                 │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 19:00  │ 🏠 activities (parent)                          │ │
│ │        │ Story Time (input oleh: Ibu)                    │ │
│ │        │ source: parent, daycareId: null                 │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Sabtu, 21 Feb 2026 (Weekend - tidak ada daycare)             │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 09:00  │ 🏠 activities (parent)                          │ │
│ │        │ Taman Bermain (input oleh: Ayah)                │ │
│ │        │ source: parent, daycareId: null                 │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 12:00  │ 🏠 activities (guardian - Nenek)                │ │
│ │        │ Makan Siang di Rumah Nenek (input: Nenek)       │ │
│ │        │ source: guardian, daycareId: null               │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

Benefit:
- Parent lihat complete timeline aktivitas anak
- Weekend/hari libur tetap ada record aktivitas
- Guardian lain (nenek, kakek) bisa ikut input activity
- Daycare tetap punya kontrol penuh atas activity di daycare
```

**Query untuk Timeline:**
```graphql
query {
  childActivityTimeline(
    childId: "child_001"
    startDate: "2026-02-20"
    endDate: "2026-02-21"
  ) {
    date
    startTime
    endTime
    activityName
    category
    source  # parent, guardian, daycare
    loggedBy { name, relation }
    ... on MealActivity { mealType, menu, eaten }
    ... on NapActivity { quality, duration }
    ... on PlayActivity { mood, photos }
  }
}
```

### 5.8 Use Case: Multiple Children Collections

```
┌──────────────────────────────────────────────────────────────┐
│ children (global)                                            │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ child_001: { ownerId: parent_001, name: "Budi" }         │ │
│ │ child_002: { ownerId: parent_002, name: "Siti" }         │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ enroll ke daycare
                          ▼
┌──────────────────────────────────────────────────────────────┐
│ children_daycare (per daycare)                               │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Daycare "Ceria":                                         │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │ cd_001: { globalChildId: child_001, customName: ... }│ │ │
│ │ │ cd_002: { globalChildId: child_002, customName: ... }│ │ │
│ │ │ cd_003: { globalChildId: null, name: "Ani" }         │ │ │ ← hanya di daycare ini
│ │ └──────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Daycare "Ceria 2":                                       │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │ cd_004: { globalChildId: child_001, customName: ... }│ │ │ ← child yang sama, daycare beda
│ │ └──────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

Benefit:
- Parent punya kontrol penuh atas data anak global
- Daycare bisa customize data tanpa affect global data
- Anak bisa enroll multiple daycare dengan data berbeda per daycare
- Ada anak yang hanya terdaftar di 1 daycare (tanpa global children)
```

---

## 6. Features by Role

### 6.1 Super Admin
| Feature | Deskripsi |
|---------|-----------|
| Register Daycare | Daftarkan daycare baru |
| Approve Daycare | Approve registrasi daycare (jika self-register) |
| Invoice Management | Hitung & generate invoice bulanan untuk daycare |
| Dashboard | Lihat total daycare, kontrak aktif, revenue |

### 6.2 Daycare Owner
| Feature | Deskripsi |
|---------|-----------|
| Dashboard | Lihat laporan keuangan & okupansi |
| Contracts | Lihat semua kontrak aktif |
| Staff Payments | Kelola pembayaran staff |

### 6.3 Daycare Admin
| Feature | Deskripsi |
|---------|-----------|
| Manage Parents | Daftar/edit parent (snapshot dari user + customData) |
| Manage Children | Daftar/edit child (profile, medical, preferences, customData) |
| Manage Contracts | Buat/edit kontrak (referensi ke parent + childIds) |
| Master Activities | Definisikan jenis aktivitas (makan, tidur, dll) |
| Schedule Templates | Buat template jadwal harian |
| Weekly Schedules | Assign sitter & atur jadwal mingguan |
| Daily Care Records | Input/catat aktivitas harian anak |
| Menus | Atur menu makanan dengan info alergi |
| Gallery | Kelola galeri foto |
| Invoices | Generate invoice untuk parent |

### 6.4 Sitter/Guru
| Feature | Deskripsi |
|---------|-----------|
| View Schedule | Lihat jadwal harian & assigned children |
| Check-in/out Anak | Input attendance dengan foto |
| Log Activities | Catat aktivitas (makan, tidur, main) |
| Log Meals & Naps | Catat detail makan & tidur |
| View Child Info | Lihat info anak (alergi, medical notes) |

### 6.5 Orang Tua/Wali
| Feature | Deskripsi |
|---------|-----------|
| View Contracts | Lihat kontrak aktif dengan daycare |
| View Daily Reports | Lihat laporan harian per anak |
| View Attendance | Lihat riwayat check-in/out |
| View Activities | Lihat aktivitas anak (foto, mood, dll) |
| View Health Records | Lihat riwayat kesehatan |
| View Menus | Lihat menu makanan daycare |
| View Gallery | Lihat galeri foto anak |
| Self-input Health | Input riwayat sakit/obat mandiri |
| Notifications | Terima notifikasi real-time |

---

## 7. Multi-Tenancy Model

### 7.1 Data Isolation
```
┌─────────────────────────────────────────────────────────┐
│                    SHARED COLLECTIONS                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │    users    │  │   daycares  │  │ master_activities│  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              MULTI-TENANT COLLECTIONS                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  daycare A  │  │  daycare B  │  │  daycare C  │      │
│  │  contracts  │  │  contracts  │  │  contracts  │      │
│  │  daily care │  │  daily care │  │  daily care │      │
│  │  schedules  │  │  schedules  │  │  schedules  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Parents & Children Snapshot Pattern
- `parents` dan `children_daycare` adalah snapshot saat pertama kali enroll di daycare
- Update profil user di `users` collection **tidak** mengubah data di `parents`/`children_daycare`
- Update data anak di `children` (global) **tidak** mengubah data di `children_daycare`
- Daycare bisa tambah `customData` (no rekening, catatan khusus, dll)
- Custom name/photo per daycare disimpan di `children_daycare.customData`
- Riwayat daily care tetap visible walau contract expired atau child exited

### 7.3 GlobalChildId Pattern
- `globalChildId` = Optional link ke `children` collection
- Jika **ada**: Anak dimiliki parent di global, enroll ke daycare → link ke global
- Jika **null**: Anak hanya ada di daycare ini (daftaran daycare langsung, tanpa global children)
- Benefit: Fleksibel untuk 2 use case:
  1. Parent daftar anak → enroll daycare (ada link ke global)
  2. Daycare daftarkan anak langsung (tanpa global children)

### 7.4 Multi-Daycare & Re-Enroll Support
- Satu anak (global) bisa enroll di **multiple daycare** berbeda
- Contoh: Child A enroll di Daycare X (Jan 2026), Daycare Y (Feb 2026)
- Setiap enroll → `children_daycare` baru per daycare, dengan `globalChildId` yang sama
- Contract baru dibuat per enrollment
- Daily care records tersimpan per `children_daycare`

---

## 8. Master Activities & Schedule Templates

### 8.1 Category Enum & Default Field Config

Setiap category memiliki **default field config** yang otomatis diterapkan. Daycare bisa override saat membuat master activity.

> **💡 Note:**
> - **12 categories di atas adalah default** — daycare bisa buat **category custom** sendiri (misal: "sensory", "music", "cooking")
> - **Field config adalah fleksibel** — daycare bisa customize/tambah fields sesuai kebutuhan
> - Contoh: Daycare ingin track "screen_time" → buat field baru `screenTime: boolean`
> - Sistem akan tetap menerima activity dengan category/fields custom (no validation strict)

#### Field Config Options
```typescript
type FieldConfig = {
  mealType?: boolean;      // breakfast, snack, lunch, dinner
  menu?: string;           // nama menu
  eaten?: boolean;         // all, some, none
  quality?: boolean;       // good, restless, short
  toiletingType?: boolean; // urine, bowel
  toiletingNotes?: string; // catatan BAB/BAK
  mood?: boolean;          // happy, sleepy, fussy, energetic, neutral
  photos?: boolean;        // array of URLs
  description?: string;    // catatan tambahan
  intensity?: boolean;     // low, medium, high
  location?: string;       // lokasi outdoor
  materials?: string;      // bahan yang digunakan
}
```

#### Category Definitions

| Category | Default Field Config | Deskripsi | Contoh Master Activity |
|----------|---------------------|-----------|----------------------|
| **meal** | `{ mealType: true, menu: true, eaten: true, mood: true }` | Aktivitas makan/minum | "Makan Pagi Ceria", "Snack Sore", "Makan Siang Bergizi" |
| **nap** | `{ quality: true, mood: true }` | Tidur/istirahat | "Tidur Siang Nyenyak", "Quiet Time", "Istirahat Pagi" |
| **toileting** | `{ toiletingType: true, toiletingNotes: true }` | BAB/BAK, toilet training | "Toilet Training Pagi", "Ganti Popok" |
| **care** | `{ mood: true, photos: true, description: true }` | Perawatan diri | "Mandi Ceria", "Gosok Gigi", "Ganti Baju", "Cuci Tangan" |
| **play** | `{ mood: true, photos: true, description: true }` | Bermain bebas | "Main Balok", "Main Peran", "Main Pasir", "Puzzle" |
| **learning** | `{ mood: true, photos: true, description: true }` | Belajar terstruktur | "Mengenal Huruf A", "Berhitung 1-10", "Mengenal Warna" |
| **creative** | `{ materials: true, photos: true, description: true }` | Seni & kreativitas | "Menggambar Bebas", "Mewarnai Hewan", "Craft Kertas" |
| **physical** | `{ intensity: true, mood: true }` | Aktivitas fisik | "Senam Pagi Ceria", "Dancing", "Yoga Anak" |
| **outdoor** | `{ location: true, photos: true, description: true }` | Luar ruangan | "Jalan ke Taman", "Playground", "Nature Walk" |
| **routine** | `{ mood: true, description: true }` | Rutinitas harian | "Circle Time Pagi", "Story Time", "Clean Up" |
| **social** | `{ mood: true, photos: true, description: true }` | Interaksi sosial | "Sharing Session", "Show & Tell", "Main Kelompok" |
| **development** | `{ mood: true, photos: true, description: true }` | Perkembangan skill | "Sorting Shapes", "Stacking Blocks", "Sensory Play" |

### 8.2 Field Config System

Master activity mendefinisikan fields apa yang perlu diisi saat log activity:

**Cara Kerja:**
1. Saat buat master activity baru → system auto-apply default fieldConfig dari category
2. Daycare bisa override/customize fieldConfig sesuai kebutuhan
3. Saat sitter log activity → form muncul sesuai fieldConfig

**Contoh Custom Category & Field Config:**

```json
// Custom category: "music" (tidak ada di default)
{
  "name": "Musik & Lagu",
  "category": "music",  // custom category
  "fieldConfig": {
    "songTitle": true,      // custom field
    "instruments": true,    // custom field
    "mood": true,
    "photos": true
  }
}

// Custom category: "cooking" (tidak ada di default)
{
  "name": "Memasak Bersama",
  "category": "cooking",  // custom category
  "fieldConfig": {
    "recipe": true,         // custom field
    "ingredients": true,    // custom field
    "result": true,         // custom field
    "photos": true
  }
}

// Custom category: "sensory" dengan override
{
  "name": "Sensory Play",
  "category": "sensory",  // custom category
  "fieldConfig": {
    "materials": true,      // dari default creative
    "textures": true,       // custom field
    "messyLevel": true,     // custom field: low, medium, high
    "mood": true
  }
}
```

> **💡 Note:**
> - Custom category tidak punya default fieldConfig — daycare harus define sendiri
> - Custom fields akan tersimpan di activity log (no schema validation)
> - Frontend perlu handle dynamic fields dengan fleksibel

**Contoh Master Activity (Default Category dengan Override):**
```json
{
  "name": "Makan Pagi Ceria",
  "category": "meal",
  "fieldConfig": {
    "mealType": true,
    "menu": true,
    "eaten": true,
    "quality": false,
    "toiletingType": false,
    "toiletingNotes": false,
    "mood": true,
    "photos": true,
    "description": false,
    "intensity": false,
    "location": false,
    "materials": false
  }
}
```

**Form yang muncul saat sitter log activity:**
```
┌────────────────────────────────┐
│ Log: Makan Pagi Ceria          │
├────────────────────────────────┤
│ Start Time: [08:00]            │
│ End Time:   [08:30]            │
│                                │
│ Meal Type:  [breakfast ▼]      │ ← fieldConfig.mealType = true
│ Menu:       [Nasi tim ayam]    │ ← fieldConfig.menu = true
│ Eaten:      [all ▼]            │ ← fieldConfig.eaten = true
│                                │
│ Mood:       [happy ▼]          │ ← fieldConfig.mood = true
│ Photos:     [📷 Upload]        │ ← fieldConfig.photos = true
│                                │
│ [Save]                         │
└────────────────────────────────┘
```

**Hasil log activity di daily_care_records:**
```json
{
  "activityName": "Makan Pagi Ceria",
  "category": "meal",
  "startTime": "08:00",
  "endTime": "08:30",
  "mealType": "breakfast",
  "menu": "Nasi tim ayam",
  "eaten": "all",
  "mood": "happy",
  "photos": ["url1", "url2"]
}
```

### 8.3 Schedule Template
Contoh template "Routine Harian":

```json
{
  "name": "Routine Harian",
  "dayOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "activities": [
    { "masterActivityId": "...", "activityName": "Makan Pagi", "startTime": "08:00", "endTime": "08:30", "category": "meal" },
    { "masterActivityId": "...", "activityName": "Main Bebas", "startTime": "08:30", "endTime": "09:30", "category": "play" },
    { "masterActivityId": "...", "activityName": "Belajar", "startTime": "09:30", "endTime": "10:15", "category": "learning" },
    { "masterActivityId": "...", "activityName": "Makan Siang", "startTime": "11:00", "endTime": "11:45", "category": "meal" },
    { "masterActivityId": "...", "activityName": "Tidur Siang", "startTime": "12:00", "endTime": "14:00", "category": "nap" },
    { "masterActivityId": "...", "activityName": "Makan Sore", "startTime": "14:00", "endTime": "14:30", "category": "meal" },
    { "masterActivityId": "...", "activityName": "Outdoor", "startTime": "15:00", "endTime": "16:00", "category": "play" }
  ]
}
```

### 8.4 Weekly Schedule dari Template
- Admin pilih template → auto-populate jadwal mingguan
- Assign sitter ke setiap activity
- Bisa override manual jika perlu

---

## 9. Daily Care Record Flow

### 9.1 Structure
```
daily_care_records (per date)
│
├── child_1
│   ├── attendance: { checkIn, checkOut, status }
│   ├── assignedSitters: [{ name, shift }]
│   │     └── (predefined dari weekly schedule)
│   └── activities: [
│       { category: "meal", startTime, endTime, ...meal specifics },
│       { category: "nap", startTime, endTime, ...nap specifics },
│       { category: "toileting", startTime, ...toileting specifics },
│       { category: "play", startTime, endTime, ... },
│       { category: "learning", startTime, endTime, ... },
│       { category: "care", startTime, endTime, ... }
│     ]
│
├── child_2
│   └── ...
│
└── child_N
    └── ...
```

### 9.2 Workflow

**H-1 (Planning):**
```
Admin/Sitter → Buat weekly schedule → Assign sitter ke anak
                ↓
        Sitter bisa lihat:
        - Anak siapa yang akan dijaga
        - Activities apa yang akan dilakukan
```

**Hari-H (Execution):**
```
07:00  Check-in (foto, parent notification)
       ↓
08:00  Activity: Makan Pagi (category: meal, startTime, endTime)
       ↓
09:00  Activity: Main Bebas (category: play, startTime, endTime)
       ↓
09:30  Activity: Tidur Pagi (category: nap, startTime, endTime)
       ↓
10:15  Activity: Toileting (category: toileting, startTime)
       ↓
11:00  Activity: Makan Siang (category: meal, startTime, endTime)
       ↓
12:00  Activity: Tidur Siang (category: nap, startTime, endTime)
       ↓
14:00  Activity: Makan Sore (category: meal, startTime, endTime)
       ↓
15:00  Activity: Outdoor (category: play, startTime, endTime)
       ↓
17:00  Check-out (foto, parent notification)
       ↓
[End of day] → Report visible to parent
```

### 9.3 Activity Logging

Sitter log activity berdasarkan master activity yang sudah didefinisikan:

```
1. Sitter pilih activity dari list (misal: "Makan Pagi Ceria")
   ↓
2. System load fieldConfig dari master activity
   ↓
3. Form muncul dengan fields yang sesuai (dynamic form)
   ↓
4. Sitter isi:
   - startTime, endTime (wajib semua activity)
   - Dynamic fields sesuai fieldConfig (mealType, menu, mood, dll)
   ↓
5. Save → tersimpan di daily_care_records.activities
```

**Contoh Flow:**

| Master Activity | Category | Fields yang Muncul |
|-----------------|----------|-------------------|
| "Makan Pagi Ceria" | meal | startTime, endTime, mealType, menu, eaten, mood, photos |
| "Tidur Siang Nyenyak" | nap | startTime, endTime, quality, mood |
| "Toilet Training" | toileting | startTime, toiletingType, toiletingNotes |
| "Main Balok" | play | startTime, endTime, mood, photos, description |
| "Senam Pagi" | physical | startTime, endTime, intensity, mood |
| "Jalan ke Taman" | outdoor | startTime, endTime, location, photos, description |

---

## 10. Pricing Model

### 10.1 Invoice Structure
| Service Type | Calculation | Example |
|--------------|-------------|---------|
| **Monthly** | Fixed per child/month | Rp 50.000 × jumlah anak |
| **Weekly** | Pro-rate (25% monthly) | (Rp 50.000 / 4) × jumlah anak |
| **Daily** | Pro-rate (1/30 monthly) | (Rp 50.000 / 30) × jumlah anak × hari |

### 10.2 Billing Cycle
- **Invoice generated**: Awal bulan
- **Due date**: 7 hari dari invoice date
- **No payment gateway**: Manual transfer & konfirmasi

---

## 11. Notifications

### 11.1 Notification Types
| Recipient | Trigger | Channel |
|-----------|---------|---------|
| Parent | Child check-in | Push + In-app |
| Parent | Child check-out | Push + In-app |
| Parent | New daily report ready | Push + In-app |
| Parent | Health record added | Push + In-app |
| Parent | New invoice | Push + In-app |
| Sitter | Shift assigned | Push + In-app |
| Admin | Payment received | Push + In-app |

---

## 12. API Structure (GraphQL)

### 12.1 Queries
```graphql
# Auth
query { me { id, email, name, roles } }

# Daycare
query { daycares { id, name, status } }
query { daycare(id: ID!) { ...DaycareDetails } }

# Contracts
query { myContracts { id, daycare { name }, children, status } }
query { daycareContracts(daycareId: ID!) { ...Contract } }

# Daily Care
query { dailyReport(date: Date!, childName: String) { ...DailyCareRecord } }
query { childReports(childName: String!, month: String) { [...DailyCareRecord] } }

# Schedule
query { weeklySchedule(weekStart: Date!) { ...WeeklySchedule } }
query { scheduleTemplates { ...ScheduleTemplate } }

# Master Activities
query { masterActivities { id, name, category, icon, color } }

# Invoices
query { myInvoices { ...Invoice } }
query { daycareInvoices(daycareId: ID!) { ...Invoice } }
```

### 12.2 Mutations
```graphql
# Auth
mutation { login(email: String!, password: String!) { token, refreshToken } }
mutation { refreshToken(refreshToken: String!) { token, refreshToken } }
mutation { logout }

# Contract
mutation { createContract(input: CreateContractInput!) { contract } }
mutation { updateContractStatus(id: ID!, status: String!) { contract } }

# Daily Care
mutation { createDailyRecord(input: DailyRecordInput!) { record } }
mutation { updateDailyRecord(id: ID!, input: DailyRecordInput!) { record } }
mutation { checkIn(input: CheckInInput!) { record } }
mutation { checkOut(input: CheckOutInput!) { record } }

# Master Activity
mutation { createMasterActivity(input: MasterActivityInput!) { activity } }
mutation { updateMasterActivity(id: ID!, input: MasterActivityInput!) { activity } }

# Schedule
mutation { createScheduleTemplate(input: TemplateInput!) { template } }
mutation { createWeeklySchedule(input: WeeklyScheduleInput!) { schedule } }
mutation { assignSitter(input: AssignSitterInput!) { schedule } }

# Admin
mutation { registerDaycare(input: RegisterDaycareInput!) { daycare } }
mutation { approveDaycare(daycareId: ID!) { daycare } }
mutation { generateInvoice(contractId: ID!) { invoice } }
```

---

## 13. Security Considerations

### 13.1 Authentication
- Password hashing (bcrypt/argon2)
- JWT expiry: 15 menit
- Refresh token expiry: 7 hari
- Refresh token rotation

### 13.2 Authorization
- Role-based access control (RBAC)
- Multi-tenant isolation (daycareId validation)
- Parent can only see their children (via contract)
- Sitter can only see assigned children

### 13.3 Data Privacy
- Foto & data anak hanya visible ke authorized users
- Health data encrypted at rest
- Audit log untuk akses data sensitif

---

## 14. Phase Planning

### Phase 1 (MVP)
- [ ] Authentication (login, JWT, refresh)
- [ ] User & Daycare registration
- [ ] Master Activities CRUD
- [ ] Contract creation
- [ ] Daily Care Record (attendance + basic activities)
- [ ] Check-in/out with photo + notification
- [ ] Parent dashboard (view daily reports)
- [ ] Sitter dashboard (log activities)
- [ ] Admin dashboard (manage contracts)

### Phase 2
- [ ] Schedule Templates
- [ ] Weekly Schedules with sitter assignment
- [ ] Health Records
- [ ] Menus with allergen info
- [ ] Photo Gallery
- [ ] Invoice system
- [ ] Staff payments

### Phase 3 (Future)
- [ ] Email notifications
- [ ] Messaging/chat
- [ ] Rating & review
- [ ] Payment gateway integration
- [ ] Dark mode
- [ ] Analytics & reports export

---

## 15. Success Metrics

| Metric | Target |
|--------|--------|
| Daycare onboarded | 10 daycare dalam 3 bulan |
| Active contracts | 200+ kontrak aktif |
| Daily records logged | 500+ per hari |
| App rating | 4.5+ stars |
| Uptime | 99.5% |

---

## 16. Appendix

### 16.1 Glossary
- **Contract**: Service agreement antara daycare & parent (referensi ke parent + childIds di children_daycare)
- **Parents**: Snapshot data parent per daycare (user data + customData seperti no rekening, notes)
- **Children (Global)**: Data anak yang dimiliki parent (ownerId), belum tentu enroll daycare
- **Children_daycare**: Snapshot data child per daycare (bisa link ke global children via globalChildId)
- **GlobalChildId**: Optional reference ke collection children (null jika anak hanya terdaftar di daycare ini)
- **Guardians**: User yang punya akses ke child (dengan permissions tertentu)
- **Medical Records**: Riwayat penyakit/kesehatan anak (illness, injury, chronic_condition, allergy, medication)
- **Activities**: Activity yang diinput parent/guardian (di rumah, weekend, liburan) - bisa digabung dengan daycare activity dalam satu timeline
- **Master Activity**: Template jenis aktivitas dengan category dan fieldConfig
- **Category**: Klasifikasi activity (12 default + custom category dari daycare)
- **Field Config**: Konfigurasi fields yang muncul saat sitter log activity (auto-apply dari category, bisa di-customize, support custom fields)
- **Schedule Template**: Routine jadwal yang bisa direuse
- **Daily Care Record**: Laporan harian lengkap per anak (attendance + activities dengan dynamic fields)
- **Sitter**: Pengasuh/guru di daycare

### 16.2 References
- MongoDB Atlas: https://www.mongodb.com/atlas
- Deno Deploy: https://deno.com/deploy
- Expo: https://expo.dev
- GraphQL: https://graphql.org

---

**Document Version**: 2.0  
**Last Updated**: 2026-02-23  
**Status**: Draft
