import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Film, MapPin, DollarSign, Save, ArrowLeft } from "lucide-react";
import fetcher from "@/apis/fetcher";

const CreateShowtime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedHeThong, setSelectedHeThong] = useState("");
  const [selectedCumRap, setSelectedCumRap] = useState("");
  const [ngayChieuGioChieu, setNgayChieuGioChieu] = useState("");
  const [giaVe, setGiaVe] = useState(75000);

  // Fetch movie data
  const { data: movie } = useQuery({
    queryKey: ["movie-detail", id],
    queryFn: async () => {
      const response = await fetcher.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${id}`);
      return response.data.content || response.data;
    },
    enabled: !!id,
  });

  // Fetch theater systems
  const { data: heThongRap = [] } = useQuery({
    queryKey: ["theater-systems"],
    queryFn: async () => {
      const response = await fetcher.get("QuanLyRap/LayThongTinHeThongRap");
      return response.data.content || response.data;
    },
  });

  // Fetch theater clusters
  const { data: cumRap = [] } = useQuery({
    queryKey: ["theater-clusters", selectedHeThong],
    queryFn: async () => {
      const response = await fetcher.get(`QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${selectedHeThong}`);
      return response.data.content || response.data;
    },
    enabled: !!selectedHeThong,
  });

  // Create showtime mutation
  const createShowtimeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetcher.post("QuanLyDatVe/TaoLichChieu", data);
      return response.data;
    },
    onSuccess: () => {
      alert("Tạo lịch chiếu thành công!");
      navigate("/admin/movie-management");
    },
    onError: (error) => {
      console.error("Lỗi tạo lịch chiếu:", error);
      alert("Lỗi tạo lịch chiếu. Vui lòng thử lại!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedHeThong || !selectedCumRap || !ngayChieuGioChieu) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const data = {
      maPhim: parseInt(id),
      ngayChieuGioChieu,
      maRap: selectedCumRap,
      giaVe,
    };

    createShowtimeMutation.mutate(data);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900/20 via-gray-900/20 to-black/20">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)`
      }}></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/admin/movie-management")}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-green-400" />
                    Tạo Lịch Chiếu
                  </h1>
                  <p className="text-gray-400 mt-2">Tạo lịch chiếu mới cho phim</p>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            {movie && (
              <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-28 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Film className="w-5 h-5 text-purple-400" />
                      {movie.tenPhim}
                    </h3>
                    <p className="text-gray-300 text-sm mb-1">Mã phim: {movie.maPhim}</p>
                    <p className="text-yellow-400 text-sm">⭐ {movie.danhGia}/10</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theater System */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Hệ thống rạp *
                  </label>
                  <select
                    value={selectedHeThong}
                    onChange={(e) => {
                      setSelectedHeThong(e.target.value);
                      setSelectedCumRap("");
                    }}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    required
                  >
                    <option value="">Chọn hệ thống rạp</option>
                    {heThongRap.map((heThong) => (
                      <option key={heThong.maHeThongRap} value={heThong.maHeThongRap}>
                        {heThong.tenHeThongRap}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theater Cluster */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Cụm rạp *
                  </label>
                  <select
                    value={selectedCumRap}
                    onChange={(e) => setSelectedCumRap(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    disabled={!selectedHeThong}
                    required
                  >
                    <option value="">Chọn cụm rạp</option>
                    {cumRap.map((cum) => (
                      <option key={cum.maCumRap} value={cum.maCumRap}>
                        {cum.tenCumRap}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Ngày giờ chiếu *
                  </label>
                  <input
                    type="datetime-local"
                    value={ngayChieuGioChieu}
                    onChange={(e) => setNgayChieuGioChieu(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    required
                  />
                </div>

                {/* Ticket Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Giá vé (VND) *
                  </label>
                  <input
                    type="number"
                    value={giaVe}
                    onChange={(e) => setGiaVe(Number(e.target.value))}
                    min="0"
                    step="1000"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-700/30">
                <button
                  type="button"
                  onClick={() => navigate("/admin/movie-management")}
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
                      <Save className="w-4 h-4" />
                      Tạo lịch chiếu
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShowtime;
      alert("Tạo lịch chiếu thành công!");
      navigate("/admin/movie-management");
    },
    onError: (error) => {
      alert("Lỗi tạo lịch chiếu: " + error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCumRap || !ngayChieuGioChieu || !giaVe) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    createShowtimeMutation.mutate({
      maPhim: parseInt(id),
      maRap: parseInt(selectedCumRap),
      ngayChieuGioChieu: ngayChieuGioChieu,
      giaVe: parseInt(giaVe),
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900/20 via-gray-900/20 to-black/20">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)`
      }}></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
                  📅 Tạo lịch chiếu
                </h1>
                <p className="text-gray-400 mt-2">
                  Phim: <span className="text-white font-semibold">{movie?.tenPhim}</span>
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/movie-management")}
                className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
              >
                ⬅️ Quay lại
              </button>
            </div>

            {/* Movie Info */}
            {movie && (
              <div className="mb-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="flex gap-6">
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="w-24 h-32 object-cover rounded-lg border border-gray-600"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{movie.tenPhim}</h3>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-3">{movie.moTa}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-yellow-400">⭐ {movie.danhGia}/10</span>
                      <span className="text-gray-400">
                        📅 {new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-yellow-400 font-semibold mb-2">🏢 Hệ thống rạp</label>
                  <select
                    value={selectedHeThong}
                    onChange={(e) => {
                      setSelectedHeThong(e.target.value);
                      setSelectedCumRap("");
                    }}
                    className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-0 rounded-lg px-4"
                    required
                  >
                    <option value="">Chọn hệ thống rạp</option>
                    {heThongRap.map((item) => (
                      <option key={item.maHeThongRap} value={item.maHeThongRap}>
                        {item.tenHeThongRap}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-yellow-400 font-semibold mb-2">🎭 Cụm rạp</label>
                  <select
                    value={selectedCumRap}
                    onChange={(e) => setSelectedCumRap(e.target.value)}
                    className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-0 rounded-lg px-4"
                    required
                    disabled={!selectedHeThong}
                  >
                    <option value="">Chọn cụm rạp</option>
                    {cumRap.map((item) => (
                      <option key={item.maCumRap} value={item.maCumRap}>
                        {item.tenCumRap}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-yellow-400 font-semibold mb-2">🕐 Ngày và giờ chiếu</label>
                  <input
                    type="datetime-local"
                    value={ngayChieuGioChieu}
                    onChange={(e) => setNgayChieuGioChieu(e.target.value)}
                    className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-0 rounded-lg px-4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-semibold mb-2">💰 Giá vé (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={giaVe}
                    onChange={(e) => setGiaVe(e.target.value)}
                    placeholder="Nhập giá vé"
                    className="w-full h-12 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-0 rounded-lg px-4"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-700/30">
                <button
                  type="submit"
                  disabled={createShowtimeMutation.isLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {createShowtimeMutation.isLoading ? "⏳ Đang tạo..." : "✅ Tạo lịch chiếu"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/movie-management")}
                  className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
                >
                  ❌ Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShowtime;
