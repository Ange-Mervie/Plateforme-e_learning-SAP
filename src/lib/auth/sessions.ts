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

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isUserRole(role: string): role is UserRole {
  return ["apprenant", "formateur", "consultant", "expert", "admin"].includes(role);
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await execute(
    "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [userId, hashToken(token), expiresAt],
  );

  return token;
}

export async function getUserForSession(token: string | undefined): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  const rows = await query<SessionUserRow>(
    `SELECT u.id, u.name, u.email, u.role, u.subscription_status
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP`,
    [hashToken(token)],
  );
  const row = rows[0];
  if (!row) return null;

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
  };
}

export async function revokeSession(token: string | undefined): Promise<void> {
  if (!token) return;
  await execute("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
}
