import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[db] DATABASE_URL is not set. Admin/content APIs will return 503 until Postgres is attached."
  );
}

/**
 * Shared pg Pool. SSL is required for Railway/Heroku-style managed Postgres
 * but disabled on localhost (no cert).
 */
export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: connectionString.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
      max: 10,
    })
  : null;

export function dbAvailable() {
  return pool !== null;
}

/**
 * Apply any migrations in server/migrations that haven't been run yet.
 * Tracks applied files in a `_migrations` table. Idempotent.
 */
export async function runMigrations() {
  if (!pool) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    const dir = path.join(__dirname, "migrations");
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const { rows } = await client.query("SELECT name FROM _migrations");
    const applied = new Set(rows.map((r) => r.name));

    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      console.log(`[db] applying migration ${file}`);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO _migrations(name) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
  } finally {
    client.release();
  }
}

/**
 * Seed `content_entries` from shared/content-defaults.js for any key that
 * doesn't already exist. Never overwrites edited rows. Safe to call on every
 * boot.
 */
export async function seedDefaultsIfMissing() {
  if (!pool) return;
  const { defaults } = await import("../shared/content-defaults.js");
  const client = await pool.connect();
  try {
    for (const [key, value] of Object.entries(defaults)) {
      await client.query(
        `INSERT INTO content_entries(key, value)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value)]
      );
    }
  } finally {
    client.release();
  }
}
