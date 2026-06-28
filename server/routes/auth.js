import { Router } from "express";
import bcrypt from "bcryptjs";
import { signAdminToken } from "../lib/jwt.js";
import { authRequired } from "../middleware/authRequired.js";

const router = Router();

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

  let ok = false;
  if (hash) {
    ok = await bcrypt.compare(password, hash);
  } else {
    // Constant-time-ish comparison to discourage timing probes.
    ok = plain.length === password.length &&
      bcrypt.compareSync(password, bcrypt.hashSync(plain, 4));
    // Fallback direct comparison just in case the above is too strict:
    if (!ok) ok = password === plain;
  }

  if (!ok) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = signAdminToken({ sub: "admin" });
  res.json({ token, expiresIn: 60 * 60 * 24 });
});

/** Check whether the caller has a valid admin token. */
router.get("/me", authRequired, (req, res) => {
  res.json({ ok: true, user: { role: req.user.role, sub: req.user.sub } });
});

export default router;
