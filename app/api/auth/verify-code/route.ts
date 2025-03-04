import { NextResponse } from "next/server"

// 테스트용 인증 코드 (실제 환경에서는 사용 X)
const TEST_VERIFICATION_CODE = "123456"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code } = body

    console.log("인증 코드 확인 요청:", { email, code })

    // 실제 Spring Boot 서버로 요청 전달 (서버가 실행 중일 때)
    try {
      const springResponse = await fetch("http://localhost:8080/", { // 이 부분 수정 필요
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
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
    // 테스트 코드 "123456"으로 확인
    if (code === TEST_VERIFICATION_CODE) {
      return NextResponse.json({
        success: true,
        message: "이메일 인증이 완료되었습니다. (테스트 모드)",
      })
    } else {
      return NextResponse.json(
        { success: false, message: "잘못된 인증 코드입니다. 테스트 코드는 123456입니다." },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("API 라우트 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

