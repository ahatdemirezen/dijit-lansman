"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const media_controller_1 = require("../controllers/media-controller");
const router = express_1.default.Router();
// Multer middleware
const upload = (0, multer_1.default)();
// Tüm medya dosyalarını listeleme
router.get("/list", media_controller_1.listAllMedia);
// Yeni medya dosyası oluşturma
router.post("/", upload.single("mediaUploadOrLink"), media_controller_1.createMedia);
// Belirli bir medya dosyasını silme
router.delete("/", media_controller_1.deleteMedia);
exports.default = router;
//# sourceMappingURL=media-route.js.map