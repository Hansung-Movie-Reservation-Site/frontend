"use client";

import { useEffect, useState } from "react";
import ReservationNav from "./reservationUI/reservationNav";
import SelectedSeat from "./reservationDetail/selectedSeat";
import SelectedMovie from "./reservationDetail/selectedMovie";
import { motion, AnimatePresence } from "framer-motion";
import { TypingText } from "@/app/Common/Animation/typingAni";
import Payment from "./reservationDetail/payment";
import { BufferingAni } from "../Common/Animation/motionAni";
import { ReservationState } from "./reservationUI/reservationState";
import BeforeMovie from "./reservationDetail/CinemaComponents/beforeMovie";
import BookingInfo from "./reservationUI/bookinginfo";
import { fetchBoxofficeGet } from "../Common/Service/apiService";
import { useReduxBoxoffice } from "@/redux/reduxService";

export default function Reservation() {
  const [activeStep, setActiveStep] = useState(0); // 현재 활성화된 단계
  const [isLoading, setIsLoading] = useState(false);
  const [BookingState, setBookingState] = useState(false);
  const text = "예매하기";

  // 🚨서버에서 데이터 가져오기 🚨
  const { movieList, updateMovieList } = useReduxBoxoffice();
  const fetchMovieList = async () => {
    try {
      const data = await fetchBoxofficeGet();
      console.log(data);
      updateMovieList(data);
    } catch (error) {
      console.log(error);
      updateMovieList([]);
    }
  };
  useEffect(() => {
    fetchMovieList();
  }, []);
  // 🚨서버에서 데이터 가져오기 🚨

  // 🚨activeStep의 값변화에 따른 UI 관리: 경우의 수는 0,1,2,3 🚨
  useEffect(() => {
    console.log(activeStep);
    console.log(cinema);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeStep]);
  // 🚨activeStep의 값변화에 따른 UI 관리. 🚨

  // 결제에 필요한 state 변수.
  const [movie, setMovie] = useState(-1);
  const [cinema, setCinema] = useState<{ region: number; theather: number }>({
    region: -1,
    theather: -1,
  });
  const [room, setRoom] = useState<number>(0);
  const [seats, setSeats] = useState<{ row: string; col: number }[]>([]);

  return (
    <>
      <div className="min-h-full">
        <ReservationNav activeStep={activeStep} setActiveStep={setActiveStep}></ReservationNav>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <header className="bg-white shadow-md">
              <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <h1 className="text-2xl font-normal text-gray-900 font-lato">
                  <TypingText text={text} className="text-2xl font-bold text-gray-900 font-lato" />
                </h1>
                <div className="flex-1 flex justify-center"></div>
              </div>
            </header>
            <AnimatePresence mode="wait">
              {isLoading ? ( // 로딩 중이면 스피너 표시
                <BufferingAni className={"translate-y-23"}></BufferingAni>
              ) : (
                <motion.div
                  key={activeStep} // key 변경 시 애니메이션 실행
                  initial={{ opacity: 0, y: 30 }} // 더 아래서 시작
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} // 사라질 때 위로 약간 올라가며 퇴장
                  transition={{ duration: 0.5, ease: "easeInOut" }} // 더 부드러운 효과 적용
                >
                  {activeStep === 0 ? (
                    <SelectedMovie setActiveStep={setActiveStep} setMovie={setMovie} />
                  ) : activeStep === 1 ? (
                    movie === -1 ? (
                      <BeforeMovie
                        setActiveStep={setActiveStep}
                        setCinema={setCinema}
                        setMovie={setMovie}
                        setRoom={setRoom}
                      />
                    ) : (
                      <div>영화 선택 후 영화관 선택</div>
                    )
                  ) : activeStep === 2 ? (
                    <SelectedSeat
                      setActiveStep={setActiveStep}
                      setSeats={setSeats}
                      movie={movie}
                      cinema={cinema}
                      room={room}
                    />
                  ) : activeStep === 3 ? (
                    <Payment setBookingState={setBookingState} />
                  ) : (
                    <div>error</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <ReservationState
          activeStep={activeStep}
          setBookingState={setBookingState}
        ></ReservationState>
        {BookingState ? (
          <BookingInfo setBookingState={setBookingState} movie={movie}></BookingInfo>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
