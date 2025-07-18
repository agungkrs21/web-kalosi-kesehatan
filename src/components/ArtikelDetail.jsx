import { useParams, useLocation } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
export default function ArtikelDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const article = location.state?.article;

  if (!article) return <p>Data tidak ditemukan. (Coba kembali)</p>;

  return (
    <div className="prose prose-lg max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
        <FiCalendar className="text-base text-blue-500" />
        {new Date(article.$createdAt).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="article-content mt-5" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
