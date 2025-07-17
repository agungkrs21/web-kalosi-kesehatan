import { useState, useEffect } from "react";
import { databases, client, MESSAGES_ID, DATABASES_ID } from "../lib/appwrite";
import { ID } from "appwrite";
import ChatBox from "../components/ChatBox";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("user_demo_123"); // Ganti dengan auth user sebenarnya

  // Ambil pesan awal
  const getMessages = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MESSAGES_ID);
      setMessages(res.documents);
    } catch (error) {
      console.log("Gagal ambil pesan:", error);
    }
  };

  // Kirim pesan
  const sendMessage = async (body) => {
    try {
      await databases.createDocument(DATABASES_ID, MESSAGES_ID, ID.unique(), {
        user_id: userId,
        body,
      });
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
    }
  };

  // Tambahkan ke dalam fungsi utama ChatApp
  const editMessage = async (id, newBody) => {
    try {
      await databases.updateDocument(DATABASES_ID, MESSAGES_ID, id, {
        body: newBody,
      });
      setMessages((prev) => prev.map((msg) => (msg.$id === id ? { ...msg, body: newBody } : msg)));
    } catch (error) {
      console.error("Gagal edit pesan:", error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await databases.deleteDocument(DATABASES_ID, MESSAGES_ID, id);
      setMessages((prev) => prev.filter((msg) => msg.$id !== id));
    } catch (error) {
      console.error("Gagal hapus pesan:", error);
    }
  };

  useEffect(() => {
    getMessages();

    // Subscribe ke real-time pesan baru
    const unsubscribe = client.subscribe(`databases.${DATABASES_ID}.collections.${MESSAGES_ID}.documents`, (response) => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        setMessages((prev) => [...prev, response.payload]);
      }
    });

    return () => {
      unsubscribe(); // Bersihkan langganan
    };
  }, []);

  return (
    <div className="h-screen bg-white">
      <ChatBox messages={messages} onSendMessage={sendMessage} onEditMessage={editMessage} onDeleteMessage={deleteMessage} currentUserId={userId} />
    </div>
  );
};

export default ChatApp;
