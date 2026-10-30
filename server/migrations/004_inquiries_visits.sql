-- 문의 저장 + 자체 방문 집계.
--
-- inquiries: /contact 폼으로 들어온 문의. 메일 발송 전에 먼저 저장해서, 메일이
--   실패해도 문의가 사라지지 않게 한다. 어디서 들어왔는지(유입)도 함께 남긴다.
-- visits / hits: 브라우저가 페이지마다 보내는 작은 신호(/api/v). 쿠키 없이 브라우저에
--   저장한 무작위 번호만 쓰고, 이름·연락처·IP는 담지 않는다. 25개월 뒤 자동 삭제.

CREATE TABLE IF NOT EXISTS inquiries (
  id            SERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'proposal', 'won', 'hold', 'lost', 'spam')),

  -- 폼 내용
  brand         TEXT NOT NULL DEFAULT '',
  manager       TEXT NOT NULL DEFAULT '',
  position      TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  channel_url   TEXT NOT NULL DEFAULT '',
  biz           TEXT NOT NULL DEFAULT '',
  bench         TEXT NOT NULL DEFAULT '',
  budget        TEXT NOT NULL DEFAULT '',
  service       TEXT NOT NULL DEFAULT '',
  reason        TEXT NOT NULL DEFAULT '',
  goal          TEXT NOT NULL DEFAULT '',
  heard_from    TEXT NOT NULL DEFAULT '',   -- 고객이 직접 고른 '유입 경로'

  -- 관리
  memo          TEXT NOT NULL DEFAULT '',
  amount        BIGINT,                     -- 계약 금액(원)
  contacted_at  TIMESTAMPTZ,                -- 처음 '신규'에서 벗어난 시각
  history       JSONB NOT NULL DEFAULT '[]'::jsonb,
  mail_status   TEXT NOT NULL DEFAULT 'pending',  -- pending | sent | failed | off
  mail_error    TEXT,

  -- 유입 (방문 기록에서 복사)
  visit_id      TEXT,
  visitor       TEXT,
  grp           TEXT,
  channel       TEXT,
  src           TEXT,
  medium        TEXT,
  campaign      TEXT,
  keyword       TEXT,
  landing       TEXT,
  ref_url       TEXT,
  device        TEXT,
  os            TEXT,
  browser       TEXT,
  first_seen    TIMESTAMPTZ,
  first_channel TEXT,
  visit_count   INTEGER,
  journey       JSONB NOT NULL DEFAULT '[]'::jsonb   -- 문의 전에 본 페이지 [{ path, at }]
);

CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status);

CREATE TABLE IF NOT EXISTS visits (
  id          TEXT PRIMARY KEY,               -- 방문 번호 (30분 쉬면 새 방문)
  visitor     TEXT NOT NULL,                  -- 방문자 번호 (브라우저별)
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pages       INTEGER NOT NULL DEFAULT 1,
  landing     TEXT NOT NULL DEFAULT '/',
  ref_host    TEXT,
  ref_url     TEXT,
  grp         TEXT NOT NULL DEFAULT '직접 방문',
  channel     TEXT NOT NULL DEFAULT '직접 방문',
  src         TEXT,
  medium      TEXT,
  campaign    TEXT,
  keyword     TEXT,
  device      TEXT,
  os          TEXT,
  browser     TEXT,
  is_new      BOOLEAN NOT NULL DEFAULT TRUE,
  inquiry_id  INTEGER
);

CREATE INDEX IF NOT EXISTS visits_started_idx ON visits (started_at);
CREATE INDEX IF NOT EXISTS visits_last_idx ON visits (last_at);
CREATE INDEX IF NOT EXISTS visits_visitor_idx ON visits (visitor);

CREATE TABLE IF NOT EXISTS hits (
  id      BIGSERIAL PRIMARY KEY,
  visit   TEXT NOT NULL,
  kind    TEXT NOT NULL DEFAULT 'pv',   -- pv | tel | mail | kakao | cta | out | form
  path    TEXT NOT NULL,
  target  TEXT,
  at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hits_at_idx ON hits (at);
CREATE INDEX IF NOT EXISTS hits_visit_idx ON hits (visit);
