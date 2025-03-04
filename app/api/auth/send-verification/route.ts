import { NextResponse } from "next/server"

// 이 파일은 Next.js API 라우트로, Spring Boot 서버가 실행되지 않았을 때 테스트 목적으로 사용
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // 실제로는 Spring Boot 서버로 요청을 전달하지만,
    // 서버가 없는 경우 테스트용으로 사용할 수 있는 코드
    console.log("이메일 인증 코드 전송 요청:", email)

    // 실제 Spring Boot 서버로 요청 전달 (서버가 실행 중일 때)
    try {
      const springResponse = await fetch("http://localhost:8080", { // 이 부분 수정 필요
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (springResponse.ok) {
        const data = await springResponse.json()
        return NextResponse.json(data)
      }

      // Spring Boot 서버 응답이 실패한 경우 테스트용 응답 반환
      console.log("Spring Boot 서버 응답 실패, 테스트용 응답 반환")
    } catch (error) {
      console.error("Spring Boot 서버 연결 실패:", error)
    }

    // 테스트용 응답 (Spring Boot 서버가 없거나 응답하지 않을 때)
    // 실제 환경에서는 이 부분을 제거하고 Spring Boot 서버 응답만 사용
     return NextResponse.json({
      success: true,
      message: "인증 코드가 이메일로 전송되었습니다. (테스트 모드)",
    })
    
  } catch (error) {
    console.error("API 라우트 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

