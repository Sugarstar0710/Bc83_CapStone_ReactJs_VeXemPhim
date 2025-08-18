import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Calendar,
  Clock,
  Film,
  MapPin,
  Plus,
  Search,
  RefreshCw,
  Edit,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllShowtimes,
  getHeThongRapAPI,
  createShowtimeAPI,
  getCumRapTheoHeThongAPI,
  getShowtimesByMovie,
} from "@/apis/showtime";
import { listMovieAPI } from "@/apis/movie";

export default function ShowtimeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newShowtime, setNewShowtime] = useState({
    maPhim: "",
    ngayChieuGioChieu: "",
    maRap: "",
    giaVe: 75000,
    maHeThongRap: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch movies for selection
  const { data: moviesData } = useQuery({
    queryKey: ["movie-list"],
    queryFn: () => listMovieAPI({ maNhom: "GP00" }),
  });

  const movies = moviesData?.items || moviesData || [];

  // Fetch theater systems
  const { data: theaterSystems = [] } = useQuery({
    queryKey: ["theater-systems"],
    queryFn: getHeThongRapAPI,
  });

  // Fetch theater clusters by selected system
  const { data: cumRapData = [] } = useQuery({
    queryKey: ["theater-clusters", newShowtime.maHeThongRap],
    queryFn: () => getCumRapTheoHeThongAPI(newShowtime.maHeThongRap),
    enabled: !!newShowtime.maHeThongRap,
  });

  // Create showtime mutation
  const createShowtimeMutation = useMutation({
    mutationFn: createShowtimeAPI,
    onSuccess: () => {
      toast.success("🎉 Tạo lịch chiếu thành công!");

      // Store the created movie ID to auto-select it
      const createdMovieId = newShowtime.maPhim;

      setShowCreateForm(false);
      setNewShowtime({
        maPhim: "",
        ngayChieuGioChieu: "",
        maRap: "",
        giaVe: 75000,
        maHeThongRap: "",
      });

      // Refresh data first
      queryClient.invalidateQueries({ queryKey: ["movie-showtimes"] });
      if (selectedMovie) {
        queryClient.invalidateQueries({
          queryKey: ["movie-showtimes", selectedMovie],
        });
      }
      if (createdMovieId) {
        queryClient.invalidateQueries({
          queryKey: ["movie-showtimes", createdMovieId],
        });
      }

      // Auto-select the movie to show the new showtime with a small delay
      setTimeout(() => {
        if (createdMovieId) {
          setSelectedMovie(createdMovieId);
          toast.info("📋 Đã chọn phim để hiển thị lịch chiếu mới");
        }
      }, 500);
    },
    onError: (error) => {
      console.error("Create showtime error:", error);
      toast.error(`❌ Lỗi tạo lịch chiếu: ${error.message}`);
    },
  });

  // Fetch showtimes for selected movie
  const { data: showtimesData, isLoading } = useQuery({
    queryKey: ["movie-showtimes", selectedMovie],
    queryFn: () =>
      selectedMovie
        ? getShowtimesByMovie(selectedMovie)
        : Promise.resolve(null),
    enabled: !!selectedMovie,
  });

  // Process showtimes data
  const showtimes = useMemo(() => {
    if (!showtimesData) return [];

    const allShowtimes = [];

    // Handle the actual API structure
    if (showtimesData.heThongRapChieu) {
      showtimesData.heThongRapChieu.forEach((heThong, heThongIndex) => {
        if (heThong.cumRapChieu) {
          heThong.cumRapChieu.forEach((cumRap, cumRapIndex) => {
            if (cumRap.lichChieuPhim) {
              cumRap.lichChieuPhim.forEach((lichChieu, lichChieuIndex) => {
                allShowtimes.push({
                  maLichChieu: lichChieu.maLichChieu,
                  maPhim: showtimesData.maPhim,
                  tenPhim: showtimesData.tenPhim,
                  hinhAnh: showtimesData.hinhAnh,
                  heThongRap: heThong.tenHeThongRap,
                  cumRap: cumRap.tenCumRap,
                  diaChi: cumRap.diaChi,
                  ngayChieuGioChieu: lichChieu.ngayChieuGioChieu,
                  giaVe: lichChieu.giaVe,
                  thoiLuong: lichChieu.thoiLuong || 120,
                });
              });
            }
          });
        }
      });
    }
    // Fallback for old structure (if any)
    else if (showtimesData.heThongRap) {
      showtimesData.heThongRap.forEach((heThong) => {
        if (heThong.cumRapChieu) {
          heThong.cumRapChieu.forEach((cumRap) => {
            if (cumRap.lichChieuPhim) {
              cumRap.lichChieuPhim.forEach((lichChieu) => {
                allShowtimes.push({
                  maLichChieu: lichChieu.maLichChieu,
                  maPhim: showtimesData.maPhim,
                  tenPhim: showtimesData.tenPhim,
                  hinhAnh: showtimesData.hinhAnh,
                  heThongRap: heThong.tenHeThongRap,
                  cumRap: cumRap.tenCumRap,
                  diaChi: cumRap.diaChi,
                  ngayChieuGioChieu: lichChieu.ngayChieuGioChieu,
                  giaVe: lichChieu.giaVe,
                  thoiLuong: lichChieu.thoiLuong || 120,
                });
              });
            }
          });
        }
      });
    }

    return allShowtimes;
  }, [showtimesData]);

  // Filter showtimes
  const filteredShowtimes = useMemo(() => {
    if (!searchTerm.trim()) return showtimes;

    return showtimes.filter(
      (showtime) =>
        showtime.tenPhim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.heThongRap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.cumRap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.diaChi?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [showtimes, searchTerm]);

  // Search functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Format datetime for API
  const formatDateTimeForAPI = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {
      const date = new Date(dateTimeString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Create showtime functions
  const handleCreateShowtime = (e) => {
    e.preventDefault();

    if (
      !newShowtime.maPhim ||
      !newShowtime.ngayChieuGioChieu ||
      !newShowtime.maRap
    ) {
      toast.error("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formattedDateTime = formatDateTimeForAPI(
      newShowtime.ngayChieuGioChieu
    );
    if (!formattedDateTime) {
      toast.error("⚠️ Định dạng ngày giờ không hợp lệ!");
      return;
    }

    const data = {
      maPhim: parseInt(newShowtime.maPhim),
      ngayChieuGioChieu: formattedDateTime,
      maRap: newShowtime.maRap,
      giaVe: newShowtime.giaVe,
    };

    createShowtimeMutation.mutate(data);
  };

  const handleShowtimeInputChange = (field, value) => {
    setNewShowtime((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset dependent fields
    if (field === "maHeThongRap") {
      setNewShowtime((prev) => ({
        ...prev,
        maRap: "",
      }));
    }
  };

  // Format date/time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Chưa xác định";
    try {
      // Handle both ISO format and dd/MM/yyyy hh:mm:ss format
      let date;
      if (dateTimeString.includes("/")) {
        // Format: dd/MM/yyyy hh:mm:ss
        const [datePart, timePart] = dateTimeString.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hours, minutes, seconds] = timePart.split(":");
        date = new Date(year, month - 1, day, hours, minutes, seconds);
      } else {
        // ISO format
        date = new Date(dateTimeString);
      }

      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting display date:", error);
      return dateTimeString;
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                  🎫 Quản lý lịch chiếu
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-gray-400">
                    Quản lý lịch chiếu phim trong hệ thống rạp
                  </p>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">
                      {filteredShowtimes.length} lịch chiếu
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Plus size={20} />
                    Tạo lịch chiếu
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (selectedMovie) {
                      queryClient.invalidateQueries({
                        queryKey: ["movie-showtimes", selectedMovie],
                      });
                    }
                    queryClient.invalidateQueries({
                      queryKey: ["movie-showtimes"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["theater-systems"],
                    });
                    queryClient.invalidateQueries({ queryKey: ["movie-list"] });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw size={20} />
                    Tải lại
                  </span>
                </button>
              </div>
            </div>

            {/* Movie selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chọn phim để xem lịch chiếu:
              </label>
              <select
                value={selectedMovie}
                onChange={(e) => {
                  setSelectedMovie(e.target.value);
                  setSearchTerm(""); // Clear search when changing movie
                }}
                className="w-full md:w-64 bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="">-- Chọn phim --</option>
                {movies.map((movie) => (
                  <option key={movie.maPhim} value={movie.maPhim}>
                    {movie.tenPhim}
                  </option>
                ))}
              </select>
              {selectedMovie && showtimes.length > 0 && (
                <div className="mt-2 text-sm text-green-400">
                  Tìm thấy <strong>{showtimes.length}</strong> lịch chiếu cho
                  phim này
                </div>
              )}
            </div>

            {/* Search bar */}
            {selectedMovie && (
              <div className="mb-6">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên phim, rạp, địa chỉ..."
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
                    {filteredShowtimes.length > 0 ? (
                      <span>
                        Tìm thấy{" "}
                        <strong className="text-blue-400">
                          {filteredShowtimes.length}
                        </strong>{" "}
                        lịch chiếu phù hợp
                      </span>
                    ) : (
                      <span>Không tìm thấy lịch chiếu nào phù hợp</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Showtimes table */}
            {selectedMovie ? (
              isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Đang tải lịch chiếu...</p>
                  </div>
                </div>
              ) : filteredShowtimes.length > 0 ? (
                <div className="overflow-x-auto rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-600">
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          🎬 Mã lịch chiếu
                        </th>
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          🎭 Phim
                        </th>
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          🏢 Hệ thống rạp
                        </th>
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          🎪 Cụm rạp
                        </th>
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          📍 Địa chỉ
                        </th>
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          📅 Ngày giờ chiếu
                        </th>
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          💰 Giá vé
                        </th>
                        <th className="p-4 text-left text-yellow-400 font-semibold">
                          ⏱️ Thời lượng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShowtimes.map((showtime, index) => (
                        <tr
                          key={`${showtime.maLichChieu}-${index}`}
                          className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                        >
                          <td className="p-4 text-blue-400 font-mono">
                            {showtime.maLichChieu}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {showtime.hinhAnh && (
                                <img
                                  src={showtime.hinhAnh}
                                  alt={showtime.tenPhim}
                                  className="w-12 h-16 object-cover rounded-lg shadow-lg"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-white text-sm">
                                  {showtime.tenPhim}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  ID: {showtime.maPhim}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">
                            {showtime.heThongRap}
                          </td>
                          <td className="p-4 text-gray-300">
                            {showtime.cumRap}
                          </td>
                          <td className="p-4 text-gray-400 text-sm max-w-xs truncate">
                            {showtime.diaChi}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-green-400">
                              <Calendar size={16} />
                              <span className="text-sm font-mono">
                                {formatDateTime(showtime.ngayChieuGioChieu)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-yellow-400">
                              <span className="text-sm font-semibold">
                                {showtime.giaVe?.toLocaleString("vi-VN")} ₫
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-purple-400">
                              <Clock size={16} />
                              <span className="text-sm">
                                {showtime.thoiLuong} phút
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    Chưa có lịch chiếu
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Phim này chưa có lịch chiếu nào được tạo hoặc chưa có dữ
                    liệu lịch chiếu từ API.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-yellow-400">
                      💡 Gợi ý: Hãy tạo lịch chiếu mới cho phim này
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <Plus size={20} />
                      Tạo lịch chiếu đầu tiên
                    </span>
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Chọn phim để xem lịch chiếu
                </h3>
                <p className="text-gray-500">
                  Vui lòng chọn một phim từ danh sách để xem các lịch chiếu của
                  phim đó.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Showtime Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-gray-700/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  🎫 Tạo lịch chiếu mới
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-300"
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
              </div>

              {/* Create Form */}
              <form onSubmit={handleCreateShowtime} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Movie Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🎬 Chọn phim *
                    </label>
                    <select
                      value={newShowtime.maPhim}
                      onChange={(e) =>
                        handleShowtimeInputChange("maPhim", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      required
                    >
                      <option value="">-- Chọn phim --</option>
                      {movies.map((movie) => (
                        <option key={movie.maPhim} value={movie.maPhim}>
                          {movie.tenPhim}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theater System */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🏢 Hệ thống rạp *
                    </label>
                    <select
                      value={newShowtime.maHeThongRap}
                      onChange={(e) =>
                        handleShowtimeInputChange(
                          "maHeThongRap",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      required
                    >
                      <option value="">-- Chọn hệ thống rạp --</option>
                      {theaterSystems.map((system) => (
                        <option
                          key={system.maHeThongRap}
                          value={system.maHeThongRap}
                        >
                          {system.tenHeThongRap}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theater Cluster */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🎪 Cụm rạp *
                    </label>
                    <select
                      value={newShowtime.maRap}
                      onChange={(e) =>
                        handleShowtimeInputChange("maRap", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      disabled={!newShowtime.maHeThongRap}
                      required
                    >
                      <option value="">-- Chọn cụm rạp --</option>
                      {cumRapData.map((cluster) => (
                        <option key={cluster.maCumRap} value={cluster.maCumRap}>
                          {cluster.tenCumRap}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      📅 Ngày giờ chiếu *
                    </label>
                    <input
                      type="datetime-local"
                      value={newShowtime.ngayChieuGioChieu}
                      onChange={(e) =>
                        handleShowtimeInputChange(
                          "ngayChieuGioChieu",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Ticket Price */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      💰 Giá vé (VND) *
                    </label>
                    <input
                      type="number"
                      value={newShowtime.giaVe}
                      onChange={(e) =>
                        handleShowtimeInputChange(
                          "giaVe",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step="1000"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-700/30">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={createShowtimeMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {createShowtimeMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Tạo lịch chiếu
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
