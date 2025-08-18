import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Film,
  MapPin,
  DollarSign,
  Save,
  ArrowLeft,
} from "lucide-react";
import fetcher from "@/apis/fetcher";

const CreateShowtime = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedHeThong, setSelectedHeThong] = useState("");
  const [selectedCumRap, setSelectedCumRap] = useState("");
  const [ngayChieuGioChieu, setNgayChieuGioChieu] = useState("");
  const [giaVe, setGiaVe] = useState(75000);

  const { data: movie } = useQuery({
    queryKey: ["movie-detail", id],
    queryFn: async () => {
      const response = await fetcher.get(
        `QuanLyPhim/LayThongTinPhim?MaPhim=${id}`
      );
      return response.data.content || response.data;
    },
    enabled: !!id,
  });

  const { data: heThongRap = [] } = useQuery({
    queryKey: ["theater-systems"],
    queryFn: async () => {
      const response = await fetcher.get("QuanLyRap/LayThongTinHeThongRap");
      return response.data.content || response.data;
    },
  });

  const { data: cumRap = [] } = useQuery({
    queryKey: ["theater-clusters", selectedHeThong],
    queryFn: async () => {
      const response = await fetcher.get(
        `QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${selectedHeThong}`
      );
      return response.data.content || response.data;
    },
    enabled: !!selectedHeThong,
  });

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
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden">
          <div className="p-8">
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
                  <p className="text-gray-400 mt-2">
                    Tạo lịch chiếu mới cho phim
                  </p>
                </div>
              </div>
            </div>

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
                    <p className="text-gray-300 text-sm mb-1">
                      Mã phim: {movie.maPhim}
                    </p>
                    <p className="text-yellow-400 text-sm">
                      ⭐ {movie.danhGia}/10
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option
                        key={heThong.maHeThongRap}
                        value={heThong.maHeThongRap}
                      >
                        {heThong.tenHeThongRap}
                      </option>
                    ))}
                  </select>
                </div>

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
