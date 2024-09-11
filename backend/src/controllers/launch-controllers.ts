import { RequestHandler } from "express";
import addLaunchModel from "../models/Launch";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { getAddLaunch } from "../services/add-launch-service";
import seoSettingsModel from "../models/seoSettings";
import deployDesign from "../models/deployDesign";

import {
  UpdateLaunchParams,
  UpdateAddLaunchBody,
  GetLaunchParams,
} from "../interfaces/interfaces";

const fetchAddLaunch = getAddLaunch(addLaunchModel);

export const getAddLaunchHandler: RequestHandler = async (req, res, next) => {
  try {
    const addLaunchData = await fetchAddLaunch();
    res.status(200).json(addLaunchData);
  } catch (error) {
    next(error);
  }
};

export const getAddLaunchById: RequestHandler<GetLaunchParams> = async (
  req,
  res,
  next
) => {
  const { launchId } = req.params;

  try {
    if (!mongoose.isValidObjectId(launchId)) {
      throw createHttpError(400, "Invalid launchId format");
    }

    const addLaunch = await addLaunchModel.findById(launchId).exec();

    if (!addLaunch) {
      throw createHttpError(404, "Launch not found");
    }

    res.status(200).json(addLaunch);
  } catch (error) {
    next(error);
  }
};

export const createAddLaunch: RequestHandler = async (req, res, next) => {
  const {
    launchName,
    language,
    groupNumber,
    companyName,
    companyLogo,
    launchDate, // launchDate'i ekleyin
    endDate, // endDate'i ekleyin
    sequenceNumber,
    isActive,
    showOnHomepage,
  } = req.body;

  try {
    const newAddLaunch = await addLaunchModel.create({
      launchName,
      language,
      groupNumber,
      companyName,
      companyLogo,
      launchDate, // Date objesi yerine direkt string olarak kaydediyoruz
      endDate, // Date objesi yerine direkt string olarak kaydediyoruz
      sequenceNumber,
      isActive,
      showOnHomepage,
    });

    res.status(201).json(newAddLaunch);
  } catch (error) {
    next(error);
  }
};

export const updateAddLaunch: RequestHandler<
  UpdateLaunchParams,
  unknown,
  UpdateAddLaunchBody,
  unknown
> = async (req, res, next) => {
  const { launchId } = req.params;
  const updateData = req.body;

  try {
    if (!mongoose.isValidObjectId(launchId)) {
      throw createHttpError(400, "Invalid launchId");
    }

    // Tarihleri string olarak kaydedin
    const updatedAddLaunch = await addLaunchModel.findByIdAndUpdate(
      launchId,
      { $set: updateData }, // Date objesi yerine direkt string olarak kaydediyoruz
      { new: true, runValidators: true }
    );

    if (!updatedAddLaunch) {
      throw createHttpError(404, "Launch not found");
    }

    res.status(200).json(updatedAddLaunch);
  } catch (error) {
    next(error);
  }
};

export const deleteAddLaunch: RequestHandler = async (req, res, next) => {
  const { launchId } = req.params;

  try {
    if (!mongoose.isValidObjectId(launchId)) {
      throw createHttpError(400, "Invalid launchId");
    }

    // İlk olarak, ana lansmanı silin
    const deletedLaunch = await addLaunchModel.findByIdAndDelete(launchId);

    if (!deletedLaunch) {
      throw createHttpError(404, "Launch not found");
    }

    await seoSettingsModel.deleteMany({ launchId }); 
    await deployDesign.deleteMany({ launchId });

    res
      .status(200)
      .json({ message: "Launch and related data deleted successfully" });
  } catch (error) {
    next(error);
  }
};
