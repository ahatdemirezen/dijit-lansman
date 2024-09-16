import express from "express";
import { getHomepageLaunchWithComponents } from "../controllers/getHomepageLaunchWithComponents";

const router = express.Router();

// Anasayfa lansmanı ve bileşenlerini almak için yeni route
router.get("/with-components", getHomepageLaunchWithComponents);

export default router;
