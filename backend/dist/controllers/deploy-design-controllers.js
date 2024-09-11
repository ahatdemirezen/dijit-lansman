"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeployDesignSequence = exports.deleteDeployDesign = exports.updateInTrailerStatus = exports.createDeployDesign = exports.getDeployDesignByLaunchId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const deployDesign_1 = __importDefault(require("../models/deployDesign"));
const Launch_1 = __importDefault(require("../models/Launch"));
// LaunchId'ye göre DeployDesign'leri getirme
// LaunchId'ye göre DeployDesign'leri getirme
const getDeployDesignByLaunchId = async (req, res, next) => {
    const { launchId } = req.params;
    if (!mongoose_1.default.isValidObjectId(launchId)) {
        return res.status(400).json({ message: "Invalid launchId format" });
    }
    try {
        const launch = await Launch_1.default.findById(launchId);
        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }
        // DeployDesign'leri sequenceNumber'a göre sıralı olarak getiriyoruz
        const deployDesigns = await deployDesign_1.default.find({
            launchId: new mongoose_1.default.Types.ObjectId(launchId),
        }).sort({ sequenceNumber: 1 });
        if (deployDesigns.length === 0) {
            return res.status(404).json({ message: "No DeployDesigns found" });
        }
        res.status(200).json(deployDesigns);
    }
    catch (error) {
        next(error);
    }
};
exports.getDeployDesignByLaunchId = getDeployDesignByLaunchId;
// DeployDesign kaydı oluşturma
const createDeployDesign = async (req, res, next) => {
    const { launchId } = req.params;
    const { name, inTrailer, preview, content, type } = req.body; // type alanı da body'den alınıyor
    if (!mongoose_1.default.Types.ObjectId.isValid(launchId)) {
        return res.status(400).json({ message: "Geçersiz Launch ID" });
    }
    try {
        const launch = await Launch_1.default.findById(launchId);
        if (!launch) {
            return res.status(404).json({ message: "Launch not found" });
        }
        // Aynı launchId'ye sahip en yüksek sequenceNumber'ı bul
        const lastDeployDesign = await deployDesign_1.default.findOne({ launchId: launchId })
            .sort("-sequenceNumber")
            .exec();
        // Yeni sequenceNumber'ı belirle
        let newSequenceNumber = 1;
        if (lastDeployDesign && lastDeployDesign.sequenceNumber) {
            newSequenceNumber = lastDeployDesign.sequenceNumber + 1;
        }
        // DeployDesign belgesini oluşturuyoruz
        const newDeployDesign = await deployDesign_1.default.create({
            launchId: new mongoose_1.default.Types.ObjectId(launchId),
            name, // deployDesign alt dokümanı yerine doğrudan schema alanları
            inTrailer,
            preview,
            content, // components yerine content
            type, // type alanını burada kullanıyoruz
            sequenceNumber: newSequenceNumber, // Yeni sequenceNumber ekleniyor
        });
        res.status(201).json(newDeployDesign);
    }
    catch (error) {
        next(error);
    }
};
exports.createDeployDesign = createDeployDesign;
// inTrailer durumunu güncelleme
const updateInTrailerStatus = async (req, res, next) => {
    const { launchId } = req.params;
    const { id, inTrailer } = req.body; // id ve inTrailer değerlerini body'den alıyoruz
    if (!mongoose_1.default.Types.ObjectId.isValid(launchId)) {
        return res.status(400).json({ message: "Geçersiz Launch ID" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Geçersiz DeployDesign ID" });
    }
    try {
        const deployDesign = await deployDesign_1.default.findOneAndUpdate({
            launchId: new mongoose_1.default.Types.ObjectId(launchId),
            _id: new mongoose_1.default.Types.ObjectId(id),
        }, {
            $set: { inTrailer }, // Sadece inTrailer alanını güncelliyoruz
        }, { new: true });
        if (!deployDesign) {
            return res.status(404).json({ message: "DeployDesign not found" });
        }
        res.status(200).json({
            message: "inTrailer durumu başarıyla güncellendi",
            deployDesign,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateInTrailerStatus = updateInTrailerStatus;
const deleteDeployDesign = async (req, res, next) => {
    const { launchId } = req.params;
    const { id } = req.body; // DeployDesign ID'sini body'den alıyoruz
    if (!mongoose_1.default.Types.ObjectId.isValid(launchId)) {
        return res.status(400).json({ message: "Geçersiz Launch ID" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Geçersiz DeployDesign ID" });
    }
    try {
        const result = await deployDesign_1.default.findOneAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(id),
            launchId: new mongoose_1.default.Types.ObjectId(launchId),
        });
        if (!result) {
            return res.status(404).json({ message: "DeployDesign not found" });
        }
        res.status(200).json({ message: "DeployDesign başarıyla silindi" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDeployDesign = deleteDeployDesign;
// Sıra güncelleme işlemi
const updateDeployDesignSequence = async (req, res, next) => {
    const { launchId } = req.params;
    const { id, newSequenceNumber } = req.body; // yeni sequenceNumber değeri ve ID body'den alınır
    if (!mongoose_1.default.Types.ObjectId.isValid(launchId)) {
        return res.status(400).json({ message: "Geçersiz Launch ID" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Geçersiz DeployDesign ID" });
    }
    if (typeof newSequenceNumber !== "number" || newSequenceNumber < 1) {
        return res.status(400).json({ message: "Geçersiz yeni sıra numarası" });
    }
    try {
        const deployDesign = await deployDesign_1.default.findOne({
            launchId: new mongoose_1.default.Types.ObjectId(launchId),
            _id: new mongoose_1.default.Types.ObjectId(id),
        });
        if (!deployDesign) {
            return res.status(404).json({ message: "DeployDesign not found" });
        }
        const currentSequenceNumber = deployDesign.sequenceNumber;
        // Eğer yeni sıra numarası mevcut sıra numarasından farklıysa güncellemeyi yap
        if (newSequenceNumber !== currentSequenceNumber) {
            // Aşağıdaki diğer DeployDesign kayıtlarının sıralamasını güncelle
            if (newSequenceNumber > currentSequenceNumber) {
                await deployDesign_1.default.updateMany({
                    launchId: new mongoose_1.default.Types.ObjectId(launchId),
                    sequenceNumber: {
                        $gt: currentSequenceNumber,
                        $lte: newSequenceNumber,
                    },
                }, { $inc: { sequenceNumber: -1 } });
            }
            else if (newSequenceNumber < currentSequenceNumber) {
                await deployDesign_1.default.updateMany({
                    launchId: new mongoose_1.default.Types.ObjectId(launchId),
                    sequenceNumber: {
                        $gte: newSequenceNumber,
                        $lt: currentSequenceNumber,
                    },
                }, { $inc: { sequenceNumber: 1 } });
            }
            // Seçili DeployDesign kaydının sıra numarasını güncelle
            deployDesign.sequenceNumber = newSequenceNumber;
            await deployDesign.save();
        }
        res.status(200).json({ message: "Sıra numarası başarıyla güncellendi" });
    }
    catch (error) {
        next(error);
    }
};
exports.updateDeployDesignSequence = updateDeployDesignSequence;
//# sourceMappingURL=deploy-design-controllers.js.map