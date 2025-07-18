// AdminArticlePage.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { databases, storage, DATABASES_ID, ARTIKEL_ID, AVATAR_ID, PROJECT_ID } from "../../lib/appwrite";
import { ID } from "appwrite";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AdminArticlePage() {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [pendingImages, setPendingImages] = useState([]);

  // quill editor reff
  const quilAddllRef = useRef(null);
  const quilEditRef = useRef(null);

  const fetchArticles = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, ARTIKEL_ID);
      setArticles(res.documents);
    } catch (err) {
      console.error("Gagal mengambil artikel:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(DATABASES_ID, ARTIKEL_ID, id);
      fetchArticles();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.$id);
    setEditTitle(item.title);
    setEditContent(item.content);
  };

  const handleEditSave = async () => {
    try {
      await databases.updateDocument(DATABASES_ID, ARTIKEL_ID, editingId, {
        title: editTitle,
        content: editContent,
      });
      setEditingId(null);
      fetchArticles();
    } catch (err) {
      console.error("Gagal mengedit:", err);
    }
  };

  const handleAddArticle = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      let finalContent = newContent;
      if (finalContent.length > 7000) throw Error("artikel terlalu panjang!!");
      for (const item of pendingImages) {
        const uploaded = await storage.createFile(AVATAR_ID, ID.unique(), item.file);

        const url = `https://fra.cloud.appwrite.io/v1/storage/buckets/${AVATAR_ID}/files/${uploaded.$id}/view?project=${PROJECT_ID}&mode=admin`;

        finalContent = finalContent.replace(item.placeholder, url);
      }

      await databases.createDocument(DATABASES_ID, ARTIKEL_ID, ID.unique(), {
        title: newTitle,
        content: finalContent,
      });
      setNewTitle("");
      setNewContent("");
      setPendingImages([]);
      setShowAddForm(false);
      fetchArticles();
    } catch (err) {
      console.error("Gagal menambah:", err);
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const quill = editingId !== null ? quilEditRef.current?.getEditor() : quilAddllRef.current?.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", base64);
        setPendingImages((prev) => [...prev, { file, placeholder: base64 }]);
      };
      reader.readAsDataURL(file);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"]],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [editingId]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Artikel Edukasi</h1>
        <button
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setPendingImages((prev) => (prev = []));
            setNewContent((prev) => (prev = ""));
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          <FiPlus /> {showAddForm ? "Bersihkan" : "Tambah Artikel"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">Tambah Artikel Baru</h2>
          <strong className="text-gray-400">Max Character Arikel : 6700</strong>
          <br />
          <strong className={countArikelLength(newContent, pendingImages) > 7000 ? "text-red-400" : "text-gray-400"}>Artikel Character : {countArikelLength(newContent, pendingImages)}</strong> <br />
          <input className="w-full border px-2 py-1 rounded" placeholder="Judul Artikel" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <ReactQuill ref={quilAddllRef} theme="snow" value={newContent} onChange={setNewContent} modules={modules} />
          <button onClick={handleAddArticle} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Simpan Artikel
          </button>
        </div>
      )}

      {/* mapping artikle */}
      <div className="space-y-6">
        {articles.map((item) => {
          const isEditing = editingId === item.$id;

          return (
            <div key={item.$id} className="bg-white p-4 rounded shadow cursor-pointer transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-1">{item.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">Tanggal: {new Date(item.$createdAt).toLocaleDateString("id-ID")}</p>
                  {editingId && <p className="text-sm text-red-500 mb-2">Edit foto tidak diperkenankan untuk mode edit demi menyimpan kuota badnwith server</p>}
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                      setShowAddForm(false);
                    }}
                    className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.$id);
                    }}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 /> Hapus
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input className="w-full border px-2 py-1 rounded" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      {/* modules={modules} disabled add image for now cuz iam lazy */}
                      <ReactQuill ref={quilEditRef} theme="snow" value={editContent} onChange={setEditContent} />
                      <div className="flex gap-2">
                        <button onClick={handleEditSave} className="bg-green-500 text-white px-3 py-1 rounded">
                          Simpan
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                          }}
                          className="bg-gray-300 px-3 py-1 rounded"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const demoUrl = "https://fra.cloud.appwrite.io/v1/storage/buckets/68786dfd0010507fa2df/files/6878b86d000d2e85acf8/view?project=6877342c0034395d4249&mode=admin";

function countArikelLength(string, imagesToreplace) {
  let newLenght = string;

  for (const item of imagesToreplace) {
    newLenght = newLenght.replace(item.placeholder, demoUrl);
  }
  return newLenght.length;
}
