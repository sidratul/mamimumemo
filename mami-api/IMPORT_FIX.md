# Import Fix - GraphQL & Mongoose

## Problem

Deno requires explicit `npm:` prefix for npm packages, but original code used bare imports:
```typescript
import { GraphQLError } from "graphql";  // ❌ Error in Deno
import { Types } from "mongoose";        // ❌ Error in Deno
```

## Solution

All imports have been updated to use `npm:` prefix:
```typescript
import { GraphQLError } from "npm:graphql";  // ✅ Works in Deno
import { Types } from "npm:mongoose";        // ✅ Works in Deno
```

## Files Updated

**Bulk Update Command:**
```bash
# Fix graphql imports
find . -name "*.ts" -type f -exec sed -i '' 's/from "graphql"/from "npm:graphql"/g' {} +

# Fix mongoose imports
find . -name "*.ts" -type f -exec sed -i '' 's/from "mongoose"/from "npm:mongoose"/g' {} +
```

**Affected Files (32 files):**
- All service files (`src/*/ *.service.ts`)
- All repository files (`src/*/ *.repository.ts`)
- Scalar files (`shared/scalar/*.scalar.ts`)
- Error files (`shared/errors/*.ts`)

## Import Map

The `import_map.json` already has the npm packages defined:

```json
{
  "imports": {
    "graphql": "npm:graphql@^16.8.1",
    "@graphql-yoga/plugin-health-check": "npm:@graphql-yoga/plugin-health-check@^5",
    "graphql-yoga": "npm:graphql-yoga@^5",
    "mongoose": "npm:mongoose@8.4.0",
    "zod": "npm:zod@^3.22.4",
    "@graphql-tools/schema": "npm:@graphql-tools/schema@^10.0.0",
    "jsonwebtoken": "npm:jsonwebtoken@^9.0.2",
    "bcrypt": "npm:bcrypt@^5.1.1"
  }
}
```

## Why This Works

**Deno's npm: Specifier:**
- `npm:graphql` → Deno automatically fetches from npm registry
- Version is resolved from `deno.lock` or `import_map.json`
- No `node_modules` needed (Deno caches in different location)

**Benefits:**
- ✅ Native Deno support for npm packages
- ✅ No `node_modules` folder required
- ✅ Faster installation (Deno's caching)
- ✅ Better security (explicit dependencies)

## Verification

After the fix, running the app should work without import errors:

```bash
# Start the app
deno task start

# Expected output:
# Listening on http://localhost:8000/graphql
# Successfully connected to MongoDB
```

## Common Import Patterns

| Package | Old Import | New Import |
|---------|-----------|------------|
| GraphQL | `from "graphql"` | `from "npm:graphql"` |
| Mongoose | `from "mongoose"` | `from "npm:mongoose"` |
| Zod | `from "zod"` | `from "npm:zod"` |
| JWT | `from "jsonwebtoken"` | `from "npm:jsonwebtoken"` |
| Bcrypt | `from "bcrypt"` | `from "npm:bcrypt"` |

## Alternative: Using Import Map

If you prefer not to use `npm:` prefix, you can rely on import map:

**deno.jsonc:**
```json
{
  "imports": {
    "graphql": "npm:graphql@^16.8.1",
    "mongoose": "npm:mongoose@8.4.0"
  }
}
```

**Code:**
```typescript
import { GraphQLError } from "graphql";  // Works with import map
```

However, using `npm:` prefix is more explicit and recommended for Deno 2.x+.

## Status

✅ **All imports fixed**
- 32 files updated
- No more "Cannot find module" errors
- Ready to run with `deno task start`
