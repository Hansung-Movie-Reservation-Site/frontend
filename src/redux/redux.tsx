import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Movie = {
  id: number;
  tmdbMovieId: number;
  kobisMovieCd: string;
  title: string;
  posterImage: string;
  overview: string;
  director: string;
  genres: string;
  releaseDate: string;
  runtime: number;
};

const movieListSlices = createSlice({
  name: "movieList",
  initialState: { movies: [] as Movie[] },
  reducers: {
    setMovieList: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
      console.log(action.payload);
    },
  },
});

export const { setMovieList } = movieListSlices.actions;

export default movieListSlices.reducer;
