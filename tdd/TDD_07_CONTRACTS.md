# TDD - Module 07: Contracts

**Purpose:** Service agreement antara daycare & parent

---

## 🔍 Queries

### **GetDaycareContracts**

**Variables:**
```json
{
  "daycareId": "65daycare123...",
  "status": "ACTIVE"
}
```

**Query:**
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
    isExpired
  }
}
```

**Frontend Fields:**
| Field | Type | UI Component |
|-------|------|-------------|
| `serviceType` | Enum | Badge (DAILY/WEEKLY/MONTHLY) |
| `price` | Float | Price display |
| `status` | Enum | Status badge |
| `isExpired` | Boolean | Expiry warning |

---

### **GetParentContracts**

**Variables:**
```json
{
  "parentId": "65parent456...",
  "status": "ACTIVE"
}
```

**Query:**
```graphql
query GetParentContracts($parentId: ObjectId!, $status: ContractStatus) {
  parentContracts(parentId: $parentId, status: $status) {
    id
    daycare {
      name
    }
    childIds
    serviceType
    price
    startDate
    endDate
    status
  }
}
```

---

### **GetContract**

**Variables:**
```json
{
  "id": "65contract789..."
}
```

**Query:**
```graphql
query GetContract($id: ObjectId!) {
  contract(id: $id) {
    id
    parent {
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
  }
}
```

---

## ✏️ Mutations

### **CreateContract**

**Variables:**
```json
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

**Mutation:**
```graphql
mutation CreateContract($input: CreateContractInput!) {
  createContract(input: $input) {
    id
    status
  }
}
```

---

### **UpdateContract**

**Variables:**
```json
{
  "id": "65contract789...",
  "input": {
    "serviceType": "WEEKLY",
    "price": 150000,
    "endDate": "2026-03-15"
  }
}
```

**Mutation:**
```graphql
mutation UpdateContract($id: ObjectId!, $input: UpdateContractInput!) {
  updateContract(id: $id, input: $input) {
    id
    serviceType
    price
  }
}
```

---

### **UpdateContractStatus**

**Variables:**
```json
{
  "id": "65contract789...",
  "status": "TERMINATED"
}
```

**Mutation:**
```graphql
mutation UpdateContractStatus($id: ObjectId!, $status: ContractStatus!) {
  updateContractStatus(id: $id, status: $status) {
    id
    status
  }
}
```

---

## 📱 UI Components

### **ContractCard**
```tsx
function ContractCard({ contract, onClick }) {
  return (
    <Card onClick={() => onClick(contract.id)}>
      <h3>{contract.parent.name}</h3>
      <Badge>{contract.serviceType}</Badge>
      <p>Rp {contract.price.toLocaleString()}</p>
      <StatusBadge status={contract.status} />
      {contract.isExpired && <Warning>Expired</Warning>}
    </Card>
  );
}
```

---

## 🔐 Permissions

| Feature | DAYCARE_ADMIN | PARENT |
|---------|---------------|--------|
| View Contracts | ✅ All | ✅ Own |
| Create Contract | ✅ | ❌ |
| Update Contract | ✅ | ❌ |
| Terminate Contract | ✅ | ❌ |

---

**File:** `TDD_07_CONTRACTS.md`  
**Status:** Complete
