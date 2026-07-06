import { Router } from "express";
import { pool, dbAvailable } from "../db.js";
import { authRequired } from "../middleware/authRequired.js";
import { toPost, ensureUniqueSlug } from "../lib/posts.js";

const router = Router();

// Every admin post route requires a valid admin token and a database.
router.use(authRequired);
router.use((_req, res, next) => {
  if (!dbAvailable()) {
    return res.status(503).json({ error: "Database not available" });
  }
  next();
});

const LIST_FIELDS = `id, title, slug, excerpt, thumbnail_url, category,
  status, published_at, created_at, updated_at, view_count`;

/** Normalise an incoming status to a valid enum value (defaults to DRAFT). */
function normStatus(v) {
  return v === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
}

/**
 * GET /api/admin/posts
 * All posts regardless of status, most-recently-updated first.
 */
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${LIST_FIELDS} FROM posts ORDER BY updated_at DESC`
    );
    res.json({ items: rows.map(toPost) });
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/posts/:id — single post (any status) for the editor. */
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts WHERE id = $1", [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(toPost(rows[0]));
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/posts — create.
 * Body: { title, slug?, content?, excerpt?, thumbnailUrl?, category?, status? }
 * Slug is derived from `slug || title` and made unique. When created as
 * PUBLISHED, published_at is stamped now.
 */
router.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    const title = (b.title || "").trim();
    if (!title) return res.status(400).json({ error: "제목은 필수입니다" });

    const status = normStatus(b.status);
    const slug = await ensureUniqueSlug(pool, b.slug || title);
    const publishedAt = status === "PUBLISHED" ? new Date() : null;

    const { rows } = await pool.query(
      `INSERT INTO posts
         (title, slug, content, excerpt, thumbnail_url, category, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        slug,
        b.content || "",
        b.excerpt || "",
        b.thumbnailUrl || null,
        b.category || "",
        status,
        publishedAt,
      ]
    );
    res.status(201).json(toPost(rows[0]));
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/posts/:id — full update.
 * Re-uniquifies the slug if it changed. published_at is stamped the first time
 * a post transitions to PUBLISHED and preserved thereafter; unpublishing keeps
 * the original date (so re-publishing doesn't reset ordering unexpectedly).
 */
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const b = req.body || {};

    const existingR = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    const existing = existingR.rows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });

    const title = (b.title || "").trim();
    if (!title) return res.status(400).json({ error: "제목은 필수입니다" });

    const status = normStatus(b.status);

    // Slug: only recompute uniqueness when the desired value actually changes.
    const desiredSlug = (b.slug || title).trim();
    let slug = existing.slug;
    if (desiredSlug && desiredSlug !== existing.slug) {
      slug = await ensureUniqueSlug(pool, desiredSlug, id);
    }

    // published_at: stamp on first publish, keep whatever exists otherwise.
    let publishedAt = existing.published_at;
    if (status === "PUBLISHED" && !existing.published_at) {
      publishedAt = new Date();
    }

    const { rows } = await pool.query(
      `UPDATE posts SET
         title = $1, slug = $2, content = $3, excerpt = $4,
         thumbnail_url = $5, category = $6, status = $7,
         published_at = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        title,
        slug,
        b.content ?? existing.content,
        b.excerpt ?? existing.excerpt,
        // Respect an explicit null/"" (thumbnail removed); only keep the old
        // value when the field is omitted entirely from the payload.
        "thumbnailUrl" in b ? b.thumbnailUrl || null : existing.thumbnail_url,
        b.category ?? existing.category,
        status,
        publishedAt,
        id,
      ]
    );
    res.json(toPost(rows[0]));
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/posts/:id/status — publish/unpublish toggle.
 * Body: { status: "PUBLISHED" | "DRAFT" }
 */
router.patch("/:id/status", async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = normStatus((req.body || {}).status);

    const existingR = await pool.query(
      "SELECT published_at FROM posts WHERE id = $1",
      [id]
    );
    if (!existingR.rows[0]) return res.status(404).json({ error: "Not found" });

    let publishedAt = existingR.rows[0].published_at;
    if (status === "PUBLISHED" && !publishedAt) publishedAt = new Date();

    const { rows } = await pool.query(
      `UPDATE posts SET status = $1, published_at = $2, updated_at = NOW()
        WHERE id = $3 RETURNING *`,
      [status, publishedAt, id]
    );
    res.json(toPost(rows[0]));
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/admin/posts/:id */
router.delete("/:id", async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM posts WHERE id = $1", [
      req.params.id,
    ]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
