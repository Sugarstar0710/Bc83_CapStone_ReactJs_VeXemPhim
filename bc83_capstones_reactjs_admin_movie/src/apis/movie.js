import fetcher from "./fetcher";

export const listMovieAPI = async (data) => {
  //data: {soTrang:1, soPhanTuTrenTrang: 10, maNhom=GP00}
  try {
    // Sử dụng API không phân trang với GP00
    const response = await fetcher.get(
      "QuanLyPhim/LayDanhSachPhim?maNhom=GP00"
    );
    console.log("Movie API response:", response.data);
    return response.data.content || response.data;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error;
  }
};

// Thêm phim
export const addMovieAPI = async (data) => {
  // data: {tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, sapChieu, hot, danhGia, hinhAnh, maNhom}
  try {
    // Check if data exists
    if (!data) {
      throw new Error("Không có dữ liệu được gửi đến API");
    }

    // Extract movie name with safety checks
    let movieName = "";
    if (data.tenPhim !== undefined && data.tenPhim !== null) {
      movieName = String(data.tenPhim).trim();
    }

    if (!movieName || movieName.length === 0) {
      throw new Error("Vui lòng nhập tên phim");
    }

    // Check image
    if (!data.hinhAnh) {
      throw new Error("Vui lòng chọn hình ảnh cho phim");
    }

    // Create FormData for multipart upload
    const formData = new FormData();

    // Format date properly (DD/MM/YYYY format)
    let formattedDate = data.ngayKhoiChieu;
    if (formattedDate && formattedDate.includes("T")) {
      formattedDate = formattedDate.split("T")[0];
    }
    if (formattedDate) {
      // Convert YYYY-MM-DD to DD/MM/YYYY
      const dateParts = formattedDate.split("-");
      if (dateParts.length === 3) {
        formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    } else {
      // Use current date as fallback
      const today = new Date();
      formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${today.getFullYear()}`;
    }

    // Add all required fields
    if (!movieName) {
      throw new Error("Tên phim không được để trống sau khi xử lý");
    }

    formData.append("tenPhim", movieName);
    formData.append("trailer", data.trailer || "https://youtube.com/default");
    formData.append("moTa", data.moTa || "Mô tả phim");
    formData.append("ngayKhoiChieu", formattedDate);
    formData.append("dangChieu", (data.dangChieu ?? true).toString());
    formData.append("sapChieu", (data.sapChieu ?? false).toString());
    formData.append("hot", (data.hot ?? false).toString());
    formData.append(
      "danhGia",
      Math.max(1, Math.min(10, parseInt(data.danhGia) || 5)).toString()
    );
    formData.append("maNhom", data.maNhom || "GP00");

    // Add image - this is required!
    formData.append("hinhAnh", data.hinhAnh);

    const response = await fetcher.post(
      "QuanLyPhim/ThemPhimUploadHinh",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.content || response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    console.log("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    // Handle specific errors
    if (error.response?.status === 500) {
      const serverMessage =
        error.response?.data?.content || error.response?.data?.message;
      if (serverMessage) {
        if (serverMessage.includes("Chưa chọn hình ảnh")) {
          throw new Error("⚠️ Vui lòng chọn hình ảnh cho phim!");
        }
        throw new Error(`Lỗi server: ${serverMessage}`);
      } else {
        throw new Error("Lỗi server nội bộ. Có thể do dữ liệu không hợp lệ!");
      }
    }

    // Handle network errors
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("Network error details:", {
        message: error.message,
        code: error.code,
        config: error.config?.url,
      });
      throw new Error(
        "🌐 Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại!"
      );
    }

    // Check for permission errors
    if (error.response?.status === 403) {
      throw new Error("Không có quyền thêm phim. Cần tài khoản admin!");
    }

    if (error.response?.status === 400) {
      const message = error.response?.data?.content || "Dữ liệu không hợp lệ";
      throw new Error(message);
    }

    // Fallback for permission errors
    if (error.response?.status === 401) {
      throw new Error("Không có quyền thêm phim. Vui lòng đăng nhập!");
    }

    // Generic error
    throw new Error(error.message || "Có lỗi không xác định xảy ra!");
  }
};

// Xoá phim
export const deleteMovieAPI = async (maPhim) => {
  try {
    const response = await fetcher.delete(
      `QuanLyPhim/XoaPhim?MaPhim=${maPhim}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error deleting movie:", error);
    console.log("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    // Handle network errors
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      throw new Error(
        "🌐 Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại!"
      );
    }

    // Handle server errors
    if (error.response?.status === 500) {
      const serverMessage =
        error.response?.data?.content || error.response?.data?.message;
      if (serverMessage) {
        throw new Error(`Lỗi server: ${serverMessage}`);
      } else {
        throw new Error("Lỗi server nội bộ!");
      }
    }

    // Check for specific errors
    if (error.response?.status === 403) {
      throw new Error("Không có quyền xóa phim. Cần tài khoản admin!");
    }

    if (error.response?.status === 400) {
      const message = error.response?.data?.content || "Dữ liệu không hợp lệ";
      if (
        message.includes("không thể bị xóa") ||
        message.includes("không thể cập nhật")
      ) {
        throw new Error(`⚠️ Phim này được bảo vệ và không thể xóa!`);
      }
      throw new Error(message);
    }

    // Generic error
    throw new Error(error.message || "Có lỗi không xác định xảy ra!");
  }
};

// Sửa phim
export const updateMovieAPI = async (data) => {
  // data: {maPhim, tenPhim, trailer, moTa, ngayKhoiChieu, dangChieu, sapChieu, hot, danhGia, hinhAnh, maNhom}
  try {
    // Check if data exists
    if (!data) {
      throw new Error("Không có dữ liệu được gửi đến API");
    }

    // Extract movie ID with safety checks
    let movieId = "";
    if (data.maPhim !== undefined && data.maPhim !== null) {
      movieId = String(data.maPhim).trim();
    }

    if (!movieId || movieId.length === 0) {
      throw new Error("Mã phim không được để trống");
    }

    // Extract movie name
    let movieName = "";
    if (data.tenPhim !== undefined && data.tenPhim !== null) {
      movieName = String(data.tenPhim).trim();
    }

    if (!movieName || movieName.length === 0) {
      throw new Error("Tên phim không được để trống");
    }

    // Create FormData for multipart upload
    const formData = new FormData();

    // Format date properly - API expects DD/MM/YYYY format
    let formattedDate = data.ngayKhoiChieu;
    if (formattedDate) {
      // Convert from YYYY-MM-DD to DD/MM/YYYY
      if (formattedDate.includes("-")) {
        const [year, month, day] = formattedDate.split("T")[0].split("-");
        formattedDate = `${day}/${month}/${year}`;
      }
    }
    if (!formattedDate) {
      // Use current date as fallback in DD/MM/YYYY format
      const now = new Date();
      formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${now.getFullYear()}`;
    }

    // Add all required fields with safe conversion
    formData.append("maPhim", data.maPhim.toString());
    formData.append("tenPhim", data.tenPhim.trim());
    formData.append("trailer", data.trailer || "https://youtube.com/default");
    formData.append("moTa", data.moTa || "Mô tả phim");
    formData.append("ngayKhoiChieu", formattedDate);
    formData.append("dangChieu", (data.dangChieu ?? false).toString());
    formData.append("sapChieu", (data.sapChieu ?? false).toString());
    formData.append("hot", (data.hot ?? false).toString());
    formData.append(
      "danhGia",
      Math.max(1, Math.min(10, parseInt(data.danhGia) || 5)).toString()
    );
    formData.append("maNhom", data.maNhom || "GP00");

    // Handle image field - try different approaches
    if (data.hinhAnh && typeof data.hinhAnh !== "string") {
      // New file uploaded
      formData.append("File", data.hinhAnh); // Some APIs expect 'File' instead of 'hinhAnh'
    }
    // Note: Don't append empty hinhAnh field if no new image

    console.log("Formatted update data:", {
      maPhim: data.maPhim,
      tenPhim: data.tenPhim,
      ngayKhoiChieu: formattedDate,
      dangChieu: data.dangChieu ?? false,
      sapChieu: data.sapChieu ?? false,
      hot: data.hot ?? false,
      danhGia: parseInt(data.danhGia) || 5,
      hasNewImage: data.hinhAnh && typeof data.hinhAnh !== "string",
    });

    const response = await fetcher.post(
      "QuanLyPhim/CapNhatPhimUpload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.content || response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    console.log("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    // Handle network errors
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("Network error details:", {
        message: error.message,
        code: error.code,
        config: error.config?.url,
      });
      throw new Error(
        "🌐 Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại!"
      );
    }

    // Handle server errors
    if (error.response?.status === 500) {
      const serverMessage =
        error.response?.data?.content || error.response?.data?.message;
      if (serverMessage) {
        throw new Error(`Lỗi server: ${serverMessage}`);
      } else {
        throw new Error("Lỗi server nội bộ. Có thể do dữ liệu không hợp lệ!");
      }
    }

    // Check for specific errors
    if (error.response?.status === 403) {
      throw new Error("Không có quyền cập nhật phim. Cần tài khoản admin!");
    }

    if (error.response?.status === 400) {
      const message = error.response?.data?.content || "Dữ liệu không hợp lệ";
      if (
        message.includes("không thể bị xóa") ||
        message.includes("không thể cập nhật")
      ) {
        throw new Error(`⚠️ Phim này được bảo vệ và không thể chỉnh sửa!`);
      }
      throw new Error(message);
    }

    // Fallback for permission errors
    if (error.response?.status === 401) {
      throw new Error("Không có quyền cập nhật phim. Vui lòng đăng nhập!");
    }

    // Generic error
    throw new Error(error.message || "Có lỗi không xác định xảy ra!");
  }
};

// Lấy thông tin phim theo ID
export const getMovieById = async (maPhim) => {
  try {
    const response = await fetcher.get(
      `QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    throw error;
  }
};
