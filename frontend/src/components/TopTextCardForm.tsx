import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import TopTextCardSection from "../sections/topTextCard-section"; // TopTextCardSection'u import et

interface TopTextCardFormProps {
  text: string;
  media: string;
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const TopTextCardForm: React.FC<TopTextCardFormProps> = ({
  text,
  media,
  onTextChange,
  onMediaChange,
}) => {
  const [mediaList, setMediaList] = useState<
    { key: string; launchName: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama için state
  const [charCount, setCharCount] = useState<number>(text.length); // Karakter sayacı
  const [error, setError] = useState<string>(""); // Hata mesajı
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false); // Önizleme için state
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => ({
          key: media.Key,
          launchName: media.launchName || "", // Lansman adını ekliyoruz
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
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Karakter sınırı kontrolü
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    if (newText.length <= 250) {
      setError(""); // Hata mesajını temizliyoruz
      onTextChange(e); // Yalnızca geçerli olduğunda metni güncelle
    } else {
      setError("Karakter sınırını aştınız!"); // Hata mesajı
    }
    setCharCount(newText.length > 250 ? 250 : newText.length); // Karakter sayacını güncelliyoruz
  };

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
    onMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsModalOpen(false);
  };

  // Arama için filtreleme
  const filteredMediaList = mediaList.filter(
    (mediaItem) =>
      mediaItem.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediaItem.launchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Yazı
        </label>
        <textarea
          value={text.slice(0, 250)} // Text sınırı burada zorlanıyor
          onChange={handleTextChange} // Karakter sınırı kontrolü fonksiyonunu bağlıyoruz
          placeholder="Yazı Alanı"
          className="block text-gray-900 bg-white border border-gray-300 sm:text-sm"
          rows={4}
          style={{
            width: "423px", // Genişlik 423px yapıldı
            marginLeft: "3%",
            height: "80px",
            borderRadius: "8px",
            padding: "16px",
            borderTop: "1px solid #D9D9D9",
            outline: "none",
          }}
        />
        {/* Hata mesajı ve karakter sayacı textarea'nın altında */}
        {error && (
          <p className="text-red-500 text-xs mt-1" style={{ marginLeft: "3%" }}>
            {error}
          </p>
        )}
        <div
          className="text-right text-sm text-gray-500 mt-1"
          style={{ marginRight: "60%" }}
        >
          {charCount}/250
        </div>
      </div>

      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Medya
        </label>
        <input
          type="text"
          readOnly
          value={media || "Medya Seç"}
          onClick={() => setIsModalOpen(true)}
          className="block text-gray-900 bg-white border border-gray-300 rounded-md sm:text-sm"
          style={{
            width: "423px", // Genişlik 423px yapıldı
            marginLeft: "3%",
            height: "50px",
            padding: "10px 16px",
            borderRadius: "8px",
            outline: "none",
          }}
        />
        {/* Yıldız işaretli medya ölçüsü ekleniyor, %3 uzaklıkta */}
        <p
          style={{
            color: "#667085",
            fontSize: "12px",
            marginTop: "4px",
            marginLeft: "3%",
          }}
        >
          <span style={{ color: "red" }}>*</span>1040x400(px)
        </p>
      </div>

      {/* Önizleme Butonu */}
      <div className="w-full mt-4">
        <button
          type="button"
          className="bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
          style={{
            width: "100px",
            textAlign: "center",
            marginLeft: "3%", // Buton soldan %3 uzaklıkta
          }}
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
        >
          Önizleme
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Medya Seç</h3>
            <input
              type="text"
              placeholder="Medya adına veya lansman adına göre arama"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-500 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-gray-500 text-sm font-medium text-gray-700 mb-4"
              style={{ width: "300px", height: "40px" }}
            />
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
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full bg-[#970928] text-white py-2 px-4 rounded-md hover:bg-[#7a0620] transition transform duration-150 ease-in-out"
              onClick={() => setIsModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* TopTextCardSection'ın %50 küçültülmüş önizleme alanı */}
      {isPreviewOpen && (
        <div
          style={{
            transform: "scale(0.5)", // %50 küçültme
            transformOrigin: "top left", // Sol üstten küçült
            margin: "0 auto", // Ortalamak için
            width: "100%", // Orijinal genişliğin yarısı
            height: "340px",
            marginLeft: "25%",
          }}
          className="p-2 rounded-lg mt-6"
        >
          <TopTextCardSection text={text} media={media} />
        </div>
      )}
    </div>
  );
};

export default TopTextCardForm;
