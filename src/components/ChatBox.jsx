import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ChatBox({ messages, onSendMessage, onEditMessage, onDeleteMessage, currentUserData, selectedUser }) {
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-2xl border rounded-xl shadow bg-white p-4 flex flex-col max-h-[90vh]">
        <div className="text-xl font-semibold mb-3 text-center">Live Chat</div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 rounded-lg mb-4 max-h-[60vh]">
          {messages.map((message) => {
            const isOwn = message.senderId === currentUserData.$id;
            const isEditing = editingId === message.$id;

            return (
              <div key={message.$id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative max-w-xs px-4 py-2 rounded-lg shadow-md
                  ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}
                  ${isOwn ? "rounded-br-none" : "rounded-bl-none"}`}
                >
                  {!isOwn && currentUserData.role === "user" && <p className="text-black/20 border-b-1 text-sm">Dokter boyke</p>}

                  {!isOwn && currentUserData.role === "admin" && <p className="text-black/20 border-b-1 text-sm">{selectedUser.name}</p>}
                  {isEditing ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onEditMessage(message.$id, editText);
                        setEditingId(null);
                        setEditText("");
                      }}
                    >
                      <input className="w-full p-1 rounded text-white bg-blue-700" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                      <div className="flex gap-2 mt-1">
                        <button type="submit" className="text-sm bg-green-500 px-2 py-1 rounded text-white">
                          Simpan
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="text-sm text-gray-200">
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <span className="text-base break-words">{message.body}</span>
                  )}

                  <p className="text-sm opacity-70 mt-1">
                    {new Date(message.$createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {isOwn && !isEditing && (
                    <div className="space-x-2 mt-2 text-right">
                      <button
                        onClick={() => {
                          setEditingId(message.$id);
                          setEditText(message.body);
                        }}
                        className="hover:text-yellow-300 text-white/50"
                        title="Edit pesan"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => onDeleteMessage(message.$id)} className="hover:text-red-400 text-white/50" title="Hapus pesan">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Input message */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
