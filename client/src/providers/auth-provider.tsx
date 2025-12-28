import {
  createContext,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import type { User } from "../types/entities";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useGet, useMutation } from "@nnaumovski/react-api-client";

type AuthContextType = {
  user: User | null;
  register: (
    username: string,
    password: string,
    repeatPassword: string
  ) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, loading, refetch, resetData } = useGet<User>("/user/me");
  const navigator = useNavigate();
  const location = useLocation();

  const { trigger } = useMutation("post");

  const login = async (username: string, password: string) => {
    await trigger("/auth/login", {
      username,
      password,
    });

    await refetch();
  };

  const register = async (
    username: string,
    password: string,
    repeatPassword: string
  ) => {
    await trigger("/auth/register", {
      username,
      password,
      repeatPassword,
    });

    await refetch();
  };

  const logout = async () => {
    await trigger("/auth/logout", {});
    resetData();
    navigator({ pathname: "/login" });
  };
  console.log({user})
  useEffect(() => {
    const isUserLoggedIn = !loading && !!user;
    const isLoginPage = location.pathname.includes("login");
    const isRegisterPage = location.pathname.includes("register");

    if (isUserLoggedIn && (isLoginPage || isRegisterPage)) {
      navigator({
        pathname: "/dashboard",
      });
    }

    if (!isLoginPage && !isRegisterPage && !isUserLoggedIn) {
      navigator({
        pathname: "/login",
      });
    }
  }, [loading, location.pathname, navigator, user]);

  const isLoading = loading && !user;

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {isLoading ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
