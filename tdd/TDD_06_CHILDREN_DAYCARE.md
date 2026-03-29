# TDD - Module 06: Children Daycare

**Purpose:** Child snapshot di daycare (enrollment dengan custom data per daycare)

---

## 🔍 Queries

### **DaycareChildren**

**Purpose:** Get all children enrolled in a daycare

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "active": true
}
```

**Query:**
```graphql
query GetDaycareChildren($daycareId: ObjectId!, $active: Boolean) {
  daycareChildren(daycareId: $daycareId, active: $active) {
    id
    globalChildId
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
```

**Response:**
```json
{
  "data": {
    "daycareChildren": [
      {
        "id": "65childdaycare123...",
        "globalChildId": "65child789...",
        "profile": {
          "name": "Budi Santoso",
          "birthDate": "2023-01-15T00:00:00Z",
          "photo": "https://example.com/budi.jpg",
          "gender": "MALE"
        },
        "medical": {
          "allergies": ["Susu sapi", "Kacang"],
          "medicalNotes": "Perlu inhaler setiap malam",
          "medications": [
            {
              "name": "Ventolin",
              "dosage": "2 puff",
              "schedule": "Setiap malam"
            }
          ]
        },
        "preferences": {
          "favoriteFoods": ["Nasi goreng", "Ayam goreng"],
          "favoriteActivities": ["Main balok", "Menggambar"],
          "comfortItems": ["Selimut biru"],
          "napRoutine": "Tidur jam 12 siang"
        },
        "customData": {
          "customName": "Budi Kecil",
          "customPhoto": "https://example.com/budi-daycare.jpg",
          "notes": "Suka makan siang jam 11"
        },
        "enrolledAt": "2026-01-15T10:00:00Z",
        "active": true
      }
    ]
  }
}
```

**Frontend Fields:**

| Field | Type | UI Component | Usage |
|-------|------|-------------|-------|
| `profile.name` | String | Child card | Display name |
| `profile.photo` | URL | Avatar | Profile picture |
| `medical.allergies` | String[] | Warning badges | Allergy alerts |
| `customData.customName` | String | Nickname display | Daycare nickname |
| `preferences.favoriteFoods` | String[] | Food list | Meal planning |

---

### **ChildrenDaycare**

**Purpose:** Get child by ID

**Variables:**
```json
{
  "id": "65childdaycare123..."
}
```

**Query:**
```graphql
query GetChildrenDaycare($id: ObjectId!) {
  childrenDaycare(id: $id) {
    id
    globalChildId
    profile {
      name
      birthDate
      photo
    }
    medical {
      allergies
    }
    customData {
      customName
    }
  }
}
```

---

### **ChildByGlobalId**

**Purpose:** Get child by global child ID and daycare

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "globalChildId": "65child789..."
}
```

**Query:**
```graphql
query GetChildByGlobalId($daycareId: ObjectId!, $globalChildId: ObjectId!) {
  childByGlobalId(daycareId: $daycareId, globalChildId: $globalChildId) {
    id
    profile {
      name
    }
    customData {
      customName
    }
  }
}
```

---

### **ParentChildren**

**Purpose:** Get children for a parent in a daycare

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "parentId": "65parent456..."
}
```

**Query:**
```graphql
query GetParentChildren($daycareId: ObjectId!, $parentId: ObjectId!) {
  parentChildren(daycareId: $daycareId, parentId: $parentId) {
    id
    profile {
      name
      photo
    }
  }
}
```

---

## ✏️ Mutations

### **CreateChildrenDaycare**

**Purpose:** Enroll child to daycare

**Variables:**
```json
{
  "input": {
    "daycareId": "65daycare123...",
    "parentId": "65parent456...",
    "globalChildId": "65child789...",
    "profile": {
      "name": "Budi Santoso",
      "birthDate": "2023-01-15",
      "photo": "https://example.com/budi.jpg",
      "gender": "MALE"
    },
    "medical": {
      "allergies": ["Susu sapi", "Kacang"],
      "medicalNotes": "Perlu inhaler"
    },
    "preferences": {
      "favoriteFoods": ["Nasi goreng"],
      "favoriteActivities": ["Main balok"],
      "comfortItems": ["Selimut biru"],
      "napRoutine": "Tidur jam 12"
    },
    "customData": {
      "customName": "Budi Kecil",
      "customPhoto": "https://example.com/budi-daycare.jpg",
      "notes": "Suka makan siang jam 11"
    }
  }
}
```

**Mutation:**
```graphql
mutation CreateChildrenDaycare($input: CreateChildrenDaycareInput!) {
  createChildrenDaycare(input: $input) {
    id
    profile {
      name
    }
    customData {
      customName
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "createChildrenDaycare": {
      "id": "65childdaycare123...",
      "profile": {
        "name": "Budi Santoso"
      },
      "customData": {
        "customName": "Budi Kecil"
      }
    }
  }
}
```

**Frontend Input Fields:**

| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| `daycareId` | ObjectId | Valid daycare ID | Hidden | ✅ |
| `parentId` | ObjectId | Valid parent ID | Hidden | ✅ |
| `globalChildId` | ObjectId | Optional | Child selector | ❌ |
| `profile.name` | String | Min 1 char | Text input | ✅ |
| `profile.birthDate` | Date | Valid date | Date picker | ✅ |
| `profile.gender` | Enum | MALE/FEMALE | Radio | ✅ |
| `medical.allergies` | String[] | Optional | Tag input | ❌ |
| `preferences` | Object | Optional | Preference form | ❌ |
| `customData.customName` | String | Optional | Text input | ❌ |

---

### **UpdateChildrenDaycare**

**Purpose:** Update child daycare information

**Variables:**
```json
{
  "id": "65childdaycare123...",
  "input": {
    "medical": {
      "allergies": ["Susu sapi", "Telur"]
    },
    "customData": {
      "customName": "Budi Updated"
    }
  }
}
```

**Mutation:**
```graphql
mutation UpdateChildrenDaycare($id: ObjectId!, $input: UpdateChildrenDaycareInput!) {
  updateChildrenDaycare(id: $id, input: $input) {
    id
    medical {
      allergies
    }
    customData {
      customName
    }
  }
}
```

---

### **DeactivateChildrenDaycare**

**Purpose:** Deactivate child enrollment (soft delete)

**Variables:**
```json
{
  "id": "65childdaycare123..."
}
```

**Mutation:**
```graphql
mutation DeactivateChildrenDaycare($id: ObjectId!) {
  deactivateChildrenDaycare(id: $id) {
    id
    active
    exitedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "deactivateChildrenDaycare": {
      "id": "65childdaycare123...",
      "active": false,
      "exitedAt": "2026-02-23T10:00:00Z"
    }
  }
}
```

---

## 🎨 UI Components

### **ChildrenDaycareCard**
```tsx
interface ChildrenDaycareCardProps {
  child: ChildrenDaycare;
  onClick: (id: string) => void;
}

function ChildrenDaycareCard({ child, onClick }: ChildrenDaycareCardProps) {
  return (
    <Card onClick={() => onClick(child.id)}>
      <Avatar src={child.profile.photo} alt={child.profile.name} />
      <div>
        <h3>{child.profile.name}</h3>
        {child.customData.customName && (
          <p className="nickname">"{child.customData.customName}"</p>
        )}
        {child.medical.allergies.length > 0 && (
          <div className="allergy-warning">
            ⚠️ {child.medical.allergies.join(', ')}
          </div>
        )}
      </div>
    </Card>
  );
}
```

### **ChildrenDaycareForm**
```tsx
interface ChildrenDaycareFormProps {
  onSubmit: (data: CreateChildrenDaycareInput) => void;
  loading: boolean;
}

function ChildrenDaycareForm({ onSubmit, loading }: ChildrenDaycareFormProps) {
  const [formData, setFormData] = useState({
    daycareId: '',
    parentId: '',
    globalChildId: '',
    profile: {
      name: '',
      birthDate: '',
      photo: '',
      gender: 'MALE' as Gender,
    },
    medical: {
      allergies: [] as string[],
      medicalNotes: '',
    },
    preferences: {
      favoriteFoods: [] as string[],
      favoriteActivities: [] as string[],
      comfortItems: [] as string[],
      napRoutine: '',
    },
    customData: {
      customName: '',
      customPhoto: '',
      notes: '',
    },
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <ChildSelector
        value={formData.globalChildId}
        onChange={(v) => setFormData({ ...formData, globalChildId: v })}
        label="Pilih Anak (dari global children)"
      />
      <Input
        value={formData.profile.name}
        onChange={(v) => setFormData({ ...formData, profile: { ...formData.profile, name: v } })}
        placeholder="Nama Anak"
        required
      />
      <DatePicker
        value={formData.profile.birthDate}
        onChange={(v) => setFormData({ ...formData, profile: { ...formData.profile, birthDate: v } })}
        label="Tanggal Lahir"
        required
      />
      <TagInput
        value={formData.medical.allergies}
        onChange={(v) => setFormData({ ...formData, medical: { ...formData.medical, allergies: v } })}
        label="Alergi"
      />
      <Input
        value={formData.customData.customName}
        onChange={(v) => setFormData({ ...formData, customData: { ...formData.customData, customName: v } })}
        placeholder="Nama Panggilan di Daycare"
      />
      <Button type="submit" loading={loading}>
        Enroll ke Daycare
      </Button>
    </form>
  );
}
```

---

## 📱 Screens

| Screen | Components | Route | Permissions |
|--------|-----------|-------|-------------|
| Children List | ChildrenDaycareCard, ChildrenDaycareList | `/daycare/:id/children` | DAYCARE_ADMIN, DAYCARE_OWNER |
| Child Detail | ChildrenDaycareDetail | `/daycare/:id/children/:id` | DAYCARE_ADMIN, DAYCARE_OWNER |
| Enroll Child | ChildrenDaycareForm | `/daycare/:id/children/new` | DAYCARE_ADMIN, DAYCARE_OWNER |

---

## 🔐 Permission Matrix

| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT |
|---------|-------------|---------------|---------------|----------------|--------|
| Get Daycare Children | ✅ | ✅ | ✅ | ✅ View | ❌ |
| Get Children Daycare | ✅ | ✅ | ✅ | ✅ View | ✅ Own children |
| Create Children Daycare | ✅ | ✅ | ✅ | ❌ | ❌ |
| Update Children Daycare | ✅ | ✅ | ✅ | ❌ | ❌ |
| Deactivate Children Daycare | ✅ | ✅ | ✅ | ❌ | ❌ |

---

**File:** `TDD_06_CHILDREN_DAYCARE.md`  
**Version:** 1.0  
**Status:** Complete
