import express from "express";
import multer from "multer";
import {
  listAllMedia,
  createMedia,
  deleteMedia,
} from "../controllers/media-controller";

const router = express.Router();

// Multer middleware
const upload = multer();

// Tüm medya dosyalarını listeleme
router.get("/list", listAllMedia);

// Yeni medya dosyası oluşturma
router.post("/", upload.single("mediaUploadOrLink"), createMedia);

// Belirli bir medya dosyasını silme
router.delete("/", deleteMedia);

export default router;
