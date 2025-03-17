"use client";
import { useEffect, useState } from "react";
import ReservationNav from "./reservationUI/reservationNav";
import SelectedCinema from "./reservationDetail/selectedCinema";
import SelectedSeat from "./reservationDetail/selectedSeat";
import SelectedMovie from "./reservationDetail/selectedMovie";
import { motion, AnimatePresence } from "framer-motion";
import { TypingText } from "@/app/Common/Animation/typingAni";
import Payment from "./reservationDetail/payment";
import { BufferingAni } from "../Common/Animation/motionAni";
import { ReservationState } from "./reservationDetail/reservationState";

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
        <ReservationNav activeStep={activeStep} setActiveStep={setActiveStep}></ReservationNav>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <header className="bg-white shadow-md">
              <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* 왼쪽 정렬된 예매하기 텍스트 */}
                <h1 className="text-2xl font-normal text-gray-900 font-lato">
                  <TypingText text={text} className="text-2xl font-bold text-gray-900 font-lato" />
                </h1>

                {/* 중앙 정렬된 ProgressBar */}
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
                    <SelectedMovie setActiveStep={setActiveStep} />
                  ) : activeStep === 1 ? (
                    <SelectedCinema setActiveStep={setActiveStep} />
                  ) : activeStep === 2 ? (
                    <SelectedSeat />
                  ) : activeStep === 3 ? (
                    <Payment />
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <ReservationState activeStep={activeStep}></ReservationState>
      </div>
    </>
  );
}
