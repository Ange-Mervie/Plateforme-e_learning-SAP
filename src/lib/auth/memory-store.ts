import { createHash, randomBytes } from "node:crypto";
import type { RowDataPacket } from "mysql2/promise";
import { execute, query } from "@/lib/db";
import type { AuthenticatedUser, UserRole } from "./types";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionUserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription_status: string;
}

interface MemoryUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  subscription_status: string;
  email_verified: boolean;
  email_verification_code: string | null;
}

interface MemorySession {
  user_id: number;
  token_hash: string;
  expires_at: Date;
}

const memoryUsers: MemoryUser[] = [];
let memorySessions: MemorySession[] = [];
let memoryCounter = 1;

function dbIsAvailable(): boolean {
  return memoryUsers.length > -1 && typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isUserRole(role: string): role is UserRole {
  return ["apprenant", "formateur", "consultant", "expert", "admin"].includes(role);
}

function memoryFindUserByEmail(email: string): MemoryUser | undefined {
  return memoryUsers.find((u) => u.email === email);
}

function memoryFindUserById(id: number): MemoryUser | undefined {
  return memoryUsers.find((u) => u.id === id);
}

export async function createSessionWithFallback(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Try DB first
  const result = await execute(
    "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [userId, hashToken(token), expiresAt],
  );

  if (result.insertId && result.insertId > 0) {
    return token;
  }

  // Fallback to memory
  memorySessions.push({ user_id: userId, token_hash: hashToken(token), expires_at: expiresAt });
  return token;
}

export async function getUserForSessionWithFallback(token: string | undefined): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  // Try DB first
  const rows = await query<SessionUserRow>(
    `SELECT u.id, u.name, u.email, u.role, u.subscription_status
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP`,
    [hashToken(token)],
  );
  const row = rows[0];
  if (row) {
    const role = row.role === "learner" ? "apprenant" : row.role;
    if (!isUserRole(role)) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role,
      subscription: {
        status: row.subscription_status === "active" ? "active" : "free",
        planId: null,
      },
      emailVerified: true,
    };
  }

  // Fallback to memory
  const session = memorySessions.find(
    (s) => s.token_hash === hashToken(token) && s.expires_at > new Date(),
  );
  if (!session) return null;

  const user = memoryFindUserById(session.user_id);
  if (!user) return null;

  const role = user.role === "learner" ? "apprenant" : user.role;
  if (!isUserRole(role)) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    subscription: {
      status: user.subscription_status === "active" ? "active" : "free",
      planId: null,
    },
    emailVerified: user.email_verified,
  };
}

export async function revokeSessionWithFallback(token: string | undefined): Promise<void> {
  if (!token) return;
  await execute("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
  memorySessions = memorySessions.filter((s) => s.token_hash !== hashToken(token));
}

export async function registerUserWithFallback(
  name: string,
  email: string,
  passwordHash: string,
): Promise<{ id: number; emailVerified: boolean; verificationCode: string } | null> {
  // Check DB first
  const existing = await query<RowDataPacket>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  if (existing.length > 0) {
    return null;
  }

  const result = await execute(
    "INSERT INTO users (name, email, password, role, subscription_status) VALUES (?, ?, ?, 'apprenant', 'free')",
    [name, email, passwordHash],
  );

  if (result.insertId && result.insertId > 0) {
    const verificationCode = randomBytes(32).toString("base64url");
    return { id: result.insertId, emailVerified: false, verificationCode };
  }

  // Fallback to memory
  const normalizedEmail = email.toLowerCase();
  if (memoryFindUserByEmail(normalizedEmail)) {
    return null;
  }

  const id = memoryCounter++;
  const verificationCode = randomBytes(32).toString("base64url");
  memoryUsers.push({
    id,
    name,
    email: normalizedEmail,
    password: passwordHash,
    role: "apprenant",
    subscription_status: "free",
    email_verified: false,
    email_verification_code: verificationCode,
  });

  return { id, emailVerified: false, verificationCode };
}

export async function loginUserWithFallback(email: string, password: string): Promise<MemoryUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  // Try DB first
  const rows = await query<SessionUserRow>(
    `SELECT id, name, email, password, role, subscription_status
     FROM users WHERE email = ? LIMIT 1`,
    [normalizedEmail],
  );
  const user = rows[0];
  if (user) {
    const bcrypt = await import("bcryptjs");
    if (await bcrypt.compare(password, user.password)) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        subscription_status: user.subscription_status,
        email_verified: true,
        email_verification_code: null,
      };
    }
    return null;
  }

  // Fallback to memory
  const memoryUser = memoryFindUserByEmail(normalizedEmail);
  if (!memoryUser) return null;

  const bcrypt = await import("bcryptjs");
  if (!(await bcrypt.compare(password, memoryUser.password))) return null;

  return memoryUser;
}

export async function verifyEmailWithFallback(token: string): Promise<boolean> {
  // Try memory first (DB email verification not implemented in schema)
  const user = memoryUsers.find((u) => u.email_verification_code === token);
  if (user) {
    user.email_verified = true;
    user.email_verification_code = null;
    return true;
  }
  return false;
}

export function getMemoryUserByEmail(email: string): MemoryUser | undefined {
  return memoryFindUserByEmail(email);
}

export function getMemoryUsersCount(): number {
  return memoryUsers.length;
}

export { dbIsAvailable, hashToken, isUserRole };
