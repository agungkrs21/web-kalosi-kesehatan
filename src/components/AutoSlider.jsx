import { useEffect, useState } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Waspadai Demam Berdarah Saat Musim Hujan",
  },
  {
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Tips Sehat dari Dokter untuk Keluarga",
  },
  {
    image: "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Pentingnya Vaksinasi Dasar untuk Anak",
  },
];

export default function AutoSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrent(index);

  // ⏱ Autoplay logic
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [current, paused]);

  const { image, text } = slides[current];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full h-48 sm:h-64 bg-gray-200 rounded-xl overflow-hidden shadow-md" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {/* Gambar */}
        <img src={image} alt="Slide" className="w-full h-full object-cover transition-all duration-700 ease-in-out" />

        {/* Overlay teks */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm sm:text-base">{text}</div>

        {/* Tombol ← → */}
        <button onClick={prevSlide} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
          ◀
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full">
          ▶
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {slides.map((_, idx) => (
          <button key={idx} className={`w-3 h-3 rounded-full ${current === idx ? "bg-blue-600" : "bg-gray-300"} transition-all`} onClick={() => goToSlide(idx)} />
        ))}
      </div>
    </div>
  );
}
