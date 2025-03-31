import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  Box,
  FormHelperText,
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../../firebase'; // Firebase 설정 파일 경로 확인

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setPasswordConfirmError('');
    setError('');
    setSuccessMessage('');

    if (!isEmailValid(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (!isPasswordValid(password)) {
      setPasswordError('비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage('회원가입이 완료되었습니다. 로그인해주세요.');
      setIsSignUp(false);
      setIsForgotPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage('로그인되었습니다.');
      // 로그인 성공 후 리디렉션 또는 다른 처리
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setEmailError('');
    setError('');
    setSuccessMessage('');

    if (!isEmailValid(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다.');
      setIsForgotPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMessage('');
    try {
      await signInWithPopup(auth, googleAuthProvider);
      setSuccessMessage('Google 계정으로 로그인되었습니다.');
      // 로그인 성공 후 리디렉션 또는 다른 처리
    } catch (error) {
      setError(error.message);
    }
  };

  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <Box component="form" onSubmit={handleForgotPassword} noValidate sx={{ mt: 1 }}>
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
              <Link href="#" variant="body2" onClick={() => setIsForgotPassword(false)}>
                로그인 화면으로 돌아가기
              </Link>
            </Grid>
          </Grid>
        </Box>
      );
    }

    return (
      <Box component="form" onSubmit={isSignUp ? handleSignUp : handleSignIn} noValidate sx={{ mt: 1 }}>
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
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isSignUp ? '회원가입' : '로그인'}
        </Button>
        <Grid container>
          <Grid item xs>
            {!isSignUp && (
              <Link href="#" variant="body2" onClick={() => setIsForgotPassword(true)}>
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
                setError('');
                setSuccessMessage('');
                setEmailError('');
                setPasswordError('');
                setPasswordConfirmError('');
                setEmail('');
                setPassword('');
                setPasswordConfirm('');
              }}
            >
              {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {isForgotPassword ? '비밀번호 찾기' : isSignUp ? '회원가입' : '로그인'}
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
    </Container>
  );
};

export default AuthForm;