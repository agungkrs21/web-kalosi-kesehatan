// AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { databases, DATABASES_ID, ARTIKEL_ID, MEDIA_ID, USER_ID } from "../../lib/appwrite";
import { Query } from "appwrite";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const totalDataStorage = { artikel: 0, media: 0, users: 0 };
  const [totalData, setTotalData] = useState(() => {
    const data = localStorage.getItem("totalData");
    return data ? JSON.parse(data) : { artikel: 0, media: 0, users: 0 };
  });

  const [loading, setLoading] = useState(false);

  const limit = 50;
  const loadArtikelData = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, ARTIKEL_ID, [Query.limit(limit)]);
      totalDataStorage.artikel = res.total;
      setTotalData((prev) => ({ ...prev, artikel: res.total }));
    } catch (error) {
      console.log("gagal mengambil total artikel:", error);
    }
  };
  const loadMediaData = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MEDIA_ID, [Query.limit(limit)]);
      totalDataStorage.media = res.total;
      setTotalData((prev) => ({ ...prev, media: res.total }));
    } catch (error) {
      console.log("gagal mengambil total media:", error);
    }
  };

  const loadUserData = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, USER_ID, [Query.limit(limit)]);
      totalDataStorage.users = res.total;
      setTotalData((prev) => ({ ...prev, users: res.total }));
    } catch (error) {
      console.log("gagal mengambil total users:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadArtikelData(), loadMediaData(), loadUserData()]);

      localStorage.setItem("totalData", JSON.stringify(totalDataStorage));
    } catch (error) {
      console.log("Error load data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold mb-6 inline">Selamat datang, Admin 👋</h1>
          <button className="p-1 bg-blue-600 hover:bg-blue-400 hover:text-black rounded-2xl text-white ml-5 cursor-pointer" onClick={loadData}>
            Refresh Total Data
          </button>
        </div>

        {/* Statistik Gabungan */}
        {!loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div onClick={() => navigate("/admin/media")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
              <h2 className="font-medium text-gray-600">Total Media</h2>
              <p className="text-2xl font-bold text-blue-600">{totalData.media}</p>
            </div>
            <div onClick={() => navigate("/admin/articles")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
              <h2 className="font-medium text-gray-600">Total Edukasi</h2>
              <p className="text-2xl font-bold text-blue-600">{totalData.artikel}</p>
            </div>
            {/* <div onClick={() => navigate("/admin/chat")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50 relative">
            <h2 className="font-medium text-gray-600">Total Pesan</h2>
            <p className="text-2xl font-bold text-blue-600">23</p>

          </div> */}
            <div onClick={() => navigate("/admin/users")} className="bg-white border rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50">
              <h2 className="font-medium text-gray-600">Jumlah User</h2>
              <p className="text-2xl font-bold text-blue-600">{totalData.users}</p>
            </div>
          </div>
        ) : (
          <h1>Mengambil data....</h1>
        )}
      </div>
    </div>
  );
}
