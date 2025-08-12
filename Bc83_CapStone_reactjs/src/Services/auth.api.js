import http from "./http";

// body: { taiKhoan, matKhau }
export async function loginApi(body) {
  const res = await http.post("/api/QuanLyNguoiDung/DangNhap", body);
  if (res.data?.statusCode !== 200) throw new Error(res.data?.message || "Đăng nhập thất bại");
  return res.data.content; // { taiKhoan, hoTen, email, ..., accessToken }
}
