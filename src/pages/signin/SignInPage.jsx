// src/pages/SignInPage.jsx
import React, { useEffect } from "react";
import AuthForm from "../../components/AuthForm";
import { Container, Box } from "@mui/material";

import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const navigate = useNavigate();
  const { clearUser } = useUserStore();

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 실행
    localStorage.clear(); // localStorage 전체 비우기
    clearUser(); // Zustand 스토어의 사용자 정보 삭제

    // (선택 사항) 만약 특정 localStorage 아이템만 삭제하고 싶다면 아래와 같이 사용
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('refreshToken');

    // (선택 사항) 로그인 상태가 이미 있다면 다른 페이지로 리다이렉트 (예시)
    // const storedToken = localStorage.getItem('authToken');
    // if (storedToken) {
    //   navigate('/main');
    // }
  }, [clearUser, navigate]); // clearUser와 navigate를 의존성 배열에 추가

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ backgroundColor: "FFDD00" }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AuthForm type="signIn" />
        {/* 필요에 따라 추가적인 UI 요소 (소셜 로그인 버튼 등) 추가 */}
      </Box>
    </Container>
  );
}

export default SignInPage;
