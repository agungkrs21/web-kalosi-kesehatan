import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import ProtectedRoutes from "./components/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Registes";
// pages
import ChatApp from "./pages/ChatApp";
import NavBar from "./pages/NavBar";

// main app
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* secure route */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<ChatApp />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
