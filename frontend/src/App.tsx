import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Launches from "./pages/launches";
import CreateLaunch from "./pages/CreateLaunch";
import GalleryList from "./pages/GalleryList";
import DesignSettings from "./pages/DesignSettings";
import SeoSettings from "./pages/SeoSettings";
import Login from "./pages/login";
import ProtectedRoute from "./access/control-access"; // ProtectedRoute bileşenini içe aktarın
import PreviewPage from "./pages/previewPage"; // PreviewPage bileşenini içe aktarın
import ErrorPage from "./pages/errorPage"; // ErrorPage bileşenini içe aktarın
import Error404 from "./pages/error404"; // Error404 bileşenini içe aktarın
import PreviewRoute from "./access/previewRoute"; // PreviewRoute bileşenini içe aktarın
import LaunchPage from "./pages/launchAndFragmanControl"; // launchAndFragmanControl bileşenini ekleyin

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <Routes>
              {/* Kök yol ("/") için yönlendirme ekliyoruz */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/launches" replace />} />

              {/* Protected Routes */}
              <Route
                path="/launches"
                element={
                  <ProtectedRoute>
                    <Launches />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-launch"
                element={
                  <ProtectedRoute>
                    <CreateLaunch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute>
                    <GalleryList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/design-settings/:launchId"
                element={
                  <ProtectedRoute>
                    <DesignSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seo-settings/:launchId"
                element={
                  <ProtectedRoute>
                    <SeoSettings />
                  </ProtectedRoute>
                }
              />

              {/* PreviewPage rotasında PreviewRoute kullanıyoruz */}
              <Route
                path="/preview/:launchId" // PreviewPage için route tanımlaması
                element={
                  <PreviewRoute>
                    <PreviewPage />
                  </PreviewRoute>
                }
              />
              {/* Launch kontrolü ve yönlendirme */}
              <Route
                path="/lansman/:launchId" // Yeni rota için launch kontrolü
                element={<LaunchPage />}
              />

              {/* Error route */}
              <Route path="/error" element={<ErrorPage />} />
              {/* 404 route */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
