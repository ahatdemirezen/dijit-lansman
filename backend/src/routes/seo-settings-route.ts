import express from "express";
import * as SeoSettingsController from "../controllers/seo-settings";

const router = express.Router();

router.post("/:launchId", SeoSettingsController.createSeoSettings);

// Belirli bir launchId'ye göre SEO ayarlarını getirme
router.get("/:launchId", SeoSettingsController.getSeoSettingsByLaunchId);

// Belirli bir launchId'ye göre SEO ayarlarını güncelleme
router.patch("/:launchId/:seoId", SeoSettingsController.updateSeoSettings);

export default router;
