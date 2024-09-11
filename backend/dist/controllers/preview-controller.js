"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPreviewAccess = exports.updatePreviewStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const deployDesign_1 = __importDefault(require("../models/deployDesign"));
// Preview durumunu güncelleme
const updatePreviewStatus = async (req, res, next) => {
    const { launchId } = req.params;
    const { preview } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(launchId)) {
        return res.status(400).json({ message: "Geçersiz Launch ID" });
    }
    if (typeof preview !== "boolean") {
        return res.status(400).json({ message: "Geçersiz preview durumu" });
    }
    try {
        // launchId'ye ait tüm DeployDesign belgelerinin preview alanını güncelle
        const result = await deployDesign_1.default.updateMany({
            launchId: new mongoose_1.default.Types.ObjectId(launchId),
        }, {
            $set: { preview },
        });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "DeployDesign bulunamadı" });
        }
        res.status(200).json({
            message: "Preview durumu başarıyla güncellendi",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePreviewStatus = updatePreviewStatus;
// Preview erişim kontrolü
const checkPreviewAccess = async (req, res, next) => {
    const { launchId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(launchId)) {
        return res.status(400).json({ message: "Geçersiz Launch ID" });
    }
    try {
        const deployDesign = await deployDesign_1.default.findOne({
            launchId: new mongoose_1.default.Types.ObjectId(launchId),
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
    }
    catch (error) {
        next(error);
    }
};
exports.checkPreviewAccess = checkPreviewAccess;
//# sourceMappingURL=preview-controller.js.map