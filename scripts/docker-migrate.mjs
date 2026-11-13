import mysql from "mysql2/promise";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

function getDbUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL must be set");
  const u = new URL(url);
  if (u.protocol !== "mysql:" || !u.hostname) throw new Error("DATABASE_URL must be a valid mysql URL");
  return { url, database: u.pathname.replace(/^\//, "") };
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForDb(url, retries = 60, delayMs = 2000) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    let conn;
    try {
      conn = await mysql.createConnection(url);
      await conn.ping();
      await conn.end();
      console.log("[migrate] database is ready");
      return;
    } catch (e) {
      lastErr = e;
      try { await conn?.end(); } catch {}
      console.log(`[migrate] waiting for database... (${i + 1}/${retries})`);
      await sleep(delayMs);
    }
  }
  throw new Error(`Database not ready after ${retries} attempts: ${lastErr?.message || lastErr}`);
}

function splitStatements(sql) {
  // simple splitter: handles semicolons outside quotes/backticks
  const out = [];
  let cur = "";
  let q = null;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (q) {
      cur += c;
      if (c === q && sql[i - 1] !== "\\") q = null;
    } else if (c === "'" || c === '"' || c === "`") {
      q = c; cur += c;
    } else if (c === ";") {
      const s = cur.trim();
      if (s) out.push(s);
      cur = "";
    } else {
      cur += c;
    }
  }
  const s = cur.trim();
  if (s) out.push(s);
  return out;
}

async function main() {
  const { url } = getDbUrl();
  await waitForDb(url);
  const conn = await mysql.createConnection({ uri: url, multipleStatements: false });
  try {
    await conn.execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    const dir = path.join(process.cwd(), "sql");
    const files = (await readdir(dir)).filter(f => /^\d+.*\.sql$/i.test(f)).sort();
    for (const file of files) {
      const [rows] = await conn.execute("SELECT 1 FROM schema_migrations WHERE filename = ? LIMIT 1", [file]);
      if (Array.isArray(rows) && rows.length) { console.log(`[migrate] skip ${file} (already applied)`); continue; }
      const sql = await readFile(path.join(dir, file), "utf8");
      const statements = splitStatements(sql);
      console.log(`[migrate] applying ${file} (${statements.length} statements)`);
      await conn.beginTransaction();
      try {
        for (const stmt of statements) {
          await conn.query(stmt);
        }
        await conn.execute("INSERT INTO schema_migrations (filename) VALUES (?)", [file]);
        await conn.commit();
        console.log(`[migrate] applied ${file}`);
      } catch (e) {
        await conn.rollback();
        throw new Error(`Migration ${file} failed: ${e?.message || e}`);
      }
    }
    console.log("[migrate] all migrations applied");
  } finally {
    await conn.end();
  }
}

main().catch(e => { console.error(e?.message || e); process.exit(1); });
