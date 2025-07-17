import { useState, useEffect } from "react";
import { databases, client, MESSAGES_ID, DATABASES_ID } from "../lib/appwrite";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ID, Query } from "appwrite";
import ChatBox from "../components/ChatBox";

const UserChatPge = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  // Ambil pesan awal
  const getMessages = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MESSAGES_ID, [
        Query.or([Query.equal("senderId", user.$id), Query.equal("reciverId", user.$id)]),
        Query.orderAsc("$createdAt"), // opsional: urutkan dari lama ke baru
      ]);
      setMessages(res.documents);
    } catch (error) {
      console.log("Gagal ambil pesan:", error);
    }
  };

  // Kirim pesan
  const sendMessage = async (body) => {
    try {
      await databases.createDocument(DATABASES_ID, MESSAGES_ID, ID.unique(), {
        senderId: user.$id,
        reciverId: "68787b9c000a7e1982f3",
        username: user.name,
        status: "unread",
        body,
      });
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
    }
  };

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
  if (user.role !== "user") return <Navigate to="/" />;
  return (
    <div className="h-screen bg-white">
      <ChatBox messages={messages} onSendMessage={sendMessage} onEditMessage={editMessage} onDeleteMessage={deleteMessage} currentUserData={user} />
    </div>
  );
};

export default UserChatPge;
