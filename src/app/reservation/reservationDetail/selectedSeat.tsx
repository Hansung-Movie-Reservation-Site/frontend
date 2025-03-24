"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { fetchSeat } from "@/app/Common/Service/apiService";
import { Clock, Film, Ticket } from "lucide-react";
import { Movie, Region, Theater, MovieRunningDetail } from "../typeReserve";
import { useTheather, useMovieRunningDetail, useReduxBoxoffice } from "@/redux/reduxService";
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

// 좌석 정보 인터페이스
interface SeatData {
  seatId: number;
  horizontal: string;
  vertical: number;
  reserved: boolean;
}

interface SelectedSeatProps {
  movie: number;
  cinema: { region: number; theather: number };
  room: number;
  setSeats: React.Dispatch<React.SetStateAction<{ row: string; col: number }[]>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const SelectedSeat: React.FC<SelectedSeatProps> = ({
  setActiveStep,
  setSeats,
  movie,
  cinema,
  room,
}) => {
  // 샘플 데이터로 상태 초기화
  const fetchSeatData = async () => {
    const seatData = await fetchSeat(room);
    return seatData;
  };

  // useEffect(() => {
  //   const getTheather = theaters.filter((i) => i.id === cinema.theather);
  //   setTheaterDetail(getTheather[0]);
  // }, [movie, cinema]);

  const [seatData, setSeatData] = useState<SeatData[]>([]);
  useEffect(() => {
    fetchSeatData().then((seatData) => {
      setSeatData(seatData);
      console.log("🟢 Promise 해제됨:", seatData);
    });
  }, []);

  const [selectedSeats, setSelectedSeats] = useState<{ row: string; col: number }[]>([]);
  const maxSelectableSeats = 4; // 최대 선택 가능 좌석 수

  // 선택 완료 처리
  const handleConfirm = () => {
    if (selectedSeats.length > 0) {
      console.log("선택된 좌석:", selectedSeats);
      // 실제 구현에서는 다음 단계로 진행하는 로직 추가
    }
    setSeats(selectedSeats);
    setActiveStep(3);
  };
  const handleSeatBack = () => {
    setSelectedSeats([]);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">좌석 선택</h1>
      </div>

      {/* 영화 예매 요약 */}
      <MovieBookingSummary selectedSeats={selectedSeats} />

      {/* 좌석 선택 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="w-full mb-10 relative">
          <div className="h-8 bg-gray-300 rounded-lg w-4/5 mx-auto flex items-center justify-center text-gray-600 text-sm font-medium shadow-md transform perspective-500 rotateX-10">
            SCREEN
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/5 h-6 bg-gradient-to-b from-gray-200 to-transparent rounded-t-full"></div>
        </div>
        {/* 좌석 보여주는 컴포넌트 */}
        <ViewSeat
          seatData={seatData}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          maxSelectableSeats={maxSelectableSeats}
        />

        {/* 좌석 범례 */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded-md mr-2"></div>
            <span>선택 가능한 좌석</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded-md mr-2"></div>
            <span>선택한 좌석</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-400 rounded-md mr-2"></div>
            <span>선택 불가능한 좌석</span>
          </div>
        </div>
      </div>
      {/* 스크린 */}

      <div className="bg-white rounded-lg shadow-md py-10 px flex flex-wrap items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">최대 {maxSelectableSeats}석까지 선택 가능합니다.</p>
          {/* <p className="font-medium">
            {selectedSeats.length > 0 ? (
              <>
                선택: <span className="text-blue-600">{selectedSeats.length}석</span> / 금액:{" "}
                <span className="text-blue-600">{calculatePrice().toLocaleString()}원</span>
              </>
            ) : (
              "좌석을 선택해주세요"
            )}
          </p> */}
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm border border-gray-300 rounded-md transition-colors ${
              selectedSeats.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            onClick={handleSeatBack}
            disabled={selectedSeats.length === 0}
          >
            좌석 초기화
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedSeats.length > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleConfirm}
            disabled={selectedSeats.length === 0}
          >
            선택 완료
          </button>
        </div>
      </div>
      {/* 선택완료 버튼 */}
    </div>
  );
};

export default SelectedSeat;

interface MovieBookingSummaryProps {
  selectedSeats: { row: string; col: number }[];
}

const MovieBookingSummary: React.FC<MovieBookingSummaryProps> = ({ selectedSeats }) => {
  const { theaterList, findTheaterId } = useTheather();
  const { movieRunningDetail, updateMovieRunningDetail } = useMovieRunningDetail();
  const { findMovie } = useReduxBoxoffice();
  const [movie, setMovie] = useState<Movie>();
  useEffect(() => {
    const m = findMovie(movieRunningDetail.kobisMovieCd);
    if (m === undefined) return;
    setMovie(m);
  }, []);
  // if (!runningDetail) {
  //   return (
  //     <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
  //       <div className="h-24 bg-gray-200 rounded-md"></div>
  //     </div>
  //   );
  // }

  // 상영 시간을 보기 좋게 포맷팅
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  // 러닝타임을 시간:분 형식으로 변환
  const formatRuntime = (minutes: number | undefined) => {
    if (minutes === undefined) return;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 영화 포스터 */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <img
            src={movie?.posterImage}
            alt={"/error.png"}
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>

        {/* 영화 정보 */}
        {movie ? (
          <div className="w-full md:w-3/4 lg:w-4/5 space-y-4">
            <h2 className="text-2xl font-bold">{movie.title}</h2>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
            {/* <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>
                {movieRunningDetail.} | {theaterDetail.location}
              </span>
            </div> */}

            <div className="flex items-center gap-2 text-gray-600">
              <Film className="w-4 h-4" />
              <span>
                {/* {movieRunningDetail.roomIds[selectedScreeningIndex]
                  ? `${runningDetail.roomIds[selectedScreeningIndex]}관`
                  : "정보 없음"} */}
              </span>
            </div>

            {/* 선택된 좌석 정보 */}
            <div className="mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Ticket className="w-4 h-4" />
                <span className="font-medium">선택한 좌석:</span>
                {selectedSeats.length > 0 ? (
                  <span>
                    {selectedSeats
                      .sort((a, b) => {
                        if (a.row !== b.row) return a.row.localeCompare(b.row);
                        return a.col - b.col;
                      })
                      .map((seat) => `${seat.row.toUpperCase()}${seat.col}`)
                      .join(", ")}
                  </span>
                ) : (
                  <span className="text-gray-400">좌석을 선택해주세요</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

interface ViewSeatProps {
  seatData: SeatData[];
  selectedSeats: { row: string; col: number }[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<{ row: string; col: number }[]>>;
  maxSelectableSeats: number;
}

const ViewSeat: React.FC<ViewSeatProps> = ({
  seatData,
  selectedSeats,
  setSelectedSeats,
  maxSelectableSeats,
}) => {
  // 좌석 데이터를 그리드 형태로 변환
  const organizeSeatsIntoGrid = () => {
    if (!seatData || seatData.length === 0) return { grid: [], rowLabels: [], colLabels: [] };

    // 모든 가능한 행(horizontal)과 열(vertical) 값 추출
    const horizontalValues = Array.from(new Set(seatData.map((seat) => seat.horizontal))).sort();
    const verticalValues = Array.from(new Set(seatData.map((seat) => seat.vertical))).sort(
      (a, b) => a - b
    );

    // 빈 그리드 생성
    const grid = Array(horizontalValues.length)
      .fill(null)
      .map(() => Array(verticalValues.length).fill(null));

    // 그리드에 좌석 데이터 채우기
    seatData.forEach((seat) => {
      const rowIndex = horizontalValues.indexOf(seat.horizontal);
      const colIndex = verticalValues.indexOf(seat.vertical);

      if (rowIndex !== -1 && colIndex !== -1) {
        grid[rowIndex][colIndex] = seat;
      }
    });

    return { grid, rowLabels: horizontalValues, colLabels: verticalValues };
  };

  const { grid, rowLabels, colLabels } = organizeSeatsIntoGrid();

  // 좌석 선택 처리
  const handleSeatClick = (seat: SeatData) => {
    if (seat.reserved) return; // reserved: true인 좌석은 선택 불가

    const seatKey = { row: seat.horizontal, col: seat.vertical };
    const isSeatSelected = selectedSeats.some(
      (s) => s.row === seatKey.row && s.col === seatKey.col
    );

    if (isSeatSelected) {
      // 이미 선택된 좌석이면 선택 해제
      setSelectedSeats(
        selectedSeats.filter((s) => !(s.row === seatKey.row && s.col === seatKey.col))
      );
    } else {
      // 새로운 좌석 선택 (최대 선택 가능 좌석 수 확인)
      if (selectedSeats.length < maxSelectableSeats) {
        setSelectedSeats([...selectedSeats, seatKey]);
      }
    }
  };

  // 좌석이 선택되었는지 확인
  const isSeatSelected = (seat: SeatData) => {
    return selectedSeats.some((s) => s.row === seat.horizontal && s.col === seat.vertical);
  };

  // 좌석 상태에 따른 스타일 클래스 결정
  const getSeatClass = (seat: SeatData) => {
    if (!seat) return "invisible"; // 좌석이 없는 경우
    if (seat.reserved) return "bg-gray-400 text-gray-200 cursor-not-allowed"; // reserved: true인 좌석은 선택 불가
    if (isSeatSelected(seat)) return "bg-blue-500 text-white"; // 선택된 좌석
    return "bg-gray-200 hover:bg-blue-200 text-gray-700"; // 선택 가능한 좌석
  };

  if (grid.length === 0) {
    return <div className="text-center py-8">좌석 정보를 불러오는 중...</div>;
  }

  return (
    <div className="mb-8">
      {/* 열 레이블 (상단) */}
      <div className="grid grid-cols-[auto_repeat(10,minmax(0,1fr))] gap-1 max-w-3xl mx-auto mb-2">
        <div className="w-10 h-10"></div> {/* 빈 셀 (좌상단 모서리) */}
        {colLabels.map((col, index) => (
          <div
            key={index}
            className="w-10 h-10 flex items-center justify-center text-sm font-medium"
          >
            {col}
          </div>
        ))}
      </div>

      {/* 좌석 그리드 (행 레이블 포함) */}
      {grid.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-[auto_repeat(10,minmax(0,1fr))] gap-1 max-w-3xl mx-auto"
        >
          {/* 행 레이블 (왼쪽) */}
          <div className="w-10 h-10 flex items-center justify-center text-sm font-medium">
            {rowLabels[rowIndex].toUpperCase()}
          </div>

          {/* 좌석 */}
          {row.map((seat, colIndex) => (
            <div
              key={colIndex}
              className={`
                w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md cursor-pointer transition-colors
                ${seat ? getSeatClass(seat) : "invisible"}
              `}
              onClick={() => seat && handleSeatClick(seat)}
            >
              {seat && `${seat.horizontal.toUpperCase()}${seat.vertical}`}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
