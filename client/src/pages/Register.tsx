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
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name) {
      newErrors.name = "Name is required";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    ) {
      await register(email, password, confirmPassword);
      navigate({ pathname: "/login" });
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
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {">"} NEW_USER
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#00cc33",
                fontFamily: "monospace",
              }}
            >
              [CREATE TERMINAL ACCESS]
            </Typography>
          </Box>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
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

              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
                startIcon={<UserPlus size={20} />}
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
                REGISTER
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00cc33",
                    fontFamily: "monospace",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() =>
                      navigate({
                        pathname: "/login",
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
                    LOGIN
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
            [DEMO MODE: Registration creates a local session]
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
