import { PATH } from "@/routes/path";
import { sessionManager, setupAutoLogout } from "@/utils/sessionManager";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DasboardLayout({ children }) {
  const navigate = useNavigate();
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  // 🔐 SETUP AUTO LOGOUT VÀ SESSION MANAGEMENT
  useEffect(() => {
    if (!user) return;

    // Setup auto logout khi không hoạt động
    const cleanup = setupAutoLogout(() => {
      toast.warning("Phiên đăng nhập đã hết hạn do không hoạt động!");
      setTimeout(() => {
        navigate(PATH.LOGIN);
      }, 2000);
    });

    // Cleanup khi component unmount
    return cleanup;
  }, [user, navigate]);

  const handleLogout = () => {
    sessionManager.clearSession();
    toast.success("Đăng xuất thành công!");
    navigate(PATH.LOGIN);
  };

  const handleHome = () => {
    navigate(PATH.HOME);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Cinema background effects */}
      <div
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(255, 255, 255, 0.02) 40px,
            rgba(255, 255, 255, 0.02) 44px
          )`,
        }}
      ></div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="w-64 bg-gradient-to-b from-black/80 via-gray-900/90 to-black/80 text-white shadow-2xl backdrop-blur-sm border-r border-gray-700/30">
          <div
            className="p-6 font-bold text-xl border-b border-gray-700/50 cursor-pointer hover:bg-gray-800/50 transition-all duration-300"
            onClick={() => handleHome()}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎬</span>
              <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                VIET CHUONG CINEMA
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-normal">
              Admin Dashboard
            </p>
          </div>
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              <li
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 cursor-pointer rounded-lg transition-all duration-300 border border-transparent hover:border-blue-500/30"
                onClick={() => navigate(PATH.ADMIN_USER_MANAGEMENT)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">👥</span>
                  <span className="font-medium">Quản lý người dùng</span>
                </div>
              </li>
              <li
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-yellow-600/20 cursor-pointer rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/30"
                onClick={() => navigate(PATH.ADMIN_MOVIE_MANAGEMENT)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎭</span>
                  <span className="font-medium">Quản lý phim</span>
                </div>
              </li>
              <li
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 cursor-pointer rounded-lg transition-all duration-300 border border-transparent hover:border-purple-500/30"
                onClick={() => navigate(PATH.SHOWTIME_MANAGEMENT)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎫</span>
                  <span className="font-medium">Quản lý lịch chiếu</span>
                </div>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="bg-gradient-to-r from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl p-6 flex justify-between items-center shadow-2xl border-b border-gray-700/30">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                🎪 Bảng điều khiển
              </h1>
              <div className="px-3 py-1 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full border border-green-500/30">
                <span className="text-green-400 text-sm font-medium">
                  ● Online
                </span>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-white">{user.hoTen}</p>
                  <p className="text-xs text-gray-400">
                    {user.maLoaiNguoiDung === "QuanTri"
                      ? "Quản trị viên"
                      : "Người dùng"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.hoTen?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <button
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={handleLogout}
                >
                  <span className="flex items-center gap-2">🚪 Đăng xuất</span>
                </button>
              </div>
            )}
          </header>
          <main className="flex-1 bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-900/50 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
