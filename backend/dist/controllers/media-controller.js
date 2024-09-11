"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.createMedia = exports.listAllMedia = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const mime_types_1 = __importDefault(require("mime-types"));
dotenv_1.default.config();
// S3 Client oluşturma
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
// Tüm dosyaları listeleme
const listAllMedia = async (req, res, next) => {
    try {
        const listParams = {
            Bucket: process.env.BUCKET_NAME,
        };
        const data = await s3.send(new client_s3_1.ListObjectsV2Command(listParams));
        res.status(200).json(data.Contents); // Tüm dosyaların listesini döndür
    }
    catch (error) {
        next(error);
    }
};
exports.listAllMedia = listAllMedia;
// Medya yükleme
// Backend'deki createMedia fonksiyonu
const createMedia = async (req, res, next) => {
    const { mediaName } = req.body; // mediaUploadOrLink yerine sadece mediaName alınıyor olabilir.
    const mediaUploadOrLink = req.file; // Eğer dosya yüklemesi yapıyorsanız, dosya multer gibi bir middleware ile işleniyor olmalı
    if (!mediaUploadOrLink || !mediaName) {
        return res.status(400).json({ message: "Gerekli alanlar eksik" });
    }
    const key = `${mediaName}`; // Sabit key değeri "ahat"
    const contentType = mime_types_1.default.lookup(mediaName) || "application/octet-stream"; // MIME türünü otomatik olarak belirle
    try {
        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: mediaUploadOrLink.buffer, // Multer kullanılıyorsa bu şekilde erişebilirsiniz
            ContentType: contentType, // Dinamik olarak belirlenen ContentType
        };
        await s3.send(new client_s3_1.PutObjectCommand(uploadParams));
        res.status(201).json({ message: "Medya başarıyla oluşturuldu", key });
    }
    catch (error) {
        next(error);
    }
};
exports.createMedia = createMedia;
// Medya silme
const deleteMedia = async (req, res, next) => {
    const { key } = req.body;
    if (!key) {
        return res.status(400).json({ message: "Medya anahtarı eksik" });
    }
    try {
        const deleteParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        };
        await s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        res.status(200).json({ message: "Medya başarıyla silindi" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMedia = deleteMedia;
//# sourceMappingURL=media-controller.js.map