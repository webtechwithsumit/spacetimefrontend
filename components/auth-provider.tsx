"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clearApiToken, setApiToken, setUnauthorizedHandler } from "@/lib/api";
import { identifyUser, resetAnalyticsUser, track } from "@/lib/analytics";
import {
  AuthUser,
  clearStoredSession,
  getStoredToken,
  getStoredUser,
  setStoredSession,
  setStoredUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (user: AuthUser, token: string) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = getStoredToken();
    setUser(getStoredUser());
    setToken(storedToken);
    if (storedToken) setApiToken(storedToken);
    setIsReady(true);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setToken(null);
      router.replace("/login");
    });

    return () => setUnauthorizedHandler(() => {});
  }, [router]);

  useEffect(() => {
    if (user?._id) {
      identifyUser(user._id, { role: user.role });
    } else if (isReady) {
      resetAnalyticsUser();
    }
  }, [user, isReady]);

  const login = useCallback((nextUser: AuthUser, nextToken: string) => {
    setStoredSession(nextUser, nextToken);
    setApiToken(nextToken);
    setUser(nextUser);
    setToken(nextToken);
  }, []);

  const updateUser = useCallback((nextUser: AuthUser) => {
    setStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    track("logout", { role: user?.role });
    clearStoredSession();
    clearApiToken();
    setUser(null);
    setToken(null);
    router.replace("/login");
  }, [router, user?.role]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isReady,
      login,
      updateUser,
      logout,
    }),
    [user, token, isReady, login, updateUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
