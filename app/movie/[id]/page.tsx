"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, User, MessageSquare, Heart, Share2, ArrowLeft, Loader2, Film, Users } from "lucide-react"
import Link from "next/link"
import { makeImagePath, getMovieAllData } from "@/src/components/common/movieService"
import styles from "./styles.module.css"
import { useSelectedMovieForReservation } from "@/app/redux/reduxService"
import { Header } from "@/src/components/common/Header"

// 6. Review 타입 정의에서 rating 타입을 number로 명시 (소수점 지원)
type Review = {
  id: number
  username: string
  rating: number
  text: string
  date: string
  spoiler?: boolean
  userId?: number
}

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const localMovieId = params.id as string

  const [movie, setMovie] = useState<any>(null)
  const [casts, setCasts] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  // Redux에서 선택된 영화 ID 관리 훅 사용
  const { setSelectedMovie } = useSelectedMovieForReservation()

  // 2. 상태 변수 수정 및 추가 (기존 reviews 상태 변수 부분 교체)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewText, setReviewText] = useState("")
  // 1. 별점 상태 변수 타입을 number로 변경 (정수에서 소수점 지원으로)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState("")
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
  const [editReviewText, setEditReviewText] = useState("")
  const [editUserRating, setEditUserRating] = useState(0)
  const [editIsSpoiler, setEditIsSpoiler] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr)
          setIsLoggedIn(true)
          setUsername(userData.username || "사용자")
          setCurrentUserId(userData.user_id || userData.id || null)
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

  // 3. 리뷰 불러오기 함수 추가 (useEffect 블록 위에 추가)
  const fetchReviews = async (movieId: number) => {
    try {
      setReviewLoading(true)
      const response = await fetch(
        `https://hs-cinemagix.duckdns.org/api/v1/review/getReviewsByMovie?movieId=${movieId}`,
      )

      if (!response.ok) {
        throw new Error("리뷰를 불러오는데 실패했습니다.")
      }

      const data = await response.json()
      console.log("불러온 리뷰 데이터:", data)

      // API 응답 데이터를 Review 타입에 맞게 변환
      const formattedReviews: Review[] = data.map((review: any) => ({
        id: review.id,
        username: review.user?.username || "익명",
        rating: review.rating,
        text: review.review,
        date: new Date(review.createdAt || Date.now()).toISOString().split("T")[0],
        spoiler: review.spoiler,
        userId: review.userId,
      }))

      setReviews(formattedReviews)
    } catch (error) {
      console.error("리뷰 불러오기 오류:", error)
      setReviewError("리뷰를 불러오는데 실패했습니다.")
    } finally {
      setReviewLoading(false)
    }
  }

  // Fetch movie data - 최적화된 방식으로 변경
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true)
      try {
        console.log("영화 데이터 로딩 시작 (로컬 ID):", localMovieId)

        // 모든 영화 데이터를 한 번에 가져오기
        const allData = await getMovieAllData(localMovieId)

        setMovie(allData.movie)
        setCasts(allData.cast)
        setVideos(allData.videos)

        // 영화 정보 로드 후 로컬 ID로 리뷰 불러오기
        if (allData.movie && allData.movie.id) {
          console.log("로컬 영화 ID로 리뷰 불러오기:", allData.movie.id)
          fetchReviews(allData.movie.id)
        } else {
          console.error("영화의 로컬 ID를 찾을 수 없습니다.")
          setReviewError("영화 ID를 찾을 수 없어 리뷰를 불러올 수 없습니다.")
        }
      } catch (err) {
        console.error("영화 데이터 로딩 오류:", err)
        setError("영화 정보를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    if (localMovieId) {
      fetchMovieData()
    }
  }, [localMovieId])

  // Handlers
  // 2. 별점 선택 핸들러 수정 - 0.5 단위 지원
  const handleRatingClick = (rating: number, isHalf: boolean) => {
    // 반개 별점 경우 0.5 빼기
    const newRating = isHalf ? rating - 0.5 : rating
    setUserRating(newRating)
  }

  // 3. 별점 호버 핸들러 수정 - 0.5 단위 지원
  const handleRatingHover = (rating: number, isHalf: boolean) => {
    // 반개 별점인 경우 0.5 빼기
    const newRating = isHalf ? rating - 0.5 : rating
    setHoverRating(newRating)
  }

  // 4. 리뷰 저장 함수 수정 (handleReviewSubmit 함수 전체 교체)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.")
      router.push("/login")
      return
    }

    if (userRating === 0) {
      alert("평점을 선택해주세요.")
      return
    }

    if (!reviewText.trim()) {
      alert("리뷰 내용을 입력해주세요.")
      return
    }

    // 사용자 정보 가져오기
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")
    let userId = 0

    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        userId = userData.user_id || userData.id || 0
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error)
      }
    }

    if (!userId) {
      alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.")
      return
    }

    // 현재 날짜 생성
    const currentDate = new Date().toISOString().split("T")[0]

    try {
      setReviewSubmitting(true)

      // API를 통해 DB에 리뷰 저장
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const movieId = movie.id || Number(localMovieId)

      const reviewData = {
        rating: userRating,
        review: reviewText,
        spoiler: isSpoiler,
        userId: userId,
        movieId: movieId,
      }

      console.log("저장할 리뷰 데이터:", reviewData)

      const response = await fetch("https://hs-cinemagix.duckdns.org/api/v1/review/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(reviewData),
      })

      let responseData: any
      let isJson = false
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
        isJson = true
      } else {
        responseData = await response.text()
      }
      console.log("서버 응답:", response.status, responseData)

      if (!response.ok) {
        throw new Error(isJson ? (responseData.message || "리뷰 저장에 실패했습니다.") : responseData)
      }

      // 서버에서 id를 반환하므로, 리뷰 목록을 새로고침하여 실제 id를 사용
      await fetchReviews(movieId)

      // 입력 필드 초기화
      setReviewText("")
      setUserRating(0)
      setIsSpoiler(false)
      alert("리뷰가 등록되었습니다.")
    } catch (error) {
      console.error("리뷰 저장 오류:", error)
      alert("리뷰 저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleBooking = (movieId: number) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.")
      router.push("/login")
      return
    }

    // 영화 객체에서 로컬 ID를 가져옵니다
    const bookingId = movie.id || Number(localMovieId)

    // Redux에 선택한 영화 ID 저장
    setSelectedMovie(bookingId)

    // 로컬 스토리지에도 영화 ID 저장
    localStorage.setItem("selectedMovieId", bookingId.toString())
    console.log("예매할 영화 ID를 로컬 스토리지에 저장:", bookingId)

    // 예매 페이지로 이동
    router.push(`/reservation`)
  }

  // 리뷰 삭제 함수
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const response = await fetch(`https://hs-cinemagix.duckdns.org/api/v1/review/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      if (!response.ok) throw new Error("리뷰 삭제 실패")
      // 삭제 후 리뷰 목록 새로고침
      await fetchReviews(movie.id || Number(localMovieId))
      alert("리뷰가 삭제되었습니다.")
    } catch (err) {
      alert("리뷰 삭제 중 오류가 발생했습니다.")
    }
  }

  // 리뷰 수정 시작
  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id)
    setEditReviewText(review.text)
    setEditUserRating(review.rating)
    setEditIsSpoiler(!!review.spoiler)
  }

  // 리뷰 수정 취소
  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setEditReviewText("")
    setEditUserRating(0)
    setEditIsSpoiler(false)
  }

  // 리뷰 수정 제출
  const handleEditReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReviewId) return
    if (editUserRating === 0) {
      alert("평점을 선택해주세요.")
      return
    }
    if (!editReviewText.trim()) {
      alert("리뷰 내용을 입력해주세요.")
      return
    }
    try {
      setReviewSubmitting(true)
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const patchData = {
        rating: editUserRating,
        review: editReviewText,
        spoiler: editIsSpoiler,
      }
      const response = await fetch(`https://hs-cinemagix.duckdns.org/api/v1/review/reviews/${editingReviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(patchData),
      })
      let responseData: any
      let isJson = false
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
        isJson = true
      } else {
        responseData = await response.text()
      }
      if (!response.ok) throw new Error(isJson ? (responseData.message || "리뷰 수정 실패") : responseData)
      // 수정 후 리뷰 목록 새로고침
      await fetchReviews(movie.id || Number(localMovieId))
      alert("리뷰가 수정되었습니다.")
      handleCancelEdit()
    } catch (err) {
      alert("리뷰 수정 중 오류가 발생했습니다.")
    } finally {
      setReviewSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-gray-600 font-medium">영화 정보 불러오는중...</p>
      </div>
    )
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error || "영화 정보를 찾을 수 없습니다."}
        </div>
        <Link href="/" className="text-primary hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  // Find trailer
  const trailer = videos.find((video) => video.type === "Trailer" || video.type === "Teaser")

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : "평점 없음"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 사용 */}
      <Header activePage="movie" />

      <main className="site-container py-8">
        {/* Back button */}
        <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          뒤로 가기
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 md:p-8">
          {/* Movie info section using the provided structure */}
          <div className={styles.container}>
            <img
              src={
                movie.poster_path
                  ? makeImagePath(movie.poster_path)
                  : "/placeholder.svg?height=300&width=200&text=No+Image"
              }
              className={styles.poster}
              alt={movie.title}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=200&text=No+Image"
              }}
            />
            <div className={styles.info}>
              <h1 className={styles.title}>{movie.title}</h1>
              <p>
                {movie.release_date?.substring(0, 4) || "N/A"} · ⭐{movie.vote_average?.toFixed(1) || "N/A"} ·{" "}
                {movie.runtime || "N/A"} minutes
              </p>
              <p className={styles.overview}>&nbsp;{movie.overview || "줄거리 정보가 없습니다."}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleBooking(movie.id)}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  예매하기
                </button>
                <button className="px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  찜하기
                </button>
                <button className="px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  공유하기
                </button>
              </div>

              {movie.origin_country && movie.origin_country.length > 0 && (
                <div className={styles.imgList}>
                  <img
                    className={styles.flag}
                    src={`https://flagsapi.com/${movie.origin_country[0]}/flat/32.png`}
                    alt={`${movie.origin_country[0]} flag`}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                  {movie.production_companies &&
                    movie.production_companies.length > 0 &&
                    movie.production_companies[0].logo_path && (
                      <img
                        className={styles.production}
                        src={makeImagePath(movie.production_companies[0].logo_path || "")}
                        alt={movie.production_companies[0].name || "Production company"}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    )}
                </div>
              )}

              <a
                href={`https://www.themoviedb.org/movie/${movie.tmdbMovieId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-2 inline-block"
              >
                더 알아보기 &rarr;
              </a>
            </div>
          </div>

          {/* Trailer section */}
          {trailer && (
            <div className={styles.trailerSection}>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Film className="h-6 w-6 mr-2" />
                트레일러
              </h2>
              <div className={styles.trailerContainer}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} 트레일러`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            </div>
          )}

          {/* Cast section using the provided structure */}
          <h2 className="text-2xl font-bold mb-4 mt-8 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            출연진
          </h2>
          <div className={styles.cast}>
            {casts.length > 0 ? (
              casts.map((cast) => (
                <div key={cast.cast_id} className={styles.profile}>
                  <img src={makeImagePath(cast.profile_path || "")} alt={cast.name} />
                  {cast.name}
                  <p className={styles.name}>{cast.character}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">출연진 정보가 없습니다.</p>
            )}
          </div>

          {/* Reviews section */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              관람객 리뷰
              <span className="ml-2 text-lg text-gray-500">({reviews.length})</span>
            </h2>

            {/* 6. 리뷰 폼 UI 수정 (스포일러 체크박스 추가) - 리뷰 폼 부분 교체 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold mb-3">리뷰 작성</h3>
              {editingReviewId ? (
                <form onSubmit={handleEditReviewSubmit}>
                  {/* 별점 선택 UI (수정 모드) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">평점</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="relative flex">
                          {/* 별의 왼쪽 절반 (0.5) */}
                          <div
                            className="w-3 h-6 overflow-hidden cursor-pointer"
                            onClick={() => setEditUserRating(rating - 0.5)}
                          >
                            <Star
                              className={`h-6 w-6 -ml-0 ${
                                editUserRating >= rating - 0.5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          </div>
                          {/* 별의 오른쪽 절반 (1.0) */}
                          <div
                            className="w-3 h-6 overflow-hidden cursor-pointer"
                            onClick={() => setEditUserRating(rating)}
                          >
                            <Star
                              className={`h-6 w-6 -ml-3 ${
                                editUserRating >= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                      <span className="ml-2 text-sm text-gray-500 self-center">
                        {editUserRating > 0 ? `${editUserRating}점` : "평점을 선택해주세요."}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="editReview" className="block text-sm font-medium text-gray-700 mb-1">
                      리뷰 내용
                    </label>
                    <textarea
                      id="editReview"
                      rows={4}
                      value={editReviewText}
                      onChange={(e) => setEditReviewText(e.target.value)}
                      disabled={reviewSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editSpoiler"
                        checked={editIsSpoiler}
                        onChange={(e) => setEditIsSpoiler(e.target.checked)}
                        disabled={reviewSubmitting}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="editSpoiler" className="ml-2 block text-sm text-gray-700">
                        스포일러 포함 (체크하면 내용이 가려집니다)
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                      disabled={reviewSubmitting}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        !reviewSubmitting ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {reviewSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {reviewSubmitting ? "수정 중..." : "수정 완료"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  {/* 4. 리뷰 폼의 별점 선택 UI 부분 수정 (handleReviewSubmit 함수 아래에 있는 리뷰 폼 부분) */}
                  {/* 기존 별점 선택 UI를 아래 코드로 교체: */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">평점</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="relative flex">
                          {/* 별의 왼쪽 절반 (0.5) */}
                          <div
                            className="w-3 h-6 overflow-hidden cursor-pointer"
                            onClick={() => handleRatingClick(rating, true)}
                            onMouseEnter={() => handleRatingHover(rating, true)}
                            onMouseLeave={() => handleRatingHover(0, false)}
                          >
                            <Star
                              className={`h-6 w-6 -ml-0 ${
                                (hoverRating || userRating) >= rating - 0.5
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>

                          {/* 별의 오른쪽 절반 (1.0) */}
                          <div
                            className="w-3 h-6 overflow-hidden cursor-pointer"
                            onClick={() => handleRatingClick(rating, false)}
                            onMouseEnter={() => handleRatingHover(rating, false)}
                            onMouseLeave={() => handleRatingHover(0, false)}
                          >
                            <Star
                              className={`h-6 w-6 -ml-3 ${
                                (hoverRating || userRating) >= rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                      <span className="ml-2 text-sm text-gray-500 self-center">
                        {userRating > 0 ? `${userRating}점` : "평점을 선택해주세요."}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                      리뷰 내용
                    </label>
                    <textarea
                      id="review"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={
                        isLoggedIn
                          ? "영화에 대한 감상을 자유롭게 작성해주세요."
                          : "리뷰를 작성하려면 로그인이 필요합니다."
                      }
                      disabled={!isLoggedIn || reviewSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="spoiler"
                        checked={isSpoiler}
                        onChange={(e) => setIsSpoiler(e.target.checked)}
                        disabled={reviewSubmitting}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="spoiler" className="ml-2 block text-sm text-gray-700">
                        스포일러 포함 (체크하면 내용이 가려집니다)
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!isLoggedIn || reviewSubmitting}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        isLoggedIn && !reviewSubmitting
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {reviewSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {reviewSubmitting ? "등록 중..." : "리뷰 등록"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 7. 리뷰 목록 UI 수정 (스포일러 처리 및 로딩 상태 추가) - 리뷰 목록 부분 교체 */}
            <div className="space-y-4">
              {reviewLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : reviewError ? (
                <div className="text-center py-8 text-red-500">
                  <p>{reviewError}</p>
                  <button
                    onClick={() => fetchReviews(Number(localMovieId))}
                    className="mt-2 text-primary hover:underline"
                  >
                    다시 시도
                  </button>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full p-2 mr-3">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{review.username}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* 별점 표시 */}
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => {
                            if (star <= review.rating) {
                              return <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            } else if (star - 0.5 <= review.rating) {
                              return (
                                <div key={star} className="relative h-4 w-4">
                                  <Star className="absolute h-4 w-4 text-gray-300" />
                                  <div className="absolute h-4 w-2 overflow-hidden">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </div>
                                </div>
                              )
                            } else {
                              return <Star key={star} className="h-4 w-4 text-gray-300" />
                            }
                          })}
                        </div>
                        {/* 본인 리뷰에만 수정/삭제 버튼 */}
                        {currentUserId && review.userId === currentUserId && (
                          <>
                            <button
                              className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              onClick={() => handleEditReview(review)}
                              disabled={reviewSubmitting || editingReviewId === review.id}
                            >
                              수정
                            </button>
                            <button
                              className="ml-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={reviewSubmitting}
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {review.spoiler ? (
                      <div className="relative">
                        <p className="text-gray-700 blur-sm hover:blur-none transition-all duration-300">
                          {review.text}
                        </p>
                        <div className="absolute top-0 left-0 bg-gray-100 px-2 py-1 rounded text-xs text-red-500 font-medium">
                          스포일러 주의 (클릭하여 보기)
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700">{review.text}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  아직 작성된 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
