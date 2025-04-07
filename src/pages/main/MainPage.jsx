// src/pages/MainPage.js
import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function MainPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        메인 화면
      </Typography>
      <Typography variant="body1" paragraph>
        메인 화면입니다.
      </Typography>
      <Button
        component={Link}
        to="/user-info/add"
        variant="contained"
        color="primary"
      >
        유저 정보 입력 페이지로 이동
      </Button>
      <Button
        component={Link}
        to="/message/환영합니다!"
        variant="outlined"
        sx={{ mt: 2 }}
      >
        환영 메시지 보기
      </Button>
      {/* 추가적인 메인 화면 내용 및 기능 구현 */}
    </Container>
  );
}

export default MainPage;
