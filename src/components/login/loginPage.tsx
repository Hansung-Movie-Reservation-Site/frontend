"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "./loginUI"
import { loginUser } from "./loginFeatures"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      console.log("이미 로그인되어 있습니다. 대시보드로 이동합니다.")
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError("")

    try {
      console.log("로그인 시도:", email)
      const response = await loginUser(email, password)
      console.log("로그인 결과:", response)

      if (response.code === "SUCCESS") {
        // 스프링부트 응답에서 토큰 추출 (응답 구조에 따라 조정 필요)
        const token = response.token || response.data?.token
        console.log("저장할 토큰:", token)

        // 토큰 저장 (세션 스토리지와 로컬 스토리지 모두에 저장)
        localStorage.setItem("token", token)
        sessionStorage.setItem("token", token)

        // 사용자 정보 저장
        const userData = {
          email: email,
          // 스프링부트 응답에서 사용자 이름 추출 (응답 구조에 따라 조정 필요)
          username:
            response.username || response.data?.username || response.name || response.data?.name || email.split("@")[0],
        }

        console.log("저장할 사용자 정보:", userData)
        localStorage.setItem("user", JSON.stringify(userData))
        sessionStorage.setItem("user", JSON.stringify(userData))

        // 쿠키에도 저장 (추가적인 보안 조치)
        document.cookie = `auth_token=${token}; path=/; max-age=86400` // 1일 유효

        // 약간의 지연 후 리디렉션 (스토리지 저장 완료를 위해)
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
      }
    } catch (err) {
      console.error("로그인 오류:", err)
      setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
    </div>
  )
}

