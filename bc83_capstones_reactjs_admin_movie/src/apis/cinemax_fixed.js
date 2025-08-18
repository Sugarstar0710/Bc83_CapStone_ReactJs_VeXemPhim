import fetcher from "./fetcher";

export const listCinemaxAPI = async (data) => {
  //data: {soTrang:1, soPhanTuTrenTrang: 10, maNhom=GP00}
  try {
    const response = await fetcher.get("QuanLyRap/LayThongTinHeThongRap", {
      params: data,
    });
    return response.data.content;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

export const listCinemax = async (data) => {
  //data: {soTrang:1, soPhanTuTrenTrang: 10, maNhom=GP00}
  try {
    const response = await fetcher.get("QuanLyRap/LayThongTinHeThongRap", {
      params: data,
    });
    return response.data.content;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
