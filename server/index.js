import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runMigrations, seedDefaultsIfMissing } from "./db.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import uploadRoutes from "./routes/uploads.js";
import contactRoutes from "./routes/contact.js";
import { errorHandler, apiNotFound } from "./middleware/errorHandler.js";
import { UPLOAD_DIR } from "./lib/uploads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// --- Global middleware -----------------------------------------------------
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite bundle inlines modules; managed per-asset
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// --- SEO: legacy URL redirects (preserve search rankings on domain switch) -
// The previous WordPress site used different slugs + trailing slashes. Map
// them to the new React routes with 301s so accumulated SEO carries over.
const LEGACY_REDIRECTS = {
  "/portpolio": "/portfolio", // old portfolio slug (typo preserved from WP)
  "/service-2": "/pricing", // old "가격 안내" pointed at /service-2
  "/about": "/company",
  "/work": "/portfolio",
};
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const p = req.path;
  // Skip API, uploads, and any file request (has an extension).
  if (p.startsWith("/api/") || p.startsWith("/uploads/") || p.includes(".")) {
    return next();
  }
  // Normalise trailing slash (except root): /company/ -> /company
  const noSlash = p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  const target = LEGACY_REDIRECTS[noSlash] || (noSlash !== p ? noSlash : null);
  if (target) {
    const qs = req.url.slice(p.length); // preserve query string
    return res.redirect(301, target + qs);
  }
  next();
});

// --- Uploaded images (public) ---------------------------------------------
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    fallthrough: true,
    maxAge: "30d",
    immutable: true,
  })
);

// --- API -------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", apiNotFound);

// --- Static SPA ------------------------------------------------------------
app.use(
  express.static(DIST, {
    index: false, // SPA fallback below handles index.html
    maxAge: "7d",
  })
);

// SPA fallback: send index.html for any non-API route so React Router handles it.
app.get(/^(?!\/api\/|\/uploads\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

// --- Error handler (last) --------------------------------------------------
app.use(errorHandler);

// --- Boot ------------------------------------------------------------------
(async () => {
  try {
    await runMigrations();
    await seedDefaultsIfMissing();
  } catch (err) {
    console.error("[db] migration/seed failed:", err);
    // Keep serving the SPA even if DB is down; admin APIs will 503.
  }

  app.listen(PORT, () => {
    console.log(`[server] listening on :${PORT}`);
    console.log(`[server] serving dist from ${DIST}`);
    console.log(`[server] uploads dir ${UPLOAD_DIR}`);
  });
})();
