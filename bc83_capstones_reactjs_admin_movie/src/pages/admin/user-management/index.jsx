import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import {
  addUser,
  listUserAPI,
  updateUserInfo,
  deleteUserAPI,
  searchUserAPI,
} from "@/apis/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaSync } from "react-icons/fa";

// Edit User Form Component
const EditUserForm = ({ user, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    taiKhoan: user?.taiKhoan || "",
    matKhau: user?.matKhau || "",
    hoTen: user?.hoTen || "",
    email: user?.email || "",
    soDT: user?.soDT || user?.soDt || "",
    maLoaiNguoiDung: user?.maLoaiNguoiDung || "KhachHang",
    maNhom: "GP00",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.taiKhoan ||
      !formData.matKhau ||
      !formData.hoTen ||
      !formData.email ||
      !formData.soDT
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl w-full max-w-lg space-y-6 relative border border-gray-700/30 shadow-2xl">
      <button
        type="button"
        className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white transition-colors"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ✏️ Chỉnh sửa người dùng
        </h2>
        <p className="text-gray-400 mt-2">Cập nhật thông tin người dùng</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tài khoản
            </label>
            <input
              type="text"
              name="taiKhoan"
              value={formData.taiKhoan}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 rounded-lg px-4"
              disabled
              placeholder="Tên tài khoản"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 rounded-lg px-4"
              placeholder="Mật khẩu"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 rounded-lg px-4"
              placeholder="Họ và tên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 rounded-lg px-4"
              placeholder="Email"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="soDT"
              value={formData.soDT}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 rounded-lg px-4"
              placeholder="Số điện thoại"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300"
          >
            {isLoading ? "Đang cập nhật..." : "💾 Lưu thay đổi"}
          </button>
          <button
            type="button"
            className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300"
            onClick={onClose}
          >
            ❌ Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

// Add User Form Component
const AddUserForm = ({ onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDT: "",
    maLoaiNguoiDung: "KhachHang",
    maNhom: "GP00",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.taiKhoan ||
      !formData.matKhau ||
      !formData.hoTen ||
      !formData.email ||
      !formData.soDT
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl w-full max-w-lg space-y-6 relative border border-gray-700/30 shadow-2xl">
      <button
        type="button"
        className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white transition-colors"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          ➕ Thêm người dùng mới
        </h2>
        <p className="text-gray-400 mt-2">Điền thông tin để tạo người dùng</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tài khoản
            </label>
            <input
              type="text"
              name="taiKhoan"
              value={formData.taiKhoan}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 rounded-lg px-4"
              placeholder="Tên tài khoản"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 rounded-lg px-4"
              placeholder="Mật khẩu"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 rounded-lg px-4"
              placeholder="Họ và tên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 rounded-lg px-4"
              placeholder="Email"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="soDT"
              value={formData.soDT}
              onChange={handleInputChange}
              className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 rounded-lg px-4"
              placeholder="Số điện thoại"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300"
          >
            {isLoading ? "Đang thêm..." : "✅ Tạo người dùng"}
          </button>
          <button
            type="button"
            className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300"
            onClick={onClose}
          >
            ❌ Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

function UserManagement() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch users with React Query - Using GP00
  const { data, isLoading, error, refetch } = useQuery({
    queryFn: () => listUserAPI({ maNhom: "GP00" }),
    queryKey: ["user-list", { maNhom: "GP00" }],
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
  });

  // Search users - Using GP00
  const { data: searchData, isLoading: isSearching } = useQuery({
    queryFn: () => searchUserAPI({ maNhom: "GP00", tuKhoa: searchTerm }),
    queryKey: ["user-search", { maNhom: "GP00", tuKhoa: searchTerm }],
    enabled: !!searchTerm,
    keepPreviousData: true,
    staleTime: 0,
  });

  const users = searchTerm
    ? searchData?.content || searchData || []
    : data?.content || data || [];

  // Add user mutation
  const addMutation = useMutation({
    mutationFn: (formData) => addUser(formData),
    onSuccess: (response) => {
      // console.log("Add success response:", response);
      setShowAdd(false);

      // Refresh danh sách user
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      if (searchTerm) {
        queryClient.invalidateQueries({ queryKey: ["user-search"] });
      }

      toast.success("Thêm người dùng thành công!");
    },
    onError: (error) => {
      // console.error("Add error:", error);
      toast.error(
        error?.response?.data?.content || "Có lỗi xảy ra khi thêm người dùng!"
      );
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: (formData) => updateUserInfo(formData),
    onSuccess: (response, formData) => {
      // console.log("Update success response:", response);
      setShowEdit(false);
      setSelectedUser(null);

      // Refresh danh sách user
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      if (searchTerm) {
        queryClient.invalidateQueries({ queryKey: ["user-search"] });
      }

      toast.success("Cập nhật người dùng thành công!");
    },
    onError: (error) => {
      // console.error("Update error:", error);
      toast.error(
        error?.response?.data?.content ||
          "Có lỗi xảy ra khi cập nhật người dùng!"
      );
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (taiKhoan) => deleteUserAPI(taiKhoan),
    onSuccess: (response) => {
      // console.log("Delete success response:", response);

      // Refresh danh sách user
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
      if (searchTerm) {
        queryClient.invalidateQueries({ queryKey: ["user-search"] });
      }

      toast.success("Xóa người dùng thành công!");
    },
    onError: (error) => {
      // console.error("Delete error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa người dùng!");
    },
  });

  const handleDeleteUser = (taiKhoan) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteMutation.mutate(taiKhoan);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900/20 via-gray-900/20 to-black/20">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                  👥 Quản lý người dùng
                  <div className="px-2 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-400 text-xs font-medium">
                      {users.length}
                    </span>
                  </div>
                </h1>

                {/* Hiển thị thông tin user hiện tại */}
                {(() => {
                  const currentUser = localStorage.getItem("user");
                  const userInfo = currentUser ? JSON.parse(currentUser) : null;
                  if (userInfo) {
                    const roleColor =
                      userInfo.maLoaiNguoiDung === "QuanTri"
                        ? "from-red-500 to-pink-500"
                        : "from-blue-500 to-cyan-500";
                    const roleIcon =
                      userInfo.maLoaiNguoiDung === "QuanTri" ? "👑" : "👤";
                    return (
                      <div
                        className={`px-2 py-1 bg-gradient-to-r ${roleColor}/20 rounded-full border border-opacity-30 flex items-center gap-1 whitespace-nowrap`}
                      >
                        <span className="text-xs">{roleIcon}</span>
                        <span className="text-xs font-medium text-white/80 truncate max-w-[120px]">
                          {userInfo.taiKhoan}
                        </span>
                        <span className="text-[10px] text-white/60">
                          ({userInfo.maLoaiNguoiDung})
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEdit(false);
                    setSelectedUser(null);
                    setShowAdd(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <FaPlus /> Thêm người dùng
                  </span>
                </button>
                <button
                  onClick={() => {
                    // Refresh cả list và search
                    queryClient.invalidateQueries({ queryKey: ["user-list"] });
                    queryClient.invalidateQueries({
                      queryKey: ["user-search"],
                    });
                    refetch();
                    toast.success("Đã tải lại danh sách người dùng!");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <FaSync /> Tải lại
                  </span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo tài khoản, họ tên, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 rounded-lg pl-12 pr-4"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
                >
                  ❌ Xóa
                </button>
              </div>
            </div>

            {/* Users table */}
            <div className="overflow-x-auto rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-600">
                    <th className="p-3 text-left text-yellow-400 font-semibold w-32">
                      👤 Tài khoản
                    </th>
                    <th className="p-2 text-left text-yellow-400 font-semibold w-48">
                      📧 Email
                    </th>
                    <th className="p-2 text-left text-yellow-400 font-semibold w-28">
                      📱 Số ĐT
                    </th>
                    <th className="p-2 text-left text-yellow-400 font-semibold w-24">
                      👑 Vai Trò
                    </th>
                    <th className="p-2 text-left text-yellow-400 font-semibold w-36">
                      🏷️ Họ tên
                    </th>
                    <th className="p-2 text-left text-yellow-400 font-semibold w-24">
                      ⚙️ Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isSearching ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl opacity-30">👥</div>
                          <p className="text-gray-400 text-lg">
                            Đang tải danh sách người dùng...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl opacity-30">❌</div>
                          <p className="text-red-400 text-lg">
                            Lỗi tải dữ liệu người dùng
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl opacity-30">😔</div>
                          <p className="text-gray-400 text-lg">
                            {searchTerm
                              ? `Không tìm thấy người dùng nào với từ khóa "${searchTerm}"`
                              : "Chưa có người dùng nào trong hệ thống"}
                          </p>
                          {!searchTerm && (
                            <button
                              onClick={() => setShowAdd(true)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
                            >
                              ➕ Tạo người dùng đầu tiên
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr
                        key={user.taiKhoan}
                        className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-gray-800/10" : "bg-gray-900/10"
                        }`}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.hoTen?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <span className="text-white font-medium">
                              {user.taiKhoan}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 text-gray-300">{user.email}</td>
                        <td className="p-2 text-gray-300">
                          {user.soDT || user.soDt}
                        </td>
                        <td className="p-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              user.maLoaiNguoiDung === "QuanTri"
                                ? "bg-gradient-to-r from-red-600/20 to-orange-600/20 text-red-400 border border-red-500/30"
                                : "bg-gradient-to-r from-green-600/20 to-blue-600/20 text-green-400 border border-green-500/30"
                            }`}
                          >
                            {user.maLoaiNguoiDung === "QuanTri"
                              ? "👑 Admin"
                              : "👤 User"}
                          </span>
                        </td>
                        <td className="p-2 text-gray-300 font-medium">
                          {user.hoTen}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowAdd(false);
                                setSelectedUser(user);
                                setShowEdit(true);
                              }}
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                            {/* 🛡️ Ẩn nút xóa cho tài khoản được bảo vệ */}
                            {!["chiviet2025", "admin", "chiviet"].includes(
                              user.taiKhoan
                            ) ? (
                              <button
                                onClick={() => handleDeleteUser(user.taiKhoan)}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                                title="Xóa"
                              >
                                <FaTrash />
                              </button>
                            ) : (
                              <div
                                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-2 rounded-lg opacity-50 cursor-not-allowed"
                                title="🛡️ Tài khoản được bảo vệ không thể xóa"
                              >
                                🛡️
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal tạo người dùng */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] overflow-y-auto">
          <div className="my-8 mx-4">
            <AddUserForm
              onClose={() => setShowAdd(false)}
              onSave={(formData) => addMutation.mutate(formData)}
              isLoading={addMutation.isLoading}
            />
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa người dùng */}
      {showEdit &&
        selectedUser &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] overflow-y-auto">
            <div className="my-8 mx-4">
              <EditUserForm
                user={selectedUser}
                onClose={() => {
                  setShowEdit(false);
                  setSelectedUser(null);
                }}
                onSave={(formData) => updateMutation.mutate(formData)}
                isLoading={updateMutation.isLoading}
              />
            </div>
          </div>,
          document.body
        )}

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

export default UserManagement;
