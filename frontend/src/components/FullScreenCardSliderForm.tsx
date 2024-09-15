import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import FullScreenCardSection from "../sections/fullScreenCard-section";

interface FullScreenCardSliderFormProps {
  cards: {
    id: number;
    media: string;
    text: string;
    buttonText: string;
    buttonUrl: string;
    logoMedia: string;
  }[];
  onMediaChange: (id: number, e: ChangeEvent<HTMLSelectElement>) => void;
  onTextChange: (id: number, e: ChangeEvent<HTMLInputElement>) => void;
  onButtonTextChange: (id: number, e: ChangeEvent<HTMLInputElement>) => void;
  onButtonUrlChange: (id: number, e: ChangeEvent<HTMLInputElement>) => void;
  onLogoMediaChange: (id: number, e: ChangeEvent<HTMLSelectElement>) => void;
  onAddCard: () => void;
  onRemoveCard: (id: number) => void;
}

const FullScreenCardSliderForm: React.FC<FullScreenCardSliderFormProps> = ({
  cards,
  onMediaChange,
  onTextChange,
  onButtonTextChange,
  onButtonUrlChange,
  onLogoMediaChange,
  onAddCard,
  onRemoveCard,
}) => {
  const [mediaList, setMediaList] = useState<
    { key: string; launchName: string }[]
  >([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [isLogoMediaModalOpen, setIsLogoMediaModalOpen] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [logoSearchTerm, setLogoSearchTerm] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => ({
          key: media.Key,
          launchName: media.launchName,
        }));
        setMediaList(mediaNames);
      } catch (error) {
        console.error("Medya listesi alınamadı:", error);
      }
    };

    fetchMediaList();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsMediaModalOpen(false);
        setIsLogoMediaModalOpen(false);
      }
    };

    if (isMediaModalOpen || isLogoMediaModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMediaModalOpen, isLogoMediaModalOpen]);

  const renderFilePreview = (file: string) => {
    const fileType = file.split(".").pop()?.toLowerCase();
    const previewStyle = "w-full h-32 object-cover mb-2";

    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "svg":
      case "webp":
      case "avif":
        return (
          <img
            src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${file}`}
            alt={file}
            className={previewStyle}
          />
        );
      case "mp4":
      case "webm":
      case "ogg":
      case "avi":
      case "mov":
      case "mkv":
        return (
          <video controls className={previewStyle}>
            <source
              src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${file}`}
              type={`video/${fileType}`}
            />
            Tarayıcınız bu videoyu oynatmayı desteklemiyor.
          </video>
        );
      default:
        return (
          <p className="text-center">
            Desteklenmeyen dosya formatı: {fileType}
          </p>
        );
    }
  };

  const handleMediaSelect = (selectedMedia: string) => {
    if (selectedCardId !== null) {
      onMediaChange(selectedCardId, {
        target: { value: selectedMedia },
      } as ChangeEvent<HTMLSelectElement>);
    }
    setIsMediaModalOpen(false);
  };

  const handleLogoMediaSelect = (selectedLogoMedia: string) => {
    if (selectedCardId !== null) {
      onLogoMediaChange(selectedCardId, {
        target: { value: selectedLogoMedia },
      } as ChangeEvent<HTMLSelectElement>);
    }
    setIsLogoMediaModalOpen(false);
  };

  const filteredMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediaItem.launchName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogoMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(logoSearchTerm.toLowerCase()) ||
      mediaItem.launchName?.toLowerCase().includes(logoSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center">
      <div
        className="p-4 border rounded-lg"
        style={{
          width: "426px",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "rgba(16, 24, 40, 0.05)",
          borderRadius: "8px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="mb-4 p-4 bg-[#DFE2E6] border border-[#D1D5DB] rounded-lg"
            style={{
              width: "350px",
              borderRadius: "10px",
              marginTop: "24px",
              marginLeft: "-5px",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#7A8699",
                }}
              >
                Full Screen Card {card.id}
              </h3>
              <button
                onClick={() => onRemoveCard(card.id)}
                className="text-[#6B7280] hover:text-[#374151] text-xl"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">Medya</label>
              <input
                type="text"
                readOnly
                value={card.media || "Medya Seç"}
                onClick={() => {
                  setSelectedCardId(card.id);
                  setIsMediaModalOpen(true);
                }}
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#4B5563]"
                style={{
                  width: "288px",
                  height: "50px",
                  borderRadius: "8px",
                }}
              />
              <p
                style={{ color: "#667085", fontSize: "12px", marginTop: "4px" }}
              >
                <span style={{ color: "red" }}>*</span>1250x750(px)
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Yazı Alanı
              </label>
              <input
                type="text"
                value={card.text}
                onChange={(e) => onTextChange(card.id, e)}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1F2937]"
                style={{
                  width: "288px",
                  height: "50px",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Buton Adı
              </label>
              <input
                type="text"
                value={card.buttonText}
                onChange={(e) => onButtonTextChange(card.id, e)}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1F2937]"
                style={{
                  width: "288px",
                  height: "50px",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Buton Url
              </label>
              <input
                type="text"
                value={card.buttonUrl}
                onChange={(e) => onButtonUrlChange(card.id, e)}
                placeholder="Input"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1F2937]"
                style={{
                  width: "288px",
                  height: "50px",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#1F2937] mb-1">
                Logo Medya Alanı
              </label>
              <input
                type="text"
                readOnly
                value={card.logoMedia || "Logo Medya Seç"}
                onClick={() => {
                  setSelectedCardId(card.id);
                  setIsLogoMediaModalOpen(true);
                }}
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#4B5563]"
                style={{
                  width: "288px",
                  height: "50px",
                  borderRadius: "8px",
                }}
              />
              <p
                style={{ color: "#667085", fontSize: "12px", marginTop: "4px" }}
              >
                <span style={{ color: "red" }}>*</span>80x80(px)
              </p>
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <button
            onClick={onAddCard}
            className="bg-[#FCFCFC] text-[#353642] border border-[#D6D6D6] rounded-lg shadow-xs focus:outline-none"
            style={{
              width: "138px",
              height: "40px",
              padding: "10px 16px",
              borderRadius: "8px",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#353642",
              }}
            >
              Full Screen Card Ekle
            </span>
          </button>
        </div>
      </div>

      {/* Medya Modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsMediaModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Medya Seç</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Lansman Adına Göre Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700"
                style={{
                  width: "300px",
                  height: "40px",
                  boxShadow: "0 0 3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {filteredMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleMediaSelect(mediaItem.key)}
                  className="cursor-pointer"
                >
                  {renderFilePreview(mediaItem.key)}
                  <p className="text-center text-sm truncate">
                    {mediaItem.key}
                  </p>
                  <p className="text-center text-sm truncate">
                    {mediaItem.launchName}
                  </p>{" "}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
              onClick={() => setIsMediaModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
      {/* Önizleme Butonu - Sol tarafa hizalanmış */}
      <div
        className="w-full mt-4 flex justify-start"
        style={{ marginLeft: "1.5%" }}
      >
        <button
          type="button"
          className="ml-10 bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
          style={{ width: "120px", textAlign: "center" }}
          onClick={() => setIsPreviewOpen(!isPreviewOpen)} // Önizleme açılır/kapanır
        >
          Önizleme
        </button>
      </div>

      {/* Section'un %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "20px auto",
            width: "100%",
            height: "350px",
            marginLeft: "25%",
          }}
        >
          <FullScreenCardSection items={cards} />
        </div>
      )}
      {/* Logo Medya Modal */}
      {isLogoMediaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsLogoMediaModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Logo Medya Seç</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Lansman Adına Göre Ara"
                value={logoSearchTerm}
                onChange={(e) => setLogoSearchTerm(e.target.value)}
                className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700"
                style={{
                  width: "300px",
                  height: "40px",
                  boxShadow: "0 0 3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {filteredLogoMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleLogoMediaSelect(mediaItem.key)}
                  className="cursor-pointer"
                >
                  {renderFilePreview(mediaItem.key)}
                  <p className="text-center text-sm truncate">
                    {mediaItem.key}
                  </p>
                  <p className="text-center text-sm truncate">
                    {mediaItem.launchName}
                  </p>{" "}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
              onClick={() => setIsLogoMediaModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenCardSliderForm;
