import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type SqlParameter = string | number | bigint | boolean | Date | null;

export function getDatabaseConfig(env: { DATABASE_URL?: string }): string {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be configured before using the database.");
  }
  return databaseUrl;
}

export async function query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
  return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>;
}

export async function execute(sql: string, params: unknown[] = []): Promise<{ affectedRows: number; insertId: number }> {
  const result = await prisma.$executeRawUnsafe(sql, ...params);
  return { affectedRows: result, insertId: 0 };
}

export default prisma;