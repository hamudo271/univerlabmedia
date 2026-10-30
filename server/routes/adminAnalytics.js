import { Router } from "express";
import { pool, dbAvailable } from "../db.js";
import { authRequired } from "../middleware/authRequired.js";
import { defaults } from "../../shared/content-defaults.js";

/**
 * 자체 방문 집계(visits/hits)와 문의(inquiries)를 묶은 유입 분석.
 * 날짜는 한국 날짜(Asia/Seoul) 기준. 스팸 문의는 모든 숫자에서 뺀다.
 */
const router = Router();
router.use(authRequired);
router.use((_req, res, next) => {
  if (!dbAvailable()) return res.status(503).json({ error: "Database not configured" });
  next();
});

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const kstToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const addDays = (ymd, n) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000) + 1;
const kstStart = (ymd) => new Date(Date.parse(`${ymd}T00:00:00+09:00`));

// 보고서에 보여줄 페이지 이름
const STATIC_TITLES = {
  "/": "홈",
  "/company": "회사 소개",
  "/service": "서비스 소개",
  "/portfolio": "제작 사례",
  "/pricing": "가격 안내",
  "/column": "칼럼 목록",
  "/contact": "문의하기",
  "/policy": "이용약관",
  "/privacy": "개인정보처리방침",
};
for (const s of defaults.serviceDetail?.services?.items ?? []) {
  STATIC_TITLES[`/service/${s.id}`] = s.title;
}

async function titleMap() {
  const map = new Map(Object.entries(STATIC_TITLES));
  const { rows } = await pool.query("SELECT slug, title FROM posts");
  for (const r of rows) map.set(`/column/${r.slug}`, r.title);
  return (path) => {
    if (map.has(path)) return map.get(path);
    try {
      const decoded = decodeURIComponent(path);
      if (map.has(decoded)) return map.get(decoded);
    } catch {
      /* ignore */
    }
    return null;
  };
}

const INQ = "status <> 'spam' AND created_at >= $1 AND created_at < $2";
const VIS = "started_at >= $1 AND started_at < $2";

async function summary(from, to) {
  const [v, i, e] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS sessions, COUNT(DISTINCT visitor)::int AS visitors,
              COALESCE(SUM(pages), 0)::int AS pageviews,
              COUNT(*) FILTER (WHERE pages <= 1)::int AS bounces,
              COUNT(*) FILTER (WHERE is_new)::int AS new_sessions,
              COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (last_at - started_at))) FILTER (WHERE pages > 1)), 0)::int AS avg_secs
         FROM visits WHERE ${VIS}`,
      [from, to]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS inquiries,
              COUNT(*) FILTER (WHERE status IN ('proposal', 'won'))::int AS proposals,
              COUNT(*) FILTER (WHERE status = 'won')::int AS won,
              COALESCE(SUM(amount) FILTER (WHERE status = 'won'), 0)::bigint AS revenue
         FROM inquiries WHERE ${INQ}`,
      [from, to]
    ),
    pool.query(
      "SELECT kind, COUNT(*)::int AS n FROM hits WHERE at >= $1 AND at < $2 AND kind NOT IN ('pv', 'form') GROUP BY kind",
      [from, to]
    ),
  ]);
  return {
    ...v.rows[0],
    ...i.rows[0],
    revenue: Number(i.rows[0].revenue),
    events: Object.fromEntries(e.rows.map((r) => [r.kind, r.n])),
  };
}

async function series(fromDay, toDay, from, to) {
  if (fromDay === toDay) {
    const { rows } = await pool.query(
      `WITH h AS (SELECT generate_series(0, 23) AS hour),
       v AS (SELECT EXTRACT(HOUR FROM started_at AT TIME ZONE 'Asia/Seoul')::int AS hour,
                    COUNT(DISTINCT visitor)::int AS visitors, COUNT(*)::int AS sessions, SUM(pages)::int AS pageviews
               FROM visits WHERE ${VIS} GROUP BY 1),
       i AS (SELECT EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Seoul')::int AS hour, COUNT(*)::int AS inquiries
               FROM inquiries WHERE ${INQ} GROUP BY 1)
       SELECT h.hour::text AS key, COALESCE(v.visitors, 0) AS visitors, COALESCE(v.sessions, 0) AS sessions,
              COALESCE(v.pageviews, 0) AS pageviews, COALESCE(i.inquiries, 0) AS inquiries
         FROM h LEFT JOIN v USING (hour) LEFT JOIN i USING (hour) ORDER BY h.hour`,
      [from, to]
    );
    return { unit: "hour", rows };
  }
  const { rows } = await pool.query(
    `WITH d AS (SELECT generate_series($3::date, $4::date, INTERVAL '1 day')::date AS day),
     v AS (SELECT (started_at AT TIME ZONE 'Asia/Seoul')::date AS day,
                  COUNT(DISTINCT visitor)::int AS visitors, COUNT(*)::int AS sessions, SUM(pages)::int AS pageviews
             FROM visits WHERE ${VIS} GROUP BY 1),
     i AS (SELECT (created_at AT TIME ZONE 'Asia/Seoul')::date AS day, COUNT(*)::int AS inquiries
             FROM inquiries WHERE ${INQ} GROUP BY 1)
     SELECT TO_CHAR(d.day, 'YYYY-MM-DD') AS key, COALESCE(v.visitors, 0) AS visitors, COALESCE(v.sessions, 0) AS sessions,
            COALESCE(v.pageviews, 0) AS pageviews, COALESCE(i.inquiries, 0) AS inquiries
       FROM d LEFT JOIN v USING (day) LEFT JOIN i USING (day) ORDER BY d.day`,
    [from, to, fromDay, toDay]
  );
  return { unit: "day", rows };
}

/**
 * GET /api/admin/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
 * 기본은 오늘까지 최근 28일. 비교 기간은 바로 앞의 같은 길이.
 */
router.get("/", async (req, res, next) => {
  try {
    const today = kstToday();
    const toDay = DAY.test(req.query.to || "") && req.query.to <= today ? req.query.to : today;
    const fromDay = DAY.test(req.query.from || "") && req.query.from <= toDay ? req.query.from : addDays(toDay, -27);
    const len = Math.min(400, daysBetween(fromDay, toDay));
    const from = kstStart(fromDay);
    const to = kstStart(addDays(toDay, 1));
    const range = [from, to];

    const [titleOf, now, prev, ser, channels, keywords, campaigns, landings, pages, devices, browsers, heat,
      clicks, live, livePages, refUrls, journeyPages, heardFrom, statusRows] = await Promise.all([
      titleMap(),
      summary(from, to),
      summary(kstStart(addDays(fromDay, -len)), from),
      series(fromDay, toDay, from, to),
      pool.query(
        `WITH s AS (SELECT grp, channel, COUNT(*)::int AS sessions, COUNT(DISTINCT visitor)::int AS visitors,
                           COUNT(*) FILTER (WHERE pages <= 1)::int AS bounces
                      FROM visits WHERE ${VIS} GROUP BY 1, 2),
         i AS (SELECT COALESCE(grp, '알 수 없음') AS grp, COALESCE(channel, '알 수 없음') AS channel, COUNT(*)::int AS inquiries,
                      COUNT(*) FILTER (WHERE status IN ('proposal', 'won'))::int AS proposals,
                      COUNT(*) FILTER (WHERE status = 'won')::int AS won,
                      COALESCE(SUM(amount) FILTER (WHERE status = 'won'), 0)::bigint AS revenue
                 FROM inquiries WHERE ${INQ} GROUP BY 1, 2)
         SELECT COALESCE(s.grp, i.grp) AS grp, COALESCE(s.channel, i.channel) AS channel,
                COALESCE(s.sessions, 0) AS sessions, COALESCE(s.visitors, 0) AS visitors, COALESCE(s.bounces, 0) AS bounces,
                COALESCE(i.inquiries, 0) AS inquiries, COALESCE(i.proposals, 0) AS proposals,
                COALESCE(i.won, 0) AS won, COALESCE(i.revenue, 0)::bigint AS revenue
           FROM s FULL JOIN i ON s.grp = i.grp AND s.channel = i.channel
          ORDER BY 3 DESC, 6 DESC`,
        range
      ),
      pool.query(
        `SELECT keyword, MAX(channel) AS channel, COUNT(*)::int AS sessions, COUNT(inquiry_id)::int AS inquiries
           FROM visits WHERE keyword IS NOT NULL AND ${VIS} GROUP BY keyword ORDER BY 3 DESC, 4 DESC LIMIT 30`,
        range
      ),
      pool.query(
        `SELECT src, medium, campaign, COUNT(*)::int AS sessions, COUNT(inquiry_id)::int AS inquiries
           FROM visits WHERE (src IS NOT NULL OR campaign IS NOT NULL) AND ${VIS}
          GROUP BY 1, 2, 3 ORDER BY 4 DESC LIMIT 30`,
        range
      ),
      pool.query(
        `SELECT landing AS path, COUNT(*)::int AS sessions, COUNT(*) FILTER (WHERE pages <= 1)::int AS bounces,
                COUNT(inquiry_id)::int AS inquiries
           FROM visits WHERE ${VIS} GROUP BY 1 ORDER BY 2 DESC LIMIT 25`,
        range
      ),
      pool.query(
        `SELECT path, COUNT(*)::int AS views, COUNT(DISTINCT visit)::int AS sessions
           FROM hits WHERE kind = 'pv' AND at >= $1 AND at < $2 GROUP BY 1 ORDER BY 2 DESC LIMIT 40`,
        range
      ),
      pool.query(`SELECT COALESCE(device, '기타') AS label, COUNT(*)::int AS n FROM visits WHERE ${VIS} GROUP BY 1 ORDER BY 2 DESC`, range),
      pool.query(`SELECT COALESCE(browser, '기타') AS label, COUNT(*)::int AS n FROM visits WHERE ${VIS} GROUP BY 1 ORDER BY 2 DESC LIMIT 10`, range),
      pool.query(
        `SELECT EXTRACT(ISODOW FROM started_at AT TIME ZONE 'Asia/Seoul')::int AS dow,
                EXTRACT(HOUR FROM started_at AT TIME ZONE 'Asia/Seoul')::int AS hour, COUNT(*)::int AS n
           FROM visits WHERE ${VIS} GROUP BY 1, 2`,
        range
      ),
      pool.query(
        `SELECT kind, target, path, COUNT(*)::int AS n FROM hits
          WHERE kind IN ('tel', 'mail', 'kakao', 'cta', 'out') AND at >= $1 AND at < $2
          GROUP BY 1, 2, 3 ORDER BY 4 DESC LIMIT 30`,
        range
      ),
      pool.query("SELECT COUNT(DISTINCT visitor)::int AS n FROM visits WHERE last_at > NOW() - INTERVAL '5 minutes'"),
      pool.query(
        `SELECT path, COUNT(*)::int AS n FROM (
           SELECT DISTINCT ON (h.visit) h.path FROM hits h
            WHERE h.kind = 'pv' AND h.at > NOW() - INTERVAL '5 minutes' ORDER BY h.visit, h.at DESC) x
          GROUP BY 1 ORDER BY 2 DESC LIMIT 8`
      ),
      pool.query(
        `SELECT ref_url, MAX(channel) AS channel, COUNT(*)::int AS sessions, COUNT(inquiry_id)::int AS inquiries
           FROM visits WHERE ref_url IS NOT NULL AND ${VIS} GROUP BY 1 ORDER BY 3 DESC, 4 DESC LIMIT 30`,
        range
      ),
      // 문의 전에 본 페이지: 문의 한 건에서 같은 페이지를 여러 번 봐도 1로 센다.
      pool.query(
        `SELECT j.path, COUNT(DISTINCT i.id)::int AS inquiries
           FROM inquiries i, jsonb_to_recordset(i.journey) AS j(path text)
          WHERE i.status <> 'spam' AND i.created_at >= $1 AND i.created_at < $2
          GROUP BY 1 ORDER BY 2 DESC LIMIT 20`,
        range
      ),
      pool.query(
        `SELECT heard_from AS label, COUNT(*)::int AS n FROM inquiries WHERE ${INQ} GROUP BY 1 ORDER BY 2 DESC`,
        range
      ),
      pool.query(`SELECT status, COUNT(*)::int AS n FROM inquiries WHERE ${INQ} GROUP BY 1`, range),
    ]);

    const withTitle = (rows) => rows.map((r) => ({ ...r, title: titleOf(r.path) }));
    res.json({
      from: fromDay,
      to: toDay,
      days: len,
      prevFrom: addDays(fromDay, -len),
      prevTo: addDays(fromDay, -1),
      summary: now,
      previous: prev,
      series: ser,
      channels: channels.rows.map((r) => ({ ...r, revenue: Number(r.revenue) })),
      keywords: keywords.rows,
      campaigns: campaigns.rows,
      landings: withTitle(landings.rows),
      pages: withTitle(pages.rows),
      devices: devices.rows,
      browsers: browsers.rows,
      heat: heat.rows,
      clicks: withTitle(clicks.rows),
      refUrls: refUrls.rows,
      journeyPages: withTitle(journeyPages.rows),
      heardFrom: heardFrom.rows,
      statuses: Object.fromEntries(statusRows.rows.map((r) => [r.status, r.n])),
      live: { now: live.rows[0].n, pages: withTitle(livePages.rows) },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
