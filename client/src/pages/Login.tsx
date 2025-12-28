import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
} from "@mui/material";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      await login(email, password);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "#0f172a",
            border: "2px solid #00ff41",
            boxShadow: "0 0 30px rgba(0, 255, 65, 0.3)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "#00ff41",
                textShadow: "0 0 10px #00ff41, 0 0 20px #00ff41",
              }}
            >
              {">"} ACCESS_TERMINAL
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#00cc33",
                fontFamily: "monospace",
              }}
            >
              [AUTHENTICATION REQUIRED]
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#00ff41",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00ff41",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00ff41",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#ff1744",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#00ff41",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00ff41",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00ff41",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#ff1744",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<LogIn size={20} />}
                sx={{
                  backgroundColor: "#00ff41",
                  color: "#0a0e27",
                  fontFamily: "monospace",
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#00cc33",
                    boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)",
                  },
                }}
              >
                LOGIN
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00cc33",
                    fontFamily: "monospace",
                  }}
                >
                  Don't have an account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() =>
                      navigate({
                        pathname: "/register",
                      })
                    }
                    sx={{
                      color: "#00ff41",
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    REGISTER
                  </Link>
                </Typography>
              </Box>
            </Box>
          </form>
        </Paper>

        {/* Info Box */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#00cc33",
              fontFamily: "monospace",
            }}
          >
            [DEMO MODE: Use any email and password (min 6 chars)]
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
