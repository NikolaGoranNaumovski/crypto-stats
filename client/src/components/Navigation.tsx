import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { BarChart3, Table, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentLocation = location.pathname;

  const { user, logout } = useAuth();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#0f172a",
        borderBottom: "2px solid #00ff41",
        boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Button
            startIcon={<Table size={20} />}
            onClick={() =>
              navigate({
                pathname: "/dashboard",
              })
            }
            sx={{
              color: currentLocation.includes("dashboard")
                ? "#00ff41"
                : "#00cc33",
              fontFamily: "monospace",
              borderBottom: currentLocation.includes("dashboard")
                ? "2px solid #00ff41"
                : "none",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "rgba(0, 255, 65, 0.1)",
              },
            }}
          >
            DASHBOARD
          </Button>
          <Button
            startIcon={<BarChart3 size={20} />}
            onClick={() =>
              navigate({
                pathname: "/analytics",
              })
            }
            sx={{
              color: currentLocation.includes("analytics")
                ? "#00ff41"
                : "#00cc33",
              fontFamily: "monospace",
              borderBottom: currentLocation.includes("analytics")
                ? "2px solid #00ff41"
                : "none",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "rgba(0, 255, 65, 0.1)",
              },
            }}
          >
            ANALYTICS
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user?.username && (
            <Box
              sx={{
                color: "#00ff41",
                fontFamily: "monospace",
                px: 2,
                py: 0.5,
                border: "1px solid #00ff41",
                borderRadius: "4px",
              }}
            >
              USER: {user.username}
            </Box>
          )}
          <Button
            startIcon={<LogOut size={20} />}
            onClick={logout}
            sx={{
              color: "#ff1744",
              fontFamily: "monospace",
              border: "1px solid #ff1744",
              "&:hover": {
                backgroundColor: "rgba(255, 23, 68, 0.1)",
                borderColor: "#ff1744",
              },
            }}
          >
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
