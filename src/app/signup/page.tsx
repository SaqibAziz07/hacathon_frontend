"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "doctor",       label: "🩺 Doctor",       desc: "Requires admin approval" },
  { value: "receptionist", label: "📋 Receptionist",  desc: "Requires admin approval" },
  { value: "patient",      label: "🧑 Patient",       desc: "Instant access" },
];

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Password strength
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"][strength];

  const needsApproval = role === "doctor" || role === "receptionist";

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (!email.trim())    { setError("Please enter your email."); return; }
    if (!role)            { setError("Please select your role."); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password)            { setError("Please enter a password."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (strength < 2)         { setError("Password is too weak."); return; }
    if (!agreed)              { setError("Please agree to the Terms of Service."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Signup failed."); setLoading(false); return; }

      if (needsApproval) {
        // Doctor/Receptionist → go to pending page
        router.push(`/signup/pending?email=${encodeURIComponent(email)}&role=${role}`);
      } else {
        // Patient → go directly to OTP verify
        router.push(`/signup/verify-otp?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');

        .auth-root { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #f8fafc; }

        /* LEFT */
        .auth-left {
          flex: 1; background: #0f172a; position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: space-between; padding: 48px;
        }
        .auth-left-glow1 { position: absolute; top: -80px; right: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(59,130,246,0.15), transparent); border-radius: 50%; pointer-events: none; }
        .auth-left-glow2 { position: absolute; bottom: -60px; left: -60px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(99,102,241,0.12), transparent); border-radius: 50%; pointer-events: none; }
        .auth-left-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; position: relative; z-index: 1; }
        .auth-left-logo-icon { width: 40px; height: 40px; background: white; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .auth-left-logo-text { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 22px; color: white; }
        .auth-left-content { position: relative; z-index: 1; }
        .auth-left-tag { display: inline-block; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; letter-spacing: 0.5px; margin-bottom: 20px; }
        .auth-left-title { font-family: 'Sora', sans-serif; font-size: clamp(28px, 3vw, 40px); font-weight: 800; color: white; line-height: 1.2; margin-bottom: 16px; }
        .auth-left-title span { background: linear-gradient(135deg, #60a5fa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .auth-left-sub { font-size: 15px; color: #64748b; line-height: 1.7; margin-bottom: 40px; max-width: 340px; }
        .auth-checklist { display: flex; flex-direction: column; gap: 14px; margin-bottom: 40px; }
        .auth-check-item { display: flex; align-items: flex-start; gap: 12px; }
        .auth-check-icon { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #10b981; margin-top: 1px; }
        .auth-check-text { font-size: 14px; color: #94a3b8; line-height: 1.5; }
        .auth-check-text strong { color: #e2e8f0; font-weight: 600; }
        .auth-left-pills { display: flex; flex-wrap: wrap; gap: 8px; position: relative; z-index: 1; }
        .auth-pill { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 7px 12px; font-size: 12px; color: #94a3b8; font-weight: 500; }
        .auth-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

        /* RIGHT */
        .auth-right { width: 500px; flex-shrink: 0; display: flex; flex-direction: column; justify-content: center; padding: 48px; background: white; overflow-y: auto; }
        .auth-form-header { margin-bottom: 24px; }
        .auth-form-title { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .auth-form-sub { font-size: 14px; color: #64748b; }
        .auth-form-sub a { color: #3b82f6; text-decoration: none; font-weight: 600; }
        .auth-form-sub a:hover { text-decoration: underline; }

        /* Step indicator */
        .step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all 0.3s; }
        .step-dot.active { background: #0f172a; color: white; }
        .step-dot.done   { background: #10b981; color: white; }
        .step-dot.idle   { background: #f1f5f9; color: #94a3b8; border: 1.5px solid #e2e8f0; }
        .step-line { flex: 1; height: 2px; border-radius: 2px; background: #f1f5f9; transition: all 0.3s; }
        .step-line.done { background: #10b981; }
        .step-labels { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .step-label { font-size: 11px; color: #94a3b8; font-weight: 500; }

        /* Form */
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 13px; font-weight: 600; color: #374151; }
        .form-input-wrap { position: relative; }
        .form-input { width: 100%; padding: 11px 16px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px; font-family: inherit; color: #0f172a; background: #f8fafc; outline: none; transition: all 0.2s; }
        .form-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .form-input::placeholder { color: #94a3b8; }
        .form-input.has-icon { padding-right: 44px; }
        .form-input-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px; cursor: pointer; background: none; border: none; padding: 0; transition: color 0.2s; }
        .form-input-icon:hover { color: #475569; }

        /* Role selector */
        .role-grid { display: flex; flex-direction: column; gap: 8px; }
        .role-btn { padding: 12px 16px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #f8fafc; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; font-family: inherit; transition: all 0.2s; text-align: left; display: flex; align-items: center; justify-content: space-between; }
        .role-btn:hover { border-color: #94a3b8; background: white; }
        .role-btn.selected { border-color: #3b82f6; background: #eff6ff; color: #1d4ed8; }
        .role-btn-left { display: flex; flex-direction: column; gap: 2px; }
        .role-btn-name { font-size: 14px; font-weight: 600; }
        .role-btn-desc { font-size: 11px; font-weight: 500; color: #94a3b8; }
        .role-btn.selected .role-btn-desc { color: #93c5fd; }
        .role-approval-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: #fef3c7; color: #d97706; }
        .role-btn.selected .role-approval-badge { background: rgba(59,130,246,0.15); color: #93c5fd; }

        /* Approval notice */
        .approval-notice { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; }
        .approval-notice-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .approval-notice-text { font-size: 13px; color: #92400e; line-height: 1.5; }
        .approval-notice-text strong { font-weight: 700; }

        /* Password strength */
        .strength-bar-wrap { display: flex; gap: 4px; margin-top: 8px; }
        .strength-bar { flex: 1; height: 3px; border-radius: 2px; background: #f1f5f9; transition: background 0.3s; }
        .strength-label { font-size: 11px; font-weight: 600; margin-top: 4px; }

        /* Terms */
        .form-terms { display: flex; align-items: flex-start; gap: 10px; }
        .form-terms input[type="checkbox"] { width: 16px; height: 16px; accent-color: #3b82f6; cursor: pointer; flex-shrink: 0; margin-top: 2px; }
        .form-terms-text { font-size: 13px; color: #64748b; line-height: 1.5; }
        .form-terms-text a { color: #3b82f6; font-weight: 600; text-decoration: none; }
        .form-terms-text a:hover { text-decoration: underline; }

        /* Error */
        .form-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 13px; font-weight: 500; padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; gap: 8px; }

        /* Buttons */
        .form-submit { width: 100%; padding: 13px; border-radius: 11px; background: #0f172a; color: white; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .form-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,23,42,0.2); }
        .form-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .form-back { width: 100%; padding: 12px; border-radius: 11px; background: transparent; color: #475569; border: 1.5px solid #e2e8f0; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .form-back:hover { border-color: #94a3b8; background: #f8fafc; }

        /* Spinner */
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-login-row { text-align: center; margin-top: 12px; font-size: 13px; color: #64748b; }
        .auth-login-row a { color: #3b82f6; font-weight: 600; text-decoration: none; }
        .auth-login-row a:hover { text-decoration: underline; }

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
          <div className="auth-left-tag">🚀 Free 14-day Trial</div>
          <h2 className="auth-left-title">Start managing your <span>clinic smarter</span></h2>
          <p className="auth-left-sub">Join 2,400+ clinics already using AI Clinic to streamline their practice.</p>
          <div className="auth-checklist">
            {[
              { title: "AI-Powered Insights",  desc: "Real-time suggestions based on patient data" },
              { title: "Smart Scheduling",      desc: "Reduce no-shows by up to 60% automatically" },
              { title: "Instant Billing",       desc: "One-click invoices and insurance tracking" },
              { title: "Full Data Security",    desc: "HIPAA compliant with end-to-end encryption" },
            ].map(item => (
              <div key={item.title} className="auth-check-item">
                <div className="auth-check-icon">✓</div>
                <div className="auth-check-text"><strong>{item.title}</strong><br />{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-left-pills">
          {["No credit card", "14-day free trial", "Cancel anytime"].map(p => (
            <div key={p} className="auth-pill"><div className="auth-pill-dot" /> {p}</div>
          ))}
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="auth-right">
        <div className="auth-form-header">
          <h1 className="auth-form-title">
            {step === 1 ? "Create account ✨" : "Set your password 🔒"}
          </h1>
          <p className="auth-form-sub">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? "active" : "done"}`}>{step > 1 ? "✓" : "1"}</div>
          <div className={`step-line ${step > 1 ? "done" : ""}`} />
          <div className={`step-dot ${step === 2 ? "active" : "idle"}`}>2</div>
        </div>
        <div className="step-labels">
          <span className="step-label">Your Info</span>
          <span className="step-label">Password</span>
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleStep1}>
            {error && <div className="form-error"><span>⚠️</span> {error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Dr. Saqib Aziz"
                value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="doctor@clinic.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <div className="role-grid">
                {ROLES.map(r => (
                  <button key={r.value} type="button"
                    className={`role-btn${role === r.value ? " selected" : ""}`}
                    onClick={() => setRole(r.value)}>
                    <div className="role-btn-left">
                      <span className="role-btn-name">{r.label}</span>
                      <span className="role-btn-desc">{r.desc}</span>
                    </div>
                    {(r.value === "doctor" || r.value === "receptionist") && (
                      <span className="role-approval-badge">⏳ Approval</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Approval notice for doctor/receptionist */}
            {needsApproval && (
              <div className="approval-notice">
                <span className="approval-notice-icon">ℹ️</span>
                <div className="approval-notice-text">
                  <strong>Admin approval required.</strong> After signup, your request will be sent to the admin. Once approved, you will receive an OTP on your email to activate your account.
                </div>
              </div>
            )}

            <button type="submit" className="form-submit">Continue →</button>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="form-error"><span>⚠️</span> {error}</div>}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <input type={showPass ? "text" : "password"} className="form-input has-icon"
                  placeholder="Create a strong password"
                  value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                <button type="button" className="form-input-icon" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {password && (
                <>
                  <div className="strength-bar-wrap">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="strength-bar" style={{ background: i <= strength ? strengthColor : "#f1f5f9" }} />
                    ))}
                  </div>
                  <div className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</div>
                </>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-input-wrap">
                <input type={showConf ? "text" : "password"} className="form-input has-icon"
                  placeholder="Repeat your password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
                <button type="button" className="form-input-icon" onClick={() => setShowConf(!showConf)}>
                  {showConf ? "🙈" : "👁️"}
                </button>
              </div>
              {confirm && (
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: password === confirm ? "#10b981" : "#ef4444" }}>
                  {password === confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
                </div>
              )}
            </div>

            <div className="form-terms">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              <span className="form-terms-text">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </span>
            </div>

            <button type="submit" className="form-submit" disabled={loading}>
              {loading
                ? <><div className="spinner" /> Creating account...</>
                : needsApproval ? "Submit for Approval →" : "Create Account →"
              }
            </button>

            <button type="button" className="form-back" onClick={() => { setStep(1); setError(""); }}>
              ← Back
            </button>
          </form>
        )}

        <div className="auth-login-row">
          Already have an account? <Link href="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}