"use client";

import { useCallback, useEffect, useState, lazy, Suspense } from "react";
import MemoNav from "./reservationUI/reservationNav";
import SelectedSeat from "./reservationDetail/selectedSeat";
import MemoizedMoive from "./reservationDetail/selectedMovie";
import { motion, AnimatePresence } from "framer-motion";
import MemoTypingText, { TypingText } from "@/app/Common/Animation/typingAni";
import Payment from "./reservationDetail/payment";
import { BufferingAni } from "../Common/Animation/motionAni";
import { ReservationState } from "./reservationUI/reservationState";
import SelectedTheater from "./reservationDetail/CinemaComponents/selectedTheater";
import BookingInfo from "./reservationUI/bookinginfo";
import { fetchBoxofficeGet } from "../Common/Service/apiService";
import { useReduxBoxoffice } from "@/redux/reduxService";
import ScrollToTopButton from "../Common/scrollTopButton";

export default function Reservation() {
  const [activeStep, setActiveStep] = useState(0); // 현재 활성화된 단계
  const [isLoading, setIsLoading] = useState(false);
  const [BookingState, setBookingState] = useState(false);
  const text = "예매하기";

  // 🚨서버에서 데이터 가져오기 🚨
  const { updateMovieList } = useReduxBoxoffice();
  useEffect(() => {
    const controller = new AbortController();

    const fetchMovieList = async () => {
      try {
        const data = await fetchBoxofficeGet();
        updateMovieList(data);
      } catch (error) {
        controller.abort();
        console.error(error);
        updateMovieList([]);
      }
    };

    fetchMovieList();
  }, []);
  // 🚨서버에서 데이터 가져오기 🚨

  // 결제에 필요한 state 변수.
  const [movie, setMovie] = useState(-1);
  const [cinema, setCinema] = useState<{ region: number; theather: number }>({
    region: -1,
    theather: -1,
  });
  const [date, setDate] = useState<string>("");
  const [screen, setScreen] = useState<number>(-1);
  const [seats, setSeats] = useState<number[]>([]);

  const setMemoActiveStep = useCallback((id: number) => {
    return setActiveStep(id);
  }, []);
  const setMemoMovie = useCallback((id: number) => {
    return setMovie(id);
  }, []);
  const MemoMovie = lazy(() => import("./reservationDetail/selectedMovie"));
  // const MemoTheather = lazy(() => import("./reservationDetail/CinemaComponents/selectedTheater"));
  // const MemoSeat = lazy(() => import("./reservationDetail/selectedSeat"));
  // const MemoPayment = lazy(() => import("./reservationDetail/payment"));

  // 🚨activeStep의 값변화에 따른 UI 관리: 경우의 수는 0,1,2,3 🚨
  useEffect(() => {
    const resetState = () => {
      setMovie(-1);
      setCinema({ region: -1, theather: -1 });
      setDate("");
      setScreen(-1);
      setSeats([]);
      setActiveStep(0);
    };
    const loading = () => {
      if (activeStep === -1) {
        resetState();
        return;
      }
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    };
    loading();
  }, [activeStep]);
  // 🚨activeStep의 값변화에 따른 UI 관리. 🚨

  // const steps = () => {
  //   switch (activeStep) {
  //     case 0:
  //       return <MemoizedMoive setMemoActiveStep={setMemoActiveStep} setMemoMovie={setMemoMovie} />;
  //     // case 1:
  //     //   return (
  //     //     <SelectedTheater
  //     //       setActiveStep={setActiveStep}
  //     //       setCinema={setCinema}
  //     //       setMovie={setMovie}
  //     //       setScreen={setScreen}
  //     //       setDate={setDate}
  //     //     />
  //     //   );
  //     // case 2:
  //     //   return <SelectedSeat setActiveStep={setActiveStep} setSeats={setSeats} screen={screen} />;
  //     // case 3:
  //     //   return <Payment setBookingState={setBookingState} />;
  //     default:
  //       return <div>error</div>;
  //   }
  // };

  return (
    <>
      <div className="min-h-full">
        <MemoNav activeStep={activeStep} setMemoActiveStep={setMemoActiveStep}></MemoNav>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <header className="bg-white shadow-md">
              <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <h1 className="text-2xl font-normal text-gray-900 font-lato">
                  <MemoTypingText
                    text={text}
                    className="text-2xl font-bold text-gray-900 font-lato"
                  />
                </h1>
                <div className="flex-1 flex justify-center"></div>
              </div>
            </header>
            <AnimatePresence mode="wait">
              {isLoading ? ( // 로딩 중이면 스피너 표시
                <BufferingAni className={"translate-y-23"}></BufferingAni>
              ) : (
                <div>
                  {" "}
                  <motion.div
                    key={activeStep} // key 변경 시 애니메이션 실행
                    initial={{ opacity: 0, y: 30 }} // 더 아래서 시작
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }} // 사라질 때 위로 약간 올라가며 퇴장
                    transition={{ duration: 0.5, ease: "easeInOut" }} // 더 부드러운 효과 적용
                  >
                    {/* <MemoizedMoive
                      setMemoActiveStep={setMemoActiveStep}
                      setMemoMovie={setMemoMovie}
                    /> */}
                    <Suspense fallback={<div>로딩 중...</div>}>
                      {/* {steps()} */}
                      <MemoMovie
                        setMemoActiveStep={setMemoActiveStep}
                        setMemoMovie={setMemoMovie}
                      />
                    </Suspense>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
        {/* <ReservationState
          activeStep={activeStep}
          setBookingState={setBookingState}
        ></ReservationState>
        {BookingState ? (
          <BookingInfo
            setActiveStep={setActiveStep}
            setBookingState={setBookingState}
            movie={movie}
            cinema={cinema}
            screen={screen}
            seats={seats}
            date={date}
          ></BookingInfo>
        ) : (
          ""
        )} */}
        <ScrollToTopButton />
      </div>
    </>
  );
}
