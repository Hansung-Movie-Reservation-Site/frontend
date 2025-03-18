import { TypingText } from "@/app/Common/Animation/typingAni";
import SerachInput from "../reservationUI/SerachInput";
import { useRef, useEffect } from "react";

interface SelectedMovieProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setMovie: React.Dispatch<React.SetStateAction<number>>;
}

const boxoffice = [
  {
    id: 1,
    title: "듄: 파트 2",
    director: "드니 빌뇌브",
    href: "#",
    poster_image: "/error.png",
    imageAlt: "/error.png",
    movie_id: "1",
    overview:
      "아트레이데스 가문의 폴은 사막 행성 아라키스에서 운명을 마주하게 된다. 우주에서 가장 귀중한 자원인 스파이스의 지배권을 두고 벌어지는 은하계 전쟁.",
    runtime: "166",
    release_date: "2024-02-28",
    genres: "genres",
  },
  {
    id: 2,
    title: "파묘",
    director: "장재현",
    href: "#",
    poster_image: "/error.png",
    imageAlt: "/error.png",
    movie_id: "2",
    overview:
      "미스터리한 사건을 조사하기 위해 모인 팀이 오래된 묘를 파헤치면서 시작되는 공포스러운 이야기.",
    runtime: "134",
    release_date: "2024-02-22",
    genres: "genres",
  },
  {
    id: 3,
    title: "웡카",
    director: "폴 킹",
    href: "#",
    poster_image: "/error.png",
    imageAlt: "/error.png",
    movie_id: "3",
    overview:
      "세계에서 가장 유명한 초콜릿 공장을 세우기 전, 젊은 윌리 웡카의 마법 같은 모험을 그린 판타지 영화.",
    runtime: "116",
    release_date: "2023-12-20",
    genres: "genres",
  },
  {
    id: 4,
    title: "데드풀 & 울버린",
    director: "숀 레비",
    href: "#",
    poster_image: "/error.png",
    imageAlt: "/error.png",
    movie_id: "4",
    overview:
      "입담과 액션이 넘치는 데드풀이 울버린과 함께 새로운 모험을 떠나는 마블 유니버스의 코믹 액션 영화.",
    runtime: "127",
    release_date: "2024-07-26",
    genres: "genres",
  },
];

const SelectedMovie: React.FC<SelectedMovieProps> = ({ setActiveStep, setMovie }) => {
  console.log("setActiveStep 전달 확인:", setActiveStep);
  const movieList = "영화목록";
  const reserve = "예매하기";

  // const movieDb = apiServiceGet("v1/movies/fetch");
  // console.log(movieDb);

  const bookingMovie = (id: number) => {
    console.log(id);
    setMovie(id);
    setActiveStep(1);
  };

  const movieListRef = useRef<HTMLDivElement>(null);

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
  return (
    <div className="bg-white shadow-md">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div ref={movieListRef} className="pb-20">
          <TypingText
            text={movieList}
            className={"text-2xl font-bold tracking-tight text-gray-900 py-3"}
          ></TypingText>
          <button onClick={() => setMovie(-1)}>초기화</button>
          <SerachInput></SerachInput>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {boxoffice.map((movie) => (
              <div key={movie.id} className="group relative">
                <img
                  src={movie.poster_image}
                  alt={movie.imageAlt}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  style={{ maxWidth: "250px" }}
                />
                {/* object-contain */}
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={movie.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {movie.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{movie.release_date}</p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedMovie;
