import React from 'react';
import AuthForm from './components/AuthForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthForm />
    </ThemeProvider>
  );
}

export default App;

