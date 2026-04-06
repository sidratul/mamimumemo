import jwt from "jsonwebtoken";
import { Buffer } from "node:buffer";

const JWT_ACCESS_SECRET = Deno.env.get("JWT_ACCESS_SECRET") || Deno.env.get("JWT_SECRET")!;
const JWT_REFRESH_SECRET = Deno.env.get("JWT_REFRESH_SECRET") || Deno.env.get("JWT_SECRET")!;
const JWT_EXPIRES_IN = Deno.env.get("JWT_EXPIRES_IN") || "1h";
const JWT_REFRESH_EXPIRES_IN = Deno.env.get("JWT_REFRESH_EXPIRES_IN") || "30d";

export function createAccessToken(payload: string | object | Buffer): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function createRefreshToken(payload: string | object | Buffer): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
