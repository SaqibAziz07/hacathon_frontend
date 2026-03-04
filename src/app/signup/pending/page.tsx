// src/app/signup/pending/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function PendingContent() {
  const params    = useSearchParams();
  const email     = params.get("email") || "";
  const role      = params.get("role")  || "";
  const roleLabel = role === "doctor" ? "Doctor" : "Receptionist";

  return (
    <div className="pending-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pending-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; background: #0f172a; position: relative; overflow: hidden; padding: 24px; }
        .pg-glow1 { position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(59,130,246,0.12), transparent); border-radius: 50%; pointer-events: none; }
        .pg-glow2 { position: absolute; bottom: -100px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(99,102,241,0.10), transparent); border-radius: 50%; pointer-events: none; }
        .pending-card { position: relative; z-index: 1; background: #1e293b; border: 1px solid #334155; border-radius: 24px; padding: 48px 40px; max-width: 520px; width: 100%; text-align: center; animation: fadeUp 0.6s ease forwards; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .pending-icon-wrap { width: 80px; height: 80px; border-radius: 50%; background: rgba(245,158,11,0.1); border: 2px solid rgba(245,158,11,0.25); display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 24px; animation: pulse 2.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.2)} 50%{box-shadow:0 0 0 16px rgba(245,158,11,0)} }
        .pending-title { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: white; margin-bottom: 12px; }
        .pending-sub { font-size: 15px; color: #64748b; line-height: 1.7; margin-bottom: 28px; }
        .pending-sub strong { color: #94a3b8; font-weight: 600; }
        .pending-email-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25); border-radius: 10px; padding: 10px 18px; font-size: 14px; font-weight: 600; color: #93c5fd; margin-bottom: 32px; }
        .pending-steps { display: flex; flex-direction: column; gap: 0; margin-bottom: 36px; text-align: left; }
        .pending-step { display: flex; gap: 16px; align-items: flex-start; position: relative; }
        .pending-step:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 32px; width: 2px; height: calc(100% - 8px); background: #334155; }
        .pending-step-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; position: relative; z-index: 1; margin-bottom: 20px; }
        .step-done    { background: #10b981; color: white; }
        .step-active  { background: #f59e0b; color: white; }
        .step-waiting { background: #1e293b; color: #475569; border: 2px solid #334155; }
        .pending-step-text { padding-top: 6px; }
        .pending-step-title { font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 3px; }
        .pending-step-desc  { font-size: 13px; color: #64748b; line-height: 1.5; }
        .pending-status { display: inline-flex; align-items: center; gap: 8px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #fcd34d; margin-bottom: 28px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; animation: blink 1.5s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .btn-dark { width: 100%; padding: 13px; border-radius: 11px; background: #0f172a; color: white; border: 1px solid #334155; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-dark:hover { background: #1e293b; border-color: #475569; }
        .btn-ghost { width: 100%; padding: 12px; border-radius: 11px; background: transparent; color: #64748b; border: 1.5px solid #334155; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; justify-content: center; margin-top: 10px; }
        .btn-ghost:hover { color: #94a3b8; border-color: #475569; }
        .pending-note { margin-top: 24px; font-size: 12px; color: #475569; line-height: 1.6; }
        .pending-note a { color: #64748b; text-decoration: underline; }
        @media (max-width: 480px) { .pending-card { padding: 36px 24px; } }
      `}</style>

      <div className="pg-glow1" />
      <div className="pg-glow2" />

      <div className="pending-card">
        {/* Logo */}
        <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, textDecoration:"none", marginBottom:32 }}>
          <div style={{ width:32, height:32, background:"white", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🏥</div>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:17, color:"white" }}>AI Clinic</span>
        </Link>

        <div className="pending-icon-wrap">⏳</div>
        <h1 className="pending-title">Request Submitted!</h1>
        <p className="pending-sub">
          Your <strong>{roleLabel}</strong> account request has been received.<br />
          Our admin will review and approve your request shortly.
        </p>

        <div className="pending-email-pill">📧 {email || "your email"}</div>

        <div className="pending-status">
          <div className="status-dot" /> Waiting for admin approval
        </div>

        <div className="pending-steps">
          {[
            { num:"✓", cls:"step-done",    title:"Account Created",    desc:"Your details have been saved successfully." },
            { num:"2", cls:"step-active",  title:"Admin Review",       desc:"Admin will review your request and approve it." },
            { num:"3", cls:"step-waiting", title:"OTP Sent to Email",  desc:"Once approved, an OTP will be sent to your email." },
            { num:"4", cls:"step-waiting", title:"Account Activated",  desc:"Enter the OTP to fully activate your account." },
          ].map((s, i) => (
            <div key={i} className="pending-step">
              <div className={`pending-step-num ${s.cls}`}>{s.num}</div>
              <div className="pending-step-text">
                <div className="pending-step-title">{s.title}</div>
                <div className="pending-step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Link href={`/signup/verify-otp?email=${encodeURIComponent(email)}`} className="btn-dark">
          I have my OTP → Enter it here
        </Link>
        <Link href="/" className="btn-ghost">Back to Home</Link>

        <p className="pending-note">
          Didn't get an email after approval? <a href="#">Contact support</a> or check your spam folder.
        </p>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", background:"#0f172a" }} />}>
      <PendingContent />
    </Suspense>
  );
}