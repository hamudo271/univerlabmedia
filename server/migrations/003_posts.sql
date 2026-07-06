-- Blog/column posts for the /column section and its admin CRUD.
-- gen_random_uuid() comes from the pgcrypto extension created in 001_initial.sql.

CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content       TEXT NOT NULL DEFAULT '',          -- sanitized HTML from the Tiptap editor
  excerpt       TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  category      TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  view_count    INTEGER NOT NULL DEFAULT 0
);

-- Public list is ordered by published_at DESC over PUBLISHED rows only.
CREATE INDEX IF NOT EXISTS posts_published_at_idx
  ON posts (published_at DESC)
  WHERE status = 'PUBLISHED';

-- Admin list / category filtering.
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts (status);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts (category);
