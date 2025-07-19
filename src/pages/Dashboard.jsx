import { useEffect } from "react";
import AutoSlider from "../components/AutoSlider";
import { useAuth } from "../context/AuthContext";
import useLoadMessage from "../utils/useLoadMessage";
export default function Dashboard() {
  const { user } = useAuth();

  const { loadData, totalUnread } = useLoadMessage();

  useEffect(() => {
    loadData(user.$id);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 space-y-6">
      {/* 🖼️ Slider gambar */}
      <AutoSlider />

      {/* 🔲 3 Pilihan Menu Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <MenuCard title="Media" icon="🎥" link="/media" />
        <MenuCard title="Edukasi" icon="📚" link="/artikel" />
        <MenuCard title="Dialog" icon="💬" link={user.role !== "admin" ? "/chat" : "/admin/chat"} badgeCount={totalUnread} />
      </div>
    </div>
  );
}

function MenuCard({ title, icon, link, badgeCount = 0 }) {
  return (
    <a href={link}>
      <div className="relative bg-blue-100 hover:bg-blue-200 transition-all rounded-xl shadow-md p-6 text-center cursor-pointer">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-lg font-semibold">{title}</div>

        {/* 🔴 Badge */}
        {badgeCount > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{badgeCount}</span>}
      </div>
    </a>
  );
}
