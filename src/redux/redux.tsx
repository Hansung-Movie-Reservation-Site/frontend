import { createSlice } from "@reduxjs/toolkit";

const movieListSlices = createSlice({
  name: "movieList",
  initialState: { movies: [] },
  reducers: {
    setMovieList: (state, action) => {
      state.movies = action.payload;
      console.log(action.payload);
    },
  },
});

export const { setMovieList } = movieListSlices.actions;

export default movieListSlices.reducer;
