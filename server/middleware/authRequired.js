import { verifyToken } from "../lib/jwt.js";

/**
 * Express middleware that requires a valid admin JWT in the
 * `Authorization: Bearer <token>` header. Attaches `req.user`.
 */
export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
