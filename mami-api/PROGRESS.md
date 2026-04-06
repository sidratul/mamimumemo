# Mami API - Implementation Progress

## ✅ Modules Completed (16 modules)

| # | Module | Path | Status | Files |
|---|--------|------|--------|-------|
| 1 | **Auth** | `src/auth/` | ✅ Complete | 8 files |
| 2 | **Children** | `src/children/` | ✅ Complete | 8 files |
| 3 | **Medical Records** | `src/medical_records/` | ✅ Complete | 8 files |
| 4 | **Activities** | `src/activities/` | ✅ Complete | 8 files |
| 5 | **Parents** | `src/parents/` | ✅ Complete | 8 files |
| 6 | **Children Daycare** | `src/children_daycare/` | ✅ Complete | 8 files |
| 7 | **Contracts** | `src/contracts/` | ✅ Complete | 8 files |
| 8 | **Master Activities** | `src/master_activities/` | ✅ Complete | 8 files |
| 9 | **Daily Care Records** | `src/daily_care_records/` | ✅ Complete | 8 files |
| 10 | **Schedule Templates** | `src/schedule_templates/` | ✅ Complete | 8 files |
| 11 | **Weekly Schedules** | `src/weekly_schedules/` | ✅ Complete | 8 files |
| 12 | **Invoices** | `src/invoices/` | ✅ Complete | 8 files |
| 13 | **Staff Payments** | `src/staff_payments/` | ✅ Complete | 8 files |
| 14 | **Menus** | `src/menus/` | ✅ Complete | 8 files |
| 15 | **Gallery** | `src/gallery/` | ✅ Complete | 8 files |
| 16 | **Notifications** | `src/notifications/` | ✅ Complete | 8 files |

**Total: 128 files created**

---

## 🎉 ALL MODULES COMPLETE!

---

## 📊 Module Details

### 1. Auth ✅
- **Purpose**: User authentication & management
- **Features**: Register, Login, Get Profile
- **Roles**: SUPER_ADMIN, DAYCARE_OWNER, DAYCARE_ADMIN, DAYCARE_SITTER, PARENT
- **Schema**: `users`

### 2. Children ✅
- **Purpose**: Global children data (parent-owned)
- **Features**: 
  - Create/update child with profile & medical info
  - Add/remove guardians with permissions
  - Access control (owner & guardians)
- **Guardian Permissions**: VIEW_REPORTS, INPUT_ACTIVITY, INPUT_HEALTH, ENROLL_DAYCARE, EDIT_PROFILE, MANAGE_GUARDIANS
- **Schema**: `children`

### 3. Medical Records ✅
- **Purpose**: Child medical history
- **Types**: illness, injury, chronic_condition, allergy, medication
- **Features**: Create, update, delete medical records
- **Access**: Owner & guardians only
- **Schema**: `medical_records`

### 4. Activities ✅ (NEW)
- **Purpose**: Activities logged by parent/guardian at home
- **Features**:
  - Create activity with dynamic fields
  - Activity timeline (parent + daycare)
  - Category-based fields (meal, nap, toileting, play, etc.)
- **Categories**: meal, nap, toileting, care, play, learning, creative, physical, outdoor, routine, social, development
- **Schema**: `activities`

### 5. Parents ✅ (NEW)
- **Purpose**: Parent snapshot in daycare
- **Features**:
  - Parent enrollment in daycare
  - Custom data (emergency contact, pickup authorization)
  - Soft delete (deactivate)
- **Schema**: `parents`

### 6. Children Daycare ✅
- **Purpose**: Child snapshot in daycare
- **Features**:
  - Link to global child (optional)
  - Custom data per daycare (custom name, photo, preferences)
  - Medical & preferences per daycare
  - Soft delete (deactivate)
- **Schema**: `children_daycare`

### 7. Contracts ✅ (NEW)
- **Purpose**: Service agreement between daycare & parent
- **Features**:
  - Service types: daily, weekly, monthly
  - Contract status: active, expired, terminated
  - Auto-check expired contracts
  - Find expiring contracts (within 7 days)
- **Schema**: `contracts`

### 8. Master Activities ✅
- **Purpose**: Activity templates for daycare
- **Features**:
  - 12 activity categories
  - Default field config per category
  - Custom field config override
  - Icon & color for UI
- **Default Field Configs**:
  - meal: {mealType, menu, eaten, mood}
  - nap: {quality, mood}
  - toileting: {toiletingType, toiletingNotes}
  - play/learning: {mood, photos, description}
  - creative: {materials, photos, description}
  - physical: {intensity, mood}
  - outdoor: {location, photos, description}
- **Schema**: `master_activities`

### 9. Daily Care Records ✅
- **Purpose**: Daily reports from daycare (attendance + activities)
- **Features**:
  - Check-in/out dengan foto
  - Assigned sitters per child
  - Activities (same structure as global activities)
  - Upsert per day
  - Log activity per child
- **Subdocuments**:
  - `attendance` (checkIn, checkOut, status)
  - `activities[]` (meal, nap, play, etc.)
  - `assignedSitters[]` (userId, shift)
- **Schema**: `daily_care_records`

### 10. Schedule Templates ✅ (NEW)
- **Purpose**: Reusable schedule templates for daycare
- **Features**:
  - Template name (e.g., "Routine Harian", "Weekend Special")
  - Multiple days of week (monday-sunday)
  - Activities with start/end time
  - Default sitter role per activity
  - Active/inactive status
- **Use Case**: Apply template to weekly schedule for quick setup
- **Schema**: `schedule_templates`

### 11. Weekly Schedules ✅ (NEW)
- **Purpose**: Weekly schedule with child assignments and sitter allocations
- **Features**:
  - Week start/end dates
  - Daily schedules (7 days)
  - Child assignments per day with sitter assignments
  - Activities per day (from template or custom)
  - Assign sitter to child for specific date
  - Virtual fields: isPast, isCurrent
- **Use Case**: Plan weekly activities and assign sitters to children
- **Schema**: `weekly_schedules`

### 12. Invoices ✅ (NEW)
- **Purpose**: Billing system for daycare services
- **Features**:
  - Invoice per contract (parent)
  - Line items with quantity & unit price
  - Status: pending, paid, overdue, cancelled
  - Auto-mark as overdue (past due date)
  - Period-based billing (start/end date)
  - Due date tracking
  - Mark as paid with payment date
- **Virtual fields**: isOverdue
- **Schema**: `invoices`

### 13. Staff Payments ✅ (NEW)
- **Purpose**: Payroll system for daycare staff
- **Features**:
  - Payment per staff per period
  - Daily rate calculation
  - Days worked tracking
  - Deductions (tax, insurance, etc.)
  - Net amount calculation (gross - deductions)
  - Status: pending, paid, cancelled
  - Payment date tracking
- **Virtual fields**: total (auto-calculated from amount - deductions)
- **Schema**: `staff_payments`

### 14. Menus ✅ (NEW)
- **Purpose**: Meal planning with allergen information
- **Features**:
  - Daily menu (breakfast, snack, lunch, dinner)
  - Ingredients list
  - Allergen tracking
  - Notes for special dietary needs
- **Schema**: `menus`

### 15. Gallery ✅ (NEW)
- **Purpose**: Photo sharing for daycare activities
- **Features**:
  - General gallery (daycare-wide events)
  - Child-specific gallery
  - Multiple photos per item
  - Caption & event tagging
  - Uploaded by tracking
- **Schema**: `gallery`

### 16. Notifications ✅ (NEW)
- **Purpose**: In-app & push notifications
- **Features**:
  - Multiple notification types (attendance, activity, health, invoice, schedule, general)
  - Read/unread status
  - Bulk notifications
  - Auto-expire (TTL index)
  - User-specific notifications
- **Schema**: `notifications`

---

## 🎉 ALL MODULES COMPLETE!

**No remaining modules!**

---

## 📦 Shared Schemas

### User References (`shared/schemas/user-refs.schema.ts`)

Reusable subdocument schemas untuk user references di semua collection:

| Schema | Fields | Used By |
|--------|--------|---------|
| `userRefSchema` | userId, name, email, phone, role | createdBy, updatedBy |
| `staffRefSchema` | userId, name, role | staff_payments.staff |
| `parentRefSchema` | userId, name, email, phone | invoices.parent |
| `guardianUserRefSchema` | userId, name, email, phone, role | children.guardians |
| `simpleUserRefSchema` | userId, name | loggedBy, uploadedBy, attendance.by |
| `assignedUserRefSchema` | userId, name, shift | assignedSitters |

**Benefits:**
- ✅ Consistent user data structure across all collections
- ✅ No indexing on subdocuments (faster writes)
- ✅ Snapshot data (tidak terpengaruh update user)
- ✅ Easier maintenance (change in one place)

---

## 📋 Summary

| # | Module | Path |
|---|--------|------|
| 12 | **Invoices** | `src/invoices/` |
| 13 | **Staff Payments** | `src/staff_payments/` |
| 14 | **Menus** | `src/menus/` |
| 15 | **Gallery** | `src/gallery/` |
| 16 | **Notifications** | `src/notifications/` |

---

## 🔧 Shared Components

### Enums (`shared/enums/`)
- ✅ `enum.ts` - UserRole, ResponseStatus, HttpStatus
- ✅ `constant.ts` - MESSAGES (auth, general, children, medical_records)

### Database (`shared/database/`)
- ✅ `mongo.ts` - MongoDB connection with Mongoose

### Config (`shared/config/`)
- ✅ `context.ts` - AppContext class
- ✅ `auth-context.ts` - JWT auth context creation
- ✅ `env.ts` - Environment validation

### Guards (`shared/guards/`)
- ✅ `authorization.guard.ts` - isAuthenticated check

### Scalar (`shared/scalar/`)
- ✅ `scalar.resolver.ts` - ObjectId, Date scalars

### Types (`shared/types/`)
- ✅ `shared.type.ts` - Base type definitions

### Utils (`shared/utils/`)
- ✅ `jwt.ts` - JWT token creation/verification

---

## 📱 API Usage Examples

### Register & Login
```graphql
mutation {
  register(input: {
    name: "Ibu Budi"
    email: "ibu@example.com"
    password: "password123"
    role: PARENT
  }) { id, message }
}

mutation {
  login(input: {
    email: "ibu@example.com"
    password: "password123"
  }) { token }
}
```

### Create Child & Add Guardian
```graphql
mutation {
  createChild(input: {
    profile: { name: "Budi", birthDate: "2023-01-15", gender: MALE }
    medical: { allergies: ["Susu"] }
  }) { id }
  
  addGuardian(childId: "xxx", input: {
    userId: "ayah_id"
    relation: FATHER
    permissions: [VIEW_REPORTS, INPUT_ACTIVITY, INPUT_HEALTH]
  }) { id }
}
```

### Create Medical Record
```graphql
mutation {
  createMedicalRecord(input: {
    childId: "xxx"
    type: ILLNESS
    name: "Demam Berdarah"
    diagnosis: "DBD Grade II"
    symptoms: ["Demam tinggi", "Bintik merah"]
    severity: HIGH
    reportedBy: { userId: "user_id", name: "Ibu Budi", relation: "mother" }
  }) { id, status }
}
```

### Create Activity (at home)
```graphql
mutation {
  createActivity(input: {
    childId: "xxx"
    activityName: "Makan Malam"
    category: MEAL
    date: "2026-02-23"
    startTime: "19:00"
    endTime: "19:30"
    menu: "Nasi goreng"
    eaten: ALL
    mood: HAPPY
  }) { id }
}
```

### Get Activity Timeline
```graphql
query {
  activityTimeline(input: {
    childId: "xxx"
    startDate: "2026-02-20"
    endDate: "2026-02-23"
    includeDaycare: true
  }) {
    date
    activities {
      activityName
      startTime
      source # PARENT, GUARDIAN, or DAYCARE
    }
  }
}
```

### Enroll Parent & Child to Daycare
```graphql
mutation {
  createParent(input: {
    daycareId: "daycare_123"
    user: { userId: "user_456", name: "Ibu Budi", email: "...", phone: "...", role: PARENT }
    customData: { 
      deskripsi: "No rek: 123456"
      emergencyContact: { name: "Ayah Budi", phone: "0812-xxx", relation: "father" }
    }
  }) { id }
  
  createChildrenDaycare(input: {
    daycareId: "daycare_123"
    parentId: "parent_789"
    globalChildId: "child_abc" # optional
    profile: { name: "Budi", birthDate: "2023-01-15", gender: MALE }
    customData: { customName: "Budi Kecil" }
  }) { id }
}
```

---

## 🚀 How to Run

```bash
cd /Users/sidr/Documents/learn/daycare/mami-api

# Set environment
cp .env.example .env
# Edit .env dengan MONGO_URI dan JWT_SECRET

# Run server
deno task start
```

GraphQL Playground: `http://localhost:8000/graphql`

---

## 📖 Documentation

- [SPECIFICATION.md](../../SPECIFICATION.md) - Full specification
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details
- [README_MODULES.md](./README_MODULES.md) - Module documentation

---

**Last Updated**: 2026-02-23  
**Modules Completed**: 16/16  
**Status**: 🎉 ALL COMPLETE - READY FOR PRODUCTION!
