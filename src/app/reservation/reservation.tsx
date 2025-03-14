"use client";
import { useEffect, useState } from "react";
import ReservationState from "./reservationDetail/reservationState";
import SelectedCinema from "./reservationDetail/selectedCinema";
import SelectedSeat from "./reservationDetail/selectedSeat";
import SelectedMovie from "./reservationDetail/selectedMovie";
import { motion, AnimatePresence } from "framer-motion";
import { TypingText } from "@/app/Common/Animation/TypingAni";
import Payment from "./reservationDetail/payment";
import { BufferingAni } from "../Common/Animation/MotionAni";

export default function Reservation() {
  const [activeStep, setActiveStep] = useState(0); // 현재 활성화된 단계
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeStep]);
  const text = "예매하기";

  return (
    <>
      <div className="min-h-full">
        <ReservationState activeStep={activeStep} setActiveStep={setActiveStep}></ReservationState>

        <header className="bg-white shadow-md">
          <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-normal text-gray-900 font-lato">
              <TypingText
                text={text}
                className="text-2xl font-bold text-gray-900 font-lato"
              ></TypingText>
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {isLoading ? ( // 로딩 중이면 스피너 표시
                <BufferingAni className={"translate-y-23"}></BufferingAni>
              ) : (
                <motion.div
                  key={activeStep} // key 변경 시 애니메이션 실행
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeStep == 0 ? (
                    <SelectedMovie />
                  ) : activeStep == 1 ? (
                    <SelectedCinema />
                  ) : activeStep == 2 ? (
                    <SelectedSeat />
                  ) : activeStep == 3 ? (
                    <Payment />
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
