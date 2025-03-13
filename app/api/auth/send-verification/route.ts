import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    console.log("이메일 인증 코드 전송 요청:", email)

    const springResponse = await axios.post(
      "http://localhost:8080/api/v1/email/send",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      },
    )

    return NextResponse.json(springResponse.data)
  } catch (error) {
    console.error("API 라우트 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

