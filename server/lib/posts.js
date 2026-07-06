/**
 * Shared data-access helpers for blog posts. Row (snake_case) → API (camelCase)
 * mapping and slug-uniqueness live here so the public and admin routers stay
 * thin and consistent.
 */
import crypto from "node:crypto";
import { slugify } from "../../shared/slugify.js";

/** Map a `posts` row to the camelCase shape the frontend consumes. */
export function toPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    thumbnailUrl: row.thumbnail_url,
    category: row.category,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    viewCount: row.view_count,
  };
}

/**
 * Produce a slug that is unique across `posts`. Starts from the slugified
 * title (or an explicit desired slug), then appends -2, -3, … on collision.
 * `excludeId` lets an update keep its own slug without colliding with itself.
 */
export async function ensureUniqueSlug(pool, desired, excludeId = null) {
  let base = slugify(desired);
  if (!base) base = `post-${crypto.randomUUID().slice(0, 8)}`;

  let candidate = base;
  let n = 1;
  // Bounded loop; collisions are rare so this resolves in a couple of tries.
  while (true) {
    const { rows } = await pool.query(
      "SELECT id FROM posts WHERE slug = $1 LIMIT 1",
      [candidate]
    );
    const taken = rows[0] && rows[0].id !== excludeId;
    if (!taken) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}
