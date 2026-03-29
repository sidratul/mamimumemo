# Technical Development Design (TDD) - Part 2
## Modules 10-16 - Mami API

**Version:** 1.0  
**Last Updated:** 2026-02-23

---

## 10. Schedule Templates Module

### **Purpose**
Template jadwal reusable untuk daycare.

### **Queries**

#### **Get Schedule Templates**
```graphql
query GetScheduleTemplates($daycareId: ObjectId!, $active: Boolean) {
  scheduleTemplates(daycareId: $daycareId, active: $active) {
    id
    name
    dayOfWeek
    activities {
      activityName
      category
      startTime
      endTime
      defaultSitterRole
    }
    active
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `name` | String | Template name |
| `dayOfWeek` | Int[] | Day badges (0=Sun, 6=Sat) |
| `activities` | Array | Timeline preview |

### **Mutations**

#### **Create Schedule Template**
```graphql
mutation CreateScheduleTemplate($input: CreateScheduleTemplateInput!) {
  createScheduleTemplate(input: $input) {
    id
    name
  }
}
```

**Input Fields:**
- `daycareId`: ObjectId
- `name`: String (template name)
- `dayOfWeek`: Int[] (0-6)
- `activities`: Array of activity templates

---

## 11. Weekly Schedules Module

### **Purpose**
Jadwal mingguan dengan child & sitter assignments.

### **Queries**

#### **Get Weekly Schedule**
```graphql
query GetWeeklySchedule($daycareId: ObjectId!, $weekStart: Date!) {
  weeklySchedule(daycareId: $daycareId, weekStart: $weekStart) {
    weekStart
    weekEnd
    isCurrent
    days {
      date
      dayOfWeek
      childAssignments {
        childName
        assignedSitters {
          name
          shift
        }
        activities {
          activityName
          startTime
          endTime
        }
      }
    }
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `isCurrent` | Boolean | Current week indicator |
| `days` | Array | Week view (7 columns) |
| `childAssignments` | Array | Child cards per day |
| `shift` | Enum | Shift badge (MORNING/AFTERNOON/FULL) |

### **Mutations**

#### **Assign Sitter**
```graphql
mutation AssignSitter($input: AssignSitterInput!) {
  assignSitter(input: $input) {
    id
  }
}
```

**Input:**
- `daycareId`: ObjectId
- `weekStart`: Date
- `date`: Date
- `childId`: ObjectId
- `sitters`: Array of { userId, name, shift }

---

## 12. Invoices Module

### **Purpose**
Billing system untuk daycare.

### **Queries**

#### **Get Invoices**
```graphql
query GetInvoices($daycareId: ObjectId!, $status: InvoiceStatus) {
  daycareInvoices(daycareId: $daycareId, status: $status) {
    parent { name }
    period { start end }
    items { description quantity unitPrice subtotal }
    total
    status
    dueDate
    isOverdue
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `status` | Enum | Badge (PENDING/PAID/OVERDUE) |
| `total` | Float | Amount (Rp X) |
| `isOverdue` | Boolean | Warning banner |
| `dueDate` | Date | Countdown |

### **Mutations**

#### **Create Invoice**
```graphql
mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    id
    total
  }
}
```

#### **Mark as Paid**
```graphql
mutation MarkInvoiceAsPaid($id: ObjectId!) {
  markInvoiceAsPaid(id: $id) {
    status
    paidAt
  }
}
```

---

## 13. Staff Payments Module

### **Purpose**
Payroll untuk staff daycare.

### **Queries**

#### **Get Staff Payments**
```graphql
query GetStaffPayments($daycareId: ObjectId!) {
  daycareStaffPayments(daycareId: $daycareId) {
    staff { name role }
    period { start end }
    daysWorked
    rate
    amount
    deductions { description amount }
    total
    status
  }
}
```

**Calculation:**
```
Gross = daysWorked × rate
Total Deductions = Σ deductions.amount
Net Total = Gross - Deductions
```

### **Mutations**

#### **Create Staff Payment**
```graphql
mutation CreateStaffPayment($input: CreateStaffPaymentInput!) {
  createStaffPayment(input: $input) {
    id
    total
  }
}
```

---

## 14. Menus Module

### **Purpose**
Meal planning dengan allergen info.

### **Queries**

#### **Get Menu**
```graphql
query GetMenu($daycareId: ObjectId!, $date: Date!) {
  menu(daycareId: $daycareId, date: $date) {
    date
    meals {
      type
      menu
      ingredients
      allergens
    }
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `meals.type` | Enum | Section header |
| `allergens` | String[] | Allergen badges |
| `ingredients` | String[] | Expandable list |

### **Mutations**

#### **Create Menu**
```graphql
mutation CreateMenu($input: CreateMenuInput!) {
  createMenu(input: $input) {
    id
    meals { type menu }
  }
}
```

---

## 15. Gallery Module

### **Purpose**
Photo sharing.

### **Queries**

#### **Get Gallery**
```graphql
query GetGallery($daycareId: ObjectId!, $childName: String, $limit: Int) {
  gallery(daycareId: $daycareId, childName: $childName, limit: $limit) {
    photos
    caption
    event
    uploadedBy { name }
    createdAt
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `photos` | URL[] | Photo grid |
| `childName` | String | Filter by child |
| `event` | String | Event tag |

### **Mutations**

#### **Upload Photo**
```graphql
mutation CreateGallery($input: CreateGalleryInput!) {
  createGallery(input: $input) {
    id
    photos
  }
}
```

---

## 16. Notifications Module

### **Purpose**
In-app notifications.

### **Queries**

#### **Get Notifications**
```graphql
query GetNotifications($limit: Int, $unreadOnly: Boolean) {
  notifications(limit: $limit, unreadOnly: $unreadOnly) {
    type
    title
    message
    read
    createdAt
  }
}
```

#### **Get Unread Count**
```graphql
query GetUnreadCount {
  unreadNotificationCount
}
```

**Frontend:**
- Badge count on notification icon
- List with read/unread indicators

### **Mutations**

#### **Mark as Read**
```graphql
mutation MarkAsRead($id: ObjectId!) {
  markNotificationAsRead(id: $id) {
    read
    readAt
  }
}
```

#### **Mark All as Read**
```graphql
mutation MarkAllAsRead {
  markAllNotificationsAsRead
}
```

**Notification Types:**
- `ATTENDANCE` - Check-in/out
- `ACTIVITY` - New activity
- `HEALTH` - Health record
- `INVOICE` - Payment reminder
- `SCHEDULE` - Schedule change
- `GENERAL` - Announcements

---

**Document Version:** 1.0  
**Status:** Complete
