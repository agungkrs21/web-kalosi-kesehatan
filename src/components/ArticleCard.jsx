import { Link } from "react-router-dom";
// components/ArticleCard.jsx
export default function ArticleCard({ title, image, date, excerpt, slug, article }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
      <Link to={`/artikel/${slug}`} state={{ article }}>
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{date}</p>
          <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition">{title}</h2>
          <p className="text-gray-600 text-sm mb-3">{excerpt}</p>
          <span className="text-blue-600 font-semibold text-sm hover:underline">Selengkapnya →</span>
        </div>
      </Link>
    </div>
  );
}
