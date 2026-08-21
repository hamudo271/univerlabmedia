import { Router } from "express";
import { defaults } from "../../shared/content-defaults.js";

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

/**
 * POST /api/contact
 * Receives a contact-form submission and emails it via Resend.
 * Body: { brand, manager, position, phone, channel, biz, bench,
 *         budget, service, reason, goal, source, consent, _hp }
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

    if (!RESEND_API_KEY) {
      console.warn("[contact] RESEND_API_KEY not set — cannot send email.");
      return res.status(503).json({ error: "메일 발송이 아직 설정되지 않았습니다. 잠시 후 다시 시도해주세요." });
    }

    const rows = [
      ["브랜드명", b.brand],
      ["담당자 성함", b.manager],
      ["담당자 직책", b.position || "-"],
      ["연락처", b.phone],
      ["운영 채널 URL", b.channel],
      ["사업체 소개", b.biz],
      ["벤치마킹 채널 URL", b.bench],
      ["월 예산", labelOf(form.budgetOptions, b.budget)],
      ["원하는 서비스", labelOf(form.serviceOptions, b.service)],
      ["의뢰 이유", b.reason],
      ["유튜브 운영 이유", b.goal],
      ["유입 경로", labelOf(form.sourceOptions, b.source)],
    ];

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
        <p style="color:#5a6478;font-size:12px;margin-top:16px">univerlabmedia.co.kr 문의 폼에서 자동 전송된 메일입니다.</p>
      </div>`;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        subject: `[문의] ${b.brand} - ${labelOf(form.serviceOptions, b.service)}`,
        html,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      console.error("[contact] Resend error", resp.status, detail);
      return res.status(502).json({ error: "메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
