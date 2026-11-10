import { loadEnvConfig } from "@next/env";
import { input, password } from "@inquirer/prompts";
import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDatabaseConfig } from "../src/lib/db";
import {
  importLocalDatabase,
  toImportSqlParameters,
  type ImportDatabase,
} from "../src/lib/local-database-import";

async function main() {
  loadEnvConfig(process.cwd());
  const databaseUrl = getDatabaseConfig({ DATABASE_URL: process.env.DATABASE_URL });
  const sourcePath = join(process.cwd(), "src", "data", "local-database.json");
  const source = await readFile(sourcePath, "utf8");
  const connection = await mysql.createConnection(databaseUrl);

  const database: ImportDatabase = {
    beginTransaction: () => connection.beginTransaction(),
    commit: () => connection.commit(),
    rollback: () => connection.rollback(),
    end: () => connection.end(),
    query: async (sql, params = []) => {
      const [rows] = await connection.query(sql, toImportSqlParameters(params));
      return Array.isArray(rows) ? rows : [];
    },
    execute: async (sql, params = []) => {
      const [result] = await connection.execute(sql, toImportSqlParameters(params));
      if (!("insertId" in result)) throw new Error("Unexpected MySQL result during import.");
      return { insertId: result.insertId };
    },
  };

  try {
    const result = await importLocalDatabase(
      source,
      database,
      (email) => {
        if (!process.stdin.isTTY) {
          throw new Error("Interactive terminal required to rotate built-in credentials.");
        }
        return password({
          message: `Nouveau mot de passe sécurisé pour ${email} (12 caractères minimum)`,
          validate: (value) =>
            (value.length >= 12 && value.length <= 128) || "Utilisez 12 à 128 caractères.",
        });
      },
      (legacyUserId) => {
        if (!process.stdin.isTTY) {
          throw new Error("Interactive terminal required to map orphan local records.");
        }
        return input({
          message: `Adresse email du compte MySQL existant pour les anciens enregistrements (user_id=${legacyUserId})`,
          validate: (value) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Saisissez une adresse email valide.",
        });
      },
    );
    console.log(`[LocalDB Import] ${result.status}: ${result.users} users and related records processed.`);
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : error instanceof Error ? error.name : "UnknownError";
  console.error(`[LocalDB Import] Failed (${code}). No source data was deleted or modified.`);
  process.exitCode = 1;
});
