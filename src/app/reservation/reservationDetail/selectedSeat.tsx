"use client";

import { useState, useEffect, useReducer } from "react";

const seat = [
  { id: 1, horizontal: "a", vertical: 1, roomid: 1 },
  { id: 2, horizontal: "b", vertical: 2, roomid: 1 },
  { id: 3, horizontal: "c", vertical: 3, roomid: 1 },
  { id: 4, horizontal: "d", vertical: 5, roomid: 2 },
  { id: 5, horizontal: "a", vertical: 3, roomid: 3 },
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

// 좌석 상태 타입을 단순화
type SeatStatus = "available" | "occupied" | "selected";

// 좌석 정보 인터페이스를 단순화
interface Seat {
  id: number;
  status: SeatStatus;
}

type State = Seat[][];
type Action = {
  type: string;
  payload: { row: number; col: number };
};

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
  const [theaterDetail, setTheaterDetail] = useState<{
    id: number;
    name: string;
    location: string;
    distance: string;
    image: string;
    regionId: number;
  }>();
  useEffect(() => {
    const getTheather = theaters.filter((i) => i.id === cinema.theather);
    setTheaterDetail(getTheather[0]);
    console.log(room);
  }, [movie, cinema, room]);

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
      {/* 좌석 선택 */}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="w-full mb-10 relative">
          <div className="h-8 bg-gray-300 rounded-lg w-4/5 mx-auto flex items-center justify-center text-gray-600 text-sm font-medium shadow-md transform perspective-500 rotateX-10">
            SCREEN
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/5 h-6 bg-gradient-to-b from-gray-200 to-transparent rounded-t-full"></div>
        </div>
        {/* 좌석 보여주는 컴포넌트 */}
        <ViewSeat selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats}></ViewSeat>

        {/* 좌석 범례 */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded-md mr-2"></div>
            <span>일반석</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded-md mr-2"></div>
            <span>선택한 좌석</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-400 rounded-md mr-2"></div>
            <span>예약된 좌석</span>
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

interface ShowTypeSeatProps {
  theaterDetail: {
    id: number;
    name: string;
    location: string;
    distance: string;
    image: string;
    regionId: number;
  };
  selectedSeats: { row: string; col: number }[];
}
const ShowBookingInfo: React.FC<ShowTypeSeatProps> = ({ theaterDetail, selectedSeats }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="flex flex-wrap justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">선택한 좌석:</span>{" "}
          {selectedSeats.length > 0
            ? selectedSeats.sort().map((seat) => "[ " + seat.row + "," + seat.col + " ] ")
            : "없음"}
        </div>
      </div>
    </div>
  );
};

interface ViewSeatProps {
  selectedSeats: { row: string; col: number }[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<{ row: string; col: number }[]>>;
}
const ViewSeat: React.FC<ViewSeatProps> = ({ selectedSeats, setSelectedSeats }) => {
  const replaceNum = (num: number) => {
    return num.toString().replace(/[0-9]/g, (num) => String.fromCharCode(parseInt(num) + 97));
  };
  const replaceAlphabet = (str: string) => {
    return str.replace(/[a-j]/g, (char) => (char.charCodeAt(0) - 96).toString());
  };
  const createSeats = (): State => {
    const arraySeats: State = Array.from({ length: 9 }, (_, rowIndex) => {
      return Array.from({ length: 9 }, (_, colIndex) => ({
        id: rowIndex * 9 + colIndex,
        status: "available",
      }));
    });
    seat.map((s) => {
      const horizontal = Number(replaceAlphabet(s.horizontal));
      arraySeats[horizontal][s.vertical].status = "occupied";
    });
    return arraySeats;
  };
  const seatReducer = (state: State, action: Action): State => {
    if (action.type === "RESET") return createSeats();
    const { row, col } = action.payload;
    return state.map((seatRow, rowIndex) =>
      rowIndex === row
        ? seatRow.map((seat, colIndex) =>
            colIndex === col
              ? { ...seat, status: seat.status === "available" ? "selected" : "available" }
              : seat
          )
        : seatRow
    );
  };
  const [seats, dispatch] = useReducer(seatReducer, [], createSeats);

  useEffect(() => {
    console.log(selectedSeats);
    if (selectedSeats.length === 0) dispatch({ type: "RESET", payload: { row: -1, col: -1 } });
  }, [selectedSeats]);

  // 좌석 선택 처리 함수 수정
  const handleSeatClick = (s: Seat, rowIndex: number, colIndex: number) => {
    const getSelectedSeats = [...selectedSeats];
    if (s.status === "available") {
      if (selectedSeats.length === 4) return;
      getSelectedSeats.push({ row: replaceNum(rowIndex), col: colIndex });
      setSelectedSeats(getSelectedSeats);
    } else if (s.status === "selected") {
      const newSelectedSeats = getSelectedSeats.filter(
        (s) => !(s.row == replaceNum(rowIndex) && s.col == colIndex)
      );
      setSelectedSeats(newSelectedSeats);
    }
    dispatch({ type: "ADD", payload: { row: rowIndex, col: colIndex } });
  };
  return (
    <>
      {" "}
      {/* 좌석 그리드 */}
      <div className="grid grid-cols-9 gap-1 max-w-3xl mx-auto mb-8">
        {seats.map((seat, rowIndex) => (
          <div key={rowIndex}>
            {seat.map((s, colIndex) => (
              <div
                key={colIndex}
                className={`
          w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md cursor-pointer transition-colors
          ${s.status === "available" ? "bg-gray-200 hover:bg-blue-200 text-gray-700" : ""}
          ${s.status === "occupied" ? "bg-gray-400 text-gray-200 cursor-not-allowed" : ""}
          ${s.status === "selected" ? "bg-blue-500 text-white" : ""}
        `}
                onClick={() => handleSeatClick(s, rowIndex, colIndex)}
              >
                {colIndex}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
