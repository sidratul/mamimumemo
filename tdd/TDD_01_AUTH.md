# TDD - Module 01: Authentication

**Purpose:** User registration, login, dan profile management

---

## 📋 User Roles

```typescript
enum UserRole {
  SUPER_ADMIN      // System owner
  DAYCARE_OWNER    // Pemilik daycare
  DAYCARE_ADMIN    // Administrator daycare
  DAYCARE_SITTER   // Pengasuh/guru
  PARENT           // Orang tua/wali
}
```

---

## 🔍 Queries

### **GetProfile**

**File:** `src/auth/auth.typedef.ts`

```graphql
query GetProfile {
  profile {
    id
    name
    email
    phone
    role
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "profile": {
      "id": "65abc123...",
      "name": "Ibu Budi",
      "email": "ibu@example.com",
      "phone": "0812-3456-7890",
      "role": "PARENT",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-02-20T14:30:00Z"
    }
  }
}
```

**Frontend Fields:**

| Field | Type | UI Component | Usage |
|-------|------|-------------|-------|
| `name` | String | Profile header, greeting | Display user name |
| `email` | String | Account settings | Display & edit |
| `phone` | String | Contact info | Display & edit |
| `role` | Enum | Menu permissions | Feature access control |

---

## ✏️ Mutations

### **Register**

**Purpose:** Register new user

**Variables:**
```json
{
  "input": {
    "name": "Ibu Budi",
    "email": "ibu@example.com",
    "password": "password123",
    "phone": "0812-3456-7890",
    "role": "PARENT"
  }
}
```

**Mutation:**
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    message
  }
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "id": "65abc123...",
      "message": "Registrasi berhasil"
    }
  }
}
```

**Frontend Input Fields:**

| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| `name` | String | Min 1 char | Text input | ✅ |
| `email` | String | Valid email | Email input | ✅ |
| `password` | String | Min 6 chars | Password input | ✅ |
| `phone` | String | Optional | Phone input | ❌ |
| `role` | Enum | Default: PARENT | Hidden dropdown | ❌ |

**Error Handling:**
```typescript
// Error: EMAIL_EXISTS
if (error.message.includes('sudah terdaftar')) {
  showToast('Email sudah terdaftar, silakan login');
}

// Error: VALIDATION_ERROR
if (error.message.includes('Validasi gagal')) {
  showFieldErrors(error.extensions.validationErrors);
}
```

---

### **Login**

**Purpose:** User authentication

**Variables:**
```json
{
  "input": {
    "email": "ibu@example.com",
    "password": "password123"
  }
}
```

**Mutation:**
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
  }
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Frontend Input Fields:**

| Field | Type | Validation | UI Component | Required |
|-------|------|-----------|-------------|----------|
| `email` | String | Valid email | Email input | ✅ |
| `password` | String | Min 1 char | Password input | ✅ |

**Frontend Implementation:**
```typescript
// 1. Execute login mutation
const [login] = useMutation(LOGIN_MUTATION);

const handleLogin = async (email: string, password: string) => {
  try {
    const { data } = await login({
      variables: { input: { email, password } }
    });
    
    // 2. Store token
    localStorage.setItem('token', data.login.token);
    sessionStorage.setItem('token', data.login.token);
    
    // 3. Redirect to dashboard
    navigate('/dashboard');
    
  } catch (error) {
    // Handle errors
    if (error.message.includes('Kredensial tidak valid')) {
      showToast('Email atau password salah');
    }
  }
};
```

**Token Storage:**
```typescript
// Auth context
const AuthContext = createContext({
  token: string | null,
  user: User | null,
  login: (token: string) => void,
  logout: () => void,
});

// Attach token to requests
const client = new GraphQLClient('/graphql', {
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});
```

---

### **Logout** (Optional - Client Side)

**Purpose:** Clear user session

**Implementation:**
```typescript
const handleLogout = () => {
  // Clear tokens
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  
  // Clear user data
  localStorage.removeItem('user');
  
  // Redirect to login
  navigate('/login');
};
```

---

## 🎨 UI Components

### **LoginForm**
```tsx
interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
}

function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(email, password);
    }}>
      <Input
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Password"
        required
      />
      <Button type="submit" loading={loading}>
        Login
      </Button>
    </form>
  );
}
```

### **RegisterForm**
```tsx
interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => void;
  loading: boolean;
}

function RegisterForm({ onSubmit, loading }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <Input
        value={formData.name}
        onChange={(v) => setFormData({ ...formData, name: v })}
        placeholder="Nama Lengkap"
        required
      />
      <Input
        type="email"
        value={formData.email}
        onChange={(v) => setFormData({ ...formData, email: v })}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={formData.password}
        onChange={(v) => setFormData({ ...formData, password: v })}
        placeholder="Password (min 6 karakter)"
        minLength={6}
        required
      />
      <Input
        type="tel"
        value={formData.phone}
        onChange={(v) => setFormData({ ...formData, phone: v })}
        placeholder="Nomor HP (opsional)"
      />
      <Button type="submit" loading={loading}>
        Daftar
      </Button>
    </form>
  );
}
```

---

## 🔐 Permission Matrix

| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT |
|---------|-------------|---------------|---------------|----------------|--------|
| Register | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Get Profile | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📱 Screens

| Screen | Components | Route |
|--------|-----------|-------|
| Login | LoginForm | `/login` |
| Register | RegisterForm | `/register` |
| Profile | ProfileForm, UserInfo | `/profile` |

---

## 🧪 Test Cases

### **Register**
```typescript
// Test 1: Success
test('should register new user successfully', async () => {
  const variables = {
    input: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'PARENT'
    }
  };
  
  const { data } = await mutate(REGISTER, variables);
  expect(data.register.id).toBeDefined();
  expect(data.register.message).toBe('Registrasi berhasil');
});

// Test 2: Email exists
test('should fail when email already exists', async () => {
  const variables = {
    input: {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
    }
  };
  
  await expect(mutate(REGISTER, variables))
    .rejects.toThrow('Email sudah terdaftar');
});

// Test 3: Invalid email
test('should fail with invalid email', async () => {
  const variables = {
    input: {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    }
  };
  
  await expect(mutate(REGISTER, variables))
    .rejects.toThrow('Invalid email');
});
```

### **Login**
```typescript
// Test 1: Success
test('should login successfully', async () => {
  const variables = {
    input: {
      email: 'test@example.com',
      password: 'password123'
    }
  };
  
  const { data } = await mutate(LOGIN, variables);
  expect(data.login.token).toBeDefined();
  expect(data.login.token).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
});

// Test 2: Invalid credentials
test('should fail with invalid credentials', async () => {
  const variables = {
    input: {
      email: 'test@example.com',
      password: 'wrong-password'
    }
  };
  
  await expect(mutate(LOGIN, variables))
    .rejects.toThrow('Kredensial tidak valid');
});
```

---

**File:** `TDD_01_AUTH.md`  
**Version:** 1.0  
**Status:** Complete
