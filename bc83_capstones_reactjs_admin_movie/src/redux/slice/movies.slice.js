import fetcher from "@/apis/fetcher";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { get } from "http";

const initialState = {};

const movies = createSlice({
  name: "movies",
  initialState,
  reducers: {
    getMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
});

export const { getMovies } = movies.actions;

export default movies.reducer;

//redux thunk
export const getAllMovies = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios(
        "https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP00"
      );
      const data = await response.json();
      const listmovies = getMovies(data.content);
      dispatch(listmovies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };
};
