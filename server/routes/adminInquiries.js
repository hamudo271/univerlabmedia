import { Router } from "express";
import { pool, dbAvailable } from "../db.js";
import { authRequired } from "../middleware/authRequired.js";

const router = Router();
router.use(authRequired);
router.use((_req, res, next) => {
  if (!dbAvailable()) return res.status(503).json({ error: "Database not configured" });
  next();
});

export const STATUSES = ["new", "contacted", "proposal", "won", "hold", "lost", "spam"];

const LIST_COLUMNS = `id, created_at, updated_at, status, brand, manager, position, phone, channel_url,
  biz, bench, budget, service, reason, goal, heard_from, memo, amount, contacted_at, mail_status,
  grp, channel, src, medium, campaign, keyword, landing, device, first_seen, first_channel, visit_count`;

const toInquiry = (r) => ({ ...r, amount: r.amount == null ? null : Number(r.amount) });

/** GET /api/admin/inquiries/count — 아직 연락 전인 문의 수 (메뉴 배지). */
router.get("/count", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM inquiries WHERE status = 'new'");
    res.json({ new: rows[0].n });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/inquiries?status=&q=
 * 최신순 목록 + 상태별 건수. status 가 없으면 스팸을 뺀 전체.
 */
router.get("/", async (req, res, next) => {
  try {
    const status = STATUSES.includes(req.query.status) ? req.query.status : null;
    const q = String(req.query.q || "").trim().slice(0, 100);
    const where = [];
    const params = [];
    if (status) {
      params.push(status);
      where.push(`status = $${params.length}`);
    } else {
      where.push("status <> 'spam'");
    }
    if (q) {
      params.push(`%${q}%`);
      const i = params.length;
      where.push(`(brand ILIKE $${i} OR manager ILIKE $${i} OR phone ILIKE $${i} OR memo ILIKE $${i} OR channel_url ILIKE $${i})`);
    }
    const [list, counts] = await Promise.all([
      pool.query(
        `SELECT ${LIST_COLUMNS} FROM inquiries WHERE ${where.join(" AND ")} ORDER BY created_at DESC LIMIT 1000`,
        params
      ),
      pool.query("SELECT status, COUNT(*)::int AS n FROM inquiries GROUP BY status"),
    ]);
    res.json({
      items: list.rows.map(toInquiry),
      counts: Object.fromEntries(counts.rows.map((r) => [r.status, r.n])),
    });
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/inquiries/:id — 상세 + 같은 번호로 들어온 다른 문의. */
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    const { rows } = await pool.query("SELECT * FROM inquiries WHERE id = $1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "문의를 찾을 수 없습니다." });
    const digits = String(rows[0].phone).replace(/\D/g, "");
    const same = await pool.query(
      `SELECT id, created_at, status, brand, service FROM inquiries
        WHERE id <> $1 AND regexp_replace(phone, '\\D', '', 'g') = $2
        ORDER BY created_at DESC LIMIT 20`,
      [id, digits]
    );
    res.json({ item: toInquiry(rows[0]), samePhone: same.rows });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/inquiries/:id  { status?, memo?, amount? }
 * 바뀐 항목은 history 에 { at, field, from, to } 로 쌓인다.
 */
router.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    const { rows } = await pool.query("SELECT status, memo, amount, contacted_at FROM inquiries WHERE id = $1", [id]);
    const cur = rows[0];
    if (!cur) return res.status(404).json({ error: "문의를 찾을 수 없습니다." });

    const b = req.body || {};
    const next_ = {
      status: cur.status,
      memo: cur.memo,
      amount: cur.amount == null ? null : Number(cur.amount),
    };
    if (b.status !== undefined) {
      if (!STATUSES.includes(b.status)) return res.status(400).json({ error: "Invalid status" });
      next_.status = b.status;
    }
    if (b.memo !== undefined) next_.memo = String(b.memo ?? "").slice(0, 10000);
    if (b.amount !== undefined) {
      const n = b.amount === null || b.amount === "" ? null : Number(String(b.amount).replace(/[^\d]/g, ""));
      if (n !== null && !Number.isFinite(n)) return res.status(400).json({ error: "Invalid amount" });
      next_.amount = n;
    }

    const at = new Date().toISOString();
    const changes = [];
    if (next_.status !== cur.status) changes.push({ at, field: "status", from: cur.status, to: next_.status });
    if (next_.amount !== (cur.amount == null ? null : Number(cur.amount))) {
      changes.push({ at, field: "amount", from: cur.amount == null ? null : Number(cur.amount), to: next_.amount });
    }
    if (next_.memo !== cur.memo) changes.push({ at, field: "memo" });

    const contactedAt =
      cur.contacted_at || (cur.status === "new" && !["new", "spam"].includes(next_.status) ? new Date() : null);

    const upd = await pool.query(
      `UPDATE inquiries
          SET status = $1, memo = $2, amount = $3, contacted_at = $4,
              history = history || $5::jsonb, updated_at = NOW()
        WHERE id = $6
        RETURNING *`,
      [next_.status, next_.memo, next_.amount, contactedAt, JSON.stringify(changes), id]
    );
    res.json({ item: toInquiry(upd.rows[0]) });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/admin/inquiries/:id — 완전히 삭제 (방문 기록의 연결도 끊는다). */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    await pool.query("UPDATE visits SET inquiry_id = NULL WHERE inquiry_id = $1", [id]);
    const { rowCount } = await pool.query("DELETE FROM inquiries WHERE id = $1", [id]);
    if (!rowCount) return res.status(404).json({ error: "문의를 찾을 수 없습니다." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
