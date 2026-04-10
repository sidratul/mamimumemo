import { GraphQLError } from "graphql";
import { MESSAGES } from "#shared/enums/constant.ts";

export type UploadVisibility = "public" | "private";

type UploadFileParams = {
  file: File;
  folder: string;
  filename?: string;
  visibility?: UploadVisibility;
};

export type UploadFileResult = {
  bucket: string;
  path: string;
  url: string;
  contentType: string;
  size: number;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SECRET_KEY = Deno.env.get("SUPABASE_SECRET_KEY") || "";
const SUPABASE_PUBLIC_BUCKET = Deno.env.get("SUPABASE_PUBLIC_BUCKET") || "daycare";
const SUPABASE_PRIVATE_BUCKET = Deno.env.get("SUPABASE_PRIVATE_BUCKET") || "daycare_private";

function ensureConfig() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !SUPABASE_PUBLIC_BUCKET || !SUPABASE_PRIVATE_BUCKET) {
    throw new GraphQLError("Konfigurasi storage belum lengkap.");
  }
}

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function buildStoragePath(folder: string, filename: string) {
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  return `${normalizedFolder}/${filename}`;
}

function getBasename(path: string) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] || `${Date.now()}-${crypto.randomUUID()}`;
}

function buildPublicUrl(bucket: string, path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

function resolveBucket(visibility: UploadVisibility) {
  return visibility === "private" ? SUPABASE_PRIVATE_BUCKET : SUPABASE_PUBLIC_BUCKET;
}

export class UploadsService {
  async uploadFile({
    file,
    folder,
    filename,
    visibility = "public",
  }: UploadFileParams): Promise<UploadFileResult> {
    ensureConfig();

    if (!file.size) {
      throw new GraphQLError("File kosong tidak dapat diupload.");
    }

    const extension = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf("."))
      : "";
    const safeFilename = sanitizeFilename(filename || `${Date.now()}-${crypto.randomUUID()}${extension}`);
    const path = buildStoragePath(folder, safeFilename);
    const bucket = resolveBucket(visibility);
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
        apikey: SUPABASE_SECRET_KEY,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: file.stream(),
      duplex: "half",
    } as RequestInit);

    if (!response.ok) {
      const errorText = await response.text();
      throw new GraphQLError(errorText || MESSAGES.GENERAL.SERVER_ERROR);
    }

    return {
      bucket,
      path,
      url: visibility === "private"
        ? await this.createSignedUrl(bucket, path)
        : buildPublicUrl(bucket, path),
      contentType: file.type || "application/octet-stream",
      size: file.size,
    };
  }

  async createSignedUrl(bucket: string, path: string, expiresIn = 60 * 60) {
    ensureConfig();

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${bucket}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
        apikey: SUPABASE_SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new GraphQLError(errorText || MESSAGES.GENERAL.SERVER_ERROR);
    }

    const payload = await response.json() as { signedURL?: string; signedUrl?: string };
    const signedPath = payload.signedURL || payload.signedUrl;
    if (!signedPath) {
      throw new GraphQLError("Signed URL tidak tersedia.");
    }

    if (signedPath.startsWith("http")) {
      return signedPath;
    }

    if (signedPath.startsWith("/")) {
      return `${SUPABASE_URL}/storage/v1${signedPath}`;
    }

    return `${SUPABASE_URL}/storage/v1/${signedPath}`;
  }

  async moveObject(
    bucket: string,
    sourcePath: string,
    destinationPath: string,
  ) {
    ensureConfig();

    if (sourcePath === destinationPath) {
      return destinationPath;
    }

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/move`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
        apikey: SUPABASE_SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId: bucket,
        sourceKey: sourcePath,
        destinationKey: destinationPath,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new GraphQLError(errorText || MESSAGES.GENERAL.SERVER_ERROR);
    }

    return destinationPath;
  }

  async finalizePrivatePath(path: string, folder = "documents") {
    const normalizedPath = this.normalizeStoragePath(path, "private");
    if (!normalizedPath || normalizedPath.startsWith("http")) {
      return normalizedPath;
    }

    const tmpPrefix = `${folder.replace(/^\/+|\/+$/g, "")}/tmp/`;
    if (!normalizedPath.startsWith(tmpPrefix)) {
      return normalizedPath;
    }

    const finalPath = `${folder.replace(/^\/+|\/+$/g, "")}/${Date.now()}-${getBasename(normalizedPath)}`;
    return await this.moveObject(SUPABASE_PRIVATE_BUCKET, normalizedPath, finalPath);
  }

  normalizeStoragePath(value: string, visibility: UploadVisibility) {
    const trimmed = value.trim();
    if (!trimmed) {
      return trimmed;
    }

    const bucket = resolveBucket(visibility);
    const publicPrefix = `/storage/v1/object/public/${bucket}/`;
    const signedPrefix = `/storage/v1/object/sign/${bucket}/`;

    try {
      const parsed = new URL(trimmed);
      const { pathname } = parsed;

      if (pathname.includes(publicPrefix)) {
        return decodeURIComponent(pathname.split(publicPrefix)[1] || "");
      }

      if (pathname.includes(signedPrefix)) {
        return decodeURIComponent(pathname.split(signedPrefix)[1] || "");
      }
    } catch {
      return trimmed;
    }

    return trimmed;
  }
}

export default UploadsService;
