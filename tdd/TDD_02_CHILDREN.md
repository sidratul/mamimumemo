# TDD - Module 02: Children

**Purpose:** Manage data anak (global, parent-owned) dengan guardians

---

## 📋 Overview

Children module mengelola data anak yang dimiliki parent dengan fitur:
- Create child dengan profile & medical info
- Add/remove guardians dengan permissions
- Access control (owner & guardians only)

---

## 🔍 Queries

### **GetMyChildren**

**Purpose:** Get all children owned by current user

**Variables:**
```json
{}
```

**Query:**
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

**Response:**
```json
{
  "data": {
    "myChildren": [
      {
        "id": "65child123...",
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
              "schedule": "Setiap malam sebelum tidur"
            }
          ]
        },
        "guardians": [
          {
            "user": {
              "userId": "65father456...",
              "name": "Ayah Budi",
              "email": "ayah@example.com",
              "phone": "0812-3456-7890",
              "role": "PARENT"
            },
            "relation": "FATHER",
            "permissions": [
              "VIEW_REPORTS",
              "INPUT_ACTIVITY",
              "INPUT_HEALTH",
              "ENROLL_DAYCARE",
              "EDIT_PROFILE",
              "MANAGE_GUARDIANS"
            ],
            "sharedAt": "2026-01-15T10:00:00Z",
            "active": true
          }
        ],
        "createdAt": "2026-01-15T10:00:00Z",
        "updatedAt": "2026-02-20T14:30:00Z"
      }
    ]
  }
}
```

**Frontend Fields:**

| Field | Type | UI Component | Usage |
|-------|------|-------------|-------|
| `profile.name` | String | Child card title | Display child name |
| `profile.photo` | URL | Avatar image | Profile picture |
| `profile.birthDate` | Date | Age badge | Calculate age |
| `profile.gender` | Enum | Gender icon | MALE=👦, FEMALE=👧 |
| `medical.allergies` | String[] | Allergy warning badges | Display warnings |
| `guardians` | Array | Guardian list | Show who has access |
| `guardians.permissions` | Enum[] | Permission chips | Show access level |

---

### **GetChild**

**Purpose:** Get specific child by ID

**Variables:**
```json
{
  "id": "65child123..."
}
```

**Query:**
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

**Response:**
```json
{
  "data": {
    "child": {
      "id": "65child123...",
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
            "schedule": "Setiap malam sebelum tidur"
          }
        ]
      },
      "guardians": [
        {
          "user": {
            "userId": "65father456...",
            "name": "Ayah Budi",
            "relation": "FATHER"
          },
          "permissions": [
            "VIEW_REPORTS",
            "INPUT_ACTIVITY"
          ],
          "active": true
        }
      ]
    }
  }
}
```

---

### **ChildrenWhereIGuard**

**Purpose:** Get children where user is a guardian

**Variables:**
```json
{}
```

**Query:**
```graphql
query ChildrenWhereIGuard {
  childrenWhereIGuard {
    id
    profile {
      name
      birthDate
      photo
    }
    guardians {
      user {
        userId
        name
      }
      permissions
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "childrenWhereIGuard": [
      {
        "id": "65child123...",
        "profile": {
          "name": "Budi Santoso",
          "birthDate": "2023-01-15T00:00:00Z",
          "photo": "https://example.com/budi.jpg"
        },
        "guardians": [
          {
            "user": {
              "userId": "65user789...",
              "name": "Ibu Budi"
            },
            "permissions": [
              "VIEW_REPORTS",
              "INPUT_ACTIVITY"
            ]
          }
        ]
      }
    ]
  }
}
```

---

## ✏️ Mutations

### **CreateChild**

**Purpose:** Create new child record

**Variables:**
```json
{
  "input": {
    "profile": {
      "name": "Budi Santoso",
      "birthDate": "2023-01-15",
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
          "schedule": "Setiap malam sebelum tidur"
        }
      ]
    },
    "guardians": [
      {
        "userId": "65father456...",
        "relation": "FATHER",
        "permissions": [
          "VIEW_REPORTS",
          "INPUT_ACTIVITY",
          "INPUT_HEALTH"
        ]
      }
    ]
  }
}
```

**Mutation:**
```graphql
mutation CreateChild($input: CreateChildInput!) {
  createChild(input: $input) {
    id
    profile {
      name
      birthDate
      gender
    }
    medical {
      allergies
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "createChild": {
      "id": "65child123...",
      "profile": {
        "name": "Budi Santoso",
        "birthDate": "2023-01-15T00:00:00Z",
        "gender": "MALE"
      },
      "medical": {
        "allergies": ["Susu sapi", "Kacang"]
      }
    }
  }
}
```

**Frontend Input Fields:**

| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| `profile.name` | String | Min 1 char | Text input | ✅ |
| `profile.birthDate` | Date | Valid date | Date picker | ✅ |
| `profile.photo` | URL | Valid URL | Image upload | ❌ |
| `profile.gender` | Enum | MALE/FEMALE | Radio buttons | ✅ |
| `medical.allergies` | String[] | Optional | Tag input | ❌ |
| `medical.medicalNotes` | String | Optional | Textarea | ❌ |
| `medical.medications` | Array | Optional | Dynamic form | ❌ |
| `guardians` | Array | Optional | Guardian selector | ❌ |

**Frontend Implementation:**
```typescript
interface CreateChildForm {
  profile: {
    name: string;
    birthDate: string;
    photo?: string;
    gender: 'MALE' | 'FEMALE';
  };
  medical?: {
    allergies?: string[];
    medicalNotes?: string;
    medications?: Array<{
      name: string;
      dosage: string;
      schedule: string;
    }>;
  };
}

const [createChild] = useMutation(CREATE_CHILD_MUTATION);

const handleSubmit = async (formData: CreateChildForm) => {
  try {
    const { data } = await createChild({
      variables: { input: formData }
    });
    
    showToast('Anak berhasil ditambahkan');
    navigate(`/children/${data.createChild.id}`);
    
  } catch (error) {
    showToast('Gagal menambahkan anak');
  }
};
```

---

### **UpdateChild**

**Purpose:** Update child information

**Variables:**
```json
{
  "id": "65child123...",
  "input": {
    "profile": {
      "name": "Budi Santoso Updated",
      "photo": "https://example.com/budi-new.jpg"
    },
    "medical": {
      "allergies": ["Susu sapi", "Telur"],
      "medications": [
        {
          "name": "Ventolin",
          "dosage": "2 puff",
          "schedule": "Setiap malam"
        }
      ]
    }
  }
}
```

**Mutation:**
```graphql
mutation UpdateChild($id: ObjectId!, $input: UpdateChildInput!) {
  updateChild(id: $id, input: $input) {
    id
    profile {
      name
      photo
    }
    medical {
      allergies
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "updateChild": {
      "id": "65child123...",
      "profile": {
        "name": "Budi Santoso Updated",
        "photo": "https://example.com/budi-new.jpg"
      },
      "medical": {
        "allergies": ["Susu sapi", "Telur"]
      }
    }
  }
}
```

**Permission Check:**
```typescript
// Only owner or guardian with EDIT_PROFILE permission can update
const canEdit = 
  user.id === child.ownerId ||
  child.guardians.some(
    g => g.user.userId === user.id && 
    g.permissions.includes('EDIT_PROFILE')
  );

if (!canEdit) {
  showToast('Anda tidak memiliki izin untuk mengedit');
  return;
}
```

---

### **AddGuardian**

**Purpose:** Add guardian to existing child

**Variables:**
```json
{
  "childId": "65child123...",
  "input": {
    "userId": "65father456...",
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

**Mutation:**
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
```

**Response:**
```json
{
  "data": {
    "addGuardian": {
      "id": "65child123...",
      "guardians": [
        {
          "user": {
            "name": "Ayah Budi",
            "email": "ayah@example.com"
          },
          "relation": "FATHER",
          "permissions": [
            "VIEW_REPORTS",
            "INPUT_ACTIVITY",
            "INPUT_HEALTH",
            "ATTENDANCE"
          ]
        }
      ]
    }
  }
}
```

**Frontend Input Fields:**

| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| `userId` | ObjectId | Valid user ID | User selector | ✅ |
| `relation` | Enum | Valid relation | Dropdown | ✅ |
| `permissions` | Enum[] | At least 1 | Checkbox group | ✅ |

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

**Frontend Implementation:**
```typescript
interface AddGuardianForm {
  userId: string;
  relation: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'GRANDFATHER' | 'GRANDMOTHER' | 'OTHER';
  permissions: GuardianPermission[];
}

const [addGuardian] = useMutation(ADD_GUARDIAN_MUTATION);

const handleSubmit = async (formData: AddGuardianForm) => {
  try {
    await addGuardian({
      variables: {
        childId: childId,
        input: formData
      }
    });
    
    showToast('Guardian berhasil ditambahkan');
    refetch(); // Refresh child data
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      showToast('Guardian sudah ada');
    } else {
      showToast('Gagal menambahkan guardian');
    }
  }
};
```

---

### **RemoveGuardian**

**Purpose:** Remove guardian from child

**Variables:**
```json
{
  "childId": "65child123...",
  "input": {
    "guardianUserId": "65father456..."
  }
}
```

**Mutation:**
```graphql
mutation RemoveGuardian($childId: ObjectId!, $input: RemoveGuardianInput!) {
  removeGuardian(childId: $childId, input: $input) {
    id
    guardians {
      user {
        name
      }
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "removeGuardian": {
      "id": "65child123...",
      "guardians": []
    }
  }
}
```

**Frontend Implementation:**
```typescript
const [removeGuardian] = useMutation(REMOVE_GUARDIAN_MUTATION);

const handleRemoveGuardian = async (guardianUserId: string) => {
  const confirmed = await confirmDialog({
    title: 'Hapus Guardian',
    message: 'Apakah Anda yakin ingin menghapus guardian ini?',
  });
  
  if (!confirmed) return;
  
  try {
    await removeGuardian({
      variables: {
        childId: childId,
        input: { guardianUserId }
      }
    });
    
    showToast('Guardian berhasil dihapus');
    refetch();
    
  } catch (error) {
    showToast('Gagal menghapus guardian');
  }
};
```

---

## 🎨 UI Components

### **ChildCard**
```tsx
interface ChildCardProps {
  child: Child;
  onClick: (id: string) => void;
}

function ChildCard({ child, onClick }: ChildCardProps) {
  const age = calculateAge(child.profile.birthDate);
  
  return (
    <Card onClick={() => onClick(child.id)}>
      <Avatar src={child.profile.photo} alt={child.profile.name} />
      <div>
        <h3>{child.profile.name}</h3>
        <p>{age} tahun</p>
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

### **GuardianList**
```tsx
interface GuardianListProps {
  guardians: Guardian[];
  onRemove: (userId: string) => void;
  canEdit: boolean;
}

function GuardianList({ guardians, onRemove, canEdit }: GuardianListProps) {
  return (
    <div>
      <h4>Guardians</h4>
      {guardians.map(guardian => (
        <div key={guardian.user.userId} className="guardian-item">
          <div>
            <strong>{guardian.user.name}</strong>
            <span>{guardian.relation}</span>
          </div>
          <div className="permissions">
            {guardian.permissions.map(permission => (
              <Badge key={permission}>{permission}</Badge>
            ))}
          </div>
          {canEdit && (
            <Button onClick={() => onRemove(guardian.user.userId)}>
              Remove
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### **ChildForm**
```tsx
interface ChildFormProps {
  onSubmit: (data: CreateChildInput) => void;
  loading: boolean;
}

function ChildForm({ onSubmit, loading }: ChildFormProps) {
  const [formData, setFormData] = useState({
    profile: {
      name: '',
      birthDate: '',
      photo: '',
      gender: 'MALE' as Gender,
    },
    medical: {
      allergies: [] as string[],
      medicalNotes: '',
      medications: [] as Array<{
        name: string;
        dosage: string;
        schedule: string;
      }>,
    },
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
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
      <RadioGroup
        value={formData.profile.gender}
        onChange={(v) => setFormData({ ...formData, profile: { ...formData.profile, gender: v } })}
        options={[
          { value: 'MALE', label: 'Laki-laki' },
          { value: 'FEMALE', label: 'Perempuan' },
        ]}
        required
      />
      <TagInput
        value={formData.medical.allergies}
        onChange={(v) => setFormData({ ...formData, medical: { ...formData.medical, allergies: v } })}
        label="Alergi (opsional)"
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
| Children List | ChildCard, ChildList | `/children` | All users |
| Child Detail | ChildForm, GuardianList | `/children/:id` | Owner & Guardians |
| Add Child | ChildForm | `/children/new` | PARENT role |
| Edit Child | ChildForm | `/children/:id/edit` | EDIT_PROFILE permission |

---

## 🧪 Test Cases

### **CreateChild**
```typescript
test('should create child successfully', async () => {
  const variables = {
    input: {
      profile: {
        name: 'Budi Santoso',
        birthDate: '2023-01-15',
        gender: 'MALE',
      },
      medical: {
        allergies: ['Susu sapi'],
      },
    },
  };
  
  const { data } = await mutate(CREATE_CHILD, variables);
  expect(data.createChild.id).toBeDefined();
  expect(data.createChild.profile.name).toBe('Budi Santoso');
});

test('should fail without required fields', async () => {
  const variables = {
    input: {
      profile: {
        name: '', // Empty name
        birthDate: '2023-01-15',
        gender: 'MALE',
      },
    },
  };
  
  await expect(mutate(CREATE_CHILD, variables))
    .rejects.toThrow('Name is required');
});
```

### **AddGuardian**
```typescript
test('should add guardian successfully', async () => {
  const variables = {
    childId: '65child123...',
    input: {
      userId: '65father456...',
      relation: 'FATHER',
      permissions: ['VIEW_REPORTS', 'INPUT_ACTIVITY'],
    },
  };
  
  const { data } = await mutate(ADD_GUARDIAN, variables);
  expect(data.addGuardian.guardians.length).toBeGreaterThan(0);
});

test('should fail if guardian already exists', async () => {
  const variables = {
    childId: '65child123...',
    input: {
      userId: '65father456...', // Already a guardian
      relation: 'FATHER',
      permissions: ['VIEW_REPORTS'],
    },
  };
  
  await expect(mutate(ADD_GUARDIAN, variables))
    .rejects.toThrow('Guardian already exists');
});
```

---

## 🔐 Permission Matrix

| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT (Owner) | PARENT (Guardian) |
|---------|-------------|---------------|---------------|----------------|----------------|-------------------|
| Get My Children | ✅ | ✅ | ✅ | ✅ | ✅ Own | ✅ Guarded |
| Get Child | ✅ | ✅ | ✅ | ✅ | ✅ Own | ✅ Guarded |
| Create Child | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Update Child | ✅ | ✅ | ✅ | ❌ | ✅ | With permission |
| Add Guardian | ✅ | ✅ | ✅ | ❌ | ✅ | With permission |
| Remove Guardian | ✅ | ✅ | ✅ | ❌ | ✅ | With permission |

---

**File:** `TDD_02_CHILDREN.md`  
**Version:** 1.0  
**Status:** Complete
