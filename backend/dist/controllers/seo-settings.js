"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeoSettings = exports.createSeoSettings = exports.getSeoSettingsByLaunchId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const seoSettings_1 = __importDefault(require("../models/seoSettings"));
const Launch_1 = __importDefault(require("../models/Launch"));
const getSeoSettingsByLaunchId = async (req, res, next) => {
    const { launchId } = req.params;
    if (!mongoose_1.default.isValidObjectId(launchId)) {
        return res.status(400).json({ message: "Invalid launchId format" });
    }
    try {
        const launch = await Launch_1.default.findById(launchId);
        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }
        const seoSettings = await seoSettings_1.default.findOne({ launchId });
        if (!seoSettings) {
            return res.status(404).json({ message: "SEO settings not found" });
        }
        res.status(200).json(seoSettings);
    }
    catch (error) {
        next(error);
    }
};
exports.getSeoSettingsByLaunchId = getSeoSettingsByLaunchId;
const createSeoSettings = async (req, res, next) => {
    const { launchId } = req.params;
    const { title, keywords, description, socialImage, indexStatus, followStatus, launchUrl, } = req.body;
    if (!mongoose_1.default.isValidObjectId(launchId)) {
        return res.status(400).json({ message: "Invalid launchId format" });
    }
    try {
        const launch = await Launch_1.default.findById(launchId);
        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }
        // Belirtilen launchId için mevcut SEO ayarını kontrol et
        let seoSettings = await seoSettings_1.default.findOne({ launchId });
        if (seoSettings) {
            // Eğer launchId'ye ait SEO ayarı varsa güncelleme yap
            seoSettings = await seoSettings_1.default.findOneAndUpdate({ launchId }, {
                title,
                keywords,
                description,
                socialImage,
                indexStatus,
                followStatus,
                launchUrl,
            }, { new: true, runValidators: true });
            return res.status(200).json(seoSettings); // Güncellenmiş SEO ayarını döndür
        }
        // Eğer launchId'ye ait SEO ayarı yoksa, yeni bir tane oluştur
        const newSeoSettings = await seoSettings_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createSeoSettings = createSeoSettings;
const updateSeoSettings = async (req, res, next) => {
    const { launchId, seoId } = req.params;
    const updateData = req.body;
    if (!mongoose_1.default.isValidObjectId(launchId) || !mongoose_1.default.isValidObjectId(seoId)) {
        return res
            .status(400)
            .json({ message: "Invalid launchId or seoId format" });
    }
    try {
        const launch = await Launch_1.default.findById(launchId);
        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }
        const updatedSeoSettings = await seoSettings_1.default.findOneAndUpdate({ _id: seoId, launchId }, { $set: updateData }, { new: true, runValidators: true });
        if (!updatedSeoSettings) {
            return res.status(404).json({
                message: "SEO settings not found or does not belong to the specified launchId",
            });
        }
        res.status(200).json(updatedSeoSettings);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSeoSettings = updateSeoSettings;
//# sourceMappingURL=seo-settings.js.map