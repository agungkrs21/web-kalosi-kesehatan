import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { databases, client, DATABASES_ID, MESSAGES_ID } from "../lib/appwrite";
import { Query, ID } from "appwrite";

// Dummy data user
const dummyUsers = [
  { id: "user1", name: "Agus" },
  { id: "user2", name: "Rina" },
  { id: "user3", name: "Budi" },
];

export default function AdminChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const currentAdminId = "admin1"; // Simulasi ID admin login
  const { user } = useAuth();

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    getListUserMassage();
    const unsubscribe = client.subscribe(`databases.${DATABASES_ID}.collections.${MESSAGES_ID}.documents`, (response) => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        const msg = response.payload;

        // ✅ Hanya update jika berkaitan dengan user saat ini
        if (msg.senderId === user.$id || msg.reciverId === user.$id) {
          setMessages((prev) => [...prev, msg]);
        }
      }
      if (response.events.includes("databases.*.collections.*.documents.*.update")) {
        const msg = response.payload;

        // ✅ Hanya update jika berkaitan dengan user saat ini
        if (msg.senderId === user.$id || msg.reciverId === user.$id) {
          setMessages((prev) => prev.map((oldmsg) => (oldmsg.$id === msg.$id ? { ...msg, body: msg.body } : oldmsg)));
        }
      }
      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        const msg = response.payload;

        // ✅ Hanya update jika berkaitan dengan user saat ini
        if (msg.senderId === user.$id || msg.reciverId === user.$id) {
          setMessages((prev) => prev.filter((oldmsg) => oldmsg.$id !== msg.$id));
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getListUserMassage = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MESSAGES_ID, [Query.and([Query.equal("reciverId", user.$id), Query.equal("status", "unread")]), Query.orderAsc("$createdAt")]);
      setUserList(makeUserLis(res.documents));
    } catch (error) {
      console.log("gagal mendapatkan pesan user:", error);
    }
  };
  const fetchMessages = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MESSAGES_ID, [
        Query.or([Query.equal("senderId", user.$id), Query.equal("reciverId", user.$id)]),
        Query.orderAsc("$createdAt"), // opsional: urutkan dari lama ke baru
      ]);
      setMessages(res.documents.filter((msg) => msg.senderId === selectedUser.id || msg.reciverId === selectedUser.id));
    } catch (error) {
      console.log("Gagal ambil pesan:", error);
    }
  };

  const handleSendMessage = async (body) => {
    try {
      await databases.createDocument(DATABASES_ID, MESSAGES_ID, ID.unique(), {
        senderId: user.$id,
        reciverId: selectedUser.id,
        username: user.name,
        status: "read",
        body,
      });
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
    }
  };

  const handleEditMessage = async (id, newText) => {
    try {
      await databases.updateDocument(DATABASES_ID, MESSAGES_ID, id, {
        body: newText,
      });

      setMessages((prev) => prev.map((msg) => (msg.$id === id ? { ...msg, body: newText } : msg)));
    } catch (error) {
      console.error("Gagal edit pesan:", error);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await databases.deleteDocument(DATABASES_ID, MESSAGES_ID, id);
      setMessages((prev) => prev.filter((msg) => msg.$id !== id));
    } catch (error) {
      console.error("Gagal hapus pesan:", error);
    }
  };

  //   cek user role
  if (user.role !== "admin") return <Navigate to="/" />;
  return (
    <div className="flex min-h-screen">
      {/* Sidebar user */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Daftar User</h2>
        <ul className="space-y-2">
          {userList.map((user) => (
            <li key={user.id} className={`p-2 rounded cursor-pointer hover:bg-blue-100 ${selectedUser?.id === user.id ? "bg-blue-200" : ""}`} onClick={() => setSelectedUser(user)}>
              {user.name} <span className="bg-red-600 text-white rounded-full px-2">{user.count}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex items-center justify-center bg-blue-50">
        {selectedUser ? (
          <div className="w-full max-w-5xl">
            <ChatBox messages={messages} onSendMessage={handleSendMessage} onEditMessage={handleEditMessage} onDeleteMessage={handleDeleteMessage} currentUserData={user} selectedUser={selectedUser} />
          </div>
        ) : (
          <p className="text-gray-500">Pilih user untuk memulai percakapan</p>
        )}
      </main>
    </div>
  );
}

function makeUserLis(doc) {
  const payload = [];
  const seen = {};
  doc.forEach((item) => {
    if (seen[item.username]) {
      seen[item.username] = { ...seen[item.username], count: seen[item.username].count + 1 };
    } else {
      seen[item.username] = { id: item.senderId, name: item.username, count: 1 };
    }
  });
  for (let item in seen) {
    payload.push(seen[item]);
  }
  return payload;
}
