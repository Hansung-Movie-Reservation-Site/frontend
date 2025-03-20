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

export const useRegion = () => {
  const regionList = useSelector((state: RootState) => state.regionList.regions);
  return regionList;
};

export const useTheather = () => {
  const theaterList = useSelector((state: RootState) => state.theaterList.theaters);
  return theaterList;
};
