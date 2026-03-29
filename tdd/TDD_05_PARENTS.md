# TDD - Module 05: Parents

**Purpose:** Parent snapshot di daycare (enrollment dengan custom data)

---

## 🔍 Queries

### **DaycareParents**

**Purpose:** Get all parents enrolled in a daycare

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "active": true
}
```

**Query:**
```graphql
query GetDaycareParents($daycareId: ObjectId!, $active: Boolean) {
  daycareParents(daycareId: $daycareId, active: $active) {
    id
    user {
      userId
      name
      email
      phone
      role
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
      notes
    }
    childrenIds
    enrolledAt
    active
  }
}
```

**Response:**
```json
{
  "data": {
    "daycareParents": [
      {
        "id": "65parent123...",
        "user": {
          "userId": "65user456...",
          "name": "Ibu Budi",
          "email": "ibu@example.com",
          "phone": "0812-3456-7890",
          "role": "PARENT"
        },
        "customData": {
          "deskripsi": "No rek: 1234567890",
          "emergencyContact": {
            "name": "Ayah Budi",
            "phone": "0813-4567-8901",
            "relation": "father"
          },
          "pickupAuthorization": [
            {
              "name": "Nenek Budi",
              "phone": "0814-5678-9012",
              "relation": "grandmother"
            }
          ],
          "notes": "Jemput setelah jam 4 sore"
        },
        "childrenIds": ["65child789..."],
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
| `user.name` | String | Parent list | Display parent name |
| `user.phone` | String | Contact button | Call/WhatsApp |
| `customData.emergencyContact` | Object | Emergency card | Emergency info |
| `customData.pickupAuthorization` | Array | Authorized list | Who can pick up child |
| `childrenIds` | ObjectId[] | Child badges | Linked children |

---

### **Parent**

**Purpose:** Get parent by ID

**Variables:**
```json
{
  "id": "65parent123..."
}
```

**Query:**
```graphql
query GetParent($id: ObjectId!) {
  parent(id: $id) {
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
```

---

### **ParentByUser**

**Purpose:** Get parent by user ID and daycare

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "userId": "65user456..."
}
```

**Query:**
```graphql
query GetParentByUser($daycareId: ObjectId!, $userId: ObjectId!) {
  parentByUser(daycareId: $daycareId, userId: $userId) {
    id
    user {
      userId
      name
    }
    childrenIds
  }
}
```

---

## ✏️ Mutations

### **CreateParent**

**Purpose:** Enroll parent to daycare

**Variables:**
```json
{
  "input": {
    "daycareId": "65daycare123...",
    "user": {
      "userId": "65user456...",
      "name": "Ibu Budi",
      "email": "ibu@example.com",
      "phone": "0812-3456-7890",
      "role": "PARENT"
    },
    "customData": {
      "deskripsi": "No rek: 1234567890",
      "emergencyContact": {
        "name": "Ayah Budi",
        "phone": "0813-4567-8901",
        "relation": "father"
      },
      "pickupAuthorization": [
        {
          "name": "Nenek Budi",
          "phone": "0814-5678-9012",
          "relation": "grandmother"
        }
      ],
      "notes": "Jemput setelah jam 4 sore"
    },
    "childrenIds": ["65child789..."]
  }
}
```

**Mutation:**
```graphql
mutation CreateParent($input: CreateParentInput!) {
  createParent(input: $input) {
    id
    user {
      name
    }
    childrenIds
  }
}
```

**Response:**
```json
{
  "data": {
    "createParent": {
      "id": "65parent123...",
      "user": {
        "name": "Ibu Budi"
      },
      "childrenIds": ["65child789..."]
    }
  }
}
```

**Frontend Input Fields:**

| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| `user.userId` | ObjectId | Valid user ID | User selector | ✅ |
| `user.name` | String | Min 1 char | Text input | ✅ |
| `user.email` | String | Valid email | Email input | ✅ |
| `user.phone` | String | Optional | Phone input | ❌ |
| `customData.deskripsi` | String | Optional | Textarea | ❌ |
| `customData.emergencyContact` | Object | Optional | Contact form | ❌ |
| `customData.pickupAuthorization` | Array | Optional | Dynamic list | ❌ |
| `childrenIds` | Array | Optional | Child selector | ❌ |

---

### **UpdateParent**

**Purpose:** Update parent information

**Variables:**
```json
{
  "id": "65parent123...",
  "input": {
    "customData": {
      "deskripsi": "No rek: 9876543210",
      "emergencyContact": {
        "name": "Ayah Budi Updated",
        "phone": "0813-4567-8901",
        "relation": "father"
      }
    },
    "childrenIds": ["65child789...", "65child790..."]
  }
}
```

**Mutation:**
```graphql
mutation UpdateParent($id: ObjectId!, $input: UpdateParentInput!) {
  updateParent(id: $id, input: $input) {
    id
    customData {
      deskripsi
      emergencyContact {
        name
        phone
      }
    }
    childrenIds
  }
}
```

---

### **DeactivateParent**

**Purpose:** Soft delete parent (deactivate enrollment)

**Variables:**
```json
{
  "id": "65parent123..."
}
```

**Mutation:**
```graphql
mutation DeactivateParent($id: ObjectId!) {
  deactivateParent(id: $id) {
    id
    active
  }
}
```

**Response:**
```json
{
  "data": {
    "deactivateParent": {
      "id": "65parent123...",
      "active": false
    }
  }
}
```

---

## 🎨 UI Components

### **ParentCard**
```tsx
interface ParentCardProps {
  parent: Parent;
  onClick: (id: string) => void;
}

function ParentCard({ parent, onClick }: ParentCardProps) {
  return (
    <Card onClick={() => onClick(parent.id)}>
      <div className="header">
        <Avatar name={parent.user.name} />
        <div>
          <h3>{parent.user.name}</h3>
          <p>{parent.user.email}</p>
        </div>
      </div>
      <div className="body">
        {parent.customData.emergencyContact && (
          <div className="emergency">
            <strong>Emergency Contact:</strong>
            <p>{parent.customData.emergencyContact.name}</p>
            <p>{parent.customData.emergencyContact.phone}</p>
          </div>
        )}
        {parent.customData.pickupAuthorization.length > 0 && (
          <div className="pickup">
            <strong>Authorized Pickup:</strong>
            {parent.customData.pickupAuthorization.map(p => (
              <Badge key={p.name}>{p.name}</Badge>
            ))}
          </div>
        )}
        {parent.childrenIds.length > 0 && (
          <div className="children">
            <strong>Children: {parent.childrenIds.length}</strong>
          </div>
        )}
      </div>
    </Card>
  );
}
```

### **ParentForm**
```tsx
interface ParentFormProps {
  onSubmit: (data: CreateParentInput) => void;
  loading: boolean;
}

function ParentForm({ onSubmit, loading }: ParentFormProps) {
  const [formData, setFormData] = useState({
    user: {
      userId: '',
      name: '',
      email: '',
      phone: '',
      role: 'PARENT' as const,
    },
    customData: {
      deskripsi: '',
      emergencyContact: {
        name: '',
        phone: '',
        relation: '',
      },
      pickupAuthorization: [] as Array<{
        name: string;
        phone: string;
        relation: string;
      }>,
      notes: '',
    },
    childrenIds: [] as string[],
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <UserSelector
        value={formData.user.userId}
        onChange={(v) => setFormData({ ...formData, user: { ...formData.user, userId: v } })}
        required
      />
      <Input
        value={formData.customData.deskripsi}
        onChange={(v) => setFormData({ ...formData, customData: { ...formData.customData, deskripsi: v } })}
        placeholder="Deskripsi (misal: No rekening)"
      />
      <EmergencyContactForm
        value={formData.customData.emergencyContact}
        onChange={(v) => setFormData({ ...formData, customData: { ...formData.customData, emergencyContact: v } })}
      />
      <PickupAuthorizationList
        value={formData.customData.pickupAuthorization}
        onChange={(v) => setFormData({ ...formData, customData: { ...formData.customData, pickupAuthorization: v } })}
      />
      <ChildSelector
        value={formData.childrenIds}
        onChange={(v) => setFormData({ ...formData, childrenIds: v })}
        multiple
      />
      <Button type="submit" loading={loading}>
        Simpan
      </Button>
    </form>
  );
}
```

---

## 📱 Screens

| Screen | Components | Route | Permissions |
|--------|-----------|-------|-------------|
| Parent List | ParentCard, ParentList | `/daycare/:id/parents` | DAYCARE_ADMIN, DAYCARE_OWNER |
| Parent Detail | ParentDetail | `/daycare/:id/parents/:id` | DAYCARE_ADMIN, DAYCARE_OWNER |
| Enroll Parent | ParentForm | `/daycare/:id/parents/new` | DAYCARE_ADMIN, DAYCARE_OWNER |

---

## 🔐 Permission Matrix

| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT |
|---------|-------------|---------------|---------------|----------------|--------|
| Get Daycare Parents | ✅ | ✅ | ✅ | ✅ View | ❌ |
| Get Parent | ✅ | ✅ | ✅ | ✅ View | ✅ Own |
| Create Parent | ✅ | ✅ | ✅ | ❌ | ❌ |
| Update Parent | ✅ | ✅ | ✅ | ❌ | ✅ Own |
| Deactivate Parent | ✅ | ✅ | ✅ | ❌ | ❌ |

---

**File:** `TDD_05_PARENTS.md`  
**Version:** 1.0  
**Status:** Complete
