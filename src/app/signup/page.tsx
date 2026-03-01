"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { 
  User, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  LogIn
} from "lucide-react";

interface SignupResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  message?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient",
    specialization: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (formData.role === "doctor" && !formData.specialization.trim()) {
      setError("Specialization is required for doctors");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      };

      if (formData.role === "doctor") {
        payload.specialization = formData.specialization;
      }

      const res = await api.post("/auth/register", payload);

      if (res.data.success) {
        // Automatically log them in
        const loginRes = await login(formData.email, formData.password);
        if (!loginRes.success) {
          setError(loginRes.message || "Registration successful, but auto-login failed. Please log in manually.");
        }
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900 p-4">
      {/* Container with animated border */}
      <div className="relative w-[350px] md:w-[380px] overflow-hidden rounded-2xl bg-[#272727] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex-shrink-0">
        {/* Animated gradient border */}
        <div className="absolute inset-[-50px] z-[-2] animate-spin-slow bg-[conic-gradient(from_45deg,transparent_70%,#3b82f6,#a855f7,transparent_100%)]"></div>
        
        {/* Signup Box */}
        <div className="relative z-10 m-[1px] rounded-2xl bg-[#272727] p-6 md:p-8 shadow-[inset_0_40px_60px_-8px_rgba(255,255,255,0.1),inset_4px_0_12px_-6px_rgba(255,255,255,0.1),inset_0_0_12px_-4px_rgba(255,255,255,0.1)] backdrop-blur-[15px] sm:max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[20px] border-2 border-white/80 bg-gradient-to-br from-white/20 to-black/20 shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)]">
              <div className="absolute bottom-[10px] h-[20%] w-[50%] rounded-t-[40px] rounded-b-[20px] border-2.5 border-white/80"></div>
              <div className="absolute top-[10px] h-[30%] w-[30%] rounded-full border-2.5 border-white/80"></div>
              <User className="h-8 w-8 text-white/60 absolute bottom-1 right-1" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account! 🚀</h1>
            <p className="text-sm text-gray-400">Join AI Assistant today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-200">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-600 bg-[#3a3a3a] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-600 bg-[#3a3a3a] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Phone Input */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300 ml-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 234 567 890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-600 bg-[#3a3a3a] py-3 px-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>

              {/* Role Select */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300 ml-1">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-600 bg-[#3a3a3a] py-3 px-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* Specialization Input (Conditionally rendered for doctors) */}
            {formData.role === "doctor" && (
              <div className="space-y-1 animate-fadeIn">
                <label className="text-sm text-gray-300 ml-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g. Cardiologist, General Physician"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-600 bg-[#3a3a3a] py-3 px-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-600 bg-[#3a3a3a] py-3 pl-10 pr-10 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-600 bg-[#3a3a3a] py-3 pl-10 pr-10 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {formData.password && formData.confirmPassword && (
              <p className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                <CheckCircle className="h-3 w-3" />
                {formData.password === formData.confirmPassword 
                  ? "Passwords match" 
                  : "Passwords do not match"}
              </p>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#272727] text-gray-400">Already have an account?</span>
            </div>
          </div>

          {/* Login Button */}
          <Link href="/login" className="block">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white py-3 rounded-xl font-medium transition border border-gray-600 group"
            >
              <LogIn className="h-5 w-5 group-hover:scale-110 transition" />
              <span>Sign in to existing account</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}