# Import Map Configuration

## Overview

This project uses Deno's import map to resolve npm packages without needing `npm:` prefix in the code.

## Configuration

**import_map.json:**
```json
{
  "imports": {
    "graphql": "npm:graphql@^16.8.1",
    "graphql-yoga": "npm:graphql-yoga@^5",
    "@graphql-yoga/plugin-health-check": "npm:@graphql-yoga/plugin-health-check@^3",
    "mongoose": "npm:mongoose@8.4.0",
    "zod": "npm:zod@^3.22.4",
    "@graphql-tools/schema": "npm:@graphql-tools/schema@^10.0.0",
    "jsonwebtoken": "npm:jsonwebtoken@^9.0.2",
    "bcrypt": "npm:bcrypt@^5.1.1",
    "@/": "./src/",
    "#shared/": "./shared/"
  }
}
```

## Usage in Code

With import map configured, you can use clean imports:

```typescript
// ✅ Clean imports (no npm: prefix needed)
import { GraphQLError } from "graphql";
import { Types } from "mongoose";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Path aliases
import { AuthService } from "@/auth/auth.service.ts";
import { AppContext } from "#shared/config/context.ts";
```

## How It Works

**deno.jsonc references import_map.json:**
```json
{
  "tasks": {
    "start": "deno run --allow-net --allow-env --allow-read --allow-sys --env main.ts"
  },
  "nodeModulesDir": "auto",
  "importMap": "./import_map.json"
}
```

**Deno automatically resolves:**
- `graphql` → `npm:graphql@^16.8.1`
- `mongoose` → `npm:mongoose@8.4.0`
- `@/auth/...` → `./src/auth/...`
- `#shared/...` → `./shared/...`

## Benefits

| Benefit | Description |
|---------|-------------|
| **Clean Imports** | No `npm:` prefix clutter |
| **Version Control** | All versions in one place |
| **Easy Updates** | Change version in one file |
| **Path Aliases** | Clean relative imports |
| **IDE Support** | Works with Deno-enabled editors |

## Common Import Patterns

| Package | Import Statement |
|---------|-----------------|
| GraphQL | `import { GraphQLError } from "graphql";` |
| Mongoose | `import mongoose from "mongoose";` |
| Zod | `import { z } from "zod";` |
| JWT | `import jwt from "jsonwebtoken";` |
| Bcrypt | `import bcrypt from "bcrypt";` |
| GraphQL Tools | `import { makeExecutableSchema } from "@graphql-tools/schema";` |

## Troubleshooting

### Error: Cannot find module

**Solution:** Make sure you're running with import map enabled:

```bash
# Using deno task (recommended)
deno task start

# Or explicitly specify import map
deno run --import-map=import_map.json main.ts
```

### Package Version Conflicts

**Solution:** Update version in `import_map.json`:

```json
{
  "imports": {
    "graphql": "npm:graphql@^16.9.0"  // Update version here
  }
}
```

Then clear Deno cache:
```bash
deno cache --reload main.ts
```

## Migration from npm: Prefix

If you have files with `npm:` prefix, revert them:

```bash
# Revert graphql imports
find . -name "*.ts" -type f -exec sed -i '' 's/from "npm:graphql"/from "graphql"/g' {} +

# Revert mongoose imports
find . -name "*.ts" -type f -exec sed -i '' 's/from "npm:mongoose"/from "mongoose"/g' {} +
```

## Status

✅ **Import map configured**
- All npm packages defined
- Path aliases working
- Clean imports in code
- No `npm:` prefix needed
