import React, { useState, useEffect, ChangeEvent, useRef } from "react"; // useRef eklendi
import axios from "axios";

interface HeaderFormProps {
  title: string;
  logoMedia: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLogoMediaChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({
  title,
  logoMedia,
  onTitleChange,
  onLogoMediaChange,
  onSubmit,
}) => {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [searchTerm, setSearchTerm] = useState<string>(""); // Arama çubuğu için state eklendi
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/media/list`);
        const mediaNames = response.data.map((media: any) => media.Key); // Uzantıyı çıkarmadan tam medya ismini alıyoruz
        setMediaList(mediaNames);
      } catch (error) {
        console.error("Medya listesi alınamadı:", error);
      }
    };

    fetchMediaList();
  }, []);

  // Modal dışında tıklanırsa kapatmayı sağlayan fonksiyon
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

  // renderFilePreview fonksiyonunu genişletiyoruz
  const renderFilePreview = (file: string) => {
    const fileType = file.split(".").pop()?.toLowerCase();
    const previewStyle = "w-full h-32 object-cover mb-2";

    switch (fileType) {
      // Yaygın resim formatları
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

      // Yaygın video formatları
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

  // Medya seçimi yapıldıktan sonra media state'ini güncelleyen fonksiyon
  const handleMediaSelect = (selectedMedia: string) => {
    onLogoMediaChange({
      target: { value: selectedMedia },
    } as ChangeEvent<HTMLSelectElement>);
    setIsModalOpen(false); // Modalı kapatıyoruz
  };

  // Medya adlarına göre filtreleme işlemi
  const filteredMediaList = mediaList.filter((mediaItem) =>
    mediaItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col" style={{ paddingLeft: "3%" }}>
        {" "}
        {/* Soldan %3 uzaklık */}
        <label className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1">
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="  Input"
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#101828] placeholder:text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px" }}
        />
      </div>
      <div className="flex flex-col" style={{ paddingLeft: "3%" }}>
        {" "}
        {/* Soldan %3 uzaklık */}
        <label className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1">
          Logo Medya
        </label>
        <input
          type="text"
          readOnly
          value={logoMedia || "  Medya Seç"} // Başlangıçta "Medya Seç" yazısı olacak
          onClick={() => setIsModalOpen(true)} // Modalı açıyoruz
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px" }}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-4 w-3/4 max-h-full overflow-y-auto relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[#970928] bg-white rounded-full p-2 hover:bg-gray-100 transition transform duration-150 ease-in-out"
              onClick={() => setIsModalOpen(false)} // Kapatma butonu
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-4">Medya Seç</h3>

            {/* Arama çubuğu */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Firma Adına Göre Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {filteredMediaList.map((mediaItem, index) => (
                <div
                  key={index}
                  onClick={() => handleMediaSelect(mediaItem)}
                  className="cursor-pointer"
                >
                  {renderFilePreview(mediaItem)}
                  <p className="text-center text-sm truncate">{mediaItem}</p>
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
    </div>
  );
};

export default HeaderForm;
