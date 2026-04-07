import jwt from "jsonwebtoken";
import { Buffer } from "node:buffer";

function getJwtAccessSecret() {
  return Deno.env.get("JWT_ACCESS_SECRET") || Deno.env.get("JWT_SECRET") || "";
}

function getJwtRefreshSecret() {
  return Deno.env.get("JWT_REFRESH_SECRET") || Deno.env.get("JWT_SECRET") || "";
}

function getJwtExpiresIn() {
  return Deno.env.get("JWT_EXPIRES_IN") || "1h";
}

function getJwtRefreshExpiresIn() {
  return Deno.env.get("JWT_REFRESH_EXPIRES_IN") || "30d";
}

export function createAccessToken(payload: string | object | Buffer): string {
  return jwt.sign(payload, getJwtAccessSecret(), { expiresIn: getJwtExpiresIn() });
}

export function createRefreshToken(payload: string | object | Buffer): string {
  return jwt.sign(payload, getJwtRefreshSecret(), { expiresIn: getJwtRefreshExpiresIn() });
}

export function verifyAccessToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, getJwtAccessSecret());
}

export function verifyRefreshToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, getJwtRefreshSecret());
}
