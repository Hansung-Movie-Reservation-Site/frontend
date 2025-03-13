import axios from "axios"

export interface UserData {
  username: string
  email: string
  [key: string]: any // 추가 필드를 위한 인덱스 시그니처
}

/**
 * 사용자 정보를 가져오는 함수
 * @returns 사용자 데이터
 */
export const getUserProfile = (): UserData | null => {
  try {
    // 로컬 스토리지와 세션 스토리지 모두 확인
    const localUser = localStorage.getItem("user")
    const sessionUser = sessionStorage.getItem("user")

    const storedUser = localUser || sessionUser

    if (!storedUser) {
      console.warn("스토리지에 사용자 정보가 없습니다.")
      return null
    }

    const userData = JSON.parse(storedUser)

    // 필수 필드 확인
    if (!userData.username || !userData.email) {
      console.warn("사용자 정보가 불완전합니다:", userData)

      // 이메일이 있고 사용자 이름이 없는 경우, 이메일에서 사용자 이름 추출
      if (userData.email && !userData.username) {
        userData.username = userData.email.split("@")[0]
      }

      // 그래도 필수 필드가 없으면 null 반환
      if (!userData.username || !userData.email) {
        return null
      }
    }

    // 다른 스토리지에도 복제
    if (localUser && !sessionUser) {
      sessionStorage.setItem("user", localUser)
    } else if (!localUser && sessionUser) {
      localStorage.setItem("user", sessionStorage.getItem("user") || "")
    }

    return userData
  } catch (error) {
    console.error("사용자 정보 파싱 오류:", error)
    return null
  }
}

/**
 * 로그아웃 처리 함수
 */
export const logout = (): void => {
  // 모든 스토리지에서 제거
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")

  // 쿠키 제거
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

/**
 * 사용자 정보 업데이트 함수
 * @param field 업데이트할 필드 (username, email, password)
 * @param value 새 값
 * @param currentPassword 현재 비밀번호 (인증용)
 * @param newPassword 새 비밀번호 (비밀번호 변경 시 필요)
 * @returns 업데이트 결과
 */
export const updateUserProfile = async (
  field: string,
  value: string,
  currentPassword: string,
  newPassword?: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    const userData = getUserProfile()

    if (!token) {
      throw new Error("인증 토큰이 없습니다.")
    }

    if (!userData || !userData.email) {
      throw new Error("사용자 정보를 찾을 수 없습니다.")
    }

    if (!currentPassword) {
      throw new Error("현재 비밀번호가 필요합니다.")
    }

    // 비밀번호 변경 시 새 비밀번호 확인
    if (field === "password" && !value) {
      throw new Error("새 비밀번호가 필요합니다.")
    }

    console.log("업데이트 요청 준비:", {
      field,
      valueLength: value ? value.length : 0,
      email: userData.email,
      hasPassword: !!currentPassword,
      hasNewPassword: field === "password" ? !!value : "N/A",
      actualValue: value, // 실제 값 로깅 (개발 환경에서만 사용)
    })

    // API 요청 데이터 구성
    const requestData = {
      field,
      value,
      email: userData.email,
      currentPassword,
    }

    console.log("API 요청 데이터:", {
      field: requestData.field,
      valueLength: requestData.value ? requestData.value.length : 0,
      email: requestData.email,
      hasPassword: !!requestData.currentPassword,
      actualValue: requestData.value, // 실제 값 로깅 (개발 환경에서만 사용)
    })

    const response = await axios.post("/api/user/update", requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("API 응답:", response.data)

    if (response.data.code === "SUCCESS") {
      return {
        success: true,
        message:
          field === "password"
            ? "비밀번호가 변경되었습니다."
            : `${field === "username" ? "이름" : "이메일"}이 변경되었습니다.`,
      }
    }

    return {
      success: false,
      message: response.data.message || "업데이트에 실패했습니다.",
    }
  } catch (error: any) {
    console.error("사용자 정보 업데이트 오류:", error)
    console.error("상세 오류:", error.response?.data || "상세 정보 없음")

    return {
      success: false,
      message: error.response?.data?.message || error.message || "업데이트 중 오류가 발생했습니다.",
    }
  }
}

