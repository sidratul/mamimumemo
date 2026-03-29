# TDD - Module 03: Medical Records

**Purpose:** Riwayat kesehatan anak (illness, injury, allergy, medication, chronic conditions)

---

## 🔍 Queries

### **MedicalRecords**

**Purpose:** Get medical records for a child

**Variables:**
```json
{
  "childId": "65child123...",
  "status": "ACTIVE"
}
```

**Query:**
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
```

**Response:**
```json
{
  "data": {
    "medicalRecords": [
      {
        "id": "65medrec123...",
        "type": "ILLNESS",
        "name": "Demam Berdarah",
        "diagnosis": "DBD Grade II",
        "symptoms": ["Demam tinggi 3 hari", "Bintik merah", "Mual"],
        "startDate": "2026-02-20T00:00:00Z",
        "endDate": "2026-02-25T00:00:00Z",
        "status": "RECOVERED",
        "severity": "HIGH",
        "treatment": "Rawat inap 3 hari, infus, paracetamol",
        "medications": [
          {
            "name": "Paracetamol",
            "dosage": "10mg/kgBB",
            "frequency": "3x sehari",
            "startDate": "2026-02-20",
            "endDate": "2026-02-25"
          }
        ],
        "doctor": {
          "name": "Dr. Andi, Sp.A",
          "hospital": "RS Anak Bunda",
          "phone": "021-1234-5678"
        },
        "reportedBy": {
          "name": "Ibu Budi",
          "relation": "mother"
        },
        "createdAt": "2026-02-20T10:00:00Z"
      }
    ]
  }
}
```

**Frontend Fields:**

| Field | Type | UI Component | Usage |
|-------|------|-------------|-------|
| `type` | Enum | Icon badge | ILLNESS=🤒, INJURY=🩹, ALLERGY=⚠️ |
| `name` | String | Record title | Display record name |
| `severity` | Enum | Color badge | LOW=green, MEDIUM=yellow, HIGH=red, CRITICAL=purple |
| `status` | Enum | Status badge | ACTIVE=blue, RECOVERED=green, CHRONIC=orange |
| `symptoms` | String[] | Symptom tags | List symptoms |
| `medications` | Array | Medication list | Display medications |
| `doctor` | Object | Doctor info | Display doctor details |

---

### **ActiveMedicalRecords**

**Purpose:** Get active medical records only

**Variables:**
```json
{
  "childId": "65child123..."
}
```

**Query:**
```graphql
query GetActiveMedicalRecords($childId: ObjectId!) {
  activeMedicalRecords(childId: $childId) {
    id
    name
    type
    severity
    startDate
    treatment
    medications {
      name
      dosage
      frequency
    }
  }
}
```

---

## ✏️ Mutations

### **CreateMedicalRecord**

**Purpose:** Create new medical record

**Variables:**
```json
{
  "input": {
    "childId": "65child123...",
    "type": "ILLNESS",
    "name": "Demam Berdarah",
    "diagnosis": "DBD Grade II",
    "symptoms": ["Demam tinggi 3 hari", "Bintik merah", "Mual"],
    "severity": "HIGH",
    "startDate": "2026-02-20",
    "treatment": "Rawat inap 3 hari, infus, paracetamol",
    "medications": [
      {
        "name": "Paracetamol",
        "dosage": "10mg/kgBB",
        "frequency": "3x sehari",
        "startDate": "2026-02-20",
        "endDate": "2026-02-25"
      }
    ],
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

**Mutation:**
```graphql
mutation CreateMedicalRecord($input: CreateMedicalRecordInput!) {
  createMedicalRecord(input: $input) {
    id
    name
    status
  }
}
```

**Response:**
```json
{
  "data": {
    "createMedicalRecord": {
      "id": "65medrec123...",
      "name": "Demam Berdarah",
      "status": "ACTIVE"
    }
  }
}
```

**Frontend Input Fields:**

| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| `type` | Enum | Valid type | Select dropdown | ✅ |
| `name` | String | Min 1 char | Text input | ✅ |
| `diagnosis` | String | Min 10 char | Textarea | ✅ |
| `symptoms` | String[] | Optional | Tag input | ❌ |
| `severity` | Enum | Valid severity | Select (color-coded) | ✅ |
| `startDate` | Date | Valid date | Date picker | ✅ |
| `endDate` | Date | Optional | Date picker | ❌ |
| `treatment` | String | Optional | Textarea | ❌ |
| `medications` | Array | Optional | Dynamic form | ❌ |
| `doctor` | Object | Optional | Doctor form | ❌ |

**Frontend Implementation:**
```typescript
interface CreateMedicalRecordForm {
  type: 'ILLNESS' | 'INJURY' | 'CHRONIC_CONDITION' | 'ALLERGY' | 'MEDICATION';
  name: string;
  diagnosis: string;
  symptoms?: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string;
  endDate?: string;
  treatment?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }>;
  doctor?: {
    name: string;
    hospital?: string;
    phone?: string;
  };
}

const [createMedicalRecord] = useMutation(CREATE_MEDICAL_RECORD_MUTATION);

const handleSubmit = async (formData: CreateMedicalRecordForm) => {
  try {
    const { data } = await createMedicalRecord({
      variables: {
        childId: childId,
        input: formData
      }
    });
    
    showToast('Rekam medis berhasil ditambahkan');
    navigate(`/children/${childId}/medical`);
    
  } catch (error) {
    showToast('Gagal menambahkan rekam medis');
  }
};
```

---

## 🎨 UI Components

### **MedicalRecordCard**
```tsx
interface MedicalRecordCardProps {
  record: MedicalRecord;
  onClick: (id: string) => void;
}

function MedicalRecordCard({ record, onClick }: MedicalRecordCardProps) {
  const severityColors = {
    LOW: 'green',
    MEDIUM: 'yellow',
    HIGH: 'red',
    CRITICAL: 'purple'
  };
  
  const typeIcons = {
    ILLNESS: '🤒',
    INJURY: '🩹',
    CHRONIC_CONDITION: '🏥',
    ALLERGY: '⚠️',
    MEDICATION: '💊'
  };
  
  return (
    <Card onClick={() => onClick(record.id)}>
      <div className="header">
        <span className="type-icon">{typeIcons[record.type]}</span>
        <h3>{record.name}</h3>
        <Badge color={severityColors[record.severity]}>
          {record.severity}
        </Badge>
      </div>
      <div className="body">
        <p>{record.diagnosis}</p>
        {record.symptoms.length > 0 && (
          <div className="symptoms">
            {record.symptoms.map(s => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        )}
        <div className="meta">
          <span>📅 {formatDate(record.startDate)}</span>
          <span className={`status-${record.status.toLowerCase()}`}>
            {record.status}
          </span>
        </div>
      </div>
    </Card>
  );
}
```

### **MedicalRecordForm**
```tsx
interface MedicalRecordFormProps {
  onSubmit: (data: CreateMedicalRecordInput) => void;
  loading: boolean;
}

function MedicalRecordForm({ onSubmit, loading }: MedicalRecordFormProps) {
  const [formData, setFormData] = useState({
    type: 'ILLNESS' as MedicalRecordType,
    name: '',
    diagnosis: '',
    symptoms: [] as string[],
    severity: 'MEDIUM' as MedicalRecordSeverity,
    startDate: '',
    endDate: '',
    treatment: '',
    medications: [] as Array<{
      name: string;
      dosage: string;
      frequency: string;
      startDate: string;
      endDate: string;
    }>,
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <Select
        value={formData.type}
        onChange={(v) => setFormData({ ...formData, type: v })}
        options={[
          { value: 'ILLNESS', label: '🤒 Penyakit' },
          { value: 'INJURY', label: '🩹 Cedera' },
          { value: 'CHRONIC_CONDITION', label: '🏥 Kondisi Kronis' },
          { value: 'ALLERGY', label: '⚠️ Alergi' },
          { value: 'MEDICATION', label: '💊 Pengobatan' },
        ]}
        required
      />
      <Input
        value={formData.name}
        onChange={(v) => setFormData({ ...formData, name: v })}
        placeholder="Nama (misal: Demam Berdarah)"
        required
      />
      <Textarea
        value={formData.diagnosis}
        onChange={(v) => setFormData({ ...formData, diagnosis: v })}
        placeholder="Diagnosis dokter"
        required
      />
      <TagInput
        value={formData.symptoms}
        onChange={(v) => setFormData({ ...formData, symptoms: v })}
        label="Gejala"
      />
      <Select
        value={formData.severity}
        onChange={(v) => setFormData({ ...formData, severity: v })}
        options={[
          { value: 'LOW', label: 'Rendah' },
          { value: 'MEDIUM', label: 'Sedang' },
          { value: 'HIGH', label: 'Tinggi' },
          { value: 'CRITICAL', label: 'Kritis' },
        ]}
        required
      />
      <DatePicker
        value={formData.startDate}
        onChange={(v) => setFormData({ ...formData, startDate: v })}
        label="Tanggal Mulai"
        required
      />
      <DatePicker
        value={formData.endDate}
        onChange={(v) => setFormData({ ...formData, endDate: v })}
        label="Tanggal Sembuh (opsional)"
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
| Medical Records List | MedicalRecordCard, MedicalRecordList | `/children/:id/medical` | Owner & Guardians |
| Add Medical Record | MedicalRecordForm | `/children/:id/medical/new` | INPUT_HEALTH permission |
| Medical Record Detail | MedicalRecordDetail | `/children/:id/medical/:recordId` | Owner & Guardians |

---

## 🔐 Permission Matrix

| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT (Owner) | PARENT (Guardian) |
|---------|-------------|---------------|---------------|----------------|----------------|-------------------|
| Get Medical Records | ✅ | ✅ | ✅ | ✅ View | ✅ Own | ✅ Guarded |
| Create Medical Record | ✅ | ✅ | ✅ | ❌ | ✅ | With INPUT_HEALTH |
| Update Medical Record | ✅ | ✅ | ✅ | ❌ | ✅ | With INPUT_HEALTH |
| Delete Medical Record | ✅ | ✅ | ✅ | ❌ | ✅ | Creator only |

---

**File:** `TDD_03_MEDICAL_RECORDS.md`  
**Version:** 1.0  
**Status:** Complete
