import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "Laki-laki",
    role: "user",
    photoFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // auth provider
  const { handleRegister, handleLogout, user } = useAuth();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photoFile") {
      setForm({ ...form, photoFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const result = await handleRegister(form);

    if (result.success) {
      setMsg("✅ Akun berhasil dibuat!");
      setForm({ name: "", email: "", password: "", gender: "Laki-laki", role: "user", photoFile: null });
      window.location.reload();
    } else {
      setMsg("❌ Gagal: " + result.error);
    }

    setLoading(false);
  };

  if (user) return <Navigate to="/" />;
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Daftar Akun</h2>

      {msg && <p className="text-sm text-center text-red-500">{msg}</p>}

      <input type="text" name="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />

      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded-lg" required />

      <input type="password" name="password" placeholder="Password (min 8 karakter)" value={form.password} onChange={handleChange} className="w-full p-2 border rounded-lg" required minLength={8} />

      <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded-lg">
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>

      <input type="file" name="photoFile" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded-lg" required />

      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {loading ? "Mendaftar..." : "Daftar"}
      </button>

      <div>
        <p>
          Sudah punya akun ?
          <a href="/login" className="text-blue-600 hover:underline pl-2">
            Masuk Disini
          </a>
        </p>
      </div>
      <button onClick={handleLogout} type="button">
        lgoout
      </button>
    </form>
  );
}
