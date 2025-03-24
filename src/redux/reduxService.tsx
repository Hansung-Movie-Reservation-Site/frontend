import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setMovieList, setMovieRunningDetail } from "./redux";

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
  const findMovie = (kobisMovieCd: string) => {
    return movieList.find((m) => Number(m.kobisMovieCd) == Number(kobisMovieCd));
  };
  return { movieList, updateMovieList, findMovie };
};

export const useRegion = () => {
  const regionList = useSelector((state: RootState) => state.regionList.regions);
  return regionList;
};
type Theater = {
  id: number;
  region_id: number;
  name: string;
};
export const useTheather = () => {
  const theaterList = useSelector((state: RootState) => state.theaterList.theaters);
  const findTheaterId = (theaterId: number | undefined) => {
    //if (theaterId === undefined) return;
    return theaterList.find((t) => t.id == theaterId);
  };
  return { theaterList, findTheaterId };
};

type MovieRunningDetail = {
  kobisMovieCd: string;
  roomIds: number[];
  screeningIds: number[];
  startTimes: string[];
  tmdbMovieId: 696506;
};
export const useMovieRunningDetail = () => {
  const dispatch = useDispatch();
  const movieRunningDetail = useSelector(
    (state: RootState) => state.movieRunningDetail.movieRunningDetail
  );
  const updateMovieRunningDetail = (movieRunningDetail: MovieRunningDetail) => {
    dispatch(setMovieRunningDetail(movieRunningDetail));
  };
  return { movieRunningDetail, updateMovieRunningDetail };
};
