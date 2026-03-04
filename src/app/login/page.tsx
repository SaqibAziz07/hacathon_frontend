"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message); // ← error dikhao
    }
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    // router.push("/dashboard");
  };

  return (
    <div className="auth-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f8fafc;
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          flex: 1;
          background: #0f172a;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
        }
        .auth-left-glow1 {
          position: absolute; top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(59,130,246,0.15), transparent);
          border-radius: 50%; pointer-events: none;
        }
        .auth-left-glow2 {
          position: absolute; bottom: -60px; left: -60px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99,102,241,0.12), transparent);
          border-radius: 50%; pointer-events: none;
        }
        .auth-left-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; position: relative; z-index: 1;
        }
        .auth-left-logo-icon {
          width: 40px; height: 40px; background: white;
          border-radius: 11px; display: flex; align-items: center;
          justify-content: center; font-size: 20px;
        }
        .auth-left-logo-text {
          font-family: 'Sora', sans-serif;
          font-weight: 800; font-size: 22px; color: white;
        }
        .auth-left-content { position: relative; z-index: 1; }
        .auth-left-tag {
          display: inline-block; background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.3);
          color: #93c5fd; font-size: 12px; font-weight: 600;
          padding: 5px 14px; border-radius: 20px;
          letter-spacing: 0.5px; margin-bottom: 20px;
        }
        .auth-left-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 800; color: white; line-height: 1.2;
          margin-bottom: 16px;
        }
        .auth-left-title span {
          background: linear-gradient(135deg, #60a5fa, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-left-sub {
          font-size: 15px; color: #64748b; line-height: 1.7;
          margin-bottom: 40px; max-width: 340px;
        }

        /* ── RIGHT PANEL ── */
        .auth-right {
          width: 480px; flex-shrink: 0;
          display: flex; flex-direction: column;
          justify-content: center; padding: 48px;
          background: white;
        }
        .auth-form-header { margin-bottom: 32px; }
        .auth-form-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px; font-weight: 800;
          color: #0f172a; margin-bottom: 8px;
        }
        .auth-form-sub { font-size: 14px; color: #64748b; }
        .auth-form-sub a { color: #3b82f6; text-decoration: none; font-weight: 600; }
        .auth-form-sub a:hover { text-decoration: underline; }

        /* Form */
        .auth-form { display: flex; flex-direction: column; gap: 18px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 13px; font-weight: 600; color: #374151; }
        .form-input-wrap { position: relative; }
        .form-input {
          width: 100%; padding: 11px 16px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; font-size: 14px;
          font-family: inherit; color: #0f172a; background: #f8fafc;
          outline: none; transition: all 0.2s;
        }
        .form-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .form-input::placeholder { color: #94a3b8; }
        .form-input-icon {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 16px; cursor: pointer;
          background: none; border: none; padding: 0; transition: color 0.2s;
        }
        .form-input-icon:hover { color: #475569; }
        .form-input.has-icon { padding-right: 44px; }

        /* Remember + Forgot */
        .form-row { display: flex; align-items: center; justify-content: space-between; }
        .form-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .form-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: #3b82f6; cursor: pointer; }
        .form-check-label { font-size: 13px; color: #475569; font-weight: 500; }
        .form-forgot { font-size: 13px; color: #3b82f6; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .form-forgot:hover { color: #2563eb; }

        /* Error */
        .form-error {
          background: #fef2f2; border: 1px solid #fecaca;
          color: #dc2626; font-size: 13px; font-weight: 500;
          padding: 10px 14px; border-radius: 8px;
          display: flex; align-items: center; gap: 8px;
        }

        /* Submit */
        .form-submit {
          width: 100%; padding: 13px; border-radius: 11px;
          background: #0f172a; color: white; border: none;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .form-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,23,42,0.2); }
        .form-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .form-divider {
          display: flex; align-items: center; gap: 12px;
          font-size: 12px; color: #94a3b8; font-weight: 500;
        }
        .form-divider::before, .form-divider::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }

        /* Signup link */
        .auth-signup-row { text-align: center; margin-top: 8px; font-size: 13px; color: #64748b; }
        .auth-signup-row a { color: #3b82f6; font-weight: 600; text-decoration: none; }
        .auth-signup-row a:hover { text-decoration: underline; }

        @media (max-width: 900px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; padding: 32px 24px; }
        }
      `}</style>

      {/* ── LEFT ── */}
      <div className="auth-left">
        <div className="auth-left-glow1" />
        <div className="auth-left-glow2" />

        <Link href="/" className="auth-left-logo">
          <div className="auth-left-logo-icon">🏥</div>
          <span className="auth-left-logo-text">AI Clinic</span>
        </Link>

        <div className="auth-left-content">
          <div className="auth-left-tag">✨ Trusted by 2,400+ Clinics</div>
          <h2 className="auth-left-title">
            Welcome back to <span>AI Clinic</span>
          </h2>
          <p className="auth-left-sub">
            Log in to manage your patients, appointments, billing, and AI-powered clinical insights — all in one place.
          </p>
        </div>

        {/* Empty div to keep space-between layout balanced */}
        <div />
      </div>

      {/* ── RIGHT ── */}
      <div className="auth-right">
        <div className="auth-form-header">
          <h1 className="auth-form-title">Sign in 👋</h1>
          <p className="auth-form-sub">
            Don't have an account?{" "}
            <Link href="/signup">Create one free</Link>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {error && (
            <div className="form-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="form-input-wrap">
              <input
                type="email"
                className="form-input"
                placeholder="doctor@clinic.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <input
                type={showPass ? "text" : "password"}
                className="form-input has-icon"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="form-input-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="form-check">
              <input type="checkbox" />
              <span className="form-check-label">Remember me</span>
            </label>
            <a href="#" className="form-forgot">Forgot password?</a>
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? <><div className="spinner" /> Signing in...</> : "Sign In →"}
          </button>

          <div className="form-divider">or continue with</div>

        </form>

        <div className="auth-signup-row">
          New to AI Clinic?{" "}
          <Link href="/signup">Create a free account</Link>
        </div>
      </div>
    </div>
  );
}