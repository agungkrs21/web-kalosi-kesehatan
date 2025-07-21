import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { databases, DATABASES_ID, ARTIKEL_ID } from "../lib/appwrite";
import { Query } from "appwrite";
import ArticleCard from "../components/ArticleCard";

export default function ArtikelPage() {
  const [artikels, setArtikel] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get("search") || "";

  const getArtikel = async () => {
    setLoading(false);
    try {
      const queries = [Query.orderDesc("$createdAt")];

      if (searchParam) {
        queries.push(Query.search("title", searchParam));
      }

      const result = await databases.listDocuments(DATABASES_ID, ARTIKEL_ID, queries);
      setArtikel(result.documents);
    } catch (error) {
      console.error("Gagal fetching artikel:", error);
    }
    setLoading(true);
  };

  useEffect(() => {
    getArtikel();
  }, [searchParam]); // trigger ulang saat parameter search berubah

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {searchParam && (
        <h2 className="text-lg font-semibold mb-4">
          Hasil pencarian: <span className="text-blue-600">{searchParam}</span>
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artikels.length > 0 ? (
          artikels.map((article) => (
            <ArticleCard
              key={generateSlug(article.title)}
              title={article.title}
              image={article.previewUrl}
              date={article.$createdAt}
              excerpt={extractExcerptFromHTML(article.content)}
              slug={generateSlug(article.title)}
              article={article}
            />
          ))
        ) : !loading ? (
          <p className="text-gray-500">mengambil data tunggu sebentar...</p>
        ) : (
          <p className="text-gray-500">Tidak ada artikel ditemukan.</p>
        )}
      </div>
    </div>
  );
}

// 👇 tetap sama
function extractExcerptFromHTML(html, maxLength = 100) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const paragraphs = Array.from(tempDiv.querySelectorAll("p"))
    .map((p) => p.textContent.trim())
    .filter((text) => text.length > 20);
  const firstParagraph = paragraphs[1] || "";
  return firstParagraph.length > maxLength ? firstParagraph.slice(0, maxLength).trim() + "..." : firstParagraph;
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
