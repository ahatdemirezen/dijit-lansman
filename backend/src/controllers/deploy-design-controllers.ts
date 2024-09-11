import { RequestHandler } from "express";
import mongoose from "mongoose";
import DeployDesign from "../models/deployDesign";
import launchModel from "../models/Launch";

// LaunchId'ye göre DeployDesign'leri getirme
// LaunchId'ye göre DeployDesign'leri getirme
export const getDeployDesignByLaunchId: RequestHandler = async (
  req,
  res,
  next
) => {
  const { launchId } = req.params;

  if (!mongoose.isValidObjectId(launchId)) {
    return res.status(400).json({ message: "Invalid launchId format" });
  }

  try {
    const launch = await launchModel.findById(launchId);
    if (!launch) {
      return res.status(404).json({ message: "Launch not found" });
    }

    // DeployDesign'leri sequenceNumber'a göre sıralı olarak getiriyoruz
    const deployDesigns = await DeployDesign.find({
      launchId: new mongoose.Types.ObjectId(launchId),
    }).sort({ sequenceNumber: 1 });

    if (deployDesigns.length === 0) {
      return res.status(404).json({ message: "No DeployDesigns found" });
    }

    res.status(200).json(deployDesigns);
  } catch (error) {
    next(error);
  }
};

// DeployDesign kaydı oluşturma
export const createDeployDesign: RequestHandler = async (req, res, next) => {
  const { launchId } = req.params;
  const { name, inTrailer, preview, content, type } = req.body; // type alanı da body'den alınıyor

  if (!mongoose.Types.ObjectId.isValid(launchId)) {
    return res.status(400).json({ message: "Geçersiz Launch ID" });
  }

  try {
    const launch = await launchModel.findById(launchId);
    if (!launch) {
      return res.status(404).json({ message: "Launch not found" });
    }

    // Aynı launchId'ye sahip en yüksek sequenceNumber'ı bul
    const lastDeployDesign = await DeployDesign.findOne({ launchId: launchId })
      .sort("-sequenceNumber")
      .exec();

    // Yeni sequenceNumber'ı belirle
    let newSequenceNumber = 1;
    if (lastDeployDesign && lastDeployDesign.sequenceNumber) {
      newSequenceNumber = lastDeployDesign.sequenceNumber + 1;
    }

    // DeployDesign belgesini oluşturuyoruz
    const newDeployDesign = await DeployDesign.create({
      launchId: new mongoose.Types.ObjectId(launchId),
      name, // deployDesign alt dokümanı yerine doğrudan schema alanları
      inTrailer,
      preview,
      content, // components yerine content
      type, // type alanını burada kullanıyoruz
      sequenceNumber: newSequenceNumber, // Yeni sequenceNumber ekleniyor
    });

    res.status(201).json(newDeployDesign);
  } catch (error) {
    next(error);
  }
};

// inTrailer durumunu güncelleme
export const updateInTrailerStatus: RequestHandler = async (req, res, next) => {
  const { launchId } = req.params;
  const { id, inTrailer } = req.body; // id ve inTrailer değerlerini body'den alıyoruz

  if (!mongoose.Types.ObjectId.isValid(launchId)) {
    return res.status(400).json({ message: "Geçersiz Launch ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Geçersiz DeployDesign ID" });
  }

  try {
    const deployDesign = await DeployDesign.findOneAndUpdate(
      {
        launchId: new mongoose.Types.ObjectId(launchId),
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $set: { inTrailer }, // Sadece inTrailer alanını güncelliyoruz
      },
      { new: true }
    );

    if (!deployDesign) {
      return res.status(404).json({ message: "DeployDesign not found" });
    }

    res.status(200).json({
      message: "inTrailer durumu başarıyla güncellendi",
      deployDesign,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDeployDesign: RequestHandler = async (req, res, next) => {
  const { launchId } = req.params;
  const { id } = req.body; // DeployDesign ID'sini body'den alıyoruz

  if (!mongoose.Types.ObjectId.isValid(launchId)) {
    return res.status(400).json({ message: "Geçersiz Launch ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Geçersiz DeployDesign ID" });
  }

  try {
    const result = await DeployDesign.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      launchId: new mongoose.Types.ObjectId(launchId),
    });

    if (!result) {
      return res.status(404).json({ message: "DeployDesign not found" });
    }

    res.status(200).json({ message: "DeployDesign başarıyla silindi" });
  } catch (error) {
    next(error);
  }
};

// Sıra güncelleme işlemi
export const updateDeployDesignSequence: RequestHandler = async (
  req,
  res,
  next
) => {
  const { launchId } = req.params;
  const { id, newSequenceNumber } = req.body; // yeni sequenceNumber değeri ve ID body'den alınır

  if (!mongoose.Types.ObjectId.isValid(launchId)) {
    return res.status(400).json({ message: "Geçersiz Launch ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Geçersiz DeployDesign ID" });
  }

  if (typeof newSequenceNumber !== "number" || newSequenceNumber < 1) {
    return res.status(400).json({ message: "Geçersiz yeni sıra numarası" });
  }

  try {
    const deployDesign = await DeployDesign.findOne({
      launchId: new mongoose.Types.ObjectId(launchId),
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!deployDesign) {
      return res.status(404).json({ message: "DeployDesign not found" });
    }

    const currentSequenceNumber = deployDesign.sequenceNumber;

    // Eğer yeni sıra numarası mevcut sıra numarasından farklıysa güncellemeyi yap
    if (newSequenceNumber !== currentSequenceNumber) {
      // Aşağıdaki diğer DeployDesign kayıtlarının sıralamasını güncelle
      if (newSequenceNumber > currentSequenceNumber) {
        await DeployDesign.updateMany(
          {
            launchId: new mongoose.Types.ObjectId(launchId),
            sequenceNumber: {
              $gt: currentSequenceNumber,
              $lte: newSequenceNumber,
            },
          },
          { $inc: { sequenceNumber: -1 } }
        );
      } else if (newSequenceNumber < currentSequenceNumber) {
        await DeployDesign.updateMany(
          {
            launchId: new mongoose.Types.ObjectId(launchId),
            sequenceNumber: {
              $gte: newSequenceNumber,
              $lt: currentSequenceNumber,
            },
          },
          { $inc: { sequenceNumber: 1 } }
        );
      }

      // Seçili DeployDesign kaydının sıra numarasını güncelle
      deployDesign.sequenceNumber = newSequenceNumber;
      await deployDesign.save();
    }

    res.status(200).json({ message: "Sıra numarası başarıyla güncellendi" });
  } catch (error) {
    next(error);
  }
};
