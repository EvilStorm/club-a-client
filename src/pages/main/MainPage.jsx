// src/pages/MainPage.js
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import { styled, useTheme } from '@mui/material/styles';

import PersonNameCard from "./components/PersonNameCard";
import ScoringBriefChart from "./components/ScoringBriefChart";

const FirstContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(3),
  padding: theme.spacing(2),
  width: '100%',
  justifyContent: 'space-between', 
  alignItems: 'center',
}));

const PersonNameCardWrapper = styled(Box)(({ theme }) => ({
  flex: 3, // 축소되지 않고 초기 크기 30% 유지
}));

const ScoringBriefChartWrapper = styled(Box)(({ theme }) => ({
  flex: 7, // 축소되지 않고 초기 크기 70% 유지
}));



function MainPage() {

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  
  useEffect(() => {
    fetchUser()

  }, [])
  const chartData = {
    dates: ["12-14", "12-16", "12-19", "12-20", "12-24"],
    wins: [2, 4, 4, 1, 3],
    losses: [4, 2, 2, 5, 3],
  };


  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        메인 화면 {user?.name}
      </Typography>
      <Typography variant="body1" paragraph>
        메인 화면입니다.
      </Typography>
      <FirstContainer >
        <PersonNameCardWrapper>
        <PersonNameCard user={user} />
        </PersonNameCardWrapper>
        <ScoringBriefChartWrapper>
          <ScoringBriefChart
            dates={chartData.dates}
            wins={chartData.wins}
            losses={chartData.losses}
          />
        </ScoringBriefChartWrapper>
      </FirstContainer>
      <ScoringBriefChart
            dates={chartData.dates}
            wins={chartData.wins}
            losses={chartData.losses}
          />
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
