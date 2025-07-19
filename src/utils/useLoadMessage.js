import { useState, useEffect } from "react";
import { databases, client, DATABASES_ID, MESSAGES_ID } from "../lib/appwrite";
import { Query } from "appwrite";

const useLoadMessage = () => {
  const [totalUnread, setTotalUnread] = useState(0);
  let userId = "";

  const fetchMessage = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MESSAGES_ID, [Query.equal("reciverId", userId), Query.equal("status", "unread")]);
      setTotalUnread(res.total);
    } catch (error) {
      console.error("Error saat mengambil data pesan:", error);
    }
  };

  const loadData = async (id) => {
    try {
      userId = id;
      await Promise.all([fetchMessage(id)]);
    } catch (error) {
      console.error("Gagal memuat data pesan:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = client.subscribe(`databases.${DATABASES_ID}.collections.${MESSAGES_ID}.documents`, (response) => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        const msg = response.payload;

        // ✅ Hanya update jika berkaitan dengan user saat ini
        if (msg.reciverId === userId) {
          setTotalUnread((prev) => prev + 1);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [userId]);

  return { loadData, fetchMessage, totalUnread };
};

export default useLoadMessage;
