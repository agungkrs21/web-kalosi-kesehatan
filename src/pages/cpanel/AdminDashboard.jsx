// AdminDashboard.jsx
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Selamat datang, Admin 👋</h1>

        {/* Statistik Gabungan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div onClick={() => navigate("/admin/media")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
            <h2 className="font-medium text-gray-600">Total Media</h2>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </div>
          <div onClick={() => navigate("/admin/articles")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
            <h2 className="font-medium text-gray-600">Total Edukasi</h2>
            <p className="text-2xl font-bold text-blue-600">14</p>
          </div>
          <div onClick={() => navigate("/admin/chat")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
            <h2 className="font-medium text-gray-600">Total Pesan</h2>
            <p className="text-2xl font-bold text-blue-600">23</p>
          </div>
          <div onClick={() => navigate("/admin/users")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
            <h2 className="font-medium text-gray-600">Jumlah User</h2>
            <p className="text-2xl font-bold text-blue-600">35</p>
          </div>
          <div onClick={() => navigate("/admin/doctors")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
            <h2 className="font-medium text-gray-600">Jumlah Dokter</h2>
            <p className="text-2xl font-bold text-blue-600">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
