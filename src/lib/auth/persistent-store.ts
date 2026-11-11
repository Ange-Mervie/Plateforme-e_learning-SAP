import { createHash, randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { RowDataPacket } from "mysql2/promise";
import { execute, query } from "@/lib/db";
import type { AuthenticatedUser, UserRole } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionUserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription_status: string;
}

interface PersistentUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  subscription_status: string;
  email_verified: boolean;
  email_verification_code: string | null;
}

interface PersistentSession {
  user_id: number;
  token_hash: string;
  expires_at: string;
}

let persistentUsers: PersistentUser[] = [];
let persistentSessions: PersistentSession[] = [];
let persistentCounter = 1;
let initialized = false;

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function initPersistentStore() {
  if (initialized) return;
  initialized = true;

  const users = await readJsonFile<PersistentUser[]>(USERS_FILE, []);
  const sessions = await readJsonFile<PersistentSession[]>(SESSIONS_FILE, []);

  persistentUsers = users;
  persistentSessions = sessions.filter(
    (s) => new Date(s.expires_at) > new Date(),
  );

  if (persistentUsers.length > 0) {
    persistentCounter = Math.max(...persistentUsers.map((u) => u.id)) + 1;
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isUserRole(role: string): role is UserRole {
  return ["apprenant", "formateur", "consultant", "expert", "admin"].includes(role);
}

function findUserByEmail(email: string): PersistentUser | undefined {
  return persistentUsers.find((u) => u.email === email);
}

function findUserById(id: number): PersistentUser | undefined {
  return persistentUsers.find((u) => u.id === id);
}

function saveUsers() {
  writeJsonFile(USERS_FILE, persistentUsers);
}

function saveSessions() {
  writeJsonFile(SESSIONS_FILE, persistentSessions.filter((s) => new Date(s.expires_at) > new Date()));
}

export async function createSessionWithFallback(userId: number): Promise<string> {
  await initPersistentStore();

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Try DB first
  try {
    const result = await execute(
      "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [userId, hashToken(token), expiresAt],
    );
    if (result.insertId && result.insertId > 0) {
      return token;
    }
  } catch {
    // DB unavailable, use persistent storage
  }

  // Fallback to persistent file storage
  persistentSessions.push({
    user_id: userId,
    token_hash: hashToken(token),
    expires_at: expiresAt.toISOString(),
  });
  saveSessions();
  return token;
}

export async function getUserForSessionWithFallback(token: string | undefined): Promise<AuthenticatedUser | null> {
  if (!token) return null;
  await initPersistentStore();

  // Try DB first
  try {
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
  } catch {
    // DB unavailable, use persistent storage
  }

  // Fallback to persistent file storage
  const session = persistentSessions.find(
    (s) => s.token_hash === hashToken(token) && new Date(s.expires_at) > new Date(),
  );
  if (!session) return null;

  const user = findUserById(session.user_id);
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
  await initPersistentStore();

  try {
    await execute("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
  } catch {
    // ignore
  }
  persistentSessions = persistentSessions.filter((s) => s.token_hash !== hashToken(token));
  saveSessions();
}

export async function registerUserWithFallback(
  name: string,
  email: string,
  passwordHash: string,
): Promise<{ id: number; emailVerified: boolean; verificationCode: string } | null> {
  await initPersistentStore();

  const normalizedEmail = email.toLowerCase();

  // Check DB first
  try {
    const existing = await query<RowDataPacket>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail],
    );
    if (existing.length > 0) {
      return null;
    }

    const result = await execute(
      "INSERT INTO users (name, email, password, role, subscription_status) VALUES (?, ?, ?, 'apprenant', 'free')",
      [name, normalizedEmail, passwordHash],
    );

    if (result.insertId && result.insertId > 0) {
      const verificationCode = randomBytes(32).toString("base64url");
      return { id: result.insertId, emailVerified: false, verificationCode };
    }
  } catch {
    // DB unavailable, use persistent storage
  }

  // Fallback to persistent file storage
  if (findUserByEmail(normalizedEmail)) {
    return null;
  }

  const id = persistentCounter++;
  const verificationCode = randomBytes(32).toString("base64url");
  persistentUsers.push({
    id,
    name,
    email: normalizedEmail,
    password: passwordHash,
    role: "apprenant",
    subscription_status: "free",
    email_verified: false,
    email_verification_code: verificationCode,
  });
  saveUsers();

  return { id, emailVerified: false, verificationCode };
}

export async function loginUserWithFallback(email: string, password: string): Promise<PersistentUser | null> {
  await initPersistentStore();

  const normalizedEmail = email.trim().toLowerCase();

  // Try DB first
  try {
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
  } catch {
    // DB unavailable, use persistent storage
  }

  // Fallback to persistent file storage
  const memoryUser = findUserByEmail(normalizedEmail);
  if (!memoryUser) return null;

  const bcrypt = await import("bcryptjs");
  if (!(await bcrypt.compare(password, memoryUser.password))) return null;

  return memoryUser;
}

export async function verifyEmailWithFallback(code: string): Promise<boolean> {
  await initPersistentStore();

  const user = persistentUsers.find((u) => u.email_verification_code === code);
  if (user) {
    user.email_verified = true;
    user.email_verification_code = null;
    saveUsers();
    return true;
  }
  return false;
}

export function getPersistentUserByEmail(email: string): PersistentUser | undefined {
  return findUserByEmail(email);
}

export function getPersistentUsersCount(): number {
  return persistentUsers.length;
}

export { hashToken, isUserRole };
