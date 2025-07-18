// AdminMediaPage.jsx
import { useState, useEffect, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { databases, DATABASES_ID, MEDIA_ID } from "../../lib/appwrite";
import { ID } from "appwrite";

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchMedia = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MEDIA_ID);
      setMediaItems(res.documents);
    } catch (err) {
      console.error("Gagal mengambil media:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(DATABASES_ID, MEDIA_ID, id);
      fetchMedia();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.$id);
    setEditTitle(item.title);
    setEditUrl(item.url);
  };

  const handleEditSave = async () => {
    try {
      await databases.updateDocument(DATABASES_ID, MEDIA_ID, editingId, {
        title: editTitle,
        url: editUrl,
      });
      setEditingId(null);
      fetchMedia();
    } catch (err) {
      console.error("Gagal mengedit:", err);
    }
  };

  const handleAddMedia = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    try {
      await databases.createDocument(DATABASES_ID, MEDIA_ID, ID.unique(), {
        title: newTitle,
        url: newUrl,
      });
      setNewTitle("");
      setNewUrl("");
      setShowAddForm(false);
      fetchMedia();
    } catch (err) {
      console.error("Gagal menambah:", err);
    }
  };

  const filteredItems = useMemo(() => {
    return mediaItems
      .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
      .filter((item) => (filterDate ? item.$createdAt.split("T")[0] === filterDate : true))
      .sort((a, b) => (sortAsc ? a.$createdAt.localeCompare(b.$createdAt) : b.$createdAt.localeCompare(a.$createdAt)));
  }, [mediaItems, search, filterDate, sortAsc]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Media (Video)</h1>
        <button onClick={() => setShowAddForm((prev) => !prev)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          <FiPlus /> {showAddForm ? "Tutup" : "Tambah Media"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input type="text" placeholder="Cari judul video..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border rounded" />
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-2 border rounded" />
        <button onClick={() => setSortAsc((prev) => !prev)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Sort: {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Tambah Media Baru</h2>
          <input className="w-full border px-2 py-1 rounded" placeholder="Judul Video" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <input className="w-full border px-2 py-1 rounded" placeholder="URL YouTube" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
          <button onClick={handleAddMedia} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Simpan Media
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.$id} className="bg-white border rounded-lg overflow-hidden shadow">
            <div className="aspect-w-16 aspect-h-9">
              <iframe src={item.url.replace("watch?v=", "embed/")} title={item.title} allowFullScreen className="w-full h-48"></iframe>
            </div>
            <div className="p-4">
              {editingId === item.$id ? (
                <div className="space-y-2">
                  <input className="w-full border px-2 py-1 rounded" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Judul Video" />
                  <input className="w-full border px-2 py-1 rounded" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="URL YouTube" />
                  <div className="flex gap-2">
                    <button onClick={handleEditSave} className="bg-green-500 text-white px-3 py-1 rounded">
                      Simpan
                    </button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1 rounded">
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">Tanggal: {formatDate(item.$createdAt)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600">
                      <FiEdit2 /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.$id)} className="flex items-center gap-1 text-red-500 hover:text-red-600">
                      <FiTrash2 /> Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(string) {
  const date = new Date(string);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
