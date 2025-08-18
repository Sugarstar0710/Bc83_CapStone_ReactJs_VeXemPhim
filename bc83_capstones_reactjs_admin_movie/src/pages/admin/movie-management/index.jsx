import {
  listMovieAPI,
  deleteMovieAPI,
  updateMovieAPI,
  addMovieAPI,
} from "@/apis/movie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";

export default function MovieManagement() {
  const [page, setPage] = useState(1);
  const [editForm, setEditForm] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryFn: () =>
      listMovieAPI({ soTrang: page, soPhanTuTrenTrang: 10, maNhom: "GP00" }),
    queryKey: [
      "movie-list",
      { soTrang: page, soPhanTuTrenTrang: 10, maNhom: "GP00" },
    ],
    keepPreviousData: true,
  });

  // Get movies from API
  const rawMovies = data?.items || data || [];
  const allMovies = rawMovies;

  // Apply search filter
  const movies = useMemo(() => {
    if (!searchTerm.trim()) {
      return allMovies;
    }

    return allMovies.filter(
      (movie) =>
        movie.tenPhim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.moTa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.maPhim?.toString().includes(searchTerm)
    );
  }, [allMovies, searchTerm]);

  const totalPages =
    data?.totalPages || Math.ceil((allMovies?.length || 0) / 10) || 1;

  // Search function
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const deleteMutation = useMutation({
    mutationFn: (maPhim) => deleteMovieAPI(maPhim),
    onSuccess: (response, maPhim) => {
      // Always invalidate cache to get fresh data from API
      queryClient.invalidateQueries({
        queryKey: ["movie-list"],
        exact: false,
      });

      toast.success("🗑️ Xóa phim thành công!");
    },
    onError: (error) => {
      console.error("Delete movie error:", error);

      const message = error.message || "Có lỗi xảy ra khi xóa phim!";

      if (message.includes("được bảo vệ")) {
        toast.warning("⚠️ " + message);
      } else if (message.includes("Lỗi kết nối mạng")) {
        toast.error("🌐 " + message);
      } else if (message.includes("Lỗi server")) {
        toast.error("🚨 " + message);
      } else if (message.includes("Không có quyền")) {
        toast.error("❌ " + message);
      } else {
        toast.error("❌ " + message);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateMovieAPI(formData),
    onSuccess: (response) => {
      setShowEdit(false);
      // Always invalidate cache to get fresh data
      queryClient.invalidateQueries({
        queryKey: ["movie-list"],
        exact: false,
      });

      toast.success("🎉 Cập nhật phim thành công!");
    },
    onError: (error) => {
      console.error("Update movie error:", error);

      const message = error.message || "Có lỗi xảy ra khi cập nhật phim!";

      if (message.includes("Lỗi kết nối mạng")) {
        toast.error("🌐 " + message);
      } else if (message.includes("Lỗi server")) {
        toast.error("🚨 " + message);
      } else if (message.includes("Không có quyền")) {
        toast.error("❌ " + message);
      } else if (message.includes("không thể")) {
        toast.warning("⚠️ " + message);
      } else if (message.includes("không được để trống")) {
        toast.error("📝 " + message);
      } else {
        toast.error("❌ " + message);
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: (formData) => addMovieAPI(formData),
    onSuccess: (response) => {
      setShowAdd(false);
      // Always invalidate cache to get fresh data
      queryClient.invalidateQueries({
        queryKey: ["movie-list"],
        exact: false,
      });

      toast.success("🎉 Thêm phim thành công!");
    },
    onError: (error) => {
      console.error("Add movie error:", error);

      const message = error.message || "Có lỗi xảy ra khi thêm phim!";

      if (message.includes("Vui lòng chọn hình ảnh")) {
        toast.error("📷 " + message);
      } else if (message.includes("Lỗi kết nối mạng")) {
        toast.error("🌐 " + message);
      } else if (message.includes("Lỗi server")) {
        toast.error("🚨 " + message);
      } else if (message.includes("Không có quyền")) {
        toast.error("❌ " + message);
      } else if (message.includes("không được để trống")) {
        toast.error("📝 " + message);
      } else {
        toast.error("❌ " + message);
      }
    },
  });

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                  🎭 Quản lý phim
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-gray-400">
                    Quản lý danh sách phim trong hệ thống
                  </p>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">
                      {searchTerm
                        ? `${movies.length}/${allMovies.length} phim`
                        : `${movies.length} phim`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdd(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    ➕ Thêm phim mới
                  </span>
                </button>
                <button
                  onClick={() =>
                    queryClient.invalidateQueries({ queryKey: ["movie-list"] })
                  }
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">🔄 Tải lại</span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm phim theo tên, mô tả hoặc mã phim..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-400">
                  {movies.length > 0 ? (
                    <span>
                      Tìm thấy{" "}
                      <strong className="text-blue-400">{movies.length}</strong>{" "}
                      phim phù hợp với "
                      <strong className="text-white">{searchTerm}</strong>"
                    </span>
                  ) : (
                    <span>
                      Không tìm thấy phim nào phù hợp với "
                      <strong className="text-white">{searchTerm}</strong>"
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Movies table */}
            <div className="overflow-x-auto rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-600">
                    <th className="p-4 text-left text-yellow-400 font-semibold">
                      🎬 Mã phim
                    </th>
                    <th className="p-4 text-left text-yellow-400 font-semibold">
                      🖼️ Poster
                    </th>
                    <th className="p-4 text-left text-yellow-400 font-semibold">
                      🎭 Tên phim
                    </th>
                    <th className="p-4 text-left text-yellow-400 font-semibold">
                      📝 Mô tả
                    </th>
                    <th className="p-4 text-left text-yellow-400 font-semibold">
                      ⭐ Đánh giá
                    </th>
                    <th className="p-4 text-left text-yellow-400 font-semibold">
                      📅 Trạng thái
                    </th>
                    <th className="p-4 text-left text-yellow-400 font-semibold">
                      ⚙️ Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl opacity-30">🎬</div>
                          <p className="text-gray-400 text-lg">
                            Đang tải danh sách phim...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl opacity-30">❌</div>
                          <p className="text-red-400 text-lg">
                            Lỗi tải dữ liệu phim
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : movies.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl opacity-30">🎭</div>
                          <p className="text-gray-400 text-lg">
                            Chưa có phim nào trong hệ thống
                          </p>
                          <button
                            onClick={() => setShowAdd(true)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
                          >
                            ➕ Thêm phim đầu tiên
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    movies.map((film, index) => (
                      <tr
                        key={film.maPhim}
                        className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 ${
                          index % 2 === 0 ? "bg-gray-800/10" : "bg-gray-900/10"
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                            #{film.maPhim}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="w-16 h-20 rounded-lg overflow-hidden shadow-lg border border-gray-600">
                            <img
                              src={film.hinhAnh}
                              alt={film.tenPhim}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <h3 className="text-white font-semibold text-lg">
                              {film.tenPhim}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {new Date(film.ngayKhoiChieu).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-300 text-sm line-clamp-3 max-w-xs">
                            {film.moTa?.length > 100
                              ? `${film.moTa.substring(0, 100)}...`
                              : film.moTa}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-lg">⭐</span>
                            <span className="text-white font-semibold">
                              {film.danhGia || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {film.dangChieu && (
                              <span className="px-2 py-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                🟢 Đang chiếu
                              </span>
                            )}
                            {film.sapChieu && (
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                🔵 Sắp chiếu
                              </span>
                            )}
                            {film.hot && (
                              <span className="px-2 py-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 text-red-400 text-xs rounded-full border border-red-500/30">
                                🔥 Hot
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                              onClick={() => {
                                setEditForm(film);
                                setShowEdit(true);
                              }}
                              title="Chỉnh sửa phim"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Bạn có chắc muốn xoá phim này?"
                                  )
                                )
                                  deleteMutation.mutate(film.maPhim);
                              }}
                              title="Xóa phim"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-700/30">
              <button
                className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 disabled:from-gray-800 disabled:to-gray-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ⬅️ Trang trước
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Trang</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold">
                  {page}
                </span>
                <span className="text-gray-400">trên</span>
                <span className="text-white font-semibold">{totalPages}</span>
              </div>

              <button
                className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 disabled:from-gray-800 disabled:to-gray-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Trang sau ➡️
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Movie Modal */}
      <AddMovie
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(newMovie) => {
          addMutation.mutate(newMovie);
        }}
      />

      {/* Edit Movie Modal */}
      <EditMovie
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        movieData={editForm}
        onUpdate={(updatedMovie) => {
          updateMutation.mutate(updatedMovie);
        }}
      />

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
