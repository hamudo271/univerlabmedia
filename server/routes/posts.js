import { Router } from "express";
import { pool, dbAvailable } from "../db.js";
import { toPost } from "../lib/posts.js";

const router = Router();

const PER_PAGE = 9;

// Fields the list needs (no full `content` — keep the payload small).
const LIST_FIELDS = `id, title, slug, excerpt, thumbnail_url, category,
  status, published_at, created_at, updated_at, view_count`;

/**
 * GET /api/posts?page=1&category=숏폼
 * Published posts only, newest first, 9 per page. `category` is optional.
 * Degrades to an empty list when no DB is attached so the page still renders.
 */
router.get("/", async (req, res, next) => {
  try {
    if (!dbAvailable()) {
      return res.json({
        items: [],
        total: 0,
        page: 1,
        perPage: PER_PAGE,
        totalPages: 0,
        categories: [],
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const category =
      typeof req.query.category === "string" && req.query.category.trim()
        ? req.query.category.trim()
        : null;
    const offset = (page - 1) * PER_PAGE;

    const where = ["status = 'PUBLISHED'"];
    const params = [];
    if (category) {
      params.push(category);
      where.push(`category = $${params.length}`);
    }
    const whereSql = where.join(" AND ");

    const countQ = pool.query(
      `SELECT COUNT(*)::int AS n FROM posts WHERE ${whereSql}`,
      params
    );
    const itemsQ = pool.query(
      `SELECT ${LIST_FIELDS} FROM posts
        WHERE ${whereSql}
        ORDER BY published_at DESC NULLS LAST, created_at DESC
        LIMIT ${PER_PAGE} OFFSET ${offset}`,
      params
    );
    // Distinct categories across all published posts (for the filter chips).
    const catsQ = pool.query(
      `SELECT DISTINCT category FROM posts
        WHERE status = 'PUBLISHED' AND category <> ''
        ORDER BY category`
    );

    const [countR, itemsR, catsR] = await Promise.all([countQ, itemsQ, catsQ]);
    const total = countR.rows[0].n;

    res.json({
      items: itemsR.rows.map(toPost),
      total,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil(total / PER_PAGE),
      categories: catsR.rows.map((r) => r.category),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/posts/latest?limit=3
 * Newest published posts, for the home-page highlights section.
 */
router.get("/latest", async (req, res, next) => {
  try {
    if (!dbAvailable()) return res.json({ items: [] });
    const limit = Math.min(12, Math.max(1, parseInt(req.query.limit, 10) || 3));
    const { rows } = await pool.query(
      `SELECT ${LIST_FIELDS} FROM posts
        WHERE status = 'PUBLISHED'
        ORDER BY published_at DESC NULLS LAST, created_at DESC
        LIMIT $1`,
      [limit]
    );
    res.json({ items: rows.map(toPost) });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/posts/:slug
 * Full published post. Atomically increments view_count on each fetch.
 * 404 for missing or unpublished slugs.
 */
router.get("/:slug", async (req, res, next) => {
  try {
    if (!dbAvailable()) return res.status(404).json({ error: "Not found" });
    const { rows } = await pool.query(
      `UPDATE posts
          SET view_count = view_count + 1
        WHERE slug = $1 AND status = 'PUBLISHED'
        RETURNING *`,
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(toPost(rows[0]));
  } catch (err) {
    next(err);
  }
});

export default router;
