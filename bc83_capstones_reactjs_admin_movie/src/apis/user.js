import fetcher from "./fetcher";

export const listUserAPI = async (data) => {
  //data: {soTrang:1, soPhanTuTrenTrang: 10, maNhom=GP00}
  try {
    // Use GP00 as default if not specified
    const maNhom = data?.maNhom || "GP00";

    const response = await fetcher.get(
      `QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`,
      { params: { ...data, MaNhom: maNhom } }
    );

    // Đảm bảo trả về response với structure chuẩn
    if (response.data?.content) {
      return {
        ...response.data,
        success: true,
      };
    }

    return {
      success: true,
      content: response.data?.content || [],
      message: "Lấy danh sách thành công",
    };
  } catch (error) {
    // console.error("Error fetching user list:", error);
    // console.error("Error details:", error.response?.data);
    throw error;
  }
};

// Lấy thông tin tài khoản
export const getUserInfo = (taiKhoan) => {
  return fetcher.post("/QuanLyNguoiDung/ThongTinTaiKhoan", { taiKhoan });
};

//thêm tài khoản
export const addUser = async (data) => {
  try {
    // // console.log("Adding user with data:", data);

    // Đảm bảo data có đúng format
    const addData = {
      taiKhoan: data.taiKhoan,
      matKhau: data.matKhau,
      email: data.email,
      soDt: data.soDT || data.soDt,
      maNhom: data.maNhom || "GP00",
      maLoaiNguoiDung: data.maLoaiNguoiDung || "KhachHang",
      hoTen: data.hoTen,
    };

    // // console.log("Formatted add data:", addData);

    const response = await fetcher.post(
      "/QuanLyNguoiDung/ThemNguoiDung",
      addData
    );
    // // console.log("Add user response:", response);

    // Đảm bảo trả về response với structure chuẩn
    if (response.data) {
      return {
        ...response.data,
        success: true,
      };
    }

    return {
      success: true,
      message: "Thêm người dùng thành công",
    };
  } catch (error) {
    // console.error("Error adding user:", error);
    // console.error("Error details:", error.response?.data);
    // console.error("Request data:", data);
    throw error;
  }
};

// Cập nhật thông tin tài khoản
export const updateUserInfo = async (data) => {
  try {
    // console.log("Updating user with data:", data);

    // Đảm bảo data có đúng format
    const updateData = {
      taiKhoan: data.taiKhoan,
      matKhau: data.matKhau,
      email: data.email,
      soDt: data.soDT || data.soDt, // Handle both soDT and soDt
      maNhom: data.maNhom || "GP00", // Changed from GP01 to GP00
      maLoaiNguoiDung: data.maLoaiNguoiDung,
      hoTen: data.hoTen,
    };

    // console.log("Formatted update data:", updateData);

    const response = await fetcher.post(
      "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
      updateData
    );
    // console.log("Update response:", response);

    // Đảm bảo trả về response với structure chuẩn
    if (response.data) {
      return {
        ...response.data,
        success: true,
      };
    }

    return {
      success: true,
      message: "Cập nhật thành công",
    };
  } catch (error) {
    // console.error("Error updating user:", error);
    // console.error("Error details:", error.response?.data);
    // console.error("Request data:", data);
    throw error;
  }
};

// tìm kiếm user (API cũ - deprecated)
export const searchUser = (name) => {
  return fetcher.get(
    `/QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=GP00&tuKhoa=${name}`
  );
};

// API tìm kiếm người dùng
export const searchUserAPI = async ({ maNhom = "GP00", tuKhoa }) => {
  try {
    // console.log("Searching users with keyword:", tuKhoa);

    const response = await fetcher.get("/QuanLyNguoiDung/TimKiemNguoiDung", {
      params: { MaNhom: maNhom, tuKhoa },
    });

    // console.log("Search users response:", response);

    // Đảm bảo trả về response với structure chuẩn
    if (response.data) {
      return {
        ...response.data,
        success: true,
      };
    }

    return {
      success: true,
      content: [],
      message: "Tìm kiếm thành công",
    };
  } catch (error) {
    // console.error("Error searching users:", error);
    // console.error("Error details:", error.response?.data);
    throw error;
  }
};

// API xóa người dùng
export const deleteUserAPI = async (taiKhoan) => {
  try {
    // 🛡️ BẢO VỆ TÀI KHOẢN ADMIN QUAN TRỌNG
    const protectedAccounts = ["chiviet2025", "admin", "chiviet"];

    if (protectedAccounts.includes(taiKhoan)) {
      throw new Error(
        `🛡️ Tài khoản "${taiKhoan}" được bảo vệ và không thể xóa! Đây là tài khoản admin hệ thống.`
      );
    }

    const response = await fetcher({
      method: "DELETE",
      url: "/QuanLyNguoiDung/XoaNguoiDung",
      params: {
        TaiKhoan: taiKhoan,
      },
    });

    if (response.data) {
      return {
        ...response.data,
        success: true,
      };
    }

    return {
      success: true,
      message: "Xóa người dùng thành công",
    };
  } catch (error) {
    // console.error("Error deleting user:", error);

    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
    }

    if (error.response?.status === 403) {
      throw new Error("Không có quyền thực hiện chức năng này!");
    }

    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy người dùng cần xóa!");
    }

    if (error.response?.status === 500) {
      const serverMessage =
        error.response?.data?.content || error.response?.data?.message;
      if (serverMessage) {
        throw new Error(`Lỗi server: ${serverMessage}`);
      }
    }

    throw new Error(error.message || "Có lỗi xảy ra khi xóa người dùng!");
  }
};

// API đăng ký tài khoản (dành cho khách hàng)
export const registerUser = async (data) => {
  try {
    // console.log("Registering user with data:", data);

    // Đảm bảo data có đúng format cho đăng ký
    const registerData = {
      taiKhoan: data.taiKhoan,
      matKhau: data.matKhau,
      email: data.email,
      soDt: data.soDT || data.soDt,
      maNhom: data.maNhom || "GP00",
      maLoaiNguoiDung: "KhachHang", // Mặc định là khách hàng
      hoTen: data.hoTen,
    };

    // console.log("Formatted register data:", registerData);

    const response = await fetcher.post(
      "/QuanLyNguoiDung/DangKy",
      registerData
    );
    // console.log("Register response:", response);

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
    // console.error("Error registering user:", error);
    // console.error("Error details:", error.response?.data);
    // console.error("Request data:", data);
    throw error;
  }
};
