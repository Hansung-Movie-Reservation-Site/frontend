"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import {
  selectMovie,
  selectTheater,
  selectDate,
  selectTime,
  toggleSeat,
  selectPaymentMethod,
  nextStep,
  prevStep,
  resetReservation,
  selectCurrentStep,
  selectSelectedMovie,
  selectSelectedTheater,
  selectSelectedDate,
  selectSelectedTime,
  selectSelectedSeats,
  selectTotalPrice,
} from "@/app/redux/redux"
import {
  fetchMovies,
  fetchTheaters,
  fetchAvailableDates,
  fetchAvailableTimes,
  fetchSeats,
  completeBooking,
} from "@/app/redux/reduxService"
import ReservationNav from "./reservationUI/reservationNav"
import ReservationState from "./reservationUI/reservationState"
import BookingInfo from "./reservationUI/bookinginfo"
import SelectedMovie from "./reservationDetail/selectedMovie"
import SelectedTheater from "./reservationDetail/CinemaComponents/selectedTheater"
import SelectedSeat from "./reservationDetail/selectedSeat"
import Payment from "./reservationDetail/payment"
import { Loader2 } from "lucide-react"

export default function ReservationPage() {
  const router = useRouter()
  const dispatch = useDispatch()

  // Redux state
  const currentStep = useSelector(selectCurrentStep)
  const selectedMovie = useSelector(selectSelectedMovie)
  const selectedTheater = useSelector(selectSelectedTheater)
  const selectedDate = useSelector(selectSelectedDate)
  const selectedTime = useSelector(selectSelectedTime)
  const selectedSeats = useSelector(selectSelectedSeats)
  const totalPrice = useSelector(selectTotalPrice)

  // Local state
  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [availableDates, setAvailableDates] = useState([])
  const [availableTimes, setAvailableTimes] = useState([])
  const [availableSeats, setAvailableSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingData, setBookingData] = useState(null)

  // Load movies on initial render
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const moviesData = await fetchMovies()
        setMovies(moviesData)
      } catch (error) {
        console.error("Error loading movies:", error)
        setError("영화 목록을 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    loadMovies()

    // Reset reservation state when component unmounts
    return () => {
      dispatch(resetReservation())
    }
  }, [dispatch])

  // Load theaters when a movie is selected
  useEffect(() => {
    if (selectedMovie) {
      const loadTheaters = async () => {
        try {
          setLoading(true)
          // For demo purposes, we'll load theaters for "서울" region
          const theatersData = await fetchTheaters("서울")
          setTheaters(theatersData)
        } catch (error) {
          console.error("Error loading theaters:", error)
          setError("극장 목록을 불러오는데 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }

      loadTheaters()
    }
  }, [selectedMovie])

  // Load available dates when a theater is selected
  useEffect(() => {
    if (selectedTheater) {
      const loadDates = async () => {
        try {
          setLoading(true)
          const datesData = await fetchAvailableDates(selectedTheater.id)
          setAvailableDates(datesData)
        } catch (error) {
          console.error("Error loading dates:", error)
          setError("날짜 목록을 불러오는데 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }

      loadDates()
    }
  }, [selectedTheater])

  // Load available times when a date is selected
  useEffect(() => {
    if (selectedTheater && selectedDate) {
      const loadTimes = async () => {
        try {
          setLoading(true)
          const timesData = await fetchAvailableTimes(selectedTheater.id, selectedDate)
          setAvailableTimes(timesData)
        } catch (error) {
          console.error("Error loading times:", error)
          setError("시간 목록을 불러오는데 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }

      loadTimes()
    }
  }, [selectedTheater, selectedDate])

  // Load available seats when a time is selected
  useEffect(() => {
    if (selectedTheater && selectedTime) {
      const loadSeats = async () => {
        try {
          setLoading(true)
          const seatsData = await fetchSeats(selectedTheater.id, selectedTime)
          setAvailableSeats(seatsData)
        } catch (error) {
          console.error("Error loading seats:", error)
          setError("좌석 정보를 불러오는데 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }

      loadSeats()
    }
  }, [selectedTheater, selectedTime])

  // Handle movie selection
  const handleSelectMovie = (movie) => {
    dispatch(selectMovie(movie))
  }

  // Handle theater selection
  const handleSelectTheater = (theater) => {
    dispatch(selectTheater(theater))
  }

  // Handle date selection
  const handleSelectDate = (date) => {
    dispatch(selectDate(date))
  }

  // Handle time selection
  const handleSelectTime = (time) => {
    dispatch(selectTime(time))
  }

  // Handle seat selection
  const handleToggleSeat = (seat) => {
    dispatch(toggleSeat(seat))
  }

  // Handle payment method selection
  const handleSelectPaymentMethod = (method) => {
    dispatch(selectPaymentMethod(method))
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === "payment") {
      handleCompleteBooking()
    } else {
      dispatch(nextStep())
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    dispatch(prevStep())
  }

  // Handle booking completion
  const handleCompleteBooking = async () => {
    try {
      setLoading(true)

      const bookingDetails = {
        movie: selectedMovie,
        theater: selectedTheater,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        totalPrice: totalPrice,
        paymentMethod: "credit-card", // Default payment method
      }

      const result = await completeBooking(bookingDetails)

      if (result.success) {
        setBookingComplete(true)
        setBookingData(result.data)
      } else {
        setError("예매에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("Error completing booking:", error)
      setError("예매 처리 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // Handle booking confirmation and return to home
  const handleConfirmBooking = () => {
    dispatch(resetReservation())
    router.push("/")
  }

  // Render loading state
  if (loading && !selectedMovie) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">영화 정보를 불러오는 중입니다...</span>
      </div>
    )
  }

  // Render error state
  if (error && !selectedMovie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
          다시 시도
        </button>
      </div>
    )
  }

  // Render booking complete state
  if (bookingComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="site-header">
          <div className="site-container flex justify-between items-center">
            <div className="site-name">Hansung Movie Site</div>
            <nav className="flex">
              <a href="/" className="nav-link">
                홈
              </a>
            </nav>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">예매가 완료되었습니다!</h2>

            <div className="space-y-4 mb-6">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">예매 번호</p>
                <p className="font-medium">{bookingData?.bookingId || "B12345"}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">영화</p>
                <p className="font-medium">{selectedMovie?.title}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">극장</p>
                <p className="font-medium">{selectedTheater?.name}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">일시</p>
                <p className="font-medium">
                  {selectedDate} {selectedTime}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">좌석</p>
                <p className="font-medium">{selectedSeats.map((seat) => seat.id).join(", ")}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">결제 금액</p>
                <p className="font-medium">{totalPrice.toLocaleString()}원</p>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="site-header">
        <div className="site-container flex justify-between items-center">
          <div className="site-name">Hansung Movie Site</div>
          <nav className="flex">
            <a href="/" className="nav-link">
              홈
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="site-container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Reservation process */}
            <div className="w-full lg:w-3/4">
              <ReservationNav currentStep={currentStep} />

              {/* Movie selection step */}
              {currentStep === "movie" && (
                <SelectedMovie
                  movies={movies}
                  selectedMovie={selectedMovie}
                  onSelectMovie={handleSelectMovie}
                  onNextStep={handleNextStep}
                />
              )}

              {/* Theater selection step */}
              {currentStep === "theater" && (
                <SelectedTheater
                  theaters={theaters}
                  selectedTheater={selectedTheater}
                  onSelectTheater={handleSelectTheater}
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  availableTimes={availableTimes}
                  selectedTime={selectedTime}
                  onSelectTime={handleSelectTime}
                  onNextStep={handleNextStep}
                  onPrevStep={handlePrevStep}
                  loading={loading}
                />
              )}

              {/* Seat selection step */}
              {currentStep === "seat" && (
                <SelectedSeat
                  availableSeats={availableSeats}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                  onNextStep={handleNextStep}
                  onPrevStep={handlePrevStep}
                  loading={loading}
                />
              )}

              {/* Payment step */}
              {currentStep === "payment" && (
                <Payment
                  totalPrice={totalPrice}
                  onSelectPaymentMethod={handleSelectPaymentMethod}
                  onCompleteBooking={handleNextStep}
                  onPrevStep={handlePrevStep}
                  loading={loading}
                />
              )}
            </div>

            {/* Right column - Booking information */}
            <div className="w-full lg:w-1/4">
              <ReservationState
                currentStep={currentStep}
                selectedMovie={selectedMovie}
                selectedTheater={selectedTheater}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
              />

              <BookingInfo
                currentStep={currentStep}
                selectedMovie={selectedMovie}
                selectedTheater={selectedTheater}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

