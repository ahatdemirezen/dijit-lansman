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
  const { mediaName, companyName } = req.body; // Firma adı ve medya adı alınıyor
  const mediaUploadOrLink = req.file; // Yüklenen dosya

  if (!mediaUploadOrLink || !mediaName || !companyName) {
    return res
      .status(400)
      .json({ message: "Medya adı ve firma adı zorunludur." });
  }

  const key = `${mediaName}`;
  const contentType = mime.lookup(mediaName) || "application/octet-stream";

  try {
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: mediaUploadOrLink.buffer, // Dosya içeriği burada belirleniyor
      ContentType: contentType, // İçerik türü belirleniyor
      Metadata: {
        companyName, // Firma adı metadata olarak ekleniyor
      },
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
