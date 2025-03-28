import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// 영화 예매 정보를 위한 타입 정의
export interface Movie {
  id: number
  title: string
  posterImage: string
  runtime: number
  releaseDate: string
  director: string
  genres: string
}

export interface Theater {
  id: string
  name: string
  location: string
}

export interface ShowTime {
  id: string
  date: string
  time: string
  screen: string
}

export interface Seat {
  id: string
  row: string
  number: number
  booked: boolean
  selected?: boolean
}

export interface ReservationState {
  selectedMovie: Movie | null
  selectedTheater: Theater | null
  selectedDate: string
  selectedTime: string
  selectedSeats: Seat[]
  totalPrice: number
  paymentMethod: string
  step: "movie" | "theater" | "seat" | "payment" | "complete"
}

// 초기 상태 정의
const initialState: ReservationState = {
  selectedMovie: null,
  selectedTheater: null,
  selectedDate: "",
  selectedTime: "",
  selectedSeats: [],
  totalPrice: 0,
  paymentMethod: "",
  step: "movie",
}

// Redux 슬라이스 생성
export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    // 영화 선택
    selectMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload
      // 영화가 변경되면 다음 단계로 이동하고 이후 선택 초기화
      state.step = "theater"
      state.selectedTheater = null
      state.selectedDate = ""
      state.selectedTime = ""
      state.selectedSeats = []
      state.totalPrice = 0
    },

    // 극장 선택
    selectTheater: (state, action: PayloadAction<Theater>) => {
      state.selectedTheater = action.payload
    },

    // 날짜 선택
    selectDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },

    // 시간 선택
    selectTime: (state, action: PayloadAction<string>) => {
      state.selectedTime = action.payload
      // 자동 단계 이동 로직 제거
    },

    // 좌석 선택/해제
    toggleSeat: (state, action: PayloadAction<Seat>) => {
      const seatId = action.payload.id
      const seatIndex = state.selectedSeats.findIndex((seat) => seat.id === seatId)

      if (seatIndex >= 0) {
        // 이미 선택된 좌석이면 선택 해제
        state.selectedSeats = state.selectedSeats.filter((seat) => seat.id !== seatId)
      } else {
        // 새로운 좌석 선택
        if (state.selectedSeats.length < 8) {
          // 최대 8개 좌석까지 선택 가능
          state.selectedSeats.push(action.payload)
        }
      }

      // 가격 계산 (좌석당 12,000원)
      state.totalPrice = state.selectedSeats.length * 12000
    },

    // 결제 방법 선택
    selectPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload
    },

    // 다음 단계로 이동
    nextStep: (state) => {
      if (state.step === "movie" && state.selectedMovie) {
        state.step = "theater"
      } else if (state.step === "theater" && state.selectedTheater && state.selectedDate && state.selectedTime) {
        state.step = "seat"
      } else if (state.step === "seat" && state.selectedSeats.length > 0) {
        state.step = "payment"
      } else if (state.step === "payment" && state.paymentMethod) {
        state.step = "complete"
      }
    },

    // 이전 단계로 이동
    prevStep: (state) => {
      if (state.step === "theater") {
        state.step = "movie"
      } else if (state.step === "seat") {
        state.step = "theater"
      } else if (state.step === "payment") {
        state.step = "seat"
      }
    },

    // 예매 초기화
    resetReservation: (state) => {
      return initialState
    },
  },
})

// 액션 생성자 내보내기
export const {
  selectMovie,
  selectTheater,
  selectDate,
  selectTime,
  toggleSeat,
  selectPaymentMethod,
  nextStep,
  prevStep,
  resetReservation,
} = reservationSlice.actions

// 리듀서 내보내기
export default reservationSlice.reducer

export const selectReservationState = (state: any) => state.reservation
export const selectCurrentStep = (state: any) => state.reservation.step
export const selectSelectedMovie = (state: any) => state.reservation.selectedMovie
export const selectSelectedTheater = (state: any) => state.reservation.selectedTheater
export const selectSelectedDate = (state: any) => state.reservation.selectedDate
export const selectSelectedTime = (state: any) => state.reservation.selectedTime
export const selectSelectedSeats = (state: any) => state.reservation.selectedSeats
export const selectTotalPrice = (state: any) => state.reservation.totalPrice

