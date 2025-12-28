import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Navigation } from "./components/Navigation";

import { CryptoDashboard } from "./pages/CryptoDashboard";
import { CryptoAnalytics } from "./pages/CryptoAnalytics";
import { AuthProvider } from "./providers/auth-provider";
import { Box } from "@mui/material";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ApiClientProvider } from "@nnaumovski/react-api-client";
import { apiClient } from "./utils/api-client";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ff41",
    },
    secondary: {
      main: "#0f0",
    },
    background: {
      default: "#0a0e27",
      paper: "#0f172a",
    },
    text: {
      primary: "#00ff41",
      secondary: "#00cc33",
    },
  },
  typography: {
    fontFamily: '"Courier New", monospace',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <ApiClientProvider apiClient={apiClient}>
          <AuthProvider>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <>
                    <Navigation />
                    <CryptoDashboard />
                  </>
                }
              />
              <Route
                path="/analytics"
                element={
                  <>
                    <Navigation />
                    <CryptoAnalytics />
                  </>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="*"
                element={
                  <Box
                    sx={{
                      width: "100%",
                      height: "100vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Not Found
                  </Box>
                }
              />
            </Routes>
          </AuthProvider>
        </ApiClientProvider>
      </Router>
    </ThemeProvider>
  );
}
