const migrationsDir = `${Deno.cwd()}/migrations`;

async function listMigrationFiles() {
  const files: string[] = [];

  for await (const entry of Deno.readDir(migrationsDir)) {
    if (!entry.isFile || !entry.name.endsWith(".ts")) {
      continue;
    }

    files.push(`${migrationsDir}/${entry.name}`);
  }

  return files.sort();
}

async function runMigration(filePath: string) {
  console.log(`Running migration: ${filePath}`);

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "--env-file=.env", filePath],
    cwd: Deno.cwd(),
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  const { code } = await command.output();
  if (code !== 0) {
    throw new Error(`Migration failed: ${filePath}`);
  }
}

async function main() {
  const files = await listMigrationFiles();

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

  for (const file of files) {
    await runMigration(file);
  }

  console.log(`Completed ${files.length} migration(s).`);
}

await main();
