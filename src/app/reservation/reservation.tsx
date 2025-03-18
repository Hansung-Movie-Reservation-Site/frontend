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

export default function Reservation() {
  const [activeStep, setActiveStep] = useState(0); // 현재 활성화된 단계
  const [isLoading, setIsLoading] = useState(false);
  const [BookingState, setBookingState] = useState(false);

  const text = "예매하기";

  useEffect(() => {
    console.log(activeStep);
    console.log(cinema);
    console.log(time);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeStep]);

  // 컴포넌트 별 state 변수.
  const [movie, setMovie] = useState(-1);
  const [cinema, setCinema] = useState<{ region: number; theather: number }>({
    region: -1,
    theather: -1,
  });
  const [time, setTime] = useState<{ date: string; start: string }>({ date: "", start: "" });

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
                        setTime={setTime}
                      />
                    ) : (
                      <div>영화 선택 후 영화관 선택</div>
                    )
                  ) : activeStep === 2 ? (
                    <SelectedSeat />
                  ) : activeStep === 3 ? (
                    <Payment setBookingState={setBookingState} />
                  ) : (
                    <Payment />
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
