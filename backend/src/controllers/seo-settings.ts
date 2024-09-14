import { RequestHandler } from "express";
import mongoose from "mongoose";
import seoSettingsModel from "../models/seoSettings";
import launchModel from "../models/Launch";
import {
  UpdateSeoSettingsParams,
  UpdateSeoSettingsBody,
} from "../interfaces/interfaces";

export const getSeoSettingsByLaunchId: RequestHandler = async (
  req,
  res,
  next
) => {
  const { launchId } = req.params;

  if (!mongoose.isValidObjectId(launchId)) {
    return res.status(400).json({ message: "Invalid launchId format" });
  }

  try {
    const launch = await launchModel.findById(launchId);
    if (!launch) {
      return res.status(404).json({ message: "Launch not found" });
    }

    const seoSettings = await seoSettingsModel.findOne({ launchId });
    if (!seoSettings) {
      return res.status(404).json({ message: "SEO settings not found" });
    }

    res.status(200).json(seoSettings);
  } catch (error) {
    next(error);
  }
};

export const createSeoSettings: RequestHandler = async (req, res, next) => {
  const { launchId } = req.params;
  const {
    title,
    keywords,
    description,
    socialImage,
    indexStatus,
    followStatus,
    launchUrl,
  } = req.body;

  if (!mongoose.isValidObjectId(launchId)) {
    return res.status(400).json({ message: "Invalid launchId format" });
  }

  try {
    const launch = await launchModel.findById(launchId);
    if (!launch) {
      return res.status(404).json({ message: "Launch not found" });
    }

    // Belirtilen launchId için mevcut SEO ayarını kontrol et
    let seoSettings = await seoSettingsModel.findOne({ launchId });

    if (seoSettings) {
      // Eğer launchId'ye ait SEO ayarı varsa güncelleme yap
      seoSettings = await seoSettingsModel.findOneAndUpdate(
        { launchId },
        {
          title,
          keywords,
          description,
          socialImage,
          indexStatus,
          followStatus,
          launchUrl,
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json(seoSettings); // Güncellenmiş SEO ayarını döndür
    }

    // Eğer launchId'ye ait SEO ayarı yoksa, yeni bir tane oluştur
    const newSeoSettings = await seoSettingsModel.create({
      launchId,
      title,
      keywords,
      description,
      socialImage,
      indexStatus,
      followStatus,
      launchUrl,
    });

    res.status(201).json(newSeoSettings);
  } catch (error) {
    next(error);
  }
};

export const updateSeoSettings: RequestHandler<
  UpdateSeoSettingsParams,
  unknown,
  UpdateSeoSettingsBody
> = async (req, res, next) => {
  const { launchId, seoId } = req.params;
  const updateData = req.body;

  if (!mongoose.isValidObjectId(launchId) || !mongoose.isValidObjectId(seoId)) {
    return res
      .status(400)
      .json({ message: "Invalid launchId or seoId format" });
  }

  try {
    const launch = await launchModel.findById(launchId);
    if (!launch) {
      return res.status(404).json({ message: "Launch not found" });
    }

    const updatedSeoSettings = await seoSettingsModel.findOneAndUpdate(
      { _id: seoId, launchId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSeoSettings) {
      return res.status(404).json({
        message:
          "SEO settings not found or does not belong to the specified launchId",
      });
    }

    res.status(200).json(updatedSeoSettings);
  } catch (error) {
    next(error);
  }
};

export const getAllSeoSettings: RequestHandler = async (req, res, next) => {
  try {
    const allSeoSettings = await seoSettingsModel.find();

    if (!allSeoSettings || allSeoSettings.length === 0) {
      return res.status(404).json({ message: "No SEO settings found" });
    }

    res.status(200).json(allSeoSettings);
  } catch (error) {
    next(error);
  }
};
