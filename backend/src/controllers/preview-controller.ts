import { RequestHandler } from "express";
import mongoose from "mongoose";
import DeployDesign from "../models/deployDesign";

// Preview durumunu güncelleme
export const updatePreviewStatus: RequestHandler = async (req, res, next) => {
  const { launchId } = req.params;
  const { preview } = req.body;

  if (!mongoose.Types.ObjectId.isValid(launchId)) {
    return res.status(400).json({ message: "Geçersiz Launch ID" });
  }

  if (typeof preview !== "boolean") {
    return res.status(400).json({ message: "Geçersiz preview durumu" });
  }

  try {
    // launchId'ye ait tüm DeployDesign belgelerinin preview alanını güncelle
    const result = await DeployDesign.updateMany(
      {
        launchId: new mongoose.Types.ObjectId(launchId),
      },
      {
        $set: { preview },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "DeployDesign bulunamadı" });
    }

    res.status(200).json({
      message: "Preview durumu başarıyla güncellendi",
    });
  } catch (error) {
    next(error);
  }
};

// Preview erişim kontrolü
export const checkPreviewAccess: RequestHandler = async (req, res, next) => {
  const { launchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(launchId)) {
    return res.status(400).json({ message: "Geçersiz Launch ID" });
  }

  try {
    const deployDesign = await DeployDesign.findOne({
      launchId: new mongoose.Types.ObjectId(launchId),
    });

    if (!deployDesign) {
      return res.status(404).json({ message: "DeployDesign bulunamadı" });
    }

    if (!deployDesign.preview) {
      return res
        .status(403)
        .json({ message: "Bu sayfaya erişim izniniz yok." });
    }

    next(); // Eğer erişim izni varsa bir sonraki middleware'e geç
  } catch (error) {
    next(error);
  }
};
