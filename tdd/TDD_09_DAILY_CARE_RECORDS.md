# TDD - Module 09: Daily Care Records

**Purpose:** Laporan harian daycare (attendance + activities)

---

## 🔍 Queries

### **GetDailyCareRecord**

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "date": "2026-02-23"
}
```

**Query:**
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
        checkIn { time photo by { name } }
        checkOut { time photo by { name } }
        status
      }
      assignedSitters { name shift }
      activities {
        activityName
        category
        startTime
        endTime
        mealType
        menu
        eaten
        mood
        photos
      }
    }
  }
}
```

---

### **GetChildDailyRecords**

**Variables:**
```json
{
  "childId": "65child789...",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28"
}
```

**Query:**
```graphql
query GetChildDailyRecords($childId: ObjectId!, $startDate: Date!, $endDate: Date!) {
  childDailyRecords(childId: $childId, startDate: $startDate, endDate: $endDate) {
    date
    children {
      childName
      attendance {
        checkIn { time }
        checkOut { time }
        status
      }
      activities {
        activityName
        category
        startTime
      }
    }
  }
}
```

---

## ✏️ Mutations

### **CheckInChild**

**Variables:**
```json
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

**Mutation:**
```graphql
mutation CheckInChild($input: CheckInChildInput!) {
  checkInChild(input: $input) {
    id
    children {
      childName
      attendance {
        checkIn { time photo }
        status
      }
    }
  }
}
```

---

### **CheckOutChild**

**Variables:**
```json
{
  "input": {
    "daycareId": "65daycare123...",
    "childId": "65child789...",
    "date": "2026-02-23",
    "checkOut": {
      "time": "17:00",
      "photo": "https://example.com/checkout.jpg",
      "by": {
        "userId": "65user123...",
        "name": "Ibu Budi"
      }
    }
  }
}
```

**Mutation:**
```graphql
mutation CheckOutChild($input: CheckOutChildInput!) {
  checkOutChild(input: $input) {
    id
    children {
      childName
      attendance {
        checkOut { time photo }
      }
    }
  }
}
```

---

### **LogDailyActivity**

**Variables:**
```json
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
      "menu": "Nasi ayam",
      "eaten": "ALL",
      "mood": "HAPPY"
    }
  }
}
```

**Mutation:**
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
```

---

### **CreateDailyCareRecord**

**Variables:**
```json
{
  "input": {
    "daycareId": "65daycare123...",
    "date": "2026-02-23",
    "children": [
      {
        "childId": "65child789...",
        "childName": "Budi",
        "attendance": {
          "checkIn": {
            "time": "07:30",
            "photo": "https://example.com/photo.jpg",
            "by": { "userId": "65user123...", "name": "Ibu Budi" }
          },
          "status": "PRESENT"
        },
        "activities": [
          {
            "activityName": "Makan Pagi",
            "category": "MEAL",
            "startTime": "08:00",
            "endTime": "08:30",
            "mealType": "BREAKFAST",
            "menu": "Nasi goreng",
            "eaten": "ALL"
          }
        ]
      }
    ]
  }
}
```

**Mutation:**
```graphql
mutation CreateDailyCareRecord($input: CreateDailyCareRecordInput!) {
  createDailyCareRecord(input: $input) {
    id
    date
    totalChildren
  }
}
```

---

## 📱 UI Components

### **DailyReportCard**
```tsx
function DailyReportCard({ record }) {
  return (
    <Card>
      {record.children.map(child => (
        <div key={child.childId}>
          <h3>{child.childName}</h3>
          <AttendanceStatus status={child.attendance.status} />
          <ActivityList activities={child.activities} />
        </div>
      ))}
    </Card>
  );
}
```

---

## 🔐 Permissions

| Feature | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT |
|---------|---------------|----------------|--------|
| View Daily Care | ✅ | ✅ | ✅ Own child |
| Check-in/out | ✅ | ✅ | ❌ |
| Log Activity | ✅ | ✅ | ❌ |
| Create Daily Report | ✅ | ✅ | ❌ |

---

**File:** `TDD_09_DAILY_CARE_RECORDS.md`  
**Status:** Complete
