import express from "express";
import { handleVisitorProcess } from "../controllers/visitors-controller";

const router = express.Router();

// Tek endpoint ile iki işlemi yönet
router.post("/process", handleVisitorProcess);

export default router;
