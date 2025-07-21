import { useEffect, useState } from "react";
import AutoSlider from "../components/AutoSlider";
import { useAuth } from "../context/AuthContext";
import PenyakitTableSection from "../components/PenyakitTableSection";

export default function Dashboard({ totalUnread }) {
  const { user } = useAuth();
  const [previewImage, setPreviewImage] = useState(null);

  const openPreview = (src) => setPreviewImage(src);
  const closePreview = () => setPreviewImage(null);

  return (
    <div className="min-h-screen bg-white p-4 space-y-6">
      {/* 🖼️ Slider gambar */}
      <AutoSlider />

      {/* 🔲 Menu utama */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <MenuCard title="Media" icon="🎥" link="/media" />
        <MenuCard title="Edukasi" icon="📚" link="/artikel" />
        <MenuCard title="Dialog" icon="💬" link={user.role !== "admin" ? "/chat" : "/admin/chat"} badgeCount={totalUnread} />
      </div>

      <PenyakitTableSection />
      {/* 🖼️ Gambar tambahan */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 text-center mb-6 tracking-wide">Struktur Organisasi UPT Puskesmas Kalosi</h2>
        <img src="struktur-kalosi.jpg" alt="Banner Info" className="w-full rounded-xl cursor-zoom-in shadow-md hover:shadow-lg transition-all" onClick={() => openPreview("struktur-kalosi.jpg")} />
      </div>

      {/* 🔍 Modal Preview Gambar */}
      {previewImage && (
        <div onClick={closePreview} className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center cursor-zoom-out">
          <img src={previewImage} alt="Preview Besar" className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}

function MenuCard({ title, icon, link, badgeCount = 0 }) {
  return (
    <a href={link}>
      <div className="relative bg-blue-100 hover:bg-blue-200 transition-all rounded-xl shadow-md p-6 text-center cursor-pointer">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-lg font-semibold">{title}</div>

        {badgeCount > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{badgeCount}</span>}
      </div>
    </a>
  );
}
