import React from "react";
import AuthForm from "./components/AuthForm";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import SignInPage from "./pages/signin/SignInPage";
import UserInfoPage from "./pages/user-info/UserInfoPage";
import UserExtendsInfoPage from "./pages/user-info/UserExtendsInfoPage";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ width: "100vw" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/login" element={<SignInPage />} />
            {/* <Route path="/login/success" element={<LoginSuccessHandler />} />{" "} */}
            {/* 로그인 성공 후 이 경로로 리다이렉트 */}
            <Route path="/main" element={<MainPage />} />
            <Route path="/join/userInfo" element={<UserInfoPage />} />
            <Route
              path="/join/userInfo/extends"
              element={<UserExtendsInfoPage />}
            />
            {/* 다른 라우트들 */}
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <AuthForm />
    // </ThemeProvider>
  );
}

export default App;
