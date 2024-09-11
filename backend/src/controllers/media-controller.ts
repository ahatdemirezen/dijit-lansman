import { RequestHandler } from "express";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import mime from "mime-types";

dotenv.config();

// S3 Client oluşturma
const s3 = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Tüm dosyaları listeleme
export const listAllMedia: RequestHandler = async (req, res, next) => {
  try {
    const listParams = {
      Bucket: process.env.BUCKET_NAME,
    };

    const data = await s3.send(new ListObjectsV2Command(listParams));

    res.status(200).json(data.Contents); // Tüm dosyaların listesini döndür
  } catch (error) {
    next(error);
  }
};

// Medya yükleme
// Backend'deki createMedia fonksiyonu
export const createMedia: RequestHandler = async (req, res, next) => {
  const { mediaName } = req.body; // mediaUploadOrLink yerine sadece mediaName alınıyor olabilir.
  const mediaUploadOrLink = req.file; // Eğer dosya yüklemesi yapıyorsanız, dosya multer gibi bir middleware ile işleniyor olmalı

  if (!mediaUploadOrLink || !mediaName) {
    return res.status(400).json({ message: "Gerekli alanlar eksik" });
  }

  const key = `${mediaName}`; // Sabit key değeri "ahat"
  const contentType = mime.lookup(mediaName) || "application/octet-stream"; // MIME türünü otomatik olarak belirle

  try {
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: mediaUploadOrLink.buffer, // Multer kullanılıyorsa bu şekilde erişebilirsiniz
      ContentType: contentType, // Dinamik olarak belirlenen ContentType
    };

    await s3.send(new PutObjectCommand(uploadParams));

    res.status(201).json({ message: "Medya başarıyla oluşturuldu", key });
  } catch (error) {
    next(error);
  }
};

// Medya silme
export const deleteMedia: RequestHandler = async (req, res, next) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ message: "Medya anahtarı eksik" });
  }

  try {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    res.status(200).json({ message: "Medya başarıyla silindi" });
  } catch (error) {
    next(error);
  }
};
