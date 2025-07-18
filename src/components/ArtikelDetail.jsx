import { useParams, useLocation } from "react-router-dom";

export default function ArtikelDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const article = location.state?.article;

  if (!article) return <p>Data tidak ditemukan. (Coba kembali)</p>;

  return (
    <div className="prose prose-lg max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <img src={article.image} alt={article.title} className="rounded-lg my-4" />
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
