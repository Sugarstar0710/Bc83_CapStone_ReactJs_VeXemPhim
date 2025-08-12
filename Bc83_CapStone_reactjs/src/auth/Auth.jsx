import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAccessToken } from "../Services/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // khôi phục từ localStorage
  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const u = JSON.parse(raw);
      setUser(u);
      setAccessToken(u?.accessToken || null);
    }
  }, []);

  const login = (u) => {
    setUser(u);
    localStorage.setItem("auth", JSON.stringify(u));
    setAccessToken(u?.accessToken || null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    setAccessToken(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
