import { connection } from "next/server";
import { cookies } from "next/headers";
import { getUserForSession } from "./sessions";
import { AuthenticationError, type AuthenticatedUser, type UserRole } from "./types";

export const SESSION_COOKIE = "sap_academy_session";

export async function requireUser(): Promise<AuthenticatedUser> {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const user = await getUserForSession(token);
  if (!user) {
    throw new AuthenticationError(401, "Authentication required");
  }
  return user;
}

export async function requireRole(roles: readonly UserRole[]): Promise<AuthenticatedUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new AuthenticationError(403, "Insufficient role");
  }
  return user;
}
