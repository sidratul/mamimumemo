# User Admin - Data Requirements

**Purpose:** Dokumentasi data yang dibutuhkan untuk user admin

---

## 📋 User Admin Data

### **Required Fields:**

```typescript
{
  _id: string;           // Unique user ID (ObjectId)
  name: string;          // Nama lengkap
  email: string;         // Email (unique, untuk login)
  phone: string;         // Nomor telepon
  role: "ADMIN";         // Role user
  createdAt: string;     // ISO 8601 date
  updatedAt: string;     // ISO 8601 date
}
```

### **Example:**

```typescript
{
  _id: "65admin002",
  name: "Admin User",
  email: "admin@mami.com",
  phone: "0812-3456-7896",
  role: "ADMIN",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
}
```

---

## 🔐 Authentication Data

### **For Login:**

```typescript
{
  email: "admin@mami.com",
  password: "password123",  // Hashed in database
}
```

### **JWT Token:**

```typescript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "65admin002",
    name: "Admin User",
    email: "admin@mami.com",
    role: "ADMIN",
  }
}
```

---

## 📊 All User Roles

| Role | Constant | Usage |
|------|----------|-------|
| **SUPER_ADMIN** | `"SUPER_ADMIN"` | System owner, manage all daycares |
| **DAYCARE_OWNER** | `"DAYCARE_OWNER"` | Pemilik daycare |
| **DAYCARE_ADMIN** | `"DAYCARE_ADMIN"` | Administrator daycare |
| **DAYCARE_SITTER** | `"DAYCARE_SITTER"` | Pengasuh/guru |
| **PARENT** | `"PARENT"` | Orang tua/wali |
| **ADMIN** | `"ADMIN"` | General admin (new) |

---

## 🎯 Mock Data Usage

### **Import:**

```typescript
import { mockUsers } from "@/mocks/users.mock.ts";
```

### **Usage in Tests:**

```typescript
// Access admin user
const admin = mockUsers.admin;

assertEquals(admin._id, "65admin002");
assertEquals(admin.role, "ADMIN");
assertEquals(admin.email, "admin@mami.com");
```

### **Usage in Context:**

```typescript
const adminContext = createMockContext({
  id: mockUsers.admin._id,
  name: mockUsers.admin.name,
  email: mockUsers.admin.email,
  role: mockUsers.admin.role,
});
```

---

## 📝 Complete User Schema

### **Database Schema:**

```typescript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: [
      "SUPER_ADMIN",
      "DAYCARE_OWNER",
      "DAYCARE_ADMIN",
      "DAYCARE_SITTER",
      "PARENT",
      "ADMIN",
    ],
    default: "PARENT",
  },
}, {
  timestamps: true,
});
```

---

## ✅ Validation Rules

| Field | Rule | Example |
|-------|------|---------|
| `name` | Required, min 1 char | "Admin User" ✅ |
| `email` | Required, valid email | "admin@mami.com" ✅ |
| `password` | Required, min 6 chars | "password123" ✅ |
| `phone` | Optional | "0812-3456-7896" |
| `role` | Required, valid enum | "ADMIN" ✅ |

---

## 🔧 Helper Functions

### **Create Test Admin:**

```typescript
function createTestAdmin() {
  return {
    name: "Test Admin",
    email: `test.admin.${Date.now()}@mami.com`,
    password: "password123",
    phone: "0812-3456-7896",
    role: "ADMIN" as const,
  };
}
```

### **Create Admin Context:**

```typescript
function createAdminContext() {
  return {
    user: {
      id: mockUsers.admin._id,
      name: mockUsers.admin.name,
      email: mockUsers.admin.email,
      role: mockUsers.admin.role,
    },
  };
}
```

---

## 📚 Related Mock Files

| File | Contains |
|------|----------|
| `users.mock.ts` | All user roles including admin |
| `daycares.mock.ts` | Daycares owned by users |
| `children.mock.ts` | Children with guardians |
| `contracts.mock.ts` | Contracts with parent references |

---

## 🎯 Admin Permissions

| Feature | Permission |
|---------|------------|
| Manage Users | ✅ |
| Manage Daycares | ✅ |
| View Reports | ✅ |
| Manage System Settings | ✅ |
| Access All Modules | ✅ |

---

**Last Updated:** 2026-02-23  
**Status:** ✅ Complete
