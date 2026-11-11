import type { AuthenticatedUser } from "./types";
import { getUserForSessionWithFallback, createSessionWithFallback, revokeSessionWithFallback } from "./persistent-store";

export async function createSession(userId: number): Promise<string> {
  return createSessionWithFallback(userId);
}

export async function getUserForSession(token: string | undefined): Promise<AuthenticatedUser | null> {
  return getUserForSessionWithFallback(token);
}

export async function revokeSession(token: string | undefined): Promise<void> {
  return revokeSessionWithFallback(token);
}
