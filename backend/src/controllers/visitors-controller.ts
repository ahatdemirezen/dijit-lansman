import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config(); // .env dosyasından değerleri yükler

// .env dosyasından ortam değişkenleri alınır, eğer yoksa default değerler kullanılır
const EMAIL_USER = process.env.EMAIL_USER || "default_email_user";
const EMAIL_PASS = process.env.EMAIL_PASS || "default_email_pass";
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.office365.com";
const EMAIL_PORT = process.env.EMAIL_PORT
  ? parseInt(process.env.EMAIL_PORT)
  : 587;

// E-posta ayarları
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // TLS kullanımı için false
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Tek API fonksiyonu
export const handleVisitorProcess = async (req: Request, res: Response) => {
  const { email, action, code, token } = req.body;

  if (action === "sendEmail") {
    // Doğrulama kodu gönderme işlemi
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6 haneli doğrulama kodu

    try {
      // E-posta gönder
      await transporter.sendMail({
        from: EMAIL_USER,
        to: email,
        subject: "Doğrulama Kodu",
        text: `Ziyaretçi paneli doğrulama kodunuz: ${verificationCode}`,
      });

      // Doğrulama kodunu JWT token içinde 10 dakika geçerli olacak şekilde saklayalım
      const token = jwt.sign({ verificationCode }, JWT_SECRET, {
        expiresIn: "6h",
      });

      res.status(200).json({ message: "Doğrulama kodu gönderildi", token });
    } catch (error) {
      res.status(500).json({ error: "E-posta gönderilemedi" });
    }
  } else if (action === "verifyCode") {
    // Doğrulama kodu kontrolü ve JWT token oluşturma
    try {
      // JWT token doğrulama
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // Doğrulama kodunu kontrol et
      if (decoded.verificationCode === parseInt(code)) {
        // Kullanıcıya 6 saatlik bir JWT token ver
        const userToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "6h" });

        res
          .status(200)
          .json({ message: "Doğrulama başarılı", token: userToken });
      } else {
        res.status(400).json({ message: "Geçersiz doğrulama kodu" });
      }
    } catch (error) {
      res.status(401).json({ message: "Token geçersiz veya süresi dolmuş" });
    }
  } else {
    res.status(400).json({ message: "Geçersiz işlem" });
  }
};
