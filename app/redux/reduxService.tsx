import type { RootState } from "./store"
import type { Movie, Theater, Seat } from "./redux"

// 영화 목록 가져오기
export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch("/api/movies/daliy")
    const data = await response.json()

    if (!data) {
      throw new Error("영화 데이터를 가져오는데 실패했습니다.")
    }

    // API 응답 데이터를 Movie 타입에 맞게 변환
    return data.map((movie: any) => ({
      id: movie.id || movie.movieId || 0,
      tmdbMovieId: movie.tmdbMovieId || 0,
      kobisMovieCd: movie.kobisMovieCd || "",
      title: movie.title || movie.movieNm || "제목 없음",
      posterImage:
        movie.posterImage ||
        movie.posterUrl ||
        movie.poster ||
        `/placeholder.svg?height=256&width=200&text=${encodeURIComponent(movie.title || "영화")}`,
      overview: movie.overview || movie.description || "",
      director: movie.director || "",
      genres: movie.genres || "",
      releaseDate: movie.releaseDate || movie.openDt || "개봉일 정보 없음",
      runtime: movie.runtime || 0,
    }))
  } catch (error) {
    console.error("영화 데이터 로딩 오류:", error)
    // 오류 발생 시 빈 배열 반환
    return []
  }
}

// 지역별 영화관 목록 가져오기
export const fetchTheaters = async (region: string): Promise<Theater[]> => {
  // 지역별 영화관 데이터
  const theatersByRegion: Record<string, Theater[]> = {
    서울: [
      { id: "1", name: "서울 강남점", location: "서울시 강남구 역삼동" },
      { id: "2", name: "서울 홍대점", location: "서울시 마포구 서교동" },
      { id: "3", name: "서울 신촌점", location: "서울시 서대문구 창천동" },
      { id: "4", name: "서울 건대점", location: "서울시 광진구 자양동" },
      { id: "5", name: "서울 영등포점", location: "서울시 영등포구 영등포동" },
      { id: "6", name: "서울 왕십리점", location: "서울시 성동구 행당동" },
    ],
    경기: [
      { id: "7", name: "경기 수원점", location: "경기도 수원시 팔달구" },
      { id: "8", name: "경기 분당점", location: "경기도 성남시 분당구" },
      { id: "9", name: "경기 일산점", location: "경기도 고양시 일산동구" },
      { id: "10", name: "경기 용인점", location: "경기도 용인시 수지구" },
    ],
    인천: [
      { id: "11", name: "인천 부평점", location: "인천시 부평구" },
      { id: "12", name: "인천 연수점", location: "인천시 연수구" },
    ],
    "대전/충청": [
      { id: "13", name: "대전 둔산점", location: "대전시 서구 둔산동" },
      { id: "14", name: "천안 신부점", location: "충남 천안시 동남구" },
    ],
    "부산/경상": [
      { id: "15", name: "부산 서면점", location: "부산시 부산진구" },
      { id: "16", name: "대구 동성로점", location: "대구시 중구" },
    ],
    "광주/전라": [
      { id: "17", name: "광주 충장로점", location: "광주시 동구" },
      { id: "18", name: "전주 고사점", location: "전북 전주시 완산구" },
    ],
    강원: [
      { id: "19", name: "강원 춘천점", location: "강원도 춘천시" },
      { id: "20", name: "강원 강릉점", location: "강원도 강릉시" },
    ],
  }

  // 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500))

  return theatersByRegion[region] || []
}

// 영화관별 상영 날짜 가져오기
export const fetchAvailableDates = async (theater: string): Promise<string[]> => {
  // 현재 날짜 기준으로 7일간의 날짜 생성
  const dates = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // YYYY.MM.DD 형식으로 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    dates.push(`${year}.${month}.${day}`)
  }

  // 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300))

  return dates
}

// 영화관 및 날짜별 상영 시간 가져오기
export const fetchAvailableTimes = async (theater: string, date: string): Promise<string[]> => {
  // 상영 시간 목록 (오전 10시부터 오후 10시까지 2시간 간격)
  const times = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]

  // 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300))

  return times
}

// 좌석 정보 가져오기
export const fetchSeats = async (theater: string, showTime: string): Promise<Seat[]> => {
  // 좌석 배열 생성 (A1~J10, 총 100개)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const seats: Seat[] = []

  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      const seatId = `${row}${i}`

      // 랜덤하게 일부 좌석은 이미 예매된 상태로 설정
      // 시드값으로 theater와 showTime을 사용하여 같은 영화관/시간에는 항상 같은 좌석이 예매되도록 함
      const seed = (theater + showTime).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const random = (seed * Number.parseInt(seatId.replace(/[A-Z]/g, "")) * row.charCodeAt(0)) % 100

      seats.push({
        id: seatId,
        row: row,
        number: i,
        booked: random < 30, // 약 30%의 좌석이 예매됨
      })
    }
  }

  // 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 800))

  return seats
}

// 예매 완료 처리
export const completeBooking = async (bookingData: any) => {
  // 실제 구현에서는 API 호출로 대체
  // 현재는 성공 응답 시뮬레이션

  console.log("예매 데이터:", bookingData)

  // 지연 시뮬레이션 (결제 처리 시간)
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 예매 ID 생성
  const bookingId = `B${Math.floor(Math.random() * 100000)}`

  return {
    success: true,
    bookingId,
    message: "예매가 완료되었습니다.",
    data: {
      ...bookingData,
      bookingId,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    },
  }
}

// 선택기 함수들
export const selectReservationState = (state: RootState) => state.reservation
export const selectSelectedMovie = (state: RootState) => state.reservation.selectedMovie
export const selectSelectedTheater = (state: RootState) => state.reservation.selectedTheater
export const selectSelectedDate = (state: RootState) => state.reservation.selectedDate
export const selectSelectedTime = (state: RootState) => state.reservation.selectedTime
export const selectSelectedSeats = (state: RootState) => state.reservation.selectedSeats
export const selectTotalPrice = (state: RootState) => state.reservation.totalPrice
export const selectPaymentMethod = (state: RootState) => state.reservation.paymentMethod
export const selectCurrentStep = (state: RootState) => state.reservation.step

