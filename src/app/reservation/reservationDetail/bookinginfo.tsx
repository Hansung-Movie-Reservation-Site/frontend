"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";

interface BookingInfoProps {
  setBookingState: (value: boolean) => void;
}

const BookingInfo: React.FC<BookingInfoProps> = ({ setBookingState }) => {
  // 샘플 예매 정보
  const bookingInfo = {
    theater: {
      name: "메가박스 강남",
      location: "서울 강남구 역삼동 814-6",
    },
    movie: {
      title: "듄: 파트 2",
      englishTitle: "Dune: Part Two",
      runtime: 166,
      poster: "/placeholder.svg?height=300&width=200",
    },
    showtime: {
      time: "19:00",
      hall: "2관",
      seats: "120/150",
    },
    date: "오늘 (3월 16일)",
    ticketCount: 2,
    totalPrice: 26000,
    selectedSeats: "H7, H8",
  };
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

        <PaymentContent bookingInfo={bookingInfo}></PaymentContent>
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

interface PaymentContentProps {
  bookingInfo: {
    theater: {
      name: string;
      location: string;
    };
    movie: {
      title: string;
      englishTitle: string;
      runtime: number;
      poster: string;
    };
    showtime: {
      time: string;
      hall: string;
      seats: string;
    };
    date: string;
    ticketCount: number;
    totalPrice: number;
    selectedSeats: string;
  };
}

const PaymentContent = ({ bookingInfo }: PaymentContentProps) => {
  return (
    <div className="p-6 overflow-y-auto ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <Image
            src={bookingInfo.movie.poster || "/placeholder.svg"}
            alt={bookingInfo.movie.title}
            width={200}
            height={300}
            className="w-full max-w-[200px] h-auto object-cover rounded-lg shadow"
          />
        </div>

        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold">{bookingInfo.movie.title}</h3>
          <p className="text-gray-500">{bookingInfo.movie.englishTitle}</p>

          <div className="h-px bg-gray-200"></div>

          <div className="space-y-3">
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
                {Math.floor(bookingInfo.movie.runtime / 60)}시간 {bookingInfo.movie.runtime % 60}분
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
          </div>
        </div>
      </div>
    </div>
  );
};
