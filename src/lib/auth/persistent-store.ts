import { createHash, randomBytes } from "node:crypto";
import { PrismaClient, type User as PrismaUser, type Session as PrismaSession } from "@prisma/client";
import type { AuthenticatedUser, UserRole } from "./types";

const prisma = new PrismaClient();

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isUserRole(role: string): role is UserRole {
  return ["apprenant", "formateur", "consultant", "expert", "admin"].includes(role);
}

function toAuthenticatedUser(user: PrismaUser): AuthenticatedUser {
  const role = user.role === "learner" ? "apprenant" : user.role;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: isUserRole(role) ? role : "apprenant",
    subscription: {
      status: user.subscriptionStatus === "active" ? "active" : "free",
      planId: user.subscriptionPlan,
    },
    emailVerified: user.emailVerified,
  };
}

export async function createSessionWithFallback(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  return token;
}

export async function getUserForSessionWithFallback(token: string | undefined): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return toAuthenticatedUser(session.user);
}

export async function revokeSessionWithFallback(token: string | undefined): Promise<void> {
  if (!token) return;
  await prisma.session.deleteMany({
    where: { tokenHash: hashToken(token) },
  });
}

export async function registerUserWithFallback(
  name: string,
  email: string,
  passwordHash: string,
): Promise<{ id: number; emailVerified: boolean; verificationCode: string } | null> {
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) return null;

  const verificationCode = randomBytes(32).toString("base64url");

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: passwordHash,
      role: "apprenant",
      subscriptionStatus: "free",
      emailVerified: false,
      emailVerificationCode: verificationCode,
    },
  });

  return { id: user.id, emailVerified: false, verificationCode };
}

export async function loginUserWithFallback(email: string, password: string): Promise<{ id: number; name: string; email: string; password: string; role: string; subscriptionStatus: string; emailVerified: boolean; emailVerificationCode: string | null } | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) return null;

  const bcrypt = await import("bcryptjs");
  if (!(await bcrypt.compare(password, user.password))) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus,
    emailVerified: user.emailVerified,
    emailVerificationCode: user.emailVerificationCode,
  };
}

export async function verifyEmailWithFallback(code: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { emailVerificationCode: code },
  });
  if (!user) return false;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationCode: null,
    },
  });
  return true;
}

export async function getPersistentUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function getPersistentUsersCount(): Promise<number> {
  return prisma.user.count();
}

export { hashToken, isUserRole };