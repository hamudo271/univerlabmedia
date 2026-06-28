import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { pool, dbAvailable } from "../db.js";
import { authRequired } from "../middleware/authRequired.js";
import { upload, processAndSaveImage, UPLOAD_DIR } from "../lib/uploads.js";

const router = Router();

/**
 * POST /api/uploads (auth)
 * multipart/form-data, field name: "file"
 * Resizes to ≤2000px WEBP and stores on disk + metadata in DB.
 */
router.post("/", authRequired, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "file is required" });

    const meta = await processAndSaveImage(req.file.buffer);

    if (dbAvailable()) {
      await pool.query(
        `INSERT INTO uploads(id, filename, mime, size, width, height)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [meta.id, meta.filename, meta.mime, meta.size, meta.width, meta.height]
      );
    }

    res.status(201).json(meta);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/uploads (auth)
 * Returns uploaded image list, newest first.
 */
router.get("/", authRequired, async (_req, res, next) => {
  try {
    if (!dbAvailable()) {
      // Fallback: list files on disk
      const files = fs
        .readdirSync(UPLOAD_DIR)
        .filter((f) => /\.(webp|png|jpe?g|gif|avif)$/i.test(f))
        .map((filename) => {
          const stat = fs.statSync(path.join(UPLOAD_DIR, filename));
          return {
            filename,
            url: `/uploads/${filename}`,
            size: stat.size,
            createdAt: stat.mtime,
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt);
      return res.json(files);
    }

    const { rows } = await pool.query(
      `SELECT id, filename, mime, size, width, height, created_at
         FROM uploads
         ORDER BY created_at DESC
         LIMIT 500`
    );
    res.json(
      rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        mime: r.mime,
        size: r.size,
        width: r.width,
        height: r.height,
        createdAt: r.created_at,
        url: `/uploads/${r.filename}`,
      }))
    );
  } catch (err) {
    next(err);
  }
});

export default router;
