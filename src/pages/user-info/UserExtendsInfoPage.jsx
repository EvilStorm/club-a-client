import React, { useState, useEffect } from "react";
import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Typography,
  Button,
  Box,
  Switch,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ko from "date-fns/locale/ko";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// NTRP 레벨별 설명 (이미지 기반)
const ntrpDescriptions = {
  1: "테니스 라켓을 이제 막 들어 시작한 상태 (평균 레슨 3개월 미만 ?)",
  1.5: "테니스 경험이 어느 정도 있으나 게임을 하기엔 아직 미숙함이 있는 상태",
  2: "랠리는 어느 정도 가능하나 플레이를 지속하는 데는 어려움이 있는 레벨 (평균 레슨 1년 미만 ?)",
  2.5: "일관성이 있는 랠리가 가능. 코트에서 게임이 원활하게 가능, 백 코르 랠리 유지 가능",
  3: "코트 인식이 좋고, 스핀 및 고급 기술 개발을 시작한 레벨",
  3.5: "일관된 방향으로 공을 칠 수 있는 레벨, 더 발전된 샷 선택을 시작하는 레벨",
  4: "다양한 옵션의 좋은 샷 선택 능력 보유, 정밀하고 지속적인 샷 랠리 가능",
  4.5: "자신의 기술을 사용하여 수준 높은 대회에서 경쟁이 가능한 레벨",
  5: "전국 수준의 대회 참가 가능",
  5.5: "국가 수준에서 경쟁 가능한 전문가 수준",
  6: "테니스 프로 선수 수준의 레벨, 최고 수준",
  6.5: "테니스 프로 선수 수준의 레벨, 최고 수준",
  7: "테니스 프로 선수 수준의 레벨, 최고 수준",
};

function UserExtendsInfoPage() {
  const [tennisStartDate, setTennisStartDate] = useState(null);
  const [dominantHand, setDominantHand] = useState("");
  const [ntrpRating, setNtrpRating] = useState("");
  const [ntrpDescription, setNtrpDescription] = useState("");
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const handleTennisStartDateChange = (date) => {
    setTennisStartDate(date);
  };

  const handleDominantHandChange = (event) => {
    setDominantHand(event.target.value);
  };

  const handleNtrpRatingChange = (event) => {
    const selectedRating = event.target.value;
    setNtrpRating(selectedRating);
    setNtrpDescription(ntrpDescriptions[selectedRating] || "");
  };

  const handleNext = async () => {
    if (!isNextButtonDisabled) {
      const handValue =
        dominantHand === "right" ? 1 : dominantHand === "left" ? 2 : null;
      const ntrValueMap = {
        1: 1,
        1.5: 2,
        2: 3,
        2.5: 4,
        3: 5,
        3.5: 6,
        4: 7,
        4.5: 8,
        5: 9,
        5.5: 10,
        6: 11,
        6.5: 12,
        7: 13,
      };
      const ntrValue = ntrValueMap[ntrpRating] || null;

      const payload = {
        staredAt: tennisStartDate
          ? tennisStartDate.toISOString().split("T")[0]
          : null,
        hands: handValue,
        ntr: ntrValue,
      };

      try {
        const response = await axiosInstance.patch(
          "/users/me/extends",
          payload
        );

        if (response.status === 200) {
          navigate("/main");
        }
      } catch (error) {
        console.error("사용자 정보 업데이트 실패:", error);
      }
    }
  };

  const ntrpOptions = Array.from({ length: 13 }, (_, i) => 1 + i * 0.5).filter(
    (v) => v <= 7
  );

  useEffect(() => {
    if (tennisStartDate && dominantHand && ntrpRating) {
      setIsNextButtonDisabled(false);
    } else {
      setIsNextButtonDisabled(true);
    }
  }, [tennisStartDate, dominantHand, ntrpRating]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          추가 정보 입력
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
          <DatePicker
            label="테니스 시작 날짜"
            value={tennisStartDate}
            onChange={handleTennisStartDateChange}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
        </LocalizationProvider>

        <FormControl component="fieldset" fullWidth margin="normal">
          <Typography component="legend">주 사용 손</Typography>
          <RadioGroup
            row
            aria-label="dominantHand"
            name="dominantHand"
            value={dominantHand}
            onChange={handleDominantHandChange}
          >
            <FormControlLabel
              value="right"
              control={<Radio />}
              label="오른손"
            />
            <FormControlLabel value="left" control={<Radio />} label="왼손" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" fullWidth margin="normal">
          <Typography component="legend">NTRP 레이팅</Typography>
          <RadioGroup
            aria-label="ntrpRating"
            name="ntrpRating"
            value={ntrpRating}
            onChange={handleNtrpRatingChange}
            row
            sx={{ mb: 2 }}
          >
            {ntrpOptions.map((rating) => (
              <FormControlLabel
                key={rating}
                value={String(rating)}
                control={<Radio />}
                label={String(rating)}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {ntrpRating && (
          <Box mt={2} p={2} border="1px solid #ccc" borderRadius={1}>
            <Typography variant="subtitle1">NTRP {ntrpRating} 설명</Typography>
            <Typography variant="body2">{ntrpDescription}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={isNextButtonDisabled}
        >
          다음
        </Button>
      </Box>
    </Box>
  );
}

export default UserExtendsInfoPage;
