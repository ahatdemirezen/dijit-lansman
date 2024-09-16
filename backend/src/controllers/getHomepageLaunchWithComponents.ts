import { Request, Response } from "express";
import Launch from "../models/Launch";
import ComponentItem from "../models/deployDesign";

// Anasayfada gösterilen lansmanı ve ona ait bileşenleri getirir
export const getHomepageLaunchWithComponents = async (
  req: Request,
  res: Response
) => {
  try {
    // 'showOnHomepage' true olan aktif lansmanı buluyoruz
    const homepageLaunch = await Launch.findOne({ showOnHomepage: true });

    // Eğer böyle bir lansman bulunamazsa 404 döneriz
    if (!homepageLaunch) {
      return res
        .status(404)
        .json({ message: "Anasayfada gösterilecek lansman bulunamadı." });
    }

    // Lansmanın ID'sini alıyoruz
    const launchId = homepageLaunch._id;

    // Bu lansmana ait tüm bileşenleri buluyoruz ve sequenceNumber'a göre sıralıyoruz
    const components = await ComponentItem.find({ launchId }).sort({
      sequenceNumber: 1,
    });

    // Eğer bileşen bulunamazsa 404 döneriz
    if (!components.length) {
      return res
        .status(404)
        .json({ message: "Bu lansmana ait bileşen bulunamadı." });
    }

    // Lansman ve bileşen bilgilerini JSON formatında gönderiyoruz
    res.status(200).json({
      launchId,
      launchDetails: homepageLaunch, // Lansmanın tüm detayları
      components, // Bu lansmana ait bileşenler
    });
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    res
      .status(500)
      .json({ message: "Veriler çekilirken bir hata oluştu.", error });
  }
};
