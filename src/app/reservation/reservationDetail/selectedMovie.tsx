"use client";
import MemoTypingText, { TypingText } from "@/app/Common/Animation/TypingAni";
import { useRef, useEffect, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
interface SelectedMovieProps {
  setMemoActiveStep: (id: number) => void;
  setMemoMovie: (id: number) => void;
}

const SelectedMovie: React.FC<SelectedMovieProps> = ({ setMemoActiveStep, setMemoMovie }) => {
  const boxoffice = useSelector((state: RootState) => state.movieList.movies);
  console.log("랜더링됨.");

  const movieList = "영화목록";
  const reserve = "예매하기";

  const bookingMovie = (id: number) => {
    console.log(id);
    setMemoMovie(id);
    setMemoActiveStep(1);
  };

  const movieListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("🎥 현재 movieList:", boxoffice);
  }, [boxoffice]);

  useEffect(() => {
    if (movieListRef.current) {
      // 데스크톱에서는 부드럽게 스크롤
      if (window.innerWidth >= 100) {
        movieListRef.current.scrollIntoView({
          behavior: "smooth", // 부드러운 스크롤 애니메이션
          block: "start", // 요소의 상단으로 스크롤
        });
      }
    }
  }, []);

  const renderBoxOffice = useCallback(
    () =>
      boxoffice.map((movie: Movie) => {
        return (
          <div key={movie.id} className="group relative">
            <img
              src={movie.posterImage}
              alt={"/error.png"}
              className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              style={{ maxWidth: "250px" }}
            />
            {/* object-contain */}
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href={"#"}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {movie.title}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{movie.releaseDate}</p>
              </div>
              <button
                className="z-1 rounded-md bg-slate-800 py-2 px-4 border border-transparent transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none flex"
                type="button"
                aria-label={reserve}
                onClick={() => bookingMovie(movie.id)}
              >
                <div className="w-20 text-center">
                  <TypingText text={reserve} className={"text-md text-white"}></TypingText>
                </div>
              </button>
            </div>
          </div>
        );
      }),
    [boxoffice]
  );
  return (
    <div className="bg-white shadow-md">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div ref={movieListRef} className="pb-20">
          <MemoTypingText
            text={movieList}
            className={"text-2xl font-bold tracking-tight text-gray-900 py-3"}
          ></MemoTypingText>
          <button onClick={() => setMemoMovie(-1)}>초기화</button>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {boxoffice.length !== 0
              ? renderBoxOffice()
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full h-40 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const MemoizedMoive = memo(SelectedMovie);
MemoizedMoive.displayName = "SelectedMovie";

export default MemoizedMoive;
