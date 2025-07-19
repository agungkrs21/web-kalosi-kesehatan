import { databases, DATABASES_ID, MEDIA_ID } from "../lib/appwrite";
import { useState, useEffect } from "react";
export default function MediaEdukasiPage() {
  const [mediaList, setMediaList] = useState([]);

  const getInitialMedia = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, MEDIA_ID);
      setMediaList(res.documents);
    } catch (error) {
      console.error("Gagla mendapatkan Media:", error);
    }
  };

  useEffect(() => {
    getInitialMedia();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Media Edukasi</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mediaList.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col justify-between">
              <div className="mb-2">
                <h2 onClick={() => window.open(item.url, "_blank")} className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                  {item.title}
                </h2>
              </div>
              <iframe className="w-full rounded mt-3 aspect-video" src={item.url.replace("watch?v=", "embed/")} title={item.title} frameBorder="0" allowFullScreen />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
