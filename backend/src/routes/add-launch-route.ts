import express from "express";

import * as AddLaunchController from "../controllers/launch-controllers";

const router = express.Router();

router.get("/", AddLaunchController.getAddLaunchHandler);

router.post("/", AddLaunchController.createAddLaunch);

router.get("/:launchId", AddLaunchController.getAddLaunchById);

router.patch("/:launchId", AddLaunchController.updateAddLaunch);

router.delete("/:launchId", AddLaunchController.deleteAddLaunch);

export default router;
