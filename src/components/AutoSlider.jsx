import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { databases, DATABASES_ID, ARTIKEL_ID } from "../lib/appwrite";
import { Query } from "appwrite";

export default function AutoSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [artikel, setArtikel] = useState([]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % artikel.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + artikel.length) % artikel.length);
  const goToSlide = (index) => setCurrent(index);

  // Auto play
  useEffect(() => {
    if (paused || artikel.length === 0) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [current, paused, artikel.length]);

  // Load artikel terbaru
  const limit = 3;
  const loadArtikel = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, ARTIKEL_ID, [Query.orderDesc("$createdAt"), Query.limit(limit)]);
      setArtikel(res.documents);
    } catch (error) {
      console.error("Gagal mengambil artikel untuk slider:", error);
    }
  };

  useEffect(() => {
    loadArtikel();
  }, []);

  const article = artikel[current];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full h-48 sm:h-64 bg-gray-200 rounded-xl overflow-hidden shadow-md" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {article ? (
          <Link to={`/artikel/${generateSlug(article.title)}`} state={{ article }}>
            <img src={article.previewUrl || "https://placehold.co/800x400?text=No+Image"} alt={article.title} className="w-full h-full object-cover transition-all duration-700 ease-in-out" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm sm:text-base">{article.title}</div>
          </Link>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">Memuat artikel...</div>
        )}

        {/* Tombol navigasi */}
        <button onClick={prevSlide} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
          ◀
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
          ▶
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {artikel.map((_, idx) => (
          <button key={idx} className={`w-3 h-3 rounded-full ${current === idx ? "bg-blue-600" : "bg-gray-300"} transition-all`} onClick={() => goToSlide(idx)} />
        ))}
      </div>
    </div>
  );
}

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}
