import { ensureDir } from "@std/fs/ensure-dir";
import { resolve } from "@std/path";

const TEMPLATE_PATH = "./scripts/templates/migration.ts.tpl";
const TARGET_DIR = "./migrations";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getTimestamp(date = new Date()) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "_",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function createMigration() {
  const rawName = Deno.args[0];

  if (!rawName) {
    console.error("Usage: deno run -A scripts/create-migration.ts <migration_name>");
    console.error("Example: deno run -A scripts/create-migration.ts fix_admin_role");
    Deno.exit(1);
  }

  const migrationName = normalizeName(rawName);
  if (!migrationName) {
    console.error("Migration name must contain at least one alphanumeric character.");
    Deno.exit(1);
  }

  await ensureDir(resolve(TARGET_DIR));

  const template = await Deno.readTextFile(resolve(TEMPLATE_PATH));
  const fileName = `${getTimestamp()}_${migrationName}.ts`;
  const finalPath = resolve(TARGET_DIR, fileName);
  const content = template.replace(/__MIGRATION_NAME__/g, fileName.replace(/\.ts$/, ""));

  await Deno.writeTextFile(finalPath, content);

  console.log(`Created migration: ${finalPath}`);
  console.log(`Run with: deno task migrate migrations/${fileName}`);
}

await createMigration();
