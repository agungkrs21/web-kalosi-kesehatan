import { createContext, useState, useEffect, useContext } from "react";
import { account, databases, storage, AVATAR_ID, DATABASES_ID, USER_ID, PROJECT_ID } from "../lib/appwrite";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });

  const getDataFromStorage = async (setter, key) => {
    try {
      const jsonValue = await JSON.parse(localStorage.getItem(key));
      jsonValue != undefined && setter(jsonValue);
    } catch (error) {
      console.log("Gagal mengambil data dari storage");
    }
  };

  const handleLogin = async (credentials) => {
    try {
      //buat sesi login
      await account.createEmailPasswordSession(credentials.email, credentials.password);
      // ambil data user stelah login
      const user = await account.get();
      const userData = await databases.getDocument(DATABASES_ID, USER_ID, user.$id);
      localStorage.setItem("userData", JSON.stringify({ ...user, ...credentials, ...userData }));
      await getDataFromStorage(setUser, "userData");
      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("❌ Gagal login:", error.message);

      return {
        success: false,
        error: error.message,
      };
    }
  };

  const handleRegister = async (credentials) => {
    try {
      // buat akun
      const newUser = await account.create(ID.unique(), credentials.email, credentials.password);

      // login user agar bisa account.get()
      await account.createEmailPasswordSession(credentials.email, credentials.password);

      //  Ambil ID user yang sedang login
      const currentUser = await account.get();
      const userId = currentUser.$id;

      // Upload foto ke Storage
      const uploaded = await storage.createFile(AVATAR_ID, ID.unique(), credentials.photoFile);

      // Dapatkan URL foto
      const photoUrl = `https://cloud.appwrite.io/v1/storage/buckets/${AVATAR_ID}/files/${uploaded.$id}/preview?project=${PROJECT_ID}&mode=admin`;

      // Simpan data tambahan user ke koleksi `users`
      await databases.createDocument(DATABASES_ID, USER_ID, userId, {
        name: credentials.name,
        email: credentials.email,
        gender: credentials.gender,
        role: credentials.role,
        photoUrl,
      });
      localStorage.setItem("userData", JSON.stringify({ userId, ...credentials, photoFile: photoUrl }));
      await getDataFromStorage(setUser, "userData");
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  async function handleLogout() {
    try {
      await account.deleteSession("current");
      localStorage.removeItem("userData");
      console.log("✅ Logout berhasil");

      // Redirect atau update state di UI kamu
      window.location.reload();
    } catch (err) {
      console.error("❌ Gagal logout:", err.message);
    }
  }

  const contextData = {
    user,
    handleRegister,
    handleLogout,
    handleLogin,
  };

  return <AuthContext.Provider value={contextData}>{loading ? <p>loading...</p> : children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
