# Technical Development Design (TDD)
## Mami API - Daycare Management System

**Version:** 1.0  
**Last Updated:** 2026-02-23  
**Purpose:** Panduan lengkap queries, mutations, dan fields untuk frontend development

---

## 📋 Table of Contents

1. [Authentication Module](#1-authentication-module)
2. [Children Module](#2-children-module)
3. [Medical Records Module](#3-medical-records-module)
4. [Activities Module](#4-activities-module)
5. [Parents Module](#5-parents-module)
6. [Children Daycare Module](#6-children-daycare-module)
7. [Contracts Module](#7-contracts-module)
8. [Master Activities Module](#8-master-activities-module)
9. [Daily Care Records Module](#9-daily-care-records-module)
10. [Schedule Templates Module](#10-schedule-templates-module)
11. [Weekly Schedules Module](#11-weekly-schedules-module)
12. [Invoices Module](#12-invoices-module)
13. [Staff Payments Module](#13-staff-payments-module)
14. [Menus Module](#14-menus-module)
15. [Gallery Module](#15-gallery-module)
16. [Notifications Module](#16-notifications-module)

---

## 1. Authentication Module

### **Purpose**
User registration, login, dan profile management.

### **User Roles**
- `SUPER_ADMIN` - System owner
- `DAYCARE_OWNER` - Pemilik daycare
- `DAYCARE_ADMIN` - Administrator daycare
- `DAYCARE_SITTER` - Pengasuh/guru
- `PARENT` - Orang tua/wali

### **Queries**

#### **Get Current User Profile**
```graphql
query GetProfile {
  profile {
    id
    name
    email
    phone
    role
    createdAt
    updatedAt
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `name` | String | Profile header, greeting |
| `email` | String | Account settings |
| `phone` | String | Contact info |
| `role` | Enum | Menu permissions, feature access |

### **Mutations**

#### **Register User**
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    message
  }
}

# Variables
{
  "input": {
    "name": "Ibu Budi",
    "email": "ibu@example.com",
    "password": "password123",
    "phone": "0812-3456-7890",
    "role": "PARENT"
  }
}
```

**Frontend Fields:**
| Input Field | Validation | UI Component |
|-------------|-----------|-------------|
| `name` | Required, min 1 char | Text input |
| `email` | Required, valid email | Email input |
| `password` | Required, min 6 chars | Password input |
| `phone` | Optional | Phone input |
| `role` | Optional, default PARENT | Dropdown (hidden) |

#### **Login**
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
  }
}

# Variables
{
  "input": {
    "email": "ibu@example.com",
    "password": "password123"
  }
}
```

**Frontend:**
- Simpan token di localStorage/secure storage
- Attach token ke Authorization header: `Bearer <token>`

---

## 2. Children Module

### **Purpose**
Manage data anak (global, parent-owned) dengan guardians.

### **Queries**

#### **Get My Children**
```graphql
query GetMyChildren {
  myChildren {
    id
    profile {
      name
      birthDate
      photo
      gender
    }
    medical {
      allergies
      medicalNotes
      medications {
        name
        dosage
        schedule
      }
    }
    guardians {
      user {
        userId
        name
        email
        phone
        role
      }
      relation
      permissions
      sharedAt
      active
    }
    createdAt
    updatedAt
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `profile.name` | String | Child card title |
| `profile.photo` | URL | Avatar image |
| `profile.birthDate` | Date | Age calculation |
| `medical.allergies` | String[] | Allergy badges, warnings |
| `guardians` | Array | Guardian list, permissions UI |

#### **Get Child by ID**
```graphql
query GetChild($id: ObjectId!) {
  child(id: $id) {
    id
    profile {
      name
      birthDate
      photo
      gender
    }
    medical {
      allergies
      medicalNotes
      medications {
        name
        dosage
        schedule
      }
    }
    guardians {
      user {
        userId
        name
        relation
      }
      permissions
      active
    }
  }
}
```

### **Mutations**

#### **Create Child**
```graphql
mutation CreateChild($input: CreateChildInput!) {
  createChild(input: $input) {
    id
    profile {
      name
      birthDate
      gender
    }
  }
}

# Variables
{
  "input": {
    "profile": {
      "name": "Budi Santoso",
      "birthDate": "2023-01-15",
      "photo": "https://example.com/photo.jpg",
      "gender": "MALE"
    },
    "medical": {
      "allergies": ["Susu sapi", "Kacang"],
      "medicalNotes": "Perlu inhaler setiap malam",
      "medications": [{
        "name": "Ventolin",
        "dosage": "2 puff",
        "schedule": "Setiap malam sebelum tidur"
      }]
    }
  }
}
```

**Frontend Fields:**
| Input Field | Type | UI Component |
|-------------|------|-------------|
| `profile.name` | String | Text input (required) |
| `profile.birthDate` | Date | Date picker (required) |
| `profile.photo` | URL | Image upload |
| `profile.gender` | Enum | Radio buttons (MALE/FEMALE) |
| `medical.allergies` | String[] | Tag input |
| `medical.medications` | Array | Dynamic form array |

#### **Add Guardian**
```graphql
mutation AddGuardian($childId: ObjectId!, $input: AddGuardianInput!) {
  addGuardian(childId: $childId, input: $input) {
    id
    guardians {
      user {
        name
        email
      }
      relation
      permissions
    }
  }
}

# Variables
{
  "childId": "65abc123...",
  "input": {
    "userId": "65def456...",
    "relation": "FATHER",
    "permissions": [
      "VIEW_REPORTS",
      "INPUT_ACTIVITY",
      "INPUT_HEALTH",
      "ATTENDANCE"
    ]
  }
}
```

**Permission Options:**
```typescript
enum GuardianPermission {
  VIEW_REPORTS       // Lihat daily report
  INPUT_ACTIVITY     // Input activity di rumah
  INPUT_HEALTH       // Input health records
  ENROLL_DAYCARE     // Enroll ke daycare
  EDIT_PROFILE       // Edit profile child
  MANAGE_GUARDIANS   // Tambah/hapus guardian
}
```

---

## 3. Medical Records Module

### **Purpose**
Riwayat kesehatan anak (illness, injury, allergy, medication).

### **Queries**

#### **Get Medical Records**
```graphql
query GetMedicalRecords($childId: ObjectId!, $status: MedicalRecordStatus) {
  medicalRecords(childId: $childId, status: $status) {
    id
    type
    name
    diagnosis
    symptoms
    startDate
    endDate
    status
    severity
    treatment
    medications {
      name
      dosage
      frequency
      startDate
      endDate
    }
    doctor {
      name
      hospital
      phone
    }
    reportedBy {
      name
      relation
    }
    createdAt
  }
}

# Variables
{
  "childId": "65abc123...",
  "status": "ACTIVE" // Optional: ACTIVE, RECOVERED, CHRONIC, RECURRING
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `type` | Enum | Badge/icon (ILLNESS=🤒, INJURY=🩹, etc.) |
| `name` | String | Record title |
| `severity` | Enum | Color badge (LOW=green, MEDIUM=yellow, HIGH=red, CRITICAL=purple) |
| `status` | Enum | Status badge |
| `symptoms` | String[] | Symptom tags |
| `medications` | Array | Medication list |

#### **Get Active Medical Records**
```graphql
query GetActiveMedicalRecords($childId: ObjectId!) {
  activeMedicalRecords(childId: $childId) {
    id
    name
    type
    severity
    startDate
    treatment
  }
}
```

### **Mutations**

#### **Create Medical Record**
```graphql
mutation CreateMedicalRecord($input: CreateMedicalRecordInput!) {
  createMedicalRecord(input: $input) {
    id
    name
    status
  }
}

# Variables
{
  "input": {
    "childId": "65abc123...",
    "type": "ILLNESS",
    "name": "Demam Berdarah",
    "diagnosis": "DBD Grade II",
    "symptoms": ["Demam tinggi 3 hari", "Bintik merah", "Mual"],
    "severity": "HIGH",
    "startDate": "2026-02-20",
    "treatment": "Rawat inap 3 hari, infus, paracetamol",
    "medications": [{
      "name": "Paracetamol",
      "dosage": "10mg/kgBB",
      "frequency": "3x sehari",
      "startDate": "2026-02-20",
      "endDate": "2026-02-25"
    }],
    "doctor": {
      "name": "Dr. Andi, Sp.A",
      "hospital": "RS Anak Bunda",
      "phone": "021-1234-5678"
    },
    "reportedBy": {
      "userId": "65user123...",
      "name": "Ibu Budi",
      "relation": "mother"
    }
  }
}
```

**Frontend Fields:**
| Input Field | Type | UI Component |
|-------------|------|-------------|
| `type` | Enum | Select dropdown |
| `name` | String | Text input (required) |
| `diagnosis` | String | Textarea |
| `symptoms` | String[] | Tag input |
| `severity` | Enum | Select (LOW/MEDIUM/HIGH/CRITICAL) |
| `startDate` | Date | Date picker |
| `endDate` | Date | Date picker (optional) |
| `treatment` | String | Textarea |

---

## 4. Activities Module

### **Purpose**
Activity tracking (parent + daycare) dengan timeline.

### **Queries**

#### **Get Child Activities**
```graphql
query GetChildActivities($childId: ObjectId!, $date: Date, $category: ActivityCategory) {
  childActivities(childId: $childId, date: $date, category: $category) {
    id
    activityName
    category
    date
    startTime
    endTime
    duration
    mealType
    menu
    eaten
    quality
    mood
    photos
    description
    source
    loggedBy {
      name
      relation
    }
  }
}

# Variables
{
  "childId": "65abc123...",
  "date": "2026-02-23",
  "category": "MEAL" // Optional filter
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `activityName` | String | Activity card title |
| `category` | Enum | Icon/badge (MEAL=🍽️, NAP=😴, etc.) |
| `startTime` | String | Time display |
| `endTime` | String | Time display |
| `duration` | Int | Duration badge (e.g., "30 min") |
| `mood` | Enum | Emoji (HAPPY=😊, SLEEPY=😴, etc.) |
| `photos` | URL[] | Image gallery |
| `source` | Enum | Badge (PARENT=🏠, DAYCARE=🏫) |

#### **Get Activity Timeline**
```graphql
query GetActivityTimeline($input: ActivityTimelineInput!) {
  activityTimeline(input: $input) {
    date
    activities {
      activityName
      category
      startTime
      endTime
      source
      mood
      photos
    }
  }
}

# Variables
{
  "input": {
    "childId": "65abc123...",
    "startDate": "2026-02-20",
    "endDate": "2026-02-23",
    "includeDaycare": true
  }
}
```

### **Mutations**

#### **Create Activity**
```graphql
mutation CreateActivity($input: CreateActivityInput!) {
  createActivity(input: $input) {
    id
    activityName
    category
  }
}

# Variables
{
  "input": {
    "childId": "65abc123...",
    "activityName": "Makan Malam",
    "category": "MEAL",
    "date": "2026-02-23",
    "startTime": "19:00",
    "endTime": "19:30",
    "mealType": "DINNER",
    "menu": "Nasi goreng ayam",
    "eaten": "ALL",
    "mood": "HAPPY",
    "photos": ["https://example.com/photo.jpg"],
    "description": "Habiskan semua makanannya"
  }
}
```

**Category-Specific Fields:**
| Category | Fields to Show |
|----------|---------------|
| MEAL | mealType, menu, eaten |
| NAP | quality, startTime, endTime |
| TOILETING | toiletingType, toiletingNotes |
| PLAY/LEARNING | mood, photos, description |
| CREATIVE | materials, photos |
| PHYSICAL | intensity, mood |
| OUTDOOR | location, photos |

---

## 5. Parents Module

### **Purpose**
Parent snapshot di daycare (enrollment).

### **Queries**

#### **Get Daycare Parents**
```graphql
query GetDaycareParents($daycareId: ObjectId!, $active: Boolean) {
  daycareParents(daycareId: $daycareId, active: $active) {
    id
    user {
      userId
      name
      email
      phone
    }
    customData {
      deskripsi
      emergencyContact {
        name
        phone
        relation
      }
      pickupAuthorization {
        name
        phone
        relation
      }
    }
    childrenIds
    enrolledAt
    active
  }
}

# Variables
{
  "daycareId": "65daycare123...",
  "active": true
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `user.name` | String | Parent list |
| `user.phone` | String | Contact button |
| `customData.emergencyContact` | Object | Emergency info card |
| `childrenIds` | ObjectId[] | Linked children display |

---

## 6. Children Daycare Module

### **Purpose**
Child snapshot di daycare (enrollment dengan custom data).

### **Queries**

#### **Get Daycare Children**
```graphql
query GetDaycareChildren($daycareId: ObjectId!, $active: Boolean) {
  daycareChildren(daycareId: $daycareId, active: $active) {
    id
    profile {
      name
      birthDate
      photo
      gender
    }
    medical {
      allergies
      medicalNotes
    }
    preferences {
      favoriteFoods
      favoriteActivities
      comfortItems
      napRoutine
    }
    customData {
      customName
      customPhoto
      notes
    }
    enrolledAt
    exitedAt
    active
  }
}

# Variables
{
  "daycareId": "65daycare123...",
  "active": true
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `profile.name` | String | Child card |
| `profile.photo` | URL | Avatar |
| `medical.allergies` | String[] | Allergy warning badges |
| `preferences.favoriteFoods` | String[] | Food preferences |
| `customData.customName` | String | Nickname display |

---

## 7. Contracts Module

### **Purpose**
Service agreement antara daycare & parent.

### **Queries**

#### **Get Daycare Contracts**
```graphql
query GetDaycareContracts($daycareId: ObjectId!, $status: ContractStatus) {
  daycareContracts(daycareId: $daycareId, status: $status) {
    id
    parent {
      userId
      name
      email
    }
    childIds
    serviceType
    price
    startDate
    endDate
    status
    terms
    isExpired
  }
}

# Variables
{
  "daycareId": "65daycare123...",
  "status": "ACTIVE"
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `serviceType` | Enum | Badge (DAILY/WEEKLY/MONTHLY) |
| `price` | Float | Price display (Rp X) |
| `status` | Enum | Status badge (ACTIVE=green, EXPIRED=gray, TERMINATED=red) |
| `endDate` | Date | Expiry countdown |

### **Mutations**

#### **Create Contract**
```graphql
mutation CreateContract($input: CreateContractInput!) {
  createContract(input: $input) {
    id
    status
  }
}

# Variables
{
  "input": {
    "daycareId": "65daycare123...",
    "parentId": "65parent456...",
    "childIds": ["65child789..."],
    "serviceType": "MONTHLY",
    "price": 500000,
    "startDate": "2026-03-01",
    "endDate": "2026-03-31",
    "terms": "Pembayaran di awal bulan"
  }
}
```

---

## 8. Master Activities Module

### **Purpose**
Template activity untuk daycare.

### **Queries**

#### **Get Master Activities**
```graphql
query GetMasterActivities($daycareId: ObjectId!, $active: Boolean, $category: ActivityCategory) {
  masterActivities(daycareId: $daycareId, active: $active, category: $category) {
    id
    name
    category
    defaultDuration
    icon
    color
    active
    fieldConfig {
      mealType
      menu
      eaten
      quality
      mood
      photos
      description
    }
  }
}

# Variables
{
  "daycareId": "65daycare123...",
  "active": true
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `name` | String | Activity template name |
| `category` | Enum | Icon + badge |
| `defaultDuration` | Int | Duration hint |
| `fieldConfig` | Object | Form field visibility config |

---

## 9. Daily Care Records Module

### **Purpose**
Laporan harian dari daycare (attendance + activities).

### **Queries**

#### **Get Daily Care Record**
```graphql
query GetDailyCareRecord($daycareId: ObjectId!, $date: Date!) {
  dailyCareRecord(daycareId: $daycareId, date: $date) {
    id
    date
    children {
      childId
      childName
      childPhoto
      attendance {
        checkIn {
          time
          photo
          by {
            name
          }
        }
        checkOut {
          time
          photo
          by {
            name
          }
        }
        status
      }
      assignedSitters {
        name
        shift
      }
      activities {
        activityName
        category
        startTime
        endTime
        mealType
        menu
        eaten
        quality
        mood
        photos
      }
    }
  }
}

# Variables
{
  "daycareId": "65daycare123...",
  "date": "2026-02-23"
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `attendance.status` | Enum | Badge (PRESENT=green, ABSENT=red, LATE=yellow) |
| `attendance.checkIn.time` | String | Check-in time |
| `attendance.checkIn.photo` | URL | Drop-off photo |
| `assignedSitters` | Array | Sitter list with shift badges |
| `activities` | Array | Activity timeline |

### **Mutations**

#### **Check In Child**
```graphql
mutation CheckInChild($input: CheckInChildInput!) {
  checkInChild(input: $input) {
    id
    children {
      childName
      attendance {
        checkIn {
          time
          photo
        }
        status
      }
    }
  }
}

# Variables
{
  "input": {
    "daycareId": "65daycare123...",
    "childId": "65child789...",
    "date": "2026-02-23",
    "checkIn": {
      "time": "07:30",
      "photo": "https://example.com/checkin.jpg",
      "by": {
        "userId": "65user123...",
        "name": "Ibu Budi"
      }
    }
  }
}
```

#### **Log Daily Activity**
```graphql
mutation LogDailyActivity($input: LogDailyActivityInput!) {
  logDailyActivity(input: $input) {
    id
    children {
      childName
      activities {
        activityName
        category
        startTime
      }
    }
  }
}

# Variables
{
  "input": {
    "daycareId": "65daycare123...",
    "childId": "65child789...",
    "date": "2026-02-23",
    "activity": {
      "activityName": "Makan Siang",
      "category": "MEAL",
      "startTime": "11:00",
      "endTime": "11:45",
      "mealType": "LUNCH",
      "menu": "Nasi, ayam, sayur",
      "eaten": "ALL",
      "mood": "HAPPY"
    }
  }
}
```

---

## 10-16. Remaining Modules

*(Untuk modules 10-16, format sama seperti di atas)*

### **10. Schedule Templates**
- Query: `scheduleTemplates(daycareId)`
- Mutation: `createScheduleTemplate(input)`
- Fields: name, dayOfWeek, activities[], defaultSitterRole

### **11. Weekly Schedules**
- Query: `weeklySchedule(daycareId, weekStart)`
- Mutation: `createWeeklySchedule(input)`, `assignSitter(input)`
- Fields: days[], childAssignments[], assignedSitters[]

### **12. Invoices**
- Query: `daycareInvoices(daycareId)`, `parentInvoices(parentId)`
- Mutation: `createInvoice(input)`, `markInvoiceAsPaid(id)`
- Fields: items[], total, status, dueDate, isOverdue

### **13. Staff Payments**
- Query: `daycareStaffPayments(daycareId)`
- Mutation: `createStaffPayment(input)`, `markStaffPaymentAsPaid(id)`
- Fields: staff, daysWorked, rate, amount, deductions[], total (virtual)

### **14. Menus**
- Query: `menu(daycareId, date)`, `menus(daycareId, startDate, endDate)`
- Mutation: `createMenu(input)`
- Fields: meals[] (type, menu, ingredients, allergens)

### **15. Gallery**
- Query: `gallery(daycareId, childName, limit)`
- Mutation: `createGallery(input)`
- Fields: photos[], caption, event, uploadedBy

### **16. Notifications**
- Query: `notifications(limit, unreadOnly)`, `unreadNotificationCount`
- Mutation: `markNotificationAsRead(id)`, `markAllNotificationsAsRead`
- Fields: type, title, message, read, createdAt

---

## 📱 Frontend Integration Guide

### **Authentication Flow**
```typescript
// 1. Login
const { data } = await graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) { token }
  }
`, { input: { email, password } });

// 2. Store token
localStorage.setItem('token', data.login.token);

// 3. Attach to headers
const client = new GraphQLClient('/graphql', {
  headers: {
    Authorization: `Bearer ${data.login.token}`
  }
});
```

### **Error Handling**
```typescript
try {
  const result = await query(MY_QUERY, variables);
} catch (error) {
  if (error.graphQLErrors) {
    error.graphQLErrors.forEach(({ message, extensions }) => {
      // Handle specific errors
      if (extensions.code === 'UNAUTHORIZED') {
        // Redirect to login
      }
    });
  }
}
```

---

## 🎯 UI Component Mapping

| Module | Main Components | Key Screens |
|--------|----------------|-------------|
| Auth | LoginForm, RegisterForm | Login, Register |
| Children | ChildCard, ChildForm, GuardianList | Child List, Child Detail |
| Medical | MedicalRecordCard, MedicalForm | Health History |
| Activities | ActivityCard, ActivityForm, Timeline | Activity Feed |
| Daily Care | AttendanceCard, ActivityLog | Daily Report |
| Contracts | ContractCard, ContractForm | Enrollment |
| Invoices | InvoiceCard, InvoiceDetail | Billing |
| Gallery | PhotoGrid, PhotoUpload | Gallery |
| Notifications | NotificationList, NotificationBadge | Notification Center |

---

**Document Version:** 1.0  
**Status:** Complete  
**Next Review:** After MVP launch
