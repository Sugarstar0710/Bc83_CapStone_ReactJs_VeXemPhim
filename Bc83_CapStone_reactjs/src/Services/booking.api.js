import http from "./http";

// Lấy danh sách ghế + thông tin phim theo mã lịch chiếu
export async function fetchSeatMap(maLichChieu) {
  const res = await http.get("/api/QuanLyDatVe/LayDanhSachPhongVe", {
    params: { MaLichChieu: maLichChieu },
  });
  if (res.data?.statusCode !== 200) throw new Error(res.data?.message || "Lỗi lấy phòng vé");
  return res.data.content; // { thongTinPhim, danhSachGhe: [...] }
}

// Đặt vé
// payload = { maLichChieu, danhSachVe: [{ maGhe, giaVe }] }
export async function bookTickets(payload) {
  const res = await http.post("/api/QuanLyDatVe/DatVe", payload);
  if (res.data?.statusCode !== 200) throw new Error(res.data?.message || "Đặt vé thất bại");
  return res.data.content;
}
