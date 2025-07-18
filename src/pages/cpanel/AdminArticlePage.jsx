// AdminArticlePage.jsx
import { useEffect, useState, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { databases, DATABASES_ID, ARTIKEL_ID } from "../../lib/appwrite";
import { ID } from "appwrite";

const dummyArticles = [
  {
    title: "Pentingnya Cuci Tangan dengan Sabun",
    content: "Cuci tangan yang benar dapat mencegah penyebaran penyakit menular...",
    date: "2025-07-17T09:00:00.000Z",
  },
  {
    title: "Cara Mengelola Stres di Tengah Kesibukan",
    content: "Mengelola stres penting untuk kesehatan mental...",
    date: "2025-07-16T15:30:00.000Z",
  },
  {
    title: "Bahaya Gula Berlebih bagi Kesehatan",
    content: "Konsumsi gula berlebihan meningkatkan risiko diabetes dan obesitas...",
    date: "2025-07-15T08:45:00.000Z",
  },
];

export default function AdminArticlePage() {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [search, setSearch] = useState("");

  const fetchArticles = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, ARTICLE_COLLECTION_ID);
      setArticles(res.documents);
    } catch (err) {
      console.error("Gagal mengambil artikel:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
    setArticles((prev) => [...prev, ...dummyArticles]);
  }, []);

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, ARTICLE_COLLECTION_ID, id);
      fetchArticles();
    } catch (err) {
      console.error("Gagal menghapus artikel:", err);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;
    try {
      if (editingId) {
        await databases.updateDocument(DATABASE_ID, ARTICLE_COLLECTION_ID, editingId, formData);
      } else {
        await databases.createDocument(DATABASE_ID, ARTICLE_COLLECTION_ID, ID.unique(), {
          ...formData,
          date: new Date().toISOString(),
        });
      }
      setFormData({ title: "", content: "" });
      setEditingId(null);
      setShowForm(false);
      fetchArticles();
    } catch (err) {
      console.error("Gagal menyimpan artikel:", err);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));
  }, [articles, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Artikel Edukasi</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: "", content: "" });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          <FiPlus /> {showForm ? "Tutup" : "Tambah Artikel"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded shadow space-y-3 mb-6">
          <input className="w-full border px-2 py-1 rounded" placeholder="Judul Artikel" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <textarea className="w-full border px-2 py-1 rounded h-32" placeholder="Isi Artikel" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Simpan
          </button>
        </div>
      )}

      <input type="text" placeholder="Cari artikel..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full max-w-sm mb-4 px-4 py-2 border rounded" />

      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div key={article.$id} className="bg-white border rounded p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-700 mb-2">{article.content}</p>
            <p className="text-sm text-gray-500 mb-2">{new Date(article.date).toLocaleDateString("id-ID")}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(article.$id);
                  setFormData({ title: article.title, content: article.content });
                  setShowForm(true);
                }}
                className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600"
              >
                <FiEdit2 /> Edit
              </button>
              <button onClick={() => handleDelete(article.$id)} className="flex items-center gap-1 text-red-500 hover:text-red-600">
                <FiTrash2 /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
