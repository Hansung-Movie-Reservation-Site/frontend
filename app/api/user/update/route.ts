import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { field, value, currentPassword, newPassword, email } = body

    console.log("사용자 정보 업데이트 요청:", {
      field,
      valueLength: value ? value.length : 0,
      email,
      hasPassword: !!currentPassword,
      hasNewPassword: field === "password" ? !!value : "N/A",
    })

    // 요청에서 토큰 추출
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "인증 토큰이 필요합니다." }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    if (!email) {
      return NextResponse.json({ success: false, message: "이메일 정보가 필요합니다." }, { status: 400 })
    }

    if (!currentPassword) {
      return NextResponse.json({ success: false, message: "비밀번호가 필요합니다." }, { status: 400 })
    }

    // 비밀번호 변경 시 새 비밀번호 확인
    if (field === "password" && !value) {
      return NextResponse.json({ success: false, message: "새 비밀번호가 필요합니다." }, { status: 400 })
    }

    // 스프링부트 API 요청 데이터 구성
    // 스프링부트 API가 기대하는 정확한 형식으로 데이터 구성
    const requestData = {
      object: field, // 변경할 대상 (username, email, password)
      email: email, // 사용자 이메일
      password: currentPassword, // 현재 비밀번호
      after: field === "password" ? value : value, // 변경할 새 값
    }

    console.log("스프링부트 API 요청 데이터:", {
      object: requestData.object,
      email: requestData.email,
      hasPassword: !!requestData.password,
      afterLength: requestData.after ? requestData.after.length : 0,
      afterValue: requestData.after, // 실제 값 로깅 (개발 환경에서만 사용)
    })

    // 스프링부트 API 호출
    const springResponse = await axios.post("http://localhost:8080/api/v1/detail/change", requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("스프링부트 API 응답:", springResponse.data)

    return NextResponse.json(springResponse.data)
  } catch (error: any) {
    console.error("API 라우트 오류:", error.message)
    console.error("상세 오류:", error.response?.data || "상세 정보 없음")

    return NextResponse.json(
      {
        success: false,
        code: "ERROR",
        message: error.response?.data?.message || "현재 비밀번호가 일치하지 않습니다.",
      },
      { status: 500 },
    )
  }
}

