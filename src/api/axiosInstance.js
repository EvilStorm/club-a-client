import axios from "axios";

const domain = "http://localhost:3000";
// 기본 Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: domain, // 기본 도메인
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken = null; // SignIn Token을 저장할 변수

// SignIn Token 설정 함수
export const setAuthToken = (token) => {
  authToken = token.accessToken;

  // 새로운 토큰 저장
  localStorage.setItem("authToken", token.accessToken);
  localStorage.setItem("refreshToken", token.refreshToken);
};

// 요청 인터셉터: 모든 요청 헤더에 SignIn Token 추가
axiosInstance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: JWT 만료 시 Refresh Token 요청 및 재시도
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 에러이고, 아직 Refresh Token 요청을 시도하지 않았을 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정

      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Refresh Token 가져오기
        if (!refreshToken) {
          // Refresh Token이 없으면 로그아웃 처리 (선택 사항)
          console.log("Refresh Token이 없습니다. 로그아웃합니다.");
          // dispatch(logout());
          return Promise.reject(error);
        }

        // Refresh Token 요청 API 호출 (Nest.js 엔드포인트에 맞춰 수정)
        const refreshResponse = await axios.post(`${domain}/auth/refresh`, {
          refreshToken,
        });

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.tokens.accessToken;
          const newRefreshToken = refreshResponse.data.tokens.refreshToken;

          // 새로운 토큰 저장
          localStorage.setItem("authToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // SignIn Token 업데이트
          setAuthToken(newAccessToken);

          // 기존 요청 헤더 업데이트 및 재시도
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          // Refresh Token 요청 실패 시 로그아웃 처리 (선택 사항)
          console.log("Refresh Token 요청 실패. 로그아웃합니다.");
          // dispatch(logout());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Refresh Token 요청 중 오류:", refreshError);
        // 로그아웃 처리 (선택 사항)
        // dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
