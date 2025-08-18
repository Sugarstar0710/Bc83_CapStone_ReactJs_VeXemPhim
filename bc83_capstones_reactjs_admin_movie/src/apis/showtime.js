import fetcher from "./fetcher";

// Get showtimes by movie
export const getShowtimesByMovie = async (movieId) => {
  try {
    const response = await fetcher.get(
      `QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`
    );
    return response.data.content;
  } catch (error) {
    console.error(`Error fetching showtimes for movie ${movieId}:`, error);
    throw error;
  }
};

// Get all showtimes (for management)
export const getAllShowtimes = async () => {
  try {
    // Since there's no direct API for all showtimes, we might need to fetch by date or other criteria
    // This is a placeholder - adjust based on available API endpoints
    const response = await fetcher.get(
      "QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=0"
    );
    return response.data.content || response.data;
  } catch (error) {
    console.error("Error fetching all showtimes:", error);
    throw error;
  }
};

// Create showtime
export const createShowtimeAPI = async (data) => {
  try {
    console.log("Creating showtime with data:", data);
    const response = await fetcher.post("QuanLyDatVe/TaoLichChieu", data);
    return response.data.content || response.data;
  } catch (error) {
    console.error("Error creating showtime:", error);
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
        throw new Error(`Lỗi server: ${serverMessage}`);
      } else {
        throw new Error("Lỗi server nội bộ!");
      }
    }

    if (error.response?.status === 403) {
      throw new Error("Không có quyền tạo lịch chiếu. Cần tài khoản admin!");
    }

    if (error.response?.status === 400) {
      const message = error.response?.data?.content || "Dữ liệu không hợp lệ";
      throw new Error(message);
    }

    if (error.response?.status === 401) {
      throw new Error("Không có quyền tạo lịch chiếu. Vui lòng đăng nhập!");
    }

    // Network errors
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      throw new Error(
        "🌐 Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet!"
      );
    }

    throw new Error(error.message || "Có lỗi không xác định xảy ra!");
  }
};

// Get theater systems
export const getHeThongRapAPI = async () => {
  try {
    const response = await fetcher.get("QuanLyRap/LayThongTinHeThongRap");
    return response.data.content || response.data;
  } catch (error) {
    console.error("Error fetching theater systems:", error);
    throw error;
  }
};

// Get theater clusters by system
export const getCumRapTheoHeThongAPI = async (maHeThongRap) => {
  try {
    const response = await fetcher.get(
      `QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
    );
    return response.data.content || response.data;
  } catch (error) {
    console.error(`Error fetching clusters for system ${maHeThongRap}:`, error);
    throw error;
  }
};

// Get theater info
export const getThongTinRapAPI = async (maCumRap) => {
  try {
    const response = await fetcher.get(
      `QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP00`
    );
    return response.data.content || response.data;
  } catch (error) {
    console.error(`Error fetching theater info:`, error);
    throw error;
  }
};

// Update showtime (if API supports it)
export const updateShowtimeAPI = async (data) => {
  try {
    console.log("Updating showtime with data:", data);
    // Note: Check if API has an update endpoint, otherwise use delete + create
    const response = await fetcher.put("QuanLyDatVe/CapNhatLichChieu", data);
    return response.data.content || response.data;
  } catch (error) {
    console.error("Error updating showtime:", error);

    // If update doesn't exist, you might need to implement delete + create
    if (error.response?.status === 404 || error.response?.status === 405) {
      throw new Error(
        "API không hỗ trợ cập nhật lịch chiếu. Vui lòng xóa và tạo lại!"
      );
    }

    // Handle other errors similar to create/delete
    if (error.response?.status === 500) {
      const serverMessage =
        error.response?.data?.content || error.response?.data?.message;
      if (serverMessage) {
        throw new Error(`Lỗi server: ${serverMessage}`);
      } else {
        throw new Error("Lỗi server nội bộ!");
      }
    }

    if (error.response?.status === 403) {
      throw new Error(
        "Không có quyền cập nhật lịch chiếu. Cần tài khoản admin!"
      );
    }

    if (error.response?.status === 400) {
      const message = error.response?.data?.content || "Dữ liệu không hợp lệ";
      throw new Error(message);
    }

    if (error.response?.status === 401) {
      throw new Error(
        "Không có quyền cập nhật lịch chiếu. Vui lòng đăng nhập!"
      );
    }

    // Network errors
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      throw new Error(
        "🌐 Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet!"
      );
    }

    throw new Error(error.message || "Có lỗi không xác định xảy ra!");
  }
};

// Legacy functions for backward compatibility
export const getHeThongRap = () => getHeThongRapAPI();
export const getCumRapTheoHeThong = (maHeThongRap) =>
  getCumRapTheoHeThongAPI(maHeThongRap);
export const taoLichChieu = (data) => createShowtimeAPI(data);
export const createShowTime = (data) => createShowtimeAPI(data);
export const xoaLichChieu = (maLichChieu) => deleteShowtimeAPI(maLichChieu);
export const deleteShowtime = (maLichChieu) => deleteShowtimeAPI(maLichChieu);
export const updateShowtime = (data) => updateShowtimeAPI(data);
