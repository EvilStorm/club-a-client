import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  sendEmailVerification,
  getAuth as getFirebaseAuth, // 이름 변경
} from "firebase/auth";
import { auth, googleAuthProvider } from "../../firebase"; // Firebase 설정 파일 경로 확인
import axiosInstance, { setAuthToken } from "../api/axiosInstance";
import SimpleConfirmPopup from "../components/SimpleConfirmPopup";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const handleOpenPopup = (message) => {
    setPopupMessage(message);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    console.log("팝업 닫힘");
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLoginSuccess = async (email, loginType) => {
    const serviceType = "tenifo"; // 서비스 타입은 'tenifo'로 고정
    console.log(`???`);
    try {
      const response = await axiosInstance.post("/auth/register-account", {
        email: email,
        loginType: loginType,
        serviceType: serviceType,
      });

      // Nest.js 서버로부터의 응답 처리 (예: 성공 메시지)
      console.log("Account 등록 성공:", response.data);
      // 추가적인 로그인 성공 후 처리 (예: 리디렉션, 상태 업데이트)

      await signIn(email, loginType, serviceType);
    } catch (error) {
      console.error(
        "Account 등록 실패:",
        error.response ? error.response.data : error.message
      );
      // 에러 처리 로직 (예: 사용자에게 에러 메시지 표시)
    }
  };

  const signIn = async (email, loginType, serviceType) => {
    try {
      const response = await axiosInstance.post("/auth/sign-in", {
        email: email,
        loginType: loginType,
        serviceType: serviceType,
      });

      setAuthToken(response.data.tokens);

      console.log(response);

      if (response.data.user.name) {
        if (response.data.user.extendsInfo.startedAt) {
          navigate("/main");
        } else {
          navigate("/join/userInfo/extends");
        }

        console.log("있다.");
      } else {
        console.log("없다..");
        navigate("/join/userInfo");
      }

      console.log("로그인 성공:", response.data);
    } catch (error) {
      console.error(
        "사용자 정보 조회 실패:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmError("");
    setError("");
    setSuccessMessage("");

    if (!isEmailValid(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!isPasswordValid(password)) {
      setPasswordError(
        "비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다."
      );
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      setSuccessMessage(
        "회원가입이 완료되었습니다. 이메일 인증을 완료해주세요."
      );
      setIsSignUp(false);
      setIsForgotPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        setVerificationDialogOpen(true);
        await getFirebaseAuth().signOut(); // 인증 안된 사용자 로그아웃
        return;
      }
      handleLoginSuccess(user.email, "email");
      setSuccessMessage("로그인되었습니다.");
      // 로그인 성공 후 리디렉션 또는 다른 처리
    } catch (error) {
      console.log(error.message);
      if (error.message.includes("too-many-requests")) {
        handleOpenPopup(
          "너무 많은 시도를 했습니다. 잠시 후 다시 시도해주세요."
        );
      } else {
        handleOpenPopup("로그인에 실패했습니다.");
      }

      // setError(error.message);
    }
  };

  const handleSendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        setSuccessMessage(
          "인증 이메일을 다시 보냈습니다. 메일함을 확인해주세요."
        );
        setVerificationDialogOpen(false);
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("로그인 정보가 없습니다. 다시 로그인해주세요.");
      setVerificationDialogOpen(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setEmailError("");
    setError("");
    setSuccessMessage("");

    if (!isEmailValid(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("비밀번호 재설정 링크가 이메일로 발송되었습니다.");
      setIsForgotPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccessMessage("");
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;
      if (
        user &&
        !user.emailVerified &&
        user.providerData[0].providerId === "google.com"
      ) {
        // Google로 가입했지만 이메일 인증이 안 된 경우 (드문 케이스)
        setVerificationDialogOpen(true);
        await getFirebaseAuth().signOut();
        return;
      }
      handleLoginSuccess(user.email, "google");
      setSuccessMessage("Google 계정으로 로그인되었습니다.");
      // 로그인 성공 후 리디렉션 또는 다른 처리
    } catch (error) {
      handleOpenPopup("로그인에 실패했습니다.");
      // setError(error.message);
    }
  };

  const handleCloseVerificationDialog = () => {
    setVerificationDialogOpen(false);
  };

  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <Box
          component="form"
          onSubmit={handleForgotPassword}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            비밀번호 재설정 링크 보내기
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                href="#"
                variant="body2"
                onClick={() => setIsForgotPassword(false)}
              >
                로그인 화면으로 돌아가기
              </Link>
            </Grid>
          </Grid>
        </Box>
      );
    }

    return (
      <Box
        component="form"
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="이메일 주소"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="비밀번호"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
        {isSignUp && (
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            id="passwordConfirm"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={!!passwordConfirmError}
            helperText={passwordConfirmError}
          />
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isSignUp ? "회원가입" : "로그인"}
        </Button>
        <Grid container>
          <Grid item xs>
            {!isSignUp && (
              <Link
                href="#"
                variant="body2"
                onClick={() => setIsForgotPassword(true)}
              >
                비밀번호를 잊으셨나요?
              </Link>
            )}
          </Grid>
          <Grid item>
            <Link
              href="#"
              variant="body2"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsForgotPassword(false);
                setError("");
                setSuccessMessage("");
                setEmailError("");
                setPasswordError("");
                setPasswordConfirmError("");
                setEmail("");
                setPassword("");
                setPasswordConfirm("");
              }}
            >
              {isSignUp
                ? "이미 계정이 있으신가요? 로그인"
                : "계정이 없으신가요? 회원가입"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isForgotPassword
            ? "비밀번호 찾기"
            : isSignUp
            ? "회원가입"
            : "로그인"}
        </Typography>
        {renderForm()}
        {!isForgotPassword && (
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleGoogleSignIn}
          >
            Google 계정으로 로그인
          </Button>
        )}
      </Box>

      {/* 이메일 인증 확인 팝업 */}
      <Dialog
        open={verificationDialogOpen}
        onClose={handleCloseVerificationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"이메일 인증이 필요합니다"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            아직 이메일 인증이 완료되지 않았습니다. 메일함에서 인증 링크를
            클릭하여 인증을 완료해주세요.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVerificationDialog}>닫기</Button>
          <Button onClick={handleSendVerificationEmail} autoFocus>
            인증 메일 재발송
          </Button>
        </DialogActions>
      </Dialog>

      <SimpleConfirmPopup
        open={openPopup}
        onClose={handleClosePopup}
        message={popupMessage}
      />
    </Container>
  );
};

export default AuthForm;
