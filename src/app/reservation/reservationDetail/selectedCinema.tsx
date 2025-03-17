"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Sample data
const regions = [
  { id: 1, name: "서울" },
  { id: 2, name: "경기" },
  { id: 3, name: "인천" },
  { id: 4, name: "부산" },
  { id: 5, name: "대구" },
];

const theaters = [
  {
    id: 1,
    name: "메가박스 강남",
    location: "서울 강남구 역삼동 814-6",
    distance: "1.2km",
    image: "/placeholder.svg?height=100&width=200",
    regionId: 1,
  },
  {
    id: 2,
    name: "CGV 압구정",
    location: "서울 강남구 신사동 602",
    distance: "2.5km",
    image: "/placeholder.svg?height=100&width=200",
    regionId: 1,
  },
  {
    id: 3,
    name: "롯데시네마 월드타워",
    location: "서울 송파구 올림픽로 300",
    distance: "5.8km",
    image: "/placeholder.svg?height=100&width=200",
    regionId: 1,
  },
  {
    id: 4,
    name: "CGV 일산",
    location: "경기도 고양시 일산동구 중앙로 1283",
    distance: "15.2km",
    image: "/placeholder.svg?height=100&width=200",
    regionId: 2,
  },
  {
    id: 5,
    name: "메가박스 부산",
    location: "부산광역시 해운대구 센텀남대로 35",
    distance: "320km",
    image: "/placeholder.svg?height=100&width=200",
    regionId: 4,
  },
];

const movies = [
  {
    id: 1,
    title: "듄: 파트 2",
    englishTitle: "Dune: Part Two",
    rating: 8.9,
    genre: "SF, 모험",
    runtime: 166,
    poster: "/placeholder.svg?height=300&width=200",
    ageRating: "12",
  },
  {
    id: 2,
    title: "파묘",
    englishTitle: "Exhuma",
    rating: 7.8,
    genre: "공포, 미스터리",
    runtime: 134,
    poster: "/placeholder.svg?height=300&width=200",
    ageRating: "15",
  },
  {
    id: 3,
    title: "웡카",
    englishTitle: "Wonka",
    rating: 7.2,
    genre: "판타지, 모험",
    runtime: 116,
    poster: "/placeholder.svg?height=300&width=200",
    ageRating: "ALL",
  },
  {
    id: 4,
    title: "데드풀 & 울버린",
    englishTitle: "Deadpool & Wolverine",
    rating: 9.1,
    genre: "액션, 코미디",
    runtime: 127,
    poster: "/placeholder.svg?height=300&width=200",
    ageRating: "18",
  },
];

const showtimes = [
  { id: 1, time: "10:30", seats: "132/150", hall: "1관" },
  { id: 2, time: "13:20", seats: "98/150", hall: "1관" },
  { id: 3, time: "16:10", seats: "45/150", hall: "1관" },
  { id: 4, time: "19:00", seats: "120/150", hall: "2관" },
  { id: 5, time: "21:50", seats: "30/150", hall: "2관" },
];

interface SelectedMovieProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const SelectedCinema: React.FC<SelectedMovieProps> = ({ setActiveStep }) => {
  // const [cinema, setCinema] = useState({
  //   region: "",
  //   theater: "",
  //   movie: "",
  //   date: "",
  //   showtime: "",
  // });
  // // Sample data
  // const regions = [
  //   { id: 1, name: "서울" },
  //   { id: 2, name: "경기" },
  //   { id: 3, name: "인천" },
  //   { id: 4, name: "부산" },
  //   { id: 5, name: "대구" },
  // ];

  // const theaters = [
  //   {
  //     id: 1,
  //     name: "메가박스 강남",
  //     location: "서울 강남구 역삼동 814-6",
  //     distance: "1.2km",
  //     image: "/placeholder.svg?height=100&width=200",
  //     regionId: 1,
  //   },
  //   {
  //     id: 2,
  //     name: "CGV 압구정",
  //     location: "서울 강남구 신사동 602",
  //     distance: "2.5km",
  //     image: "/placeholder.svg?height=100&width=200",
  //     regionId: 1,
  //   },
  //   {
  //     id: 3,
  //     name: "롯데시네마 월드타워",
  //     location: "서울 송파구 올림픽로 300",
  //     distance: "5.8km",
  //     image: "/placeholder.svg?height=100&width=200",
  //     regionId: 1,
  //   },
  //   {
  //     id: 4,
  //     name: "CGV 일산",
  //     location: "경기도 고양시 일산동구 중앙로 1283",
  //     distance: "15.2km",
  //     image: "/placeholder.svg?height=100&width=200",
  //     regionId: 2,
  //   },
  //   {
  //     id: 5,
  //     name: "메가박스 부산",
  //     location: "부산광역시 해운대구 센텀남대로 35",
  //     distance: "320km",
  //     image: "/placeholder.svg?height=100&width=200",
  //     regionId: 4,
  //   },
  // ];

  // const movies = [
  //   {
  //     id: 1,
  //     title: "듄: 파트 2",
  //     englishTitle: "Dune: Part Two",
  //     rating: 8.9,
  //     genre: "SF, 모험",
  //     runtime: 166,
  //     poster: "/placeholder.svg?height=300&width=200",
  //     ageRating: "12",
  //   },
  //   {
  //     id: 2,
  //     title: "파묘",
  //     englishTitle: "Exhuma",
  //     rating: 7.8,
  //     genre: "공포, 미스터리",
  //     runtime: 134,
  //     poster: "/placeholder.svg?height=300&width=200",
  //     ageRating: "15",
  //   },
  //   {
  //     id: 3,
  //     title: "웡카",
  //     englishTitle: "Wonka",
  //     rating: 7.2,
  //     genre: "판타지, 모험",
  //     runtime: 116,
  //     poster: "/placeholder.svg?height=300&width=200",
  //     ageRating: "ALL",
  //   },
  //   {
  //     id: 4,
  //     title: "데드풀 & 울버린",
  //     englishTitle: "Deadpool & Wolverine",
  //     rating: 9.1,
  //     genre: "액션, 코미디",
  //     runtime: 127,
  //     poster: "/placeholder.svg?height=300&width=200",
  //     ageRating: "18",
  //   },
  // ];

  // const showtimes = [
  //   { id: 1, time: "10:30", seats: "132/150", hall: "1관" },
  //   { id: 2, time: "13:20", seats: "98/150", hall: "1관" },
  //   { id: 3, time: "16:10", seats: "45/150", hall: "1관" },
  //   { id: 4, time: "19:00", seats: "120/150", hall: "2관" },
  //   { id: 5, time: "21:50", seats: "30/150", hall: "2관" },
  // ];
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("오늘");

  const handleRegionSelect = (regionId: number) => {
    setSelectedRegion(regionId);
    setSelectedTheater(null);
    setSelectedMovie(null);
    setSelectedShowtime(null);
  };

  // 영화 목록 컨테이너에 대한 ref 생성
  const movieListRef = useRef<HTMLDivElement>(null);
  const showtimeRef = useRef<HTMLDivElement>(null);
  const seatButtonRef = useRef<HTMLDivElement>(null);

  const handleTheaterSelect = (theaterId: number) => {
    setSelectedTheater(theaterId);
    setSelectedMovie(null);
    setSelectedShowtime(null);

    // 모바일에서는 약간의 지연 후 스크롤 (UI가 업데이트될 시간을 주기 위해)
    setTimeout(() => {
      // 영화 목록으로 스크롤
      if (window.innerWidth < 768) {
        // 모바일 화면에서만
        movieListRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleMovieSelect = (movieId: number) => {
    setSelectedMovie(movieId);
    setSelectedShowtime(null);

    // 영화 선택 시 약간의 지연 후 상영 시간 섹션으로 스크롤
    setTimeout(() => {
      if (showtimeRef.current) {
        showtimeRef.current.scrollIntoView({
          behavior: "smooth", // 부드러운 스크롤 애니메이션
          block: "start", // 요소의 상단으로 스크롤
        });
      }
    }, 100);
  };

  const handleShowtimeSelect = (showtimeId: number) => {
    setSelectedShowtime(showtimeId);

    setTimeout(() => {
      if (seatButtonRef.current) {
        seatButtonRef.current.scrollIntoView({
          behavior: "smooth", // 부드러운 스크롤 애니메이션
          block: "start", // 요소의 상단으로 스크롤
        });
      }
    }, 100);
  };

  const filteredTheaters = theaters.filter((theater) => theater.regionId === selectedRegion);
  const getSelectedTheater = () => theaters.find((theater) => theater.id === selectedTheater);
  const getSelectedMovie = () => movies.find((movie) => movie.id === selectedMovie);
  const getSelectedShowtime = () => showtimes.find((showtime) => showtime.id === selectedShowtime);

  // 극장 선택 시 영화 목록으로 스크롤 애니메이션 효과
  useEffect(() => {
    if (selectedTheater && movieListRef.current) {
      // 데스크톱에서는 부드럽게 스크롤
      if (window.innerWidth >= 768) {
        movieListRef.current.scrollIntoView({
          behavior: "smooth", // 부드러운 스크롤 애니메이션
          block: "start", // 요소의 상단으로 스크롤
        });
      }
    }
  }, [selectedTheater]);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">영화 예매</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Region and Theater selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">지역 선택</h2>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedRegion === region.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleRegionSelect(region.id)}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          {selectedRegion && (
            <div>
              <h2 className="text-xl font-semibold mb-3">극장 선택</h2>
              <div className="space-y-2">
                {filteredTheaters.map((theater) => (
                  <div
                    key={theater.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTheater === theater.id
                        ? "border-blue-500 ring-2 ring-blue-500/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTheaterSelect(theater.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={theater.image || "/placeholder.svg"}
                        alt={theater.name}
                        width={60}
                        height={40}
                        className="w-[60px] h-[40px] object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{theater.name}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {theater.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Movie selection and showtimes */}
        <div className="md:col-span-2">
          {selectedTheater ? (
            <>
              {/* Right column: Movie selection and showtimes */}
              <div className="md:col-span-2" ref={movieListRef}>
                {selectedTheater ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        {getSelectedTheater()?.name} 상영 영화
                      </h2>

                      <div className="relative">
                        <select
                          title="1"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="오늘">오늘 (3월 16일)</option>
                          <option value="내일">내일 (3월 17일)</option>
                          <option value="모레">모레 (3월 18일)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* 영화 목록을 스크롤 가능한 컨테이너로 감싸기 */}
                    <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {movies.map((movie) => (
                          <div
                            key={movie.id}
                            className={`rounded-lg border overflow-hidden cursor-pointer transition-all ${
                              selectedMovie === movie.id
                                ? "border-blue-500 ring-2 ring-blue-500/50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleMovieSelect(movie.id)}
                          >
                            <div className="relative">
                              <Image
                                src={movie.poster || "/placeholder.svg"}
                                alt={movie.title}
                                width={200}
                                height={300}
                                className="w-full h-[250px] object-cover"
                              />
                              <div
                                className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded ${
                                  movie.ageRating === "ALL"
                                    ? "bg-green-100 text-green-800 border border-green-800"
                                    : movie.ageRating === "12"
                                    ? "bg-blue-500 text-white"
                                    : movie.ageRating === "15"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {movie.ageRating}
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-bold text-lg">{movie.title}</h3>
                              <p className="text-sm text-gray-500">{movie.englishTitle}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {movie.rating}
                              </div>
                              <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>{movie.genre}</span>
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {Math.floor(movie.runtime / 60)}시간 {movie.runtime % 60}분
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedMovie && (
                      <div className="py-16" ref={showtimeRef}>
                        <h3 className="text-lg font-semibold mb-3">상영 시간</h3>
                        <div className="flex flex-wrap gap-2">
                          {showtimes.map((showtime) => (
                            <button
                              key={showtime.id}
                              className={`flex flex-col items-center px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                                selectedShowtime === showtime.id
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                              onClick={() => handleShowtimeSelect(showtime.id)}
                            >
                              <span className="font-bold">{showtime.time}</span>
                              <span className="text-xs">{showtime.hall}</span>
                              <span
                                className={`text-xs ${
                                  selectedShowtime === showtime.id
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {showtime.seats}
                              </span>
                            </button>
                          ))}
                        </div>
                        {selectedShowtime && (
                          <div className="mt-6 flex justify-end" ref={seatButtonRef}>
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                              onClick={() => setActiveStep(2)}
                            >
                              좌석 선택하기
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] border rounded-lg bg-gray-50">
                    <p className="text-gray-500">지역과 극장을 선택해주세요</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] border rounded-lg bg-gray-50">
              <p className="text-gray-500">지역과 극장을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SelectedCinema;
