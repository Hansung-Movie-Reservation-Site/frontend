import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, password } = body

    console.log("로그인 요청:", { userId })

    // 실제 Spring Boot 서버로 요청 전달 (서버가 실행 중일 때)
    try {
      const springResponse = await fetch("http://localhost:8080"), { // 이 부분 수정 필요
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      })

      if (springResponse.ok) {
        const data = await springResponse.json()
        return NextResponse.json(data)
      }

      console.log("Spring Boot 서버 응답 실패, 테스트용 응답 반환")
    } catch (error) {
      console.error("Spring Boot 서버 연결 실패:", error)
    }

    // 테스트용 응답 (Spring Boot 서버가 없거나 응답하지 않을 때)
    // 테스트 계정: userId: "testuser", password: "password"
    if (userId === "testuser" && password === "password") {
      return NextResponse.json({
        success: true,
        message: "로그인 성공 (테스트 모드)",
        token: "test-jwt-token-for-development-only",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "아이디 또는 비밀번호가 잘못되었습니다. 테스트 계정: testuser/password",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("API 라우트 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

