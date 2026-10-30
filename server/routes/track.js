import { Router } from "express";
import express from "express";
import { pool, dbAvailable } from "../db.js";
import { classify, pickTags, parseUA, cleanPath, ownHosts, clientIp } from "../lib/attrib.js";

const router = Router();

const ID = /^[a-z0-9]{8,40}$/i;
const KINDS = new Set(["pv", "tel", "mail", "kakao", "cta", "out"]);

// IP별 분당 신호 수. 넘치면 조용히 버린다 (저장하지 않음).
const beats = new Map();
setInterval(() => beats.clear(), 60_000).unref();

/**
 * POST /api/v — 방문 신호. 페이지를 볼 때마다, 그리고 전화·메일·카카오·문의 버튼을
 * 누를 때 브라우저가 보낸다 (src/lib/track.js). 응답은 항상 204로 바로 돌려주고
 * 저장은 그 뒤에 한다.
 * Body(JSON 문자열): { v: 방문자 번호, s: 방문 번호, p: 경로, k: 종류, r: referrer, q: location.search, t: 누른 대상 }
 */
router.post("/", express.text({ type: () => true, limit: "4kb" }), async (req, res) => {
  res.status(204).set("Cache-Control", "no-store").end();
  if (!dbAvailable()) return;
  try {
    const ip = clientIp(req);
    const n = (beats.get(ip) || 0) + 1;
    beats.set(ip, n);
    if (n > 120) return;

    let b = req.body;
    if (typeof b === "string") {
      try {
        b = JSON.parse(b || "{}");
      } catch {
        return;
      }
    }
    if (!b || !ID.test(b.v || "") || !ID.test(b.s || "")) return;

    const ua = String(req.headers["user-agent"] || "");
    const u = parseUA(ua);
    if (u.bot) return;

    const path = cleanPath(b.p);
    if (path.startsWith("/admin")) return;
    const kind = KINDS.has(b.k) ? b.k : "pv";

    if (kind === "pv") {
      const c = classify({ ref: b.r, tags: pickTags(b.q), ua, own: ownHosts(req) });
      let refUrl = null;
      if (c.refHost) {
        try {
          const r = new URL(b.r);
          r.hash = "";
          refUrl = r.toString().slice(0, 300);
        } catch {
          refUrl = null;
        }
      }
      await pool.query(
        `INSERT INTO visits (id, visitor, landing, ref_host, ref_url, grp, channel, src, medium, campaign, keyword, device, os, browser, is_new)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                 NOT EXISTS (SELECT 1 FROM visits v WHERE v.visitor = $2))
         ON CONFLICT (id) DO UPDATE SET last_at = NOW(), pages = visits.pages + 1`,
        [b.s, b.v, path, c.refHost, refUrl, c.grp, c.channel, c.src, c.medium, c.campaign, c.keyword, u.device, u.os, u.browser]
      );
    } else {
      await pool.query("UPDATE visits SET last_at = NOW() WHERE id = $1", [b.s]);
    }
    await pool.query(
      "INSERT INTO hits (visit, kind, path, target) VALUES ($1, $2, $3, $4)",
      [b.s, kind, path, kind === "pv" ? null : String(b.t || "").slice(0, 200) || null]
    );
  } catch (err) {
    console.error("[track]", err.message);
  }
});

export default router;

/** 25개월 지난 방문 기록 삭제. 부팅 때와 하루 한 번 돈다. 문의는 지우지 않는다. */
export async function pruneOldVisits() {
  if (!dbAvailable()) return;
  try {
    await pool.query("DELETE FROM hits WHERE at < NOW() - INTERVAL '25 months'");
    await pool.query("DELETE FROM visits WHERE last_at < NOW() - INTERVAL '25 months'");
  } catch (err) {
    console.error("[track] prune failed:", err.message);
  }
}
