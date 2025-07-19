import { useMemo, useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { FaSearch, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { updateUser } from "../../utils/updateUser.js";
import { databases, storage, DATABASES_ID, USER_ID, AVATAR_ID, PROJECT_ID } from "../../lib/appwrite.js";
import { ID } from "appwrite";

export default function AdminUserPage() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortBy, setSortBy] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setTaostMsg] = useState("");

  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const columns = useMemo(
    () => [
      {
        accessorKey: "photoUrl",
        header: "",
        cell: ({ row }) => <img src={row.original.photoUrl} alt={row.original.name} className="w-10 h-10 rounded-full" />,
      },
      {
        accessorKey: "name",
        header: () => "Name",
      },
      {
        accessorKey: "email",
        header: () => "Email",
      },
      {
        accessorKey: "password",
        header: () => "Password",
      },
      {
        accessorKey: "role",
        header: () => "Role",
      },
      {
        accessorKey: "gender",
        header: () => "Gender",
      },
      {
        accessorKey: "$createdAt",
        header: () => "Tgl Dibuat",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button onClick={() => handleEdit(row.original)} className="text-blue-500 hover:text-blue-700">
              <FaEdit />
            </button>
            <button onClick={() => handleDelete(row.original.$id, row.original.photoId)} className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // get initial data
  const getInitialUserData = async () => {
    try {
      const res = await databases.listDocuments(DATABASES_ID, USER_ID);
      const removeAdmin = res.documents.filter((user) => user.name !== "golang");
      setData(removeAdmin);
    } catch (error) {
      console.error("Gagal megambil data users:", error);
    }
  };

  useEffect(() => {
    getInitialUserData();
  }, []);
  // Simpan URL hasil upload
  const handleImageUpload = (file) => {
    if (!file) return;

    // Preview lokal
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setPhotoFile(file);

    // Lanjutkan upload ke Appwrite
    // User akan tangani bagian ini
    // Contoh: setelah berhasil upload:
    // setPhotoUrl(uploadedImageUrl);
  };

  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedRole) {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }
    if (globalFilter) {
      filtered = filtered.filter((user) => user.name.toLowerCase().includes(globalFilter.toLowerCase()));
    }
    return filtered;
  }, [data, globalFilter, selectedRole]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting: sortBy },
    onSortingChange: setSortBy,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleDelete = async (id, photoId) => {
    try {
      if (confirm("Hapus user ini?")) {
        console.log("Sedang menghapus user....");
        const res = await updateUser({ userId: id, action: "delete" });
        if (!res.success) throw Error(res.message);

        await databases.deleteDocument(DATABASES_ID, USER_ID, id);
        await storage.deleteFile(AVATAR_ID, photoId);

        console.log("user berhasil dihapus");
        getInitialUserData();
      }
    } catch (error) {
      console.error("Error delete user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setModalOpen(true);
    reset(user);
  };

  const handleAddUser = () => {
    setEditUser(null);
    reset();
    setModalOpen(true);
  };
  const toastTime = (msg) => {
    setTaostMsg(msg);
    setTimeout(() => {
      setTaostMsg("");
    }, 2000);
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    if (formData.password.length < 8) {
      toastTime("Password minimal 8 karakter!");
      setLoading(false);
      return;
    }
    try {
      if (editUser) {
        // update data user pada auth
        const res = await updateUser({ email: formData.email, password: formData.password, userId: formData.$id, action: "update" });
        if (!res.success) throw Error(res.message);

        await databases.updateDocument(DATABASES_ID, USER_ID, formData.$id, {
          name: formData.name,
          password: formData.password,
          email: formData.email,
          gender: formData.gender,
        });

        console.log("user berhasil di edit");
        getInitialUserData();
      } else {
        const payload = { ...formData, photoFile };
        // upload data untuk buat akun baru pada auth
        const res = await updateUser({ email: payload.email, password: payload.password, action: "create" });
        if (!res.success) throw Error(res.message);

        // Upload foto ke Storage
        const uploaded = await storage.createFile(AVATAR_ID, ID.unique(), payload.photoFile);

        // Dapatkan URL foto
        const photoUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${AVATAR_ID}/files/${uploaded.$id}/view?project=${PROJECT_ID}&mode=admin`;

        // Simpan data tambahan user ke koleksi `users`
        await databases.createDocument(DATABASES_ID, USER_ID, res.user.$id, {
          name: payload.name,
          email: payload.email,
          gender: payload.gender,
          role: payload.role,
          photoUrl,
          photoId: uploaded.$id,
          password: payload.password,
        });
        console.log("User berhasil dibuat");
        getInitialUserData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Manajemen User</h1>
        <button onClick={handleAddUser} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <FaPlus />
          Tambah User
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative max-w-xs w-full">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari user..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full"
          />
        </div>

        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="p-3 font-semibold text-gray-600 cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg relative ">
            <div className="flex gap-4 justify-baseline items-baseline">
              <h2 className="text-xl font-semibold mb-4">{editUser ? "Edit User" : "Tambah User"}</h2>
              {toastMsg !== "" && <span className="text-red-600 font-bold tex-lg">{toastMsg}</span>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <input type="text" placeholder="Nama" {...register("name", { required: true })} className="border p-2 rounded" />
              {errors.name && <span className="text-red-500">Nama wajib diisi</span>}

              <input type="email" placeholder="Email" {...register("email", { required: true })} className="border p-2 rounded" />
              {errors.email && <span className="text-red-500">Email wajib diisi</span>}

              <input type="text" placeholder="Password" {...register("password", { required: true })} className="border p-2 rounded" />
              {errors.password && <span className="text-red-500">Password wajib diisi</span>}

              {editUser === null && (
                <div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="border p-2 rounded max-w-sm bg-gray-300" />
                  {preview && <img src={preview} alt="Preview" className="w-16 h-16 rounded-full mt-2" />}
                </div>
              )}

              <select {...register("role")} className="border p-2 rounded">
                <option value="user">User</option>
                {/* <option value="admin">Admin</option> */}
              </select>

              <select {...register("gender")} className="border p-2 rounded">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded hover:bg-red-600">
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded hover:bg-green-600 ${loading ? "bg-gray-400 cursor-not-allowed opacity-60" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"}`}
                  disabled={loading}
                >
                  {loading ? "...menyimpan" : "simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
