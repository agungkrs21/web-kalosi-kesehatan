import { Navigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { user, loading, handleLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await handleLogin(form);
      if (result.success) {
        setMsg("✅ Berhasil Login");
        setForm({ email: "", password: "" });
      }
    } catch (error) {
      setMsg("❌ Gagal: " + result.error);
    }
  };

  if (user) return <Navigate to="/" />;
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {msg && <p className="text-sm text-center text-red-500">{msg}</p>}

      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded-lg" required />

      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded-lg" required />

      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {loading ? "Masuk..." : "Login"}
      </button>
      <div>
        <p>
          Belum punya akun ?
          <a href="/register" className="text-blue-600 hover:underline pl-2">
            Daftar di sini
          </a>
        </p>
      </div>
    </form>
  );
};

export default Login;
