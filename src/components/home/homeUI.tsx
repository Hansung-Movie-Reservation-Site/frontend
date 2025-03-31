"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "../dashboard/dashboardFeatures"
import { LogOut, Loader2 } from "lucide-react"
import { fetchBoxofficeGet } from "../common/apiService"
import type { Movie } from "../common/typeReserve"

export const HomeContent = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  // 영화 데이터 상태
  const [movies, setMovies] = useState<Movie[]>([])
  // 로딩 및 오류 상태
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // 정렬 상태
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")

  useEffect(() => {
    // API에서 영화 데이터 가져오기
    const fetchMovies = async () => {
      try {
        setLoading(true)
        console.log("영화 데이터 로딩 시작")

        let data
        try {
          // 영화 목록 불러오기
          data = await fetchBoxofficeGet()
        } catch (error1) {
          console.error("첫 번째 방법 실패:", error1)
        }

        console.log("API 응답 데이터:", data)

        // 데이터가 없거나 배열이 아닌 경우 처리
        if (!data) {
          console.error("API 응답이 없습니다.")
          throw new Error("API에서 데이터를 받지 못했습니다.")
        }

        // 데이터가 배열이 아닌 경우 처리 (객체 내부에 배열이 있을 수 있음)
        let movieArray = data
        if (!Array.isArray(data)) {
          console.log("응답이 배열이 아닙니다. 객체 내부 속성 확인 중...")
          // 객체 내부에서 배열 찾기
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`배열 속성 발견: ${key}`)
              movieArray = data[key]
              break
            }
          }

          // 여전히 배열이 아니면 오류
          if (!Array.isArray(movieArray)) {
            console.error("API 응답에서 영화 배열을 찾을 수 없습니다:", data)
            throw new Error("API 응답 형식이 예상과 다릅니다.")
          }
        }

        // 빈 배열인 경우 처리
        if (movieArray.length === 0) {
          console.warn("API가 빈 영화 목록을 반환했습니다.")
        }

        console.log("처리할 영화 배열:", movieArray)

        // API 응답 데이터를 Movie 타입에 맞게 변환
        const formattedMovies: Movie[] = movieArray.map((movie: any) => {
          console.log("영화 데이터 처리:", movie)
          return {
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
          }
        })

        console.log("변환된 영화 데이터:", formattedMovies)

        // 영화 정렬 (최신순)
        const sortedMovies = [...formattedMovies].sort((a, b) => {
          try {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
          } catch (e) {
            console.warn("날짜 정렬 오류:", e)
            return 0
          }
        })

        setMovies(sortedMovies)
        setError("")
      } catch (err: any) {
        console.error("영화 데이터 로딩 최종 오류:", err)
        setError("영화 목록을 불러오는 중 오류가 발생했습니다. " + (err.message || ""))

        // API 실패 시 샘플 데이터로 대체
        console.log("샘플 데이터로 대체합니다.")
        const sampleMovies: Movie[] = Array(10)
          .fill(0)
          .map((_, i) => ({
            id: i + 1,
            tmdbMovieId: i + 100,
            kobisMovieCd: `2023${i.toString().padStart(5, "0")}`,
            title: `영화 제목 ${i + 1}`,
            posterImage: `/placeholder.svg?height=256&width=200&text=Movie ${i + 1}`,
            overview: "영화 설명이 없습니다.",
            director: "감독 정보 없음",
            genres: "장르 정보 없음",
            releaseDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
            runtime: Math.floor(Math.random() * 60) + 90,
          }))
        setMovies(sampleMovies)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()

    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr)
          setIsLoggedIn(true)
          setUsername(userData.username || "사용자")
        } catch (error) {
          console.error("사용자 정보 파싱 오류:", error)
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    checkLoginStatus()
  }, [])

  // 영화 정렬 함수
  const sortMovies = (type: "latest" | "popular") => {
    setSortBy(type)

    const sortedMovies = [...movies]
    if (type === "latest") {
      sortedMovies.sort((a, b) => {
        try {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        } catch (e) {
          return 0
        }
      })
    } else {
      // 인기순은 추후 관객 순으로 정렬 / 현재는 임의로 id 기준으로 정렬
      sortedMovies.sort((a, b) => a.id - b.id)
    }

    setMovies(sortedMovies)
  }

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUsername("")
    router.refresh() // 페이지 새로고침
  }

  // 예매 처리
  const handleBooking = (movieId: number) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.")
      router.push("/login")
      return
    }

    // booking/[movieId] 페이지로 이동하여 영화 정보를 먼저 로드
    router.push(`/booking/${movieId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="site-header">
        <div className="site-container flex justify-between items-center">
          {/* 왜인지 로그인, 회원가입 페이지와 마진이 다름; 16px 넣으면 맞음 */}
          <div className="site-name" style={{ marginTop: "16px" }}>
            Hansung Movie Site
          </div>
          <nav className="flex" style={{ marginTop: "16px" }}>
            {isLoggedIn ? (
              <>
                <span className="nav-link">
                  <span className="text-primary font-medium">{username}</span>님 환영합니다
                </span>
                <Link href="/dashboard" className="nav-link">
                  <span className="bg-primary text-white px-2 py-1 text-xs rounded">마이페이지</span>
                </Link>
                <button onClick={handleLogout} className="nav-link flex items-center text-gray-600 hover:text-primary">
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link active">
                  로그인
                </Link>
                <Link href="/register" className="nav-link">
                  회원가입
                </Link>
                <Link href="/dashboard" className="nav-link">
                  <span className="bg-primary text-white px-2 py-1 text-xs rounded">마이페이지</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="site-container py-8">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">AI가 추천하는 영화</h2> {/* 영상말고 포스터로 변경? */}
            <div className="featured-movie bg-gray-100 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=1200"
                alt="Featured movie"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">상영중인 영화</h2>
              <div>
                <button
                  className={`${sortBy === "latest" ? "bg-primary text-white" : "border border-gray-300"} text-xs px-3 py-1.5 rounded mr-2 transition-colors`}
                  onClick={() => sortMovies("latest")}
                >
                  최신순
                </button>
                <button
                  className={`${sortBy === "popular" ? "bg-primary text-white" : "border border-gray-300"} text-xs px-3 py-1.5 rounded transition-colors`}
                  onClick={() => sortMovies("popular")}
                >
                  인기순
                </button>
              </div>
            </div>

            {/* 로딩 표시 */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="movie-grid">
                {movies.map((movie) => (
                  <div key={movie.id} className="movie-card w-full overflow-hidden">
                    <div className="bg-gray-200 h-64 rounded-md mb-3">
                      <img
                        src={
                          movie.posterImage ||
                          `/placeholder.svg?height=256&width=200&text=${encodeURIComponent(movie.title) || "/placeholder.svg"}`
                        }
                        alt={movie.title}
                        className="h-full w-full object-cover rounded-md"
                        onError={(e) => {
                          // 이미지 로드 실패 시 플레이스홀더로 대체
                          ;(e.target as HTMLImageElement).src =
                            `/placeholder.svg?height=256&width=200&text=${encodeURIComponent(movie.title)}`
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-start gap-2 h-20 overflow-hidden">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3
                          className="font-medium text-base whitespace-nowrap overflow-hidden text-ellipsis"
                          title={movie.title}
                        >
                          {movie.title}
                        </h3>
                        <p
                          className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
                          title={`감독: ${movie.director || "정보 없음"}`}
                        >
                          감독: {movie.director || "정보 없음"}
                        </p>
                        <p className="text-xs text-gray-500">{movie.releaseDate} 개봉</p>
                        <p
                          className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
                          title={`${movie.runtime > 0 ? `${movie.runtime}분` : ""} ${movie.genres ? `| ${movie.genres}` : ""}`}
                        >
                          {movie.runtime > 0 ? `${movie.runtime}분` : ""} {movie.genres ? `| ${movie.genres}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBooking(movie.id)}
                        className="bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary/90 transition-colors flex-shrink-0"
                      >
                        예매하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

