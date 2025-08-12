import http from "./http";


export async function fetchAllMovies(maNhom = "GP01") {
  const res = await http.get("/api/QuanLyPhim/LayDanhSachPhim", { params: { maNhom } });
  const data = res.data?.content || [];

  return data.map(m => ({
    id: m.maPhim,
    title: m.tenPhim,
    posterUrl: m.hinhAnh,
    releaseDate: m.ngayKhoiChieu,
    rating: m.danhGia,
    hot: m.hot,
    dangChieu: m.dangChieu,
    sapChieu: m.sapChieu,
    raw: m
  }));
}
