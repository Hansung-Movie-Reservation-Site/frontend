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
  const findMovie_id = (id: number) => {
    return movieList.find((m) => m.id == id);
  };
  return { movieList, updateMovieList, findMovie, findMovie_id };
};

export const useRegion = () => {
  const regionList = useSelector((state: RootState) => state.regionList.regions);

  const findRegion = (region_id: number) => {
    return regionList.filter((r) => r.id === region_id);
  };
  return { regionList, findRegion };
};
type Theater = {
  id: number;
  region_id: number;
  name: string;
};
export const useTheather = () => {
  const theaterList = useSelector((state: RootState) => state.theaterList.theaters);
  const findTheaterId = (theaterId: number) => {
    //if (theaterId === undefined) return;
    //const result = theaterList.find((t) => t.id == theaterId);
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
  const findStartTime = (screen_id: number) => {
    return movieRunningDetail.screeningIds.findIndex((ids) => ids === screen_id);
  };
  return { movieRunningDetail, updateMovieRunningDetail, findStartTime };
};
