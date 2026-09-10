import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { AppError } from "../errors/app-error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.resolve(__dirname, "../../uploads");
export const bannersUploadDir = path.join(uploadsRoot, "banners");

if (!existsSync(bannersUploadDir)) {
  mkdirSync(bannersUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, bannersUploadDir);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
    callback(null, `banner-${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`);
  },
});

function fileFilter(
  _request: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) {
  if (!file.mimetype.startsWith("image/")) {
    callback(new AppError(400, "Only image files are allowed"));
    return;
  }
  callback(null, true);
}

export const bannerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
