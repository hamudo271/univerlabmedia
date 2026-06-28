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
