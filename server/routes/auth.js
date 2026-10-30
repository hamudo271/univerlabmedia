import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { signAdminToken } from "../lib/jwt.js";
import { authRequired } from "../middleware/authRequired.js";
import { clientIp } from "../lib/attrib.js";

const router = Router();

// ── 로그인 시도 제한 ─────────────────────────────────────────────────────────
// 같은 IP에서 15분 안에 5번 틀리면 그 IP를 15분 잠근다. IP를 바꿔 가며 시도하는
// 경우에 대비해, 전체 실패가 15분에 30번을 넘으면 모든 로그인을 15분 막는다.
// 잠긴 동안에는 비밀번호가 맞아도 들어갈 수 없다. 서버 메모리에만 두므로 재배포하면 풀린다.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_TOTAL = 30;
const failures = new Map(); // key → { n, first, lockedUntil }

function lockedFor(key, now) {
  const f = failures.get(key);
  if (!f) return 0;
  if (f.lockedUntil > now) return f.lockedUntil - now;
  if (now - f.first > WINDOW_MS) failures.delete(key);
  return 0;
}

function recordFailure(key, max, now) {
  let f = failures.get(key);
  if (!f || now - f.first > WINDOW_MS) f = { n: 0, first: now, lockedUntil: 0 };
  f.n += 1;
  if (f.n >= max) f.lockedUntil = now + WINDOW_MS;
  failures.set(key, f);
  return max - f.n;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, f] of failures) {
    if (f.lockedUntil <= now && now - f.first > WINDOW_MS) failures.delete(k);
  }
}, 60_000).unref();

const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest();

/**
 * Single-password admin login.
 *
 * Accepts either:
 *   - ADMIN_PASSWORD_HASH : a bcrypt hash (recommended in production)
 *   - ADMIN_PASSWORD      : a plaintext password (simpler; MVP)
 *
 * If neither is set, login is disabled (503).
 */
router.post("/login", async (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Password required" });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  if (!hash && !plain) {
    return res
      .status(503)
      .json({ error: "Admin password not configured on the server" });
  }

  const now = Date.now();
  const ipKey = `ip:${clientIp(req)}`;
  const wait = Math.max(lockedFor(ipKey, now), lockedFor("*", now));
  if (wait > 0) {
    const min = Math.ceil(wait / 60000);
    res.set("Retry-After", String(Math.ceil(wait / 1000)));
    return res
      .status(429)
      .json({ error: `로그인 시도가 너무 많아 잠시 막혔습니다. ${min}분 뒤에 다시 시도해주세요.` });
  }

  let ok = false;
  if (hash) {
    ok = await bcrypt.compare(password, hash);
  } else {
    // 길이와 상관없이 같은 시간에 비교되도록 해시끼리 비교한다.
    ok = crypto.timingSafeEqual(sha256(password), sha256(plain));
  }

  if (!ok) {
    const left = recordFailure(ipKey, MAX_PER_IP, now);
    recordFailure("*", MAX_TOTAL, now);
    console.warn(`[auth] failed admin login from ${clientIp(req)} (${Math.max(left, 0)} tries left)`);
    return res.status(401).json({
      error:
        left > 0
          ? `비밀번호가 올바르지 않습니다. (${left}번 더 틀리면 15분 동안 잠깁니다)`
          : "비밀번호를 5번 틀려 15분 동안 로그인이 막혔습니다.",
    });
  }

  failures.delete(ipKey);
  const token = signAdminToken({ sub: "admin" });
  res.json({ token, expiresIn: 60 * 60 * 24 });
});

/** Check whether the caller has a valid admin token. */
router.get("/me", authRequired, (req, res) => {
  res.json({ ok: true, user: { role: req.user.role, sub: req.user.sub } });
});

export default router;
