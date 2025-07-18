// pages/ArtikelPage.jsx
import ArticleCard from "../components/ArticleCard";
import { useState, useEffect } from "react";
import { databases, storage, DATABASES_ID, ARTIKEL_ID, AVATAR_ID } from "../lib/appwrite";
const dummyArticles = [
  {
    title: "Cegah Diabetes Sejak Dini",
    image: "https://via.placeholder.com/600x350",
    date: "18 Juli 2025",
    excerpt: "Diabetes bisa dicegah dengan kebiasaan sehat. Simak langkah-langkahnya...",
    slug: "cegah-diabetes-sejak-dini",
  },
  // Tambah artikel lain
];

export default function ArtikelPage() {
  const [artikels, setAtikel] = useState([]);

  const getInitialArtikel = async () => {
    try {
      const result = await databases.listDocuments(DATABASES_ID, ARTIKEL_ID);
      setAtikel(result.documents);
    } catch (error) {
      console.error("Gagal fetching artikel:", error);
    }
  };

  useEffect(() => {
    getInitialArtikel();
  }, []);
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {artikels.map((article) => (
        <ArticleCard
          key={generateSlug(article.title)}
          title={article.title}
          image={article.previewUrl}
          date={article.$createdAt}
          excerpt={extractExcerptFromHTML(article.content)}
          slug={generateSlug(article.title)}
          article={article}
        />
      ))}
    </div>
  );
}

function extractExcerptFromHTML(html, maxLength = 100) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Ambil semua tag <p> yang punya isi teks bermakna
  const paragraphs = Array.from(tempDiv.querySelectorAll("p"))
    .map((p) => p.textContent.trim())
    .filter((text) => text.length > 20); // minimal panjang kalimat

  const firstParagraph = paragraphs[1] || "";

  // Potong jika terlalu panjang
  return firstParagraph.length > maxLength ? firstParagraph.slice(0, maxLength).trim() + "..." : firstParagraph;
}

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Hapus karakter aneh (selain huruf, angka, spasi, dan strip)
    .replace(/\s+/g, "-") // Ganti semua spasi dengan strip (-)
    .replace(/--+/g, "-") // Hapus strip ganda
    .replace(/^-+|-+$/g, ""); // Hapus strip di awal dan akhir
}
