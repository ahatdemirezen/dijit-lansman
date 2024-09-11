import { Router } from "express";
import {
  createDeployDesign,
  getDeployDesignByLaunchId,
  updateInTrailerStatus,
  deleteDeployDesign,
  updateDeployDesignSequence,
} from "../controllers/deploy-design-controllers";

import {
  checkPreviewAccess,
  updatePreviewStatus,
} from "../controllers/preview-controller";

const router = Router();

// POST isteği - DeployDesign oluşturma
router.post("/:launchId", createDeployDesign);

// GET isteği - DeployDesign getirme
router.get("/:launchId", getDeployDesignByLaunchId);

router.patch("/:launchId/inTrailer", updateInTrailerStatus);

router.delete("/:launchId", deleteDeployDesign);

router.patch("/:launchId/preview", updatePreviewStatus);

router.get("/:launchId/preview", checkPreviewAccess);

router.patch("/:launchId", updateDeployDesignSequence);

export default router;
