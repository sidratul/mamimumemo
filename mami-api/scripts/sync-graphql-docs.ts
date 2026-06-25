const root = new URL("..", import.meta.url);
const srcDir = new URL("src/", root);
const docsDir = new URL("docs/graphql/", root);
const modulesDocsDir = new URL("modules/", docsDir);
const mainPath = new URL("main.ts", root);

type ModuleDoc = {
  slug: string;
  title: string;
  purpose: string;
  access: string[];
  typeDefPath?: string;
  typedef?: string;
  mounted: boolean;
  operations: {
    queries: string[];
    mutations: string[];
  };
  definitions: {
    types: string[];
    inputs: string[];
    enums: string[];
    scalars: string[];
  };
  notes: string[];
};

const moduleOrder: Record<string, number> = {
  health: 1,
  auth: 2,
  users: 3,
  daycare: 4,
  daycare_memberships: 5,
  parents: 6,
  children: 7,
  children_daycare: 8,
  medical_records: 9,
  contracts: 10,
  master_activities: 11,
  schedule_templates: 12,
  daily_care_records: 13,
  activities: 14,
  menus: 15,
  gallery: 16,
  notifications: 17,
  invoices: 18,
  staff_payments: 19,
  uploads: 20,
  weekly_schedules: 21,
};

const moduleMeta: Record<string, Pick<ModuleDoc, "title" | "purpose" | "access" | "notes">> = {
  activities: {
    title: "Activities",
    purpose: "Aktivitas anak yang dibuat parent/guardian/daycare, termasuk timeline gabungan dengan aktivitas daycare.",
    access: ["Semua operasi butuh user login.", "Akses data divalidasi lewat relasi user terhadap child/daycare."],
    notes: ["Format jam memakai `HH:mm`.", "Field dinamis tergantung kategori aktivitas."],
  },
  auth: {
    title: "Auth",
    purpose: "Login, refresh token, dan profile user aktif.",
    access: ["`login` dan `refreshToken` publik.", "`profile` butuh token Bearer valid."],
    notes: ["Role efektif dapat berasal dari membership daycare aktif, kecuali `SUPER_ADMIN`."],
  },
  children: {
    title: "Children",
    purpose: "Data anak global milik parent dan guardian sharing.",
    access: ["Semua operasi butuh user login.", "Owner child dapat update dan kelola guardian.", "Guardian hanya bisa membaca child yang dibagikan."],
    notes: ["Permission guardian memakai enum `GuardianPermission`."],
  },
  children_daycare: {
    title: "Children Daycare",
    purpose: "Data anak dalam konteks daycare, termasuk profil, medis, preferensi, dan status aktif.",
    access: ["Read: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`, `DAYCARE_SITTER`.", "Write: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`."],
    notes: ["`deactivateChildrenDaycare` adalah soft delete dengan `active = false`."],
  },
  contracts: {
    title: "Contracts",
    purpose: "Kontrak layanan daycare antara daycare, parent, dan anak.",
    access: ["Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola kontrak.", "Parent dapat membaca kontraknya sendiri melalui `parentContracts`."],
    notes: ["`terminateContract` mengubah status menjadi terminated, bukan hard delete."],
  },
  daily_care_records: {
    title: "Daily Care Records",
    purpose: "Catatan operasional harian daycare: attendance, planned activities, dan activity log per anak.",
    access: ["Read/write umum untuk role daycare: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`, `DAYCARE_SITTER`.", "`applyScheduleTemplate` hanya role daycare non-parent.", "`DAYCARE_SITTER` dibatasi pada assignment terkait untuk beberapa operasi."],
    notes: ["Format jam memakai `HH:mm`.", "`createDailyCareRecord` bersifat create/update record pada tanggal terkait."],
  },
  daycare: {
    title: "Daycare",
    purpose: "Registrasi daycare, list/review oleh system admin, dokumen legal, approval, delete, dan purge.",
    access: ["List/count/detail global hanya `SUPER_ADMIN`.", "`registerDaycare` publik atau bisa dipakai admin.", "`myDaycare` butuh login.", "`updateDaycareDocuments` butuh login dan hanya `SUPER_ADMIN` atau user pada daycare terkait.", "Approval/delete/purge hanya `SUPER_ADMIN`."],
    notes: ["`deleteDaycare` soft delete.", "`purgeDaycare` hard delete dan bisa ikut menghapus owner jika `deleteOwner = true`."],
  },
  daycare_memberships: {
    title: "Daycare Memberships",
    purpose: "Relasi user ke daycare sebagai owner, admin, atau sitter.",
    access: ["Semua operasi butuh login.", "`SUPER_ADMIN` dapat membaca/mengelola semua daycare membership.", "`DAYCARE_OWNER` dan `DAYCARE_ADMIN` dapat membaca/menambah user pada daycare yang sama.", "`deactivateDaycareMembership` hanya `SUPER_ADMIN`."],
    notes: ["`AddUserToDaycareInput` wajib mengisi tepat salah satu dari `userId` atau `userData`."],
  },
  gallery: {
    title: "Gallery",
    purpose: "Dokumentasi foto daycare, umum maupun per anak.",
    access: ["Semua query butuh login.", "Create/update: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`, `DAYCARE_SITTER`.", "Delete: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`."],
    notes: ["URL foto divalidasi sebagai URL."],
  },
  health: {
    title: "Health",
    purpose: "Pengecekan sederhana bahwa GraphQL API aktif.",
    access: ["Publik."],
    notes: ["Mengembalikan string status server."],
  },
  invoices: {
    title: "Invoices",
    purpose: "Tagihan daycare untuk parent berdasarkan kontrak dan periode.",
    access: ["Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola invoice.", "Parent dapat membaca invoice miliknya melalui `parentInvoices`."],
    notes: ["`markInvoiceAsPaid` mengisi `paidAt`; `cancelInvoice` mengubah status, bukan hard delete."],
  },
  master_activities: {
    title: "Master Activities",
    purpose: "Master aktivitas daycare dan konfigurasi field per kategori.",
    access: ["Query butuh login.", "Create/update/deactivate: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`."],
    notes: ["`defaultFieldConfig` mengembalikan konfigurasi field default untuk kategori aktivitas."],
  },
  medical_records: {
    title: "Medical Records",
    purpose: "Rekam medis anak: sakit, cedera, alergi, medication, dan kondisi kronis.",
    access: ["Semua operasi butuh login.", "Akses bergantung pada relasi user terhadap child.", "Delete hanya oleh reporter record."],
    notes: ["Attachment divalidasi sebagai URL."],
  },
  menus: {
    title: "Menus",
    purpose: "Menu makanan daycare per tanggal dan rentang tanggal.",
    access: ["Query butuh login.", "Create/update/delete: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`."],
    notes: ["`createMenu` membuat atau mengupdate menu untuk tanggal tertentu."],
  },
  notifications: {
    title: "Notifications",
    purpose: "Notifikasi user, unread count, mark read, dan notifikasi bulk oleh daycare/admin.",
    access: ["Query notification hanya untuk user aktif.", "Create/bulk create: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`.", "Mark/delete hanya untuk notification milik user aktif."],
    notes: ["Field `data` memakai scalar `JSON` lokal pada module ini."],
  },
  parents: {
    title: "Parents",
    purpose: "Data parent dalam konteks daycare, custom data, emergency contact, pickup authorization, dan anak terkait.",
    access: ["Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola parent.", "Parent dapat membaca/update data miliknya sendiri pada beberapa operasi."],
    notes: ["Role pada `ParentUserInput` dinormalisasi ke `PARENT`."],
  },
  schedule_templates: {
    title: "Schedule Templates",
    purpose: "Template jadwal daycare berdasarkan hari, rentang tanggal, atau tanggal spesifik.",
    access: ["Query butuh login.", "Create/update/deactivate: `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`."],
    notes: ["Jika target `DAY_OF_WEEK`, `dayOfWeek` wajib ada.", "Jika target `DATE_RANGE`, `startDate` dan `endDate` wajib ada.", "Jika target `SPECIFIC_DATE`, `specificDate` wajib ada."],
  },
  staff_payments: {
    title: "Staff Payments",
    purpose: "Pembayaran staff daycare per periode kerja.",
    access: ["Daycare staff/admin (`SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`) dapat mengelola pembayaran.", "Staff dapat membaca pembayaran miliknya melalui `staffPayments`."],
    notes: ["Cancel mengubah status pembayaran, bukan hard delete."],
  },
  users: {
    title: "Users",
    purpose: "Manajemen user global, filter access/persona, reset password, dan delete user.",
    access: ["List/count/create/delete hanya `SUPER_ADMIN`.", "Detail/update/password dapat dilakukan `SUPER_ADMIN` atau user itu sendiri sesuai service guard.", "Filter memakai `accesses` di schema GraphQL saat ini."],
    notes: ["`ActionResponse` hanya mengembalikan `id` dan `message`.", "Validasi source masih memiliki nama `personas`, sedangkan typedef GraphQL memakai `accesses`; ikuti typedef untuk request GraphQL."],
  },
  weekly_schedules: {
    title: "Weekly Schedules",
    purpose: "Jadwal mingguan daycare, assignment sitter, dan schedule per child.",
    access: ["Source module butuh login.", "Mutation dirancang untuk `SUPER_ADMIN`, `DAYCARE_OWNER`, `DAYCARE_ADMIN`."],
    notes: ["Module source ada di `src/weekly_schedules`, tetapi belum diregister di `main.ts`; endpoint GraphQL belum exposed sampai import resolver/typeDefs ditambahkan ke schema."],
  },
};

function titleFromSlug(slug: string) {
  return slug.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function extractTypeDefs(source: string) {
  const match = source.match(/typeDefs\s*=\s*`([\s\S]*?)`;/);
  return match?.[1].trim() ?? "";
}

function extractBlock(schema: string, blockName: "Query" | "Mutation") {
  const match = schema.match(new RegExp(`extend\\s+type\\s+${blockName}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`));
  return match?.[1] ?? "";
}

function extractOperations(block: string) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('"') && !line.startsWith("#"))
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*\s*(\(|:)/.test(line));
}

function extractDefinitions(schema: string, keyword: string) {
  const matches = [...schema.matchAll(new RegExp(`^\\s*${keyword}\\s+([A-Za-z_][A-Za-z0-9_]*)`, "gm"))];
  return [...new Set(matches.map((match) => match[1]))].sort();
}

function isMounted(mainSource: string, slug: string) {
  if (slug === "health") {
    return mainSource.includes("healthTypeDefs") && mainSource.includes("healthResolvers");
  }

  const pascal = slug.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  const aliases = [
    pascal,
    pascal.replace("DaycareMemberships", "DaycareMembership"),
    pascal.replace("Auth", "Auth"),
  ];
  return aliases.some((alias) => mainSource.includes(`${alias}TypeDefs`) || mainSource.includes(`${alias}Resolvers`));
}

function formatList(items: string[], empty = "Tidak ada.") {
  if (items.length === 0) {
    return `- ${empty}`;
  }
  return items.map((item) => `- \`${item}\``).join("\n");
}

function formatTextList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function getModuleOrder(doc: Pick<ModuleDoc, "slug">) {
  return moduleOrder[doc.slug] ?? 99;
}

function getModuleFilename(doc: Pick<ModuleDoc, "slug">) {
  return `${String(getModuleOrder(doc)).padStart(2, "0")}-${doc.slug}.md`;
}

function formatModuleDoc(doc: ModuleDoc) {
  const status = !doc.typeDefPath
    ? "Exposed sebagai REST endpoint"
    : doc.mounted
    ? "Exposed di GraphQL schema"
    : "Belum exposed di GraphQL schema";
  const sourceLine = doc.typeDefPath ? `Source schema: \`${doc.typeDefPath}\`` : "Source schema: custom REST endpoint";

  return `# ${doc.title}

${doc.purpose}

${sourceLine}

Status: **${status}**

## Access

${formatTextList(doc.access)}

## Queries

${formatList(doc.operations.queries)}

## Mutations

${formatList(doc.operations.mutations)}

## Schema Definitions

Types:

${formatList(doc.definitions.types)}

Inputs:

${formatList(doc.definitions.inputs)}

Enums:

${formatList(doc.definitions.enums)}

Scalars:

${formatList(doc.definitions.scalars)}

## Notes

${formatTextList(doc.notes)}
`;
}

async function ensureDir(url: URL) {
  await Deno.mkdir(url, { recursive: true });
}

async function buildGraphqlModuleDocs() {
  const mainSource = await Deno.readTextFile(mainPath);
  const docs: ModuleDoc[] = [];

  for await (const entry of Deno.readDir(srcDir)) {
    if (!entry.isDirectory || entry.name === "uploads") {
      continue;
    }

    const typeDefUrl = new URL(`${entry.name}/${entry.name}.typedef.ts`, srcDir);
    try {
      const source = await Deno.readTextFile(typeDefUrl);
      const schema = extractTypeDefs(source);
      const meta = moduleMeta[entry.name] ?? {
        title: titleFromSlug(entry.name),
        purpose: "Module GraphQL backend.",
        access: ["Lihat service guard pada source module untuk detail akses."],
        notes: ["Dokumen ini dibuat dari typedef GraphQL."],
      };

      docs.push({
        slug: entry.name,
        ...meta,
        typeDefPath: `src/${entry.name}/${entry.name}.typedef.ts`,
        typedef: schema,
        mounted: isMounted(mainSource, entry.name),
        operations: {
          queries: extractOperations(extractBlock(schema, "Query")),
          mutations: extractOperations(extractBlock(schema, "Mutation")),
        },
        definitions: {
          types: extractDefinitions(schema, "type"),
          inputs: extractDefinitions(schema, "input"),
          enums: extractDefinitions(schema, "enum"),
          scalars: extractDefinitions(schema, "scalar"),
        },
      });
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  }

  docs.push({
    slug: "uploads",
    ...moduleMeta.uploads ?? {
      title: "Uploads",
      purpose: "Upload file melalui REST endpoint.",
      access: ["Butuh token Bearer valid."],
      notes: ["Endpoint bukan GraphQL; ditangani langsung di `main.ts` sebelum request diteruskan ke Yoga."],
    },
    mounted: true,
    operations: {
      queries: [],
      mutations: ["POST /uploads multipart/form-data"],
    },
    definitions: {
      types: ["UploadedFile"],
      inputs: ["file: File", "folder: String", "filename: String", "visibility: public | private"],
      enums: ["UploadVisibility"],
      scalars: [],
    },
    notes: [
      "Field `file` dan `folder` wajib diisi.",
      "`visibility` default `public`; nilai selain `private` diperlakukan sebagai `public`.",
      "Response berasal dari `UploadsService.uploadFile`.",
    ],
  });

  return docs.sort((a, b) => getModuleOrder(a) - getModuleOrder(b) || a.slug.localeCompare(b.slug));
}

function formatReadme(docs: ModuleDoc[]) {
  const exposed = docs.filter((doc) => doc.mounted);
  const notMounted = docs.filter((doc) => !doc.mounted);

  return `# GraphQL Modules Docs

Dokumen ini mengikuti schema dan handler backend aktual di \`mami-api/src\` dan \`mami-api/main.ts\`.

GraphQL endpoint default: \`/graphql\`

REST endpoint tambahan:

- \`POST /uploads\` untuk upload file multipart.

## Shared Types

- \`ObjectId\` dan \`Date\` tersedia sebagai scalar shared.
- \`SortInput\`, \`PaginationInput\`, dan \`ActionResponse\` tersedia dari shared typedef.
- Request authenticated memakai header \`Authorization: Bearer <accessToken>\`.

## Exposed Modules

${exposed.map((doc) => `- [${String(getModuleOrder(doc)).padStart(2, "0")}. ${doc.title}](./modules/${getModuleFilename(doc)}) - ${doc.purpose}`).join("\n")}

## Source Exists But Not Mounted

${notMounted.length ? notMounted.map((doc) => `- [${String(getModuleOrder(doc)).padStart(2, "0")}. ${doc.title}](./modules/${getModuleFilename(doc)}) - ${doc.notes[0]}`).join("\n") : "- Tidak ada."}

## Maintenance

- Update docs saat typedef, resolver, service guard, atau \`main.ts\` berubah.
- Jalankan \`deno run -A scripts/sync-graphql-docs.ts\` dari folder \`mami-api\` untuk regenerate docs dari typedef saat ini.
`;
}

async function main() {
  await ensureDir(modulesDocsDir);
  const docs = await buildGraphqlModuleDocs();

  for await (const entry of Deno.readDir(modulesDocsDir)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      await Deno.remove(new URL(entry.name, modulesDocsDir));
    }
  }

  for (const doc of docs) {
    await Deno.writeTextFile(new URL(getModuleFilename(doc), modulesDocsDir), formatModuleDoc(doc));
  }

  await Deno.writeTextFile(new URL("README.md", docsDir), formatReadme(docs));
  console.log(`Updated ${docs.length} module doc(s).`);
}

await main();
