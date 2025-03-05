import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = async (url: string, data: object) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      withCredentials: true, // CORS 관련 쿠키 전송 허용
    });

    return response.data;
  } catch (err) {
    console.error("Error details:", err);

    throw new Error(
      err.response?.data?.message ||
        "서버에 연결할 수 없습니다. Spring Boot 서버가 실행 중인지 확인하세요."
    );
  }
};

export default apiClient;
