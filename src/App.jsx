import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminRoutes from "./components/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Registes";
// Navbar
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// pages
import Dashboard from "./pages/Dashboard";
import UserChatPage from "./pages/UserChatPage";
import AdminChatPage from "./pages/AdminChatPage";

// admin pages
import AdminDashBoard from "./pages/cpanel/AdminDashboard";
import AdminMediaPage from "./pages/cpanel/AdminMediaPage";
import AdminArticlePage from "./pages/cpanel/AdminArticlePage";
// main app
const App = () => {
  return (
    <div className="relative min-h-screen">
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* secure route */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<UserChatPage />} />
              <Route path="/admin/chat" element={<AdminChatPage />} />

              {/* admin routes */}
              <Route element={<AdminRoutes />}>
                <Route path="/admin/dashboard" element={<AdminDashBoard />} />
                <Route path="/admin/media" element={<AdminMediaPage />} />
                <Route path="/admin/articles" element={<AdminArticlePage />} />
              </Route>
            </Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
