import { Request, Response } from "express";
import User from "../models/login";
import axios from "axios";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret"; // .env dosyasından JWT_SECRET alınır

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined in the environment variables");
}

// Kullanıcı oluşturma kontrolcüsü ve doğrulama
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Firmanın API'sine POST isteği gönder
    const apiResponse = await axios.post(API_URL, { email, password });

    // Eğer firmanın API'sinden olumlu yanıt geldiyse
    if (apiResponse.status === 200) {
      const newUser = new User({ email, password });
      await newUser.save();

      // Firma API'sinden dönen verileri alın
      const { role } = apiResponse.data;

      // Eğer role "company-admin" ise JWT oluştur
      let token;
      if (role === "company-admin") {
        token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: "1h" });
      }

      // Firma API'sinden dönen tüm veriyi ve varsa token'ı kullanıcıya ilet
      res.status(200).json({ ...apiResponse.data, token });
    } else {
      // Firma API'si başarısız yanıt verdiyse hata dön
      res
        .status(apiResponse.status)
        .json({ message: "Kullanıcı doğrulanamadı", error: apiResponse.data });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res
        .status(error.response.status)
        .json({ message: "Firma API'si hatası", error: error.response.data });
    } else {
      res.status(500).json({ message: "Sunucu hatası", error });
    }
  }
};
