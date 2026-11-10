import mysql, {
  type Pool,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";

type DatabaseEnvironment = { DATABASE_URL?: string };
export type SqlParameter = string | number | bigint | boolean | Date | null | Buffer | Uint8Array;

export function getDatabaseConfig(env: DatabaseEnvironment): string {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be configured before using the database.");
  }

  try {
    const parsedUrl = new URL(databaseUrl);
    if (parsedUrl.protocol !== "mysql:" || !parsedUrl.hostname || parsedUrl.pathname.length < 2) {
      throw new Error();
    }
  } catch {
    throw new Error("DATABASE_URL must be a valid MySQL connection URL.");
  }

  return databaseUrl;
}

let pool: Pool | undefined;

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(getDatabaseConfig({ DATABASE_URL: process.env.DATABASE_URL }));
  }
  return pool;
}

export async function query<T extends RowDataPacket = RowDataPacket>(
  sql: string,
  params: SqlParameter[] = [],
): Promise<T[]> {
  const [rows] = await getPool().execute<T[]>(sql, params);
  return rows;
}

export async function execute(
  sql: string,
  params: SqlParameter[] = [],
): Promise<ResultSetHeader> {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}
