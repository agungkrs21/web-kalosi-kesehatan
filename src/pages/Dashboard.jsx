import { useState } from "react";
import AutoSlider from "../components/AutoSlider";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-white p-4 space-y-6">
      {/* 🖼️ Slider gambar */}
      <AutoSlider />

      {/* 🔲 3 Pilihan Menu Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <MenuCard title="Media" icon="🎥" link="#media" />
        <MenuCard title="Edukasi" icon="📚" link="#edukasi" />
        <MenuCard title="Dialog" icon="💬" link={user.role !== "admin" ? "/chat" : "/admin/chat"} />
      </div>
    </div>
  );
}

function MenuCard({ title, icon, link }) {
  return (
    <a href={link}>
      <div className="bg-blue-100 hover:bg-blue-200 transition-all rounded-xl shadow-md p-6 text-center cursor-pointer">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-lg font-semibold">{title}</div>
      </div>
    </a>
  );
}
