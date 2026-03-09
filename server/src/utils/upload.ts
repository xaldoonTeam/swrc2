import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
const rootUpload = path.join(__dirname, "..", "..", uploadDir);

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(rootUpload, "general");
    ensureDir(path.join(rootUpload, "pdfs"));
    ensureDir(path.join(rootUpload, "images"));
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".bin";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    cb(null, name);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

export const uploadPdf = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(rootUpload, "pdfs");
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".pdf";
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(rootUpload, "images");
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Returns public URL path for an uploaded file (e.g. /uploads/pdfs/xxx.pdf). */
export function getFileUrl(filename: string, subdir: "pdfs" | "images" | "general" = "general"): string {
  return `/uploads/${subdir}/${filename}`;
}
