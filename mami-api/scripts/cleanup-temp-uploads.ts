const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SECRET_KEY = Deno.env.get("SUPABASE_SECRET_KEY") || "";
const SUPABASE_PRIVATE_BUCKET = Deno.env.get("SUPABASE_PRIVATE_BUCKET") || "daycare_private";
const TMP_UPLOAD_PREFIX = Deno.env.get("TMP_UPLOAD_PREFIX") || "documents/tmp";
const TMP_UPLOAD_MAX_AGE_HOURS = Number(Deno.env.get("TMP_UPLOAD_MAX_AGE_HOURS") || "24");

type StorageListItem = {
  name: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
};

function ensureConfig() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !SUPABASE_PRIVATE_BUCKET) {
    throw new Error("Konfigurasi Supabase storage belum lengkap.");
  }
}

function buildHeaders() {
  return {
    Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
    apikey: SUPABASE_SECRET_KEY,
    "Content-Type": "application/json",
  };
}

async function listTempObjects() {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${SUPABASE_PRIVATE_BUCKET}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      prefix: TMP_UPLOAD_PREFIX.replace(/^\/+|\/+$/g, ""),
      limit: 1000,
      offset: 0,
      sortBy: {
        column: "created_at",
        order: "asc",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Gagal mengambil daftar file temporary.");
  }

  return await response.json() as StorageListItem[];
}

async function removeObjects(paths: string[]) {
  if (paths.length === 0) {
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/remove`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      bucketId: SUPABASE_PRIVATE_BUCKET,
      prefixes: paths,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Gagal menghapus file temporary.");
  }
}

async function main() {
  ensureConfig();

  const maxAgeMs = TMP_UPLOAD_MAX_AGE_HOURS * 60 * 60 * 1000;
  const threshold = Date.now() - maxAgeMs;

  console.log(`Scanning temp uploads in ${SUPABASE_PRIVATE_BUCKET}/${TMP_UPLOAD_PREFIX}`);
  console.log(`Removing files older than ${TMP_UPLOAD_MAX_AGE_HOURS} hours`);

  const items = await listTempObjects();
  const expiredPaths = items
    .filter((item) => item.name)
    .map((item) => {
      const createdAt = item.created_at || item.updated_at;
      return {
        path: `${TMP_UPLOAD_PREFIX.replace(/^\/+|\/+$/g, "")}/${item.name}`,
        createdAt,
      };
    })
    .filter((item) => item.createdAt && new Date(item.createdAt).getTime() < threshold)
    .map((item) => item.path);

  if (expiredPaths.length === 0) {
    console.log("No expired temp uploads found.");
    return;
  }

  await removeObjects(expiredPaths);

  console.log(`Removed ${expiredPaths.length} expired temp upload(s):`);
  for (const path of expiredPaths) {
    console.log(`- ${path}`);
  }
}

await main();
