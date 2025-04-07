// src/pages/user-info/UserInfoPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ko from "date-fns/locale/ko";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function UserInfoPage() {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsNextButtonDisabled(!name || !birthDate || !gender);
  }, [name, birthDate, gender]);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    } else {
      setProfileImage(null);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleBirthDateChange = (date) => {
    setBirthDate(date);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const uploadToS3 = async (file) => {
    if (!file) {
      return null;
    }
    const S3_PREFIX = "user-profile/";

    const filename = `${Date.now()}-${file.name}`;
    const key = `${S3_PREFIX}${filename}`;

    const uploadUrl = `https://club-a-dev.s3.ap-northeast-2.amazonaws.com/${key}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (response.ok) {
        return uploadUrl;
      } else {
        console.error("S3 업로드 실패:", response);
        throw error;
      }
    } catch (error) {
      console.error("S3 업로드 실패:", error);
      throw error;
    }
  };

  const handleNext = async () => {
    if (!isNextButtonDisabled) {
      try {
        const profileImageUrl = await uploadToS3(profileImage);

        const userData = {
          name: name,
          birthDate: birthDate ? birthDate.toISOString() : null,
          gender: gender,
          imageUrl: profileImageUrl,
        };

        await axiosInstance.patch("/users/me", userData);
        console.log("사용자 정보 업데이트 성공:", userData);
        navigate("/join/userInfo/extends");
      } catch (error) {
        console.error("사용자 정보 업데이트 실패:", error);
        // 오류 처리
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography component="h1" variant="h5">
          사용자 정보 입력
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3, width: "100%" }}>
          {/* 프로필 이미지 등록 */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
                src={
                  profileImage ? URL.createObjectURL(profileImage) : undefined
                }
              >
                <PhotoCamera sx={{ fontSize: 20 }} />
              </Avatar>
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </IconButton>
          </Box>

          {/* 이름 입력 */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="이름"
            name="name"
            autoComplete="name"
            value={name}
            onChange={handleNameChange}
          />

          {/* 생년월일 입력 */}
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
            <DatePicker
              margin="normal"
              required
              fullWidth
              id="birthDate"
              label="생년월일"
              name="birthDate"
              value={birthDate}
              onChange={handleBirthDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          {/* 성별 선택 */}
          <FormControl component="fieldset" fullWidth margin="normal" required>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={gender}
              onChange={handleGenderChange}
              row
            >
              <FormControlLabel value="1" control={<Radio />} label="남성" />
              <FormControlLabel value="2" control={<Radio />} label="여성" />
            </RadioGroup>
          </FormControl>

          {/* 다음 버튼 */}
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={isNextButtonDisabled}
            sx={{
              position: "absolute",
              bottom: -50,
              right: 0,
            }}
          >
            다음
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default UserInfoPage;
