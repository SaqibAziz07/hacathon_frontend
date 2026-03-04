"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";

export type UserRole =
  | "admin"
  | "doctor"
  | "receptionist"
  | "patient"
  | "super-admin"
  | "manager";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  phone?: string;
  specialization?: string;
  subscriptionPlan?: "free" | "pro";
};

export type AccountStatus =
  | "active"
  | "pending_approval"
  | "pending_otp"
  | "rejected";

type LoginResult =
  | { success: true }
  | { success: false; message: string; status?: AccountStatus };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: (reason?: "expired" | "manual") => void;
  refreshMe: () => Promise<void>;
  getDashboardPath: (role: UserRole) => string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

function clearStoredToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("token");
}

function setStoredToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("token", token);
}

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const didBootstrapRef = useRef(false);
  const isLoggingOutRef = useRef(false);
  // FIX: store pathname in a ref so logout/refreshMe don't recreate on route change
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  const getDashboardPath = useCallback((role: UserRole) => {
    switch (role) {
      case "admin":       return "/dashboard/admin";
      case "doctor":      return "/dashboard/doctor";
      case "receptionist":return "/dashboard/receptionist";
      case "patient":     return "/dashboard/patient";
      case "super-admin": return "/dashboard/admin";
      case "manager":     return "/dashboard/admin";
      default:            return "/dashboard";
    }
  }, []);

  // FIX: removed `pathname` from deps — use pathnameRef instead
  const logout = useCallback(
    (reason: "expired" | "manual" = "manual") => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;

      console.log("[auth] logout", { reason, from: pathnameRef.current });
      clearStoredToken();
      setUser(null);

      const url = reason === "expired" ? "/login?session=expired" : "/login";
      if (pathnameRef.current !== "/login") router.replace(url);

      setTimeout(() => { isLoggingOutRef.current = false; }, 250);
    },
    [router], // ← no more `pathname` here
  );

  // FIX: `logout` no longer changes on route change, so `refreshMe` is stable too
  const refreshMe = useCallback(async () => {
    const token = getStoredToken();
    console.log("[auth] refreshMe", { hasToken: Boolean(token) });

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user as AuthUser);
        console.log("[auth] /auth/me success", { role: (res.data.user as AuthUser).role });
        return;
      }
      console.log("[auth] /auth/me non-success payload", res.data);
      logout("expired");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: unknown } })?.response?.status;
      const data   = (err as { response?: { data?: unknown } })?.response?.data;
      console.log("[auth] /auth/me error", { status, data });

      if (status === 401 || status === 404) {
        logout("expired");
        return;
      }
      setUser(null);
    }
  }, [logout]);

  // FIX: removed `pathname` from deps — bootstrap now truly runs only once
  useEffect(() => {
    if (didBootstrapRef.current) return;
    didBootstrapRef.current = true;

    (async () => {
      setLoading(true);
      console.log("[auth] bootstrap start", { pathname: pathnameRef.current });
      await refreshMe();
      setLoading(false);
      console.log("[auth] bootstrap done");
    })();
  }, [refreshMe]); // ← no more `pathname` here

  // Enforce protected routes after bootstrap completes.
  useEffect(() => {
    if (loading) return;

    if (!user && isProtectedPath(pathname)) {
      console.log("[auth] blocked protected route; redirect to login", { pathname });
      router.replace("/login");
      return;
    }

    if (user && pathname === "/login") {
      router.replace(getDashboardPath(user.role));
    }
  }, [getDashboardPath, loading, pathname, router, user]);

  // Global 401 handler emitted from axios interceptor.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ status?: number; message?: string; url?: string }>).detail;
      console.log("[auth] unauthorized event", detail);
      if (getStoredToken()) logout("expired");
    };

    window.addEventListener("auth:unauthorized", handler as EventListener);
    return () => window.removeEventListener("auth:unauthorized", handler as EventListener);
  }, [logout]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      try {
        console.log("[auth] login start", { email });
        const res = await api.post("/auth/login", { email, password });
        if (res.data?.success && res.data?.token && res.data?.user) {
          const loggedInUser = res.data.user as AuthUser;

          if (loggedInUser.status === "pending_approval") {
            return { success: false, status: "pending_approval", message: "Your account is awaiting admin approval. You'll receive an email once approved." };
          }
          if (loggedInUser.status === "pending_otp") {
            router.replace(`/signup/verify-otp?email=${encodeURIComponent(email)}`);
            return { success: true };
          }
          if (loggedInUser.status === "rejected") {
            return { success: false, status: "rejected", message: "Your account request was rejected. Please contact support." };
          }

          setStoredToken(res.data.token as string);
          setUser(res.data.user as AuthUser);
          console.log("[auth] login success", { role: (res.data.user as AuthUser).role });
          router.replace(getDashboardPath((res.data.user as AuthUser).role));
          return { success: true };
        }
        console.log("[auth] login failed payload", res.data);
        return { success: false, message: res.data?.message ?? "Login failed" };
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "An error occurred during login";
        console.log("[auth] login error", { message });
        return { success: false, message };
      }
    },
    [getDashboardPath, router],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, logout, refreshMe, getDashboardPath }),
    [getDashboardPath, loading, login, logout, refreshMe, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}