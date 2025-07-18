import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const AdminRoutes = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") return <Navigate to="/" />;

  return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default AdminRoutes;
