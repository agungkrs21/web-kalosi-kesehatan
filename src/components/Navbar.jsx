import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, handleLogout } = useAuth();

  if (!user) return null;
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2">
            <a href="/">
              <span className="text-lg sm:text-xl font-bold text-blue-600">Puskesmas Kalosi</span>
            </a>
          </div>
        </div>

        {/* Search */}
        <div className="w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Cari artikel edukasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right Side: Dropdown + User */}
        <div className="flex items-center justify-between gap-4">
          {/* Desktop Dropdown */}
          <div className="hidden md:block relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Menu ▾
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md z-10">
                <a href="#media" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Media
                </a>
                <a href="#edukasi" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Edukasi
                </a>
                <a href="/chat" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Dialog
                </a>
              </div>
            )}
          </div>

          {/* User Info */}

          <div className="flex items-center gap-3">
            <img src={user.photoUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
            <div className="hidden sm:block text-sm text-right">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-gray-500 text-xs">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="ml-2 text-sm text-red-500 hover:underline">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav: stack horizontal */}
      <div className="md:hidden border-t px-4 py-2 flex justify-around text-sm">
        <a href="#media" className="text-gray-600 hover:text-blue-600">
          Media
        </a>
        <a href="#edukasi" className="text-gray-600 hover:text-blue-600">
          Edukasi
        </a>
        <a href="#dialog" className="text-gray-600 hover:text-blue-600">
          Dialog
        </a>
      </div>
    </nav>
  );
}
