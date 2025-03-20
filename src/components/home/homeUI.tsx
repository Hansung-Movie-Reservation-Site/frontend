"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "../dashboard/dashboardFeatures"
import { LogOut } from "lucide-react"

export const HomeContent = () => {
  const router = useRouter()
  // 클라이언트에서만 랜덤 값 생성
  const [movieRatings, setMovieRatings] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    // 클라이언트에서만 실행되는 코드
    setMovieRatings(
      Array(10)
        .fill(0)
        .map(() => (Math.random() * 5).toFixed(1)),
    )

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

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUsername("")
    router.refresh() // 페이지 새로고침
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
                <span className="bg-primary text-white text-xs px-3 py-1.5 rounded mr-2">최신순</span>
                <span className="border border-gray-300 text-xs px-3 py-1.5 rounded">인기순</span>
              </div>
            </div>

            <div className="movie-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="movie-card">
                  <div className="bg-gray-200 h-64 rounded-md mb-3">
                    <img
                      src={`/placeholder.svg?height=256&width=200&text=Movie ${i}`}
                      alt={`Movie ${i}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                  <h3 className="font-medium text-base">영화 제목 {i}</h3>
                  <p className="text-xs text-gray-500">평점: {movieRatings[i - 1] || "0.0"}/5.0</p>
                  <p className="text-xs text-gray-500">2023.01.{i} 개봉</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

