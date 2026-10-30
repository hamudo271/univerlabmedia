import { Router } from "express";
import { defaults } from "../../shared/content-defaults.js";
import { pool, dbAvailable } from "../db.js";
import { classify, pickTags, parseUA, cleanPath, ownHosts } from "../lib/attrib.js";

const router = Router();

// Resend config via environment variables (set these in Railway).
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO = process.env.CONTACT_TO_EMAIL || "contact@univerlabmedia.co.kr";
// `from` must use a domain you've verified in Resend. Until then you can test
// with Resend's sandbox sender "onboarding@resend.dev".
const CONTACT_FROM =
  process.env.CONTACT_FROM_EMAIL || "유니버랩 미디어 <onboarding@resend.dev>";

const form = defaults.contact.form;
const labelOf = (options, value) =>
  options.find((o) => o.value === value)?.label || value || "-";

const esc = (s = "") =>
  String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));

const ID = /^[a-z0-9]{8,40}$/i;
const clip = (s, n = 4000) => String(s ?? "").trim().slice(0, n);

/**
 * 이 문의가 어디서 들어왔는지. 브라우저가 보낸 방문 번호(_s)로 방문 기록을 찾고,
 * 없으면(추적이 막힌 브라우저 등) 브라우저가 기억해 둔 첫 referrer·태그(_r, _q)로 판별한다.
 */
async function attribution(b, req) {
  const ua = String(req.headers["user-agent"] || "");
  const u = parseUA(ua);
  const out = {
    visit_id: null, visitor: null, grp: null, channel: null, src: null, medium: null, campaign: null,
    keyword: null, landing: null, ref_url: null, device: u.device, os: u.os, browser: u.browser,
    first_seen: null, first_channel: null, visit_count: null, journey: [],
  };

  if (dbAvailable() && ID.test(b._s || "") && ID.test(b._v || "")) {
    const { rows } = await pool.query("SELECT * FROM visits WHERE id = $1 AND visitor = $2", [b._s, b._v]);
    const v = rows[0];
    if (v) {
      Object.assign(out, {
        visit_id: v.id, visitor: v.visitor, grp: v.grp, channel: v.channel, src: v.src, medium: v.medium,
        campaign: v.campaign, keyword: v.keyword, landing: v.landing, ref_url: v.ref_url,
        device: v.device || out.device, os: v.os || out.os, browser: v.browser || out.browser,
      });
      const [first, pages] = await Promise.all([
        pool.query(
          `SELECT MIN(started_at) AS first_seen, COUNT(*)::int AS n,
                  (SELECT channel FROM visits WHERE visitor = $1 ORDER BY started_at LIMIT 1) AS first_channel
             FROM visits WHERE visitor = $1`,
          [v.visitor]
        ),
        pool.query(
          "SELECT path, at FROM hits WHERE visit = $1 AND kind = 'pv' ORDER BY at LIMIT 40",
          [v.id]
        ),
      ]);
      out.first_seen = first.rows[0]?.first_seen || null;
      out.first_channel = first.rows[0]?.first_channel || null;
      out.visit_count = first.rows[0]?.n || null;
      out.journey = pages.rows.map((r) => ({ path: r.path, at: r.at }));
      return out;
    }
  }

  // 방문 기록이 없을 때의 대안
  const c = classify({ ref: clip(b._r, 500), tags: pickTags(clip(b._q, 500)), ua, own: ownHosts(req) });
  Object.assign(out, {
    grp: c.grp, channel: c.channel, src: c.src, medium: c.medium, campaign: c.campaign, keyword: c.keyword,
    landing: b._l ? cleanPath(b._l) : null,
  });
  if (ID.test(b._v || "")) out.visitor = b._v;
  return out;
}

/**
 * POST /api/contact
 * 문의를 먼저 DB에 저장하고, 그다음 Resend로 메일을 보낸다. 둘 중 하나라도 성공하면
 * 접수 완료로 응답한다 (메일이 실패해도 관리자 > 문의 관리에 남는다).
 * Body: { brand, manager, position, phone, channel, biz, bench,
 *         budget, service, reason, goal, source, consent, _hp, _v, _s, _r, _q, _l }
 */
router.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};

    // Honeypot: real users never fill this hidden field.
    if (b._hp) return res.json({ ok: true });

    // Required fields.
    const required = ["brand", "manager", "phone", "channel", "biz", "bench", "budget", "service", "reason", "goal", "source"];
    const missing = required.filter((k) => !String(b[k] || "").trim());
    if (missing.length) {
      return res.status(400).json({ error: `필수 항목이 누락되었습니다: ${missing.join(", ")}` });
    }
    if (!b.consent) {
      return res.status(400).json({ error: "개인정보 수집 및 이용에 동의해주세요." });
    }

    // 휴대폰 번호는 11자리 완성본만 받는다. 프론트 검증을 우회한 직접 요청도
    // 여기서 걸러진다.
    if (String(b.phone).replace(/\D/g, "").length !== 11) {
      return res.status(400).json({ error: "전화번호 11자리를 모두 입력해주세요. (예: 010-1234-5678)" });
    }

    const fields = {
      brand: clip(b.brand, 200),
      manager: clip(b.manager, 100),
      position: clip(b.position, 100),
      phone: String(b.phone).replace(/\D/g, "").replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3"),
      channel_url: clip(b.channel, 500),
      biz: clip(b.biz),
      bench: clip(b.bench, 500),
      budget: labelOf(form.budgetOptions, b.budget),
      service: labelOf(form.serviceOptions, b.service),
      reason: clip(b.reason),
      goal: clip(b.goal),
      heard_from: labelOf(form.sourceOptions, b.source),
    };

    // 1) 저장
    let inquiryId = null;
    let attr = null;
    if (dbAvailable()) {
      try {
        attr = await attribution(b, req);
        const cols = { ...fields, ...attr, journey: JSON.stringify(attr.journey) };
        const keys = Object.keys(cols);
        const { rows } = await pool.query(
          `INSERT INTO inquiries (${keys.join(", ")})
           VALUES (${keys.map((_, i) => `$${i + 1}`).join(", ")})
           RETURNING id`,
          keys.map((k) => cols[k])
        );
        inquiryId = rows[0].id;
        if (attr.visit_id) {
          await pool.query("UPDATE visits SET inquiry_id = $1, last_at = NOW() WHERE id = $2", [inquiryId, attr.visit_id]);
          await pool.query("INSERT INTO hits (visit, kind, path, target) VALUES ($1, 'form', '/contact', $2)", [attr.visit_id, String(inquiryId)]);
        }
      } catch (err) {
        console.error("[contact] save failed:", err);
      }
    }

    // 2) 메일
    const mail = await sendMail(fields, attr, inquiryId);
    if (inquiryId) {
      await pool
        .query("UPDATE inquiries SET mail_status = $1, mail_error = $2 WHERE id = $3", [mail.status, mail.error || null, inquiryId])
        .catch((err) => console.error("[contact] mail status update failed:", err.message));
    }

    if (inquiryId || mail.status === "sent") return res.json({ ok: true });
    if (mail.status === "off") {
      return res.status(503).json({ error: "메일 발송이 아직 설정되지 않았습니다. 잠시 후 다시 시도해주세요." });
    }
    return res.status(502).json({ error: "문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요." });
  } catch (err) {
    next(err);
  }
});

async function sendMail(f, attr, inquiryId) {
  if (!RESEND_API_KEY) {
    console.warn("[contact] RESEND_API_KEY not set — cannot send email.");
    return { status: "off" };
  }

  const rows = [
    ["브랜드명", f.brand],
    ["담당자 성함", f.manager],
    ["담당자 직책", f.position || "-"],
    ["연락처", f.phone],
    ["운영 채널 URL", f.channel_url],
    ["사업체 소개", f.biz],
    ["벤치마킹 채널 URL", f.bench],
    ["월 예산", f.budget],
    ["원하는 서비스", f.service],
    ["의뢰 이유", f.reason],
    ["유튜브 운영 이유", f.goal],
    ["유입 경로 (고객 선택)", f.heard_from],
  ];
  if (attr?.channel) {
    rows.push(["실제 유입 (자동 판별)", [attr.channel, attr.keyword && `검색어 "${attr.keyword}"`, attr.campaign && `캠페인 ${attr.campaign}`].filter(Boolean).join(" · ")]);
  }

  const adminLink = inquiryId
    ? `<p style="margin-top:16px"><a href="https://univerlabmedia.co.kr/admin/inquiries/${inquiryId}" style="color:#2563eb">관리자에서 보기 →</a></p>`
    : "";

  const html = `
      <div style="font-family:Pretendard,Apple SD Gothic Neo,Arial,sans-serif;max-width:640px;margin:0 auto;color:#0b1020">
        <h2 style="margin:0 0 16px">📩 새 프로젝트 문의</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([k, v]) => `<tr>
                <td style="padding:10px 12px;background:#f5f7fb;border:1px solid #e6e9f0;font-weight:700;white-space:nowrap;vertical-align:top;width:160px">${esc(k)}</td>
                <td style="padding:10px 12px;border:1px solid #e6e9f0;white-space:pre-wrap">${esc(v)}</td>
              </tr>`
            )
            .join("")}
        </table>
        ${adminLink}
        <p style="color:#5a6478;font-size:12px;margin-top:16px">univerlabmedia.co.kr 문의 폼에서 자동 전송된 메일입니다.</p>
      </div>`;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        subject: `[문의] ${f.brand} - ${f.service}`,
        html,
      }),
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      console.error("[contact] Resend error", resp.status, detail);
      return { status: "failed", error: `Resend ${resp.status} ${detail.slice(0, 300)}` };
    }
    return { status: "sent" };
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return { status: "failed", error: String(err.message || err).slice(0, 300) };
  }
}

export default router;
