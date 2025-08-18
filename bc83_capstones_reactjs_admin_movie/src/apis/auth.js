import fetcher from "./fetcher";

export const loginAuthAPI = async (data) => {
  // data = {taikhoan:..., matkhau:....} => backend quy dinh
  try {
    const response = await fetcher.post("/QuanLyNguoiDung/DangNhap", data);
    return response.data.content;
  } catch (error) {
    // 🔥 CHỈ SỬ DỤNG API THẬT - KHÔNG CÒN DEMO/FALLBACK
    throw Error(error);
  }
};
export const registerAuthAPI = async (data) => {
  try {
    // console.log("Auth register with data:", data);

    // Đảm bảo data có đúng format cho đăng ký
    const registerData = {
      taiKhoan: data.taiKhoan,
      matKhau: data.matKhau,
      email: data.email,
      soDt: data.soDT || data.soDt,
      maNhom: data.maNhom || "GP00", // Changed from GP01 to GP00
      maLoaiNguoiDung: "KhachHang", // Mặc định là khách hàng khi đăng ký
      hoTen: data.hoTen,
    };

    // console.log("Formatted auth register data:", registerData);

    const response = await fetcher.post("QuanLyNguoiDung/DangKy", registerData);
    // console.log("Auth register response:", response);

    // Đảm bảo trả về response với structure chuẩn
    if (response.data) {
      return {
        ...response.data,
        success: true,
      };
    }

    return {
      success: true,
      message: "Đăng ký tài khoản thành công",
    };
  } catch (error) {
    // console.error("Error in auth register:", error);
    // console.error("Error details:", error.response?.data);
    throw error;
  }
};
