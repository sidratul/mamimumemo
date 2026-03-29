# TDD - Modules 10-16 (Quick Reference)

**Purpose:** Quick reference untuk modules sisanya

---

## Module 10: Schedule Templates

### Queries
- `scheduleTemplates(daycareId, active)` - Get all templates
- `scheduleTemplate(id)` - Get template by ID
- `templatesForDay(daycareId, dayOfWeek)` - Get templates for specific day

### Mutations
- `createScheduleTemplate(input)` - Create new template
- `updateScheduleTemplate(id, input)` - Update template
- `deactivateScheduleTemplate(id)` - Deactivate template

### Key Fields
- `name` - Template name
- `dayOfWeek` - Array of days (0-6)
- `activities[]` - Activity templates

---

## Module 11: Weekly Schedules

### Queries
- `weeklySchedule(daycareId, weekStart)` - Get weekly schedule
- `currentWeekSchedule(daycareId)` - Get current week
- `scheduleForDate(daycareId, date)` - Get schedule for date
- `childSchedule(childId, weekStart)` - Get child's schedule

### Mutations
- `createWeeklySchedule(input)` - Create weekly schedule
- `updateWeeklySchedule(id, input)` - Update schedule
- `assignSitter(input)` - Assign sitter to child

### Key Fields
- `weekStart`, `weekEnd` - Week range
- `days[]` - Daily schedules
- `childAssignments[]` - Child + sitter assignments

---

## Module 12: Invoices

### Queries
- `daycareInvoices(daycareId, status)` - Get daycare invoices
- `parentInvoices(parentId, status)` - Get parent invoices
- `invoice(id)` - Get invoice by ID
- `overdueInvoices(daycareId)` - Get overdue invoices

### Mutations
- `createInvoice(input)` - Create invoice
- `updateInvoice(id, input)` - Update invoice
- `markInvoiceAsPaid(id, input)` - Mark as paid
- `cancelInvoice(id)` - Cancel invoice

### Key Fields
- `parent` - Parent info
- `items[]` - Line items
- `total` - Total amount
- `status` - PENDING/PAID/OVERDUE/CANCELLED
- `isOverdue` - Boolean flag

---

## Module 13: Staff Payments

### Queries
- `daycareStaffPayments(daycareId, status)` - Get staff payments
- `staffPayments(staffId, status)` - Get payments for staff
- `staffPayment(id)` - Get payment by ID
- `pendingStaffPayments(daycareId)` - Get pending payments

### Mutations
- `createStaffPayment(input)` - Create payment
- `updateStaffPayment(id, input)` - Update payment
- `markStaffPaymentAsPaid(id, input)` - Mark as paid
- `cancelStaffPayment(id)` - Cancel payment

### Key Fields
- `staff` - Staff info
- `daysWorked` - Number of days
- `rate` - Daily rate
- `deductions[]` - Deductions
- `total` - Net amount (virtual field)

---

## Module 14: Menus

### Queries
- `menu(daycareId, date)` - Get menu for date
- `menus(daycareId, startDate, endDate)` - Get menu range
- `todayMenu(daycareId)` - Get today's menu

### Mutations
- `createMenu(input)` - Create/update menu
- `updateMenu(id, input)` - Update menu
- `deleteMenu(id)` - Delete menu

### Key Fields
- `date` - Menu date
- `meals[]` - Meal objects
  - `type` - BREAKFAST/SNACK/LUNCH/DINNER
  - `menu` - Menu name
  - `ingredients[]` - Ingredients list
  - `allergens[]` - Allergen list

---

## Module 15: Gallery

### Queries
- `gallery(daycareId, childName, limit)` - Get gallery
- `galleryItem(id)` - Get gallery item
- `generalGallery(daycareId)` - Get general gallery
- `childGallery(daycareId, childName)` - Get child's gallery

### Mutations
- `createGallery(input)` - Create gallery item
- `updateGallery(id, input)` - Update gallery
- `deleteGallery(id)` - Delete gallery

### Key Fields
- `photos[]` - Photo URLs
- `caption` - Photo caption
- `event` - Event name
- `uploadedBy` - Uploader info

---

## Module 16: Notifications

### Queries
- `notifications(limit, unreadOnly)` - Get notifications
- `notification(id)` - Get notification by ID
- `unreadNotificationCount` - Get unread count

### Mutations
- `createNotification(input)` - Create notification
- `markNotificationAsRead(id, input)` - Mark as read
- `markAllNotificationsAsRead` - Mark all as read
- `deleteNotification(id)` - Delete notification

### Key Fields
- `type` - ATTENDANCE/ACTIVITY/HEALTH/INVOICE/SCHEDULE/GENERAL
- `title` - Notification title
- `message` - Notification body
- `read` - Read status
- `data` - Additional data (JSON)

---

## 🔐 Quick Permission Reference

| Module | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT |
|--------|---------------|----------------|--------|
| 10. Schedule Templates | ✅ All | ✅ View | ❌ |
| 11. Weekly Schedules | ✅ All | ✅ View/Assign | ❌ |
| 12. Invoices | ✅ All | ❌ | ✅ View Own |
| 13. Staff Payments | ✅ All | ✅ View Own | ❌ |
| 14. Menus | ✅ All | ✅ View | ✅ View |
| 15. Gallery | ✅ All | ✅ All | ✅ View |
| 16. Notifications | ✅ All | ✅ Own | ✅ Own |

---

**Files:** `TDD_10-16_QUICK_REF.md`  
**Status:** Complete (Quick Reference)
