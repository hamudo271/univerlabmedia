import { Router } from "express";
import { pool, dbAvailable } from "../db.js";
import { authRequired } from "../middleware/authRequired.js";
import { defaults } from "../../shared/content-defaults.js";

const router = Router();

/**
 * GET /api/content
 * Returns the entire content map as { [key]: value }.
 * Public — used by the site to render.
 * Falls back to shared/content-defaults when the DB is not configured.
 */
router.get("/", async (_req, res, next) => {
  if (!dbAvailable()) return res.json(defaults);
  try {
    const { rows } = await pool.query(
      "SELECT key, value FROM content_entries"
    );
    const out = { ...defaults };
    for (const row of rows) out[row.key] = row.value;
    res.json(out);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/content/:key
 * Returns a single page's content blob, or 404.
 */
router.get("/:key", async (req, res, next) => {
  const { key } = req.params;
  if (!dbAvailable()) {
    if (defaults[key]) return res.json({ key, value: defaults[key] });
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const { rows } = await pool.query(
      "SELECT value, updated_at FROM content_entries WHERE key = $1",
      [key]
    );
    if (!rows.length) {
      if (defaults[key]) return res.json({ key, value: defaults[key] });
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ key, value: rows[0].value, updatedAt: rows[0].updated_at });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/content/:key
 * Upsert one page's content blob. Body is the JSON value to store.
 */
router.put("/:key", authRequired, async (req, res, next) => {
  if (!dbAvailable()) {
    return res.status(503).json({ error: "Database not configured" });
  }
  const value = req.body;
  if (value === undefined || value === null) {
    return res.status(400).json({ error: "Body required" });
  }
  try {
    await pool.query(
      `INSERT INTO content_entries(key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value,
             updated_at = NOW()`,
      [req.params.key, JSON.stringify(value)]
    );
    res.json({ ok: true, key: req.params.key });
  } catch (err) {
    next(err);
  }
});

export default router;
