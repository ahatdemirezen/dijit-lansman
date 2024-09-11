import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import generealRoutes from "./routes/add-launch-route";
import seoSettings from "./routes/seo-settings-route";
import media from "./routes/media-route";
import deployDesign from "./routes/deploy-design-route";
import loginRoute from "./routes/login-route";
import morgan from "morgan";
import mongoose from "mongoose";
import { isHttpError } from "http-errors";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";

const app = express();
dotenv.config();
connectDB();

// CORS'u etkinleştir
app.use(
  cors({
    origin: "*", // Bu geçici olarak tüm kaynaklara izin verir. Güvenlik açısından gerçek ortamda uygun bir URL belirtin.
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(morgan("dev"));

// İstek boyutu sınırını arttır
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Homepage!");
});

app.use("/api/launch", generealRoutes);
app.use("/api/media", media);
app.use("/api/seoSettings", seoSettings);
app.use("/api/deployDesign", deployDesign);
app.use("/api/login", loginRoute);

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

// Veritabanı bağlantısını ve sunucuyu başlat
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
