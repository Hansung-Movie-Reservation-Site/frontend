"use client";

import { useState } from "react";

interface SeatSelectionProps {
  onBack: () => void;
  onConfirm: (selectedSeats: string[]) => void;
  movieTitle: string;
  theaterName: string;
  showtime: string;
  date: string;
}

// 좌석 상태 타입을 단순화
type SeatStatus = "available" | "occupied" | "selected";

// 좌석 정보 인터페이스를 단순화
interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
}

// 샘플 좌석 데이터 생성 함수를 수정하여 한 줄에 9개의 좌석으로 구성
const generateSeats = (): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 9;
  const seats: Seat[] = [];

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      // 일부 좌석은 이미 예약된 상태로 설정
      const isOccupied = Math.random() < 0.3; // 30% 확률로 예약됨

      const status = isOccupied ? "occupied" : "available";

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status,
      });
    }
  });

  return seats;
};
const SelectedSeat = ({
  onBack,
  onConfirm,
  movieTitle,
  theaterName,
  showtime,
  date,
}: SeatSelectionProps) => {
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [maxSelectableSeats] = useState(4); // 최대 선택 가능 좌석 수

  // 좌석 선택 처리 함수 수정
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied") {
      return; // 이미 예약된 좌석은 클릭 무시
    }

    setSeats((prevSeats) => {
      return prevSeats.map((s) => {
        if (s.id === seat.id) {
          // 이미 선택된 좌석이면 선택 해제
          if (s.status === "selected") {
            setSelectedSeats((prev) => prev.filter((id) => id !== s.id));
            return { ...s, status: "available" };
          }
          // 새로 선택하는 경우, 최대 선택 가능 좌석 수 확인
          else if (selectedSeats.length < maxSelectableSeats) {
            setSelectedSeats((prev) => [...prev, s.id]);
            return { ...s, status: "selected" };
          }
        }
        return s;
      });
    });
  };

  // 선택 완료 처리
  const handleConfirm = () => {
    if (selectedSeats.length > 0) {
      onConfirm(selectedSeats);
    }
  };

  // 좌석 가격 계산 함수 단순화
  const calculatePrice = () => {
    // 모든 좌석을 동일한 가격으로 계산
    return selectedSeats.length * 13000;
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <button
          title="1"
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">좌석 선택</h1>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{movieTitle}</h3>
            <p className="text-sm text-gray-600">
              {theaterName} | {date} | {showtime}
            </p>
          </div>
          <div className="text-sm">
            <span className="font-medium">선택한 좌석:</span>{" "}
            {selectedSeats.length > 0 ? selectedSeats.sort().join(", ") : "없음"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* 스크린 */}
        <div className="w-full mb-10 relative">
          <div className="h-8 bg-gray-300 rounded-lg w-4/5 mx-auto flex items-center justify-center text-gray-600 text-sm font-medium shadow-md transform perspective-500 rotateX-10">
            SCREEN
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/5 h-6 bg-gradient-to-b from-gray-200 to-transparent rounded-t-full"></div>
        </div>

        {/* 좌석 그리드 */}
        <div className="grid grid-cols-9 gap-1 max-w-3xl mx-auto mb-8">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`
                w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md cursor-pointer transition-colors
                ${seat.status === "available" ? "bg-gray-200 hover:bg-blue-200 text-gray-700" : ""}
                ${seat.status === "occupied" ? "bg-gray-400 text-gray-200 cursor-not-allowed" : ""}
                ${seat.status === "selected" ? "bg-blue-500 text-white" : ""}
              `}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.row}
              {seat.number}
            </div>
          ))}
        </div>

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

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">최대 {maxSelectableSeats}석까지 선택 가능합니다.</p>
          <p className="font-medium">
            {selectedSeats.length > 0 ? (
              <>
                선택: <span className="text-blue-600">{selectedSeats.length}석</span> / 금액:{" "}
                <span className="text-blue-600">{calculatePrice().toLocaleString()}원</span>
              </>
            ) : (
              "좌석을 선택해주세요"
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            onClick={onBack}
          >
            이전
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
    </div>
  );
};

export default SelectedSeat;
