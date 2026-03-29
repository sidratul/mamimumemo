# TDD - Module 08: Master Activities

**Purpose:** Template activity untuk daycare

---

## 🔍 Queries

### **GetMasterActivities**

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "active": true,
  "category": "MEAL"
}
```

**Query:**
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
    }
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `name` | String | Template name |
| `category` | Enum | Icon badge |
| `fieldConfig` | Object | Form field visibility |

---

### **GetDefaultFieldConfig**

**Variables:**
```json
{
  "category": "MEAL"
}
```

**Query:**
```graphql
query GetDefaultFieldConfig($category: ActivityCategory!) {
  defaultFieldConfig(category: $category) {
    mealType
    menu
    eaten
    quality
    mood
    photos
  }
}
```

---

## ✏️ Mutations

### **CreateMasterActivity**

**Variables:**
```json
{
  "input": {
    "daycareId": "65daycare123...",
    "name": "Makan Pagi Ceria",
    "category": "MEAL",
    "defaultDuration": 30,
    "fieldConfig": {
      "mealType": true,
      "menu": true,
      "eaten": true,
      "mood": true,
      "photos": true
    }
  }
}
```

**Mutation:**
```graphql
mutation CreateMasterActivity($input: CreateMasterActivityInput!) {
  createMasterActivity(input: $input) {
    id
    name
    category
  }
}
```

---

### **UpdateMasterActivity**

**Variables:**
```json
{
  "id": "65master123...",
  "input": {
    "name": "Makan Pagi Updated",
    "active": false
  }
}
```

**Mutation:**
```graphql
mutation UpdateMasterActivity($id: ObjectId!, $input: UpdateMasterActivityInput!) {
  updateMasterActivity(id: $id, input: $input) {
    id
    name
    active
  }
}
```

---

## 📱 UI Components

### **MasterActivityCard**
```tsx
function MasterActivityCard({ activity, onEdit }) {
  return (
    <Card>
      <div className="header">
        <span>{activity.icon}</span>
        <h3>{activity.name}</h3>
        <Badge color={activity.color}>{activity.category}</Badge>
      </div>
      <div className="config">
        <strong>Fields:</strong>
        {Object.entries(activity.fieldConfig)
          .filter(([_, v]) => v)
          .map(([k]) => <Badge key={k}>{k}</Badge>)}
      </div>
      <Button onClick={() => onEdit(activity.id)}>Edit</Button>
    </Card>
  );
}
```

---

## 🔐 Permissions

| Feature | DAYCARE_ADMIN | DAYCARE_SITTER |
|---------|---------------|----------------|
| View Master Activities | ✅ | ✅ |
| Create Master Activity | ✅ | ❌ |
| Update Master Activity | ✅ | ❌ |
| Deactivate Master Activity | ✅ | ❌ |

---

**File:** `TDD_08_MASTER_ACTIVITIES.md`  
**Status:** Complete
