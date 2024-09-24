import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PopupComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false); // Pop-up'ın görünür olup olmadığını kontrol eder
  const [email, setEmail] = useState(""); // E-posta adresini saklar
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]); // 6 haneli doğrulama kodunu saklar
  const [isEmailSent, setIsEmailSent] = useState(false); // E-posta gönderildi mi?
  const [isLoading, setIsLoading] = useState(false); // Yüklenme durumunu kontrol eder
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı
  const [jwtToken, setJwtToken] = useState(""); // İlk gönderimde alınan JWT token

  // 6 input için referans oluşturuyoruz
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // E-posta adresini güncelleyen fonksiyon
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Her bir doğrulama kutucuğunda yazıldığında sıradaki input'a geçişi sağlar
  const handleCodeChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Bir sonraki input'a otomatik geçiş
      if (index < 5 && value !== "") {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      // Geri silme işlemi
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
    }
  };

  // Cookie'ye JWT token'ı ayarlayan yardımcı fonksiyon
  const setCookie = (name: string, value: string, hours: number) => {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString(); // 6 saat için ayarlama
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  // Cookie'den JWT token'ı alan yardımcı fonksiyon
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  // E-posta gönderme isteği
  const sendVerificationCode = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5002/api/visitors/process",
        {
          email: email,
          action: "sendEmail",
        }
      );

      console.log("Doğrulama kodu gönderildi:", response.data);
      setJwtToken(response.data.token); // JWT token'ı alıyoruz
      setIsEmailSent(true); // İkinci aşamaya geç
    } catch (error) {
      console.error("E-posta gönderilemedi:", error);
      setErrorMessage("E-posta gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Doğrulama kodunu kontrol eden istek
  const verifyCode = async () => {
    const code = verificationCode.join(""); // 6 haneli kodu birleştiriyoruz
    if (code.length !== 6) {
      setErrorMessage("Lütfen 6 haneli bir kod girin.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5002/api/visitors/process",
        {
          email: email,
          action: "verifyCode",
          code: code, // Kullanıcının girdiği doğrulama kodu
          token: jwtToken, // İlk aşamada alınan JWT token
        }
      );

      console.log("Doğrulama başarılı, JWT token alındı:", response.data.token);

      // Token'ı cookie'de 6 saat boyunca sakla
      setCookie("jwtToken", response.data.token, 6);

      setIsVisible(false); // Doğrulama başarılıysa pop-up'ı kapat
    } catch (error) {
      console.error("Doğrulama başarısız:", error);
      setErrorMessage("Doğrulama başarısız. Lütfen kodu tekrar girin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Kullanıcının token'ı varsa pop-up'ı açma
  useEffect(() => {
    const token = getCookie("jwtToken");

    // Eğer cookie'de token varsa pop-up'ı açmayacak
    if (token) {
      setIsVisible(false); // Token geçerliyse pop-up'ı açma
    } else {
      setIsVisible(true); // Eğer token yoksa pop-up'ı aç
    }
  }, []);

  if (!isVisible) return null; // Pop-up kapalıysa hiçbir şey gösterme

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full relative z-50">
        <h2 className="text-lg font-semibold mb-4">
          Dijital Vitrin Ziyaret Formu
        </h2>
        {!isEmailSent ? (
          <>
            {/* E-posta adresi girişi */}
            <p className="mb-4">
              E-posta adresinizi, tarafınıza göndereceğimiz tek seferlik kod ile
              doğrulamanız gerekmektedir.
            </p>
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={handleEmailChange}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              disabled={isLoading}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={sendVerificationCode}
              disabled={isLoading}
            >
              {isLoading ? "Gönderiliyor..." : "Kodu Gönder"}
            </button>
          </>
        ) : (
          <>
            {/* Doğrulama kodu girişi */}
            <p className="mb-4">E-postanıza gelen doğrulama kodunu girin:</p>
            <div className="grid grid-cols-6 gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-full border border-gray-300 p-2 text-center rounded-lg"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)} // Input referanslarını oluştur
                />
              ))}
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
              onClick={verifyCode}
              disabled={isLoading}
            >
              {isLoading ? "Doğrulanıyor..." : "Lansmanı Görüntüle"}
            </button>
          </>
        )}

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PopupComponent;
