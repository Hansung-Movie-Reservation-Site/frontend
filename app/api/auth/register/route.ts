import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, userId, password } = body

    console.log("회원가입 요청:", { email, username, userId })

    // 실제 Spring Boot 서버로 요청 전달 (서버가 실행 중일 때)
    try {
      const springResponse = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, userId, password }),
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
    return NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다. (테스트 모드)",
      user: {
        id: "test-user-id",
        email,
        username,
        userId,
      },
    })
  } catch (error) {
    console.error("API 라우트 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

