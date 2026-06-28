import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-insecure-change-me";
const ISSUER = "univerlab";
const EXPIRES_IN = "24h";

if (!process.env.JWT_SECRET) {
  console.warn(
    "[jwt] JWT_SECRET is not set. Using an insecure dev default. Set JWT_SECRET in production."
  );
}

/** Sign a short-lived admin token. */
export function signAdminToken(payload = {}) {
  return jwt.sign({ ...payload, role: "admin" }, SECRET, {
    issuer: ISSUER,
    expiresIn: EXPIRES_IN,
  });
}

/** Verify a token and return the decoded payload, or throw. */
export function verifyToken(token) {
  return jwt.verify(token, SECRET, { issuer: ISSUER });
}
