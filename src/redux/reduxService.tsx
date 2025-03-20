import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setMovieList } from "./redux";

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

export const useReduxBoxoffice = () => {
  const dispatch = useDispatch();
  const movieList = useSelector((state: RootState) => state.movieList.movies);
  const updateMovieList = (newMovieList: Movie[]) => {
    dispatch(setMovieList(newMovieList));
  };
  return { movieList, updateMovieList };
};
