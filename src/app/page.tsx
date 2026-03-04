"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Activity, ShieldCheck, Stethoscope, ArrowRight } from "lucide-react";
import LandingPage from "./landing";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return <LandingPage />
}
