import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  FaCalendarAlt,
  FaPlayCircle,
  FaClock,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";
import useLaunchStore from "../zustands/useLaunchStore";
import useSeoSettingsStore from "../zustands/useSeoSettingsStore";

// SearchComponentSection Props arayüzünü güncelleyin
interface SearchComponentSectionProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  loading: boolean;
  onButtonClick: (type: string) => void;
  onFocus?: () => void; // onFocus özelliğini ekleyin, opsiyonel yapın
}

// SearchComponentSection bileşeni
const SearchSection: React.FC<SearchComponentSectionProps> = ({
  searchQuery,
  onSearchQueryChange,
  loading,
  onButtonClick,
}) => {
  return (
    <div className="p-6 bg-white flex flex-col items-center justify-start w-full">
      {/* Arama Kutusu */}
      <div className="relative w-full max-w-4xl mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Arama yapın..."
          className="w-full border border-gray-300 p-5 rounded-lg pl-12 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
        <div className="absolute inset-y-0 left-3 flex items-center">
          <FaSearch className="text-gray-400" />
        </div>
      </div>

      {/* Lansman Butonları */}
      <div className="grid grid-cols-4 gap-8 w-full max-w-5xl mb-6">
        <button
          type="button"
          className="bg-gray-200 p-8 rounded-lg text-center shadow-md cursor-pointer w-full"
          onClick={() => onButtonClick("todayLaunches")}
          disabled={loading}
        >
          <FaCalendarAlt className="text-3xl mb-2 text-gray-600 mx-auto" />
          <span className="font-semibold text-md text-gray-800">
            Bugünün Lansmanları
          </span>
        </button>

        <button
          type="button"
          className="bg-gray-200 p-8 rounded-lg text-center shadow-md cursor-pointer w-full"
          onClick={() => onButtonClick("ongoing")}
          disabled={loading}
        >
          <FaPlayCircle className="text-3xl mb-2 text-gray-600 mx-auto" />
          <span className="font-semibold text-md text-gray-800">
            Devam Eden Lansmanlar
          </span>
        </button>

        <button
          type="button"
          className="bg-gray-200 p-8 rounded-lg text-center shadow-md cursor-pointer w-full"
          onClick={() => onButtonClick("upcoming")}
          disabled={loading}
        >
          <FaClock className="text-3xl mb-2 text-gray-600 mx-auto" />
          <span className="font-semibold text-md text-gray-800">
            Gelecek Lansmanlar
          </span>
        </button>

        <button
          type="button"
          className="bg-gray-200 p-8 rounded-lg text-center shadow-md cursor-pointer w-full"
          onClick={() => onButtonClick("past")}
          disabled={loading}
        >
          <FaSyncAlt className="text-3xl mb-2 text-gray-600 mx-auto" />
          <span className="font-semibold text-md text-gray-800">
            Geçmiş Lansmanlar
          </span>
        </button>
      </div>

      {/* Yükleniyor durumu */}
      {loading && (
        <p className="mt-4 text-center text-lg text-indigo-600">
          Yükleniyor...
        </p>
      )}
    </div>
  );
};

// LaunchFilter bileşeni
const LaunchFilter: React.FC = () => {
  const { launches, getLaunchData } = useLaunchStore();
  const { fetchAllSeoSettings, allSeoSettings } = useSeoSettingsStore();

  const [filteredLaunches, setFilteredLaunches] = useState(launches);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const convertDateFormat = (dateString: string) => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

  const getFormattedDate = (dateString: string) => {
    const formattedDate = convertDateFormat(dateString);
    return dayjs(formattedDate);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await getLaunchData();
        await fetchAllSeoSettings();
      } catch (error) {
        console.error("Veri çekilirken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getLaunchData, fetchAllSeoSettings]);

  useEffect(() => {
    setFilteredLaunches(launches);
  }, [launches]);

  const handleButtonClick = (type: string) => {
    setHasInteracted(true);
    const today = dayjs();

    let filtered = [];

    switch (type) {
      case "todayLaunches":
        filtered = launches.filter((launch) =>
          getFormattedDate(launch.launchDate).isSame(today, "day")
        );
        break;
      case "ongoing":
        filtered = launches.filter(
          (launch) =>
            getFormattedDate(launch.launchDate).isBefore(today) &&
            getFormattedDate(launch.endDate).isAfter(today)
        );
        break;
      case "upcoming":
        filtered = launches.filter((launch) =>
          getFormattedDate(launch.launchDate).isAfter(today)
        );
        break;
      case "past":
        filtered = launches.filter((launch) =>
          getFormattedDate(launch.endDate).isBefore(today, "day")
        );
        break;
      default:
        filtered = launches;
    }

    setFilteredLaunches(filtered);
  };

  const handleSearchQueryChange = (query: string) => {
    setHasInteracted(true);
    setSearchQuery(query);
    const searchedLaunches = launches.filter((launch) =>
      launch.launchName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLaunches(searchedLaunches);
  };

  const getSeoForLaunch = (launchId: string) => {
    return allSeoSettings.find((seo) => seo.launchId === launchId);
  };

  const handleMoreClick = (launchUrl: string) => {
    if (launchUrl) {
      window.location.href = launchUrl;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-5xl">
        <SearchSection
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          loading={loading}
          onButtonClick={handleButtonClick}
          onFocus={() => setHasInteracted(true)} // onFocus fonksiyonunu burada kullanın
        />
      </div>

      {hasInteracted && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {filteredLaunches.length > 0 ? (
            filteredLaunches.map((launch) => {
              const seoData = getSeoForLaunch(launch._id);

              return (
                <div
                  key={launch._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300 h-full w-full"
                >
                  {seoData ? (
                    <div className="flex flex-col h-full">
                      {seoData.socialImage && (
                        <img
                          src={`${import.meta.env.VITE_AWS_S3_BUCKET_URL}/${
                            seoData.socialImage
                          }`}
                          alt="SEO Görseli"
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {seoData.title || "Lansman Başlık"}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4">
                            {seoData.description || "Lansman açıklaması..."}
                          </p>
                        </div>
                        <div>
                          <button
                            className="text-indigo-600 text-sm font-medium hover:underline"
                            onClick={() => handleMoreClick(seoData.launchUrl)}
                          >
                            Daha fazlası...
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>SEO bilgisi bulunamadı.</p>
                  )}
                </div>
              );
            })
          ) : (
            <p>Seçilen kritere göre lansman bulunamadı.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LaunchFilter;
