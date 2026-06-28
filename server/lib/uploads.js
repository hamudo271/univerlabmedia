import multer from "multer";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Railway Volume mounts at /app/uploads in production. Locally we fall back
// to a `uploads/` directory at the project root.
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/** In-memory multer — we pipe the buffer through sharp before writing. */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter(req, file, cb) {
    if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

/**
 * Resize (max 2000px on longest edge) + convert to webp.
 * Returns metadata needed to insert into the `uploads` table and serve publicly.
 */
export async function processAndSaveImage(buffer) {
  const id = crypto.randomUUID();
  const filename = `${id}.webp`;
  const outPath = path.join(UPLOAD_DIR, filename);

  const pipeline = sharp(buffer, { failOnError: false })
    .rotate() // honor EXIF orientation
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 });

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  fs.writeFileSync(outPath, data);

  return {
    id,
    filename,
    mime: "image/webp",
    size: data.length,
    width: info.width,
    height: info.height,
    url: `/uploads/${filename}`,
  };
}
