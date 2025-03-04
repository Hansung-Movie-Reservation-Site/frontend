import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // 헤더에서 토큰 추출
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "인증 토큰이 필요합니다." }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    console.log("사용자 정보 요청, 토큰:", token)

    // 실제 Spring Boot 서버로 요청 전달 (서버가 실행 중일 때)
    try {
      const springResponse = await fetch("http://localhost:8080/", { // 이 부분 수정 필요
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    if (token === "test-jwt-token-for-development-only") {
      return NextResponse.json({
        userId: "testuser",
        username: "테스트 사용자",
        email: "test@example.com",
      })
    } else {
      return NextResponse.json({ success: false, message: "유효하지 않은 토큰입니다." }, { status: 401 })
    }
  } catch (error) {
    console.error("API 라우트 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

