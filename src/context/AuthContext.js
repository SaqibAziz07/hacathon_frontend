"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      // If we are on a protected route, redirect to login
      if (isProtectedRoute(pathname)) {
        router.push("/login");
      }
      return;
    }

    try {
      const res = await api.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        redirectUser(res.data.user.role);
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "An error occurred during login" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const isProtectedRoute = (path) => {
    const protectedPaths = ["/dashboard", "/patients", "/appointments", "/prescriptions"];
    return protectedPaths.some(p => path.startsWith(p));
  };

  const redirectUser = (role) => {
    switch (role) {
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "doctor":
        router.push("/dashboard/doctor");
        break;
      case "receptionist":
        router.push("/dashboard/receptionist");
        break;
      case "patient":
        router.push("/dashboard/patient");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
