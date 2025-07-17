import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
// pages
import ChatApp from "./pages/ChatApp";
import Login from "./pages/Login";

// main app
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* secure route */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<ChatApp />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
