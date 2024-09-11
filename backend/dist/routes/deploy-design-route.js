"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deploy_design_controllers_1 = require("../controllers/deploy-design-controllers");
const preview_controller_1 = require("../controllers/preview-controller");
const router = (0, express_1.Router)();
// POST isteği - DeployDesign oluşturma
router.post("/:launchId", deploy_design_controllers_1.createDeployDesign);
// GET isteği - DeployDesign getirme
router.get("/:launchId", deploy_design_controllers_1.getDeployDesignByLaunchId);
router.patch("/:launchId/inTrailer", deploy_design_controllers_1.updateInTrailerStatus);
router.delete("/:launchId", deploy_design_controllers_1.deleteDeployDesign);
router.patch("/:launchId/preview", preview_controller_1.updatePreviewStatus);
router.get("/:launchId/preview", preview_controller_1.checkPreviewAccess);
router.patch("/:launchId", deploy_design_controllers_1.updateDeployDesignSequence);
exports.default = router;
//# sourceMappingURL=deploy-design-route.js.map