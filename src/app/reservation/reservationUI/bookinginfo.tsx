"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheather, useMovieRunningDetail, useReduxBoxoffice } from "@/redux/reduxService";
import { Movie, Theater } from "../typeReserve";

interface BookingInfoProps {
  setBookingState: (value: boolean) => void;
  movie: number;
  cinema: { region: number; theather: number };
  screen: number;
  seats: number[];
  date: string;
}

const BookingInfo: React.FC<BookingInfoProps> = ({
  setBookingState,
  movie,
  cinema,
  screen,
  seats,
  date,
}) => {
  const { findTheaterId } = useTheather();
  const { movieRunningDetail } = useMovieRunningDetail();
  const { findMovie } = useReduxBoxoffice();

  type MovieInfo = {
    title: string;
    posterImage: string;
    director: string;
    genres: string;
    runtime: number;
  };
  const defaultMovie = {
    title: "영화를 선택해주세요.",
    posterImage: "/error.png",
    director: "영화를 선택해주세요.",
    genres: "영화를 선택해주세요.",
    runtime: 0,
  };
  const getMovie = () => {
    const m = findMovie(movieRunningDetail.kobisMovieCd);
    if (m === undefined) return defaultMovie;
    return {
      title: m.title,
      posterImage: m?.posterImage,
      director: m.director,
      genres: m.genres,
      runtime: m.runtime,
    };
  };
  const getTheater = () => {
    const t = findTheaterId(cinema.theather);
    if (t === undefined) return "영화관을 선택해주세요.";
    return t.name;
  };
  const [movieInfo, setMovieInfo] = useState<MovieInfo>(getMovie());
  const [cinemaInfo, setCinemaInfo] = useState<string>(getTheater());
  // 모달이 열릴 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setBookingState(false);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }} // 처음에는 위쪽에서 시작
        animate={{ y: 0, opacity: 1 }} // 아래로 내려오면서 나타남
        exit={{ y: -100, opacity: 0 }} // 닫힐 때 다시 위로 올라감
        transition={{ duration: 0.3, ease: "easeOut" }} // 부드러운 애니메이션
        className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div>
          <div className="p-4 flex items-center justify-between bg-gray-50">
            <h2 className="text-xl font-bold">예매 정보</h2>
            <button
              title="1"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setBookingState(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="h-px bg-gray-200"></div>
        </div>

        <PaymentContent movie={movie}></PaymentContent>
        <div className="h-px bg-gray-200"></div>
        <div className="p-4 flex justify-end bg-gray-50">
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors mr-2"
            onClick={() => setBookingState(false)}
          >
            취소
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path
                fillRule="evenodd"
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
            결제하기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingInfo;

const movies = [
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

interface PaymentContentProps {
  movie: number;
}

const PaymentContent = ({ movie }: PaymentContentProps) => {
  const { findMovie_id } = useReduxBoxoffice();
  const { movieRunningDetail } = useMovieRunningDetail();

  type MovieInfo = {
    title: string;
    posterImage: string;
    director: string;
    genres: string;
    runtime: number;
  };
  const defaultMovie = {
    title: "영화를 선택해주세요.",
    posterImage: "/error.png",
    director: "영화를 선택해주세요.",
    genres: "영화를 선택해주세요.",
    runtime: 0,
  };
  const getMovie = () => {
    const m = findMovie_id(movie);
    if (m === undefined) return defaultMovie;
    return {
      title: m.title,
      posterImage: m?.posterImage,
      director: m.director,
      genres: m.genres,
      runtime: m.runtime,
    };
  };
  const [movieInfo, setMovieInfo] = useState<MovieInfo>(getMovie());
  useEffect(() => {
    setMovieInfo(getMovie());
    console.log(movieInfo);
  }, [movie]); // movie가 변경될 때마다 실행

  return (
    <div className="p-6 overflow-y-auto ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <img
            src={movieInfo.posterImage}
            alt={"/error.png"}
            width={200}
            height={300}
            className="w-full max-w-[200px] h-auto object-cover rounded-lg shadow"
          />
        </div>

        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold">{movieInfo.title}</h3>

          <div className="h-px bg-gray-200"></div>

          {/* <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">극장</span>
              <span className="font-medium">{bookingInfo.theater.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">위치</span>
              <span className="font-medium">{bookingInfo.theater.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">날짜</span>
              <span className="font-medium">{bookingInfo.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">시간</span>
              <span className="font-medium">
                {bookingInfo.showtime.time} ({bookingInfo.showtime.hall})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">잔여좌석</span>
              <span className="font-medium">{bookingInfo.showtime.seats}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">상영시간</span>
              <span className="font-medium">
                {Math.floor(Number(movieDetail?.runtime) / 60)}시간{" "}
                {Number(movieDetail?.runtime) % 60}분
              </span>
            </div>

            <div className="h-px bg-gray-200 my-2"></div>

            <div className="flex justify-between">
              <span className="text-gray-500">선택 좌석</span>
              <span className="font-medium">{bookingInfo.selectedSeats}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">인원</span>
              <span className="font-medium">{bookingInfo.ticketCount}명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 금액</span>
              <span className="font-bold text-blue-600">
                {bookingInfo.totalPrice.toLocaleString()}원
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
