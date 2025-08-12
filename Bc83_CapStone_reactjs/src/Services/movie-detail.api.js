import http from "./http";


export async function fetchMovieInfo(maPhim) {
  const res = await http.get("/api/QuanLyPhim/LayThongTinPhim", { params: { maPhim } });
  if (res.data?.statusCode !== 200) throw new Error(res.data?.message || "Lỗi lấy thông tin phim");
  return res.data.content;
}


export async function fetchMovieShowtimes(maPhim) {
  const res = await http.get("/api/QuanLyRap/LayThongTinLichChieuPhim", { params: { MaPhim: maPhim } });
  if (res.data?.statusCode !== 200) throw new Error(res.data?.message || "Lỗi lấy lịch chiếu");
  return res.data.content; 
}


export async function fetchMovieDetail(maPhim) {
  const [infoRes, showRes] = await Promise.allSettled([
    fetchMovieInfo(maPhim),
    fetchMovieShowtimes(maPhim),
  ]);
  const showtimes = showRes.status === "fulfilled" ? showRes.value : null;
  const info =
    infoRes.status === "fulfilled"
      ? infoRes.value
      : showtimes
      ? { tenPhim: showtimes.tenPhim, hinhAnh: showtimes.hinhAnh }
      : null;

  if (!showtimes) throw new Error("Không có dữ liệu lịch chiếu");
  return { info, showtimes };
}
