"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function OTPContent() {
  const router  = useRouter();
  const params  = useSearchParams();
  const email   = params.get("email") || "";

  const [otp, setOtp]               = useState(["","","","","",""]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(false);
  const [resending, setResending]   = useState(false);
  const [resendMsg, setResendMsg]   = useState("");
  const [countdown, setCountdown]   = useState(60);
  const [canResend, setCanResend]   = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5 && newOtp.every(d => d !== "")) handleVerify(newOtp.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((d,i) => { if(i<6) newOtp[i]=d; });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex(d => d==="");
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    if (pasted.length === 6) handleVerify(pasted);
  };

  const handleVerify = async (code?: string) => {
    const finalOtp = code || otp.join("");
    if (finalOtp.length < 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid OTP.");
        setOtp(["","","","","",""]); inputRefs.current[0]?.focus();
        setLoading(false); return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch { setError("Server error."); setLoading(false); }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true); setResendMsg(""); setError("");
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to resend."); }
      else {
        setResendMsg("OTP resent! Check your inbox.");
        setCountdown(60); setCanResend(false);
        setOtp(["","","","","",""]); inputRefs.current[0]?.focus();
      }
    } catch { setError("Server error."); }
    setResending(false);
  };

  if (success) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:24, padding:"56px 40px", maxWidth:440, width:"100%", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(16,185,129,0.15)", border:"2px solid rgba(16,185,129,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px" }}>✅</div>
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, color:"white", marginBottom:12 }}>Account Verified!</h1>
        <p style={{ fontSize:15, color:"#64748b", lineHeight:1.7 }}>Your account is activated.<br/>Redirecting to <strong style={{color:"#94a3b8"}}>login</strong>...</p>
        <div style={{ marginTop:28, height:3, background:"#334155", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"#10b981", borderRadius:2, animation:"fill 2.5s linear forwards" }} />
        </div>
        <style>{`@keyframes fill{from{width:0}to{width:100%}}`}</style>
      </div>
    </div>
  );

  return (
    <div className="otp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .otp-root{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;background:#0f172a;position:relative;overflow:hidden;padding:24px}
        .otp-glow1{position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(59,130,246,0.12),transparent);border-radius:50%;pointer-events:none}
        .otp-glow2{position:absolute;bottom:-100px;left:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,0.10),transparent);border-radius:50%;pointer-events:none}
        .otp-card{position:relative;z-index:1;background:#1e293b;border:1px solid #334155;border-radius:24px;padding:48px 40px;max-width:460px;width:100%;text-align:center;animation:fadeUp 0.6s ease forwards}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .otp-icon{width:72px;height:72px;border-radius:50%;background:rgba(59,130,246,0.1);border:2px solid rgba(59,130,246,0.25);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 22px}
        .otp-title{font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:white;margin-bottom:10px}
        .otp-sub{font-size:14px;color:#64748b;line-height:1.7;margin-bottom:8px}
        .otp-email-pill{display:inline-block;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:6px 14px;font-size:13px;font-weight:600;color:#93c5fd;margin-bottom:32px}
        .otp-inputs{display:flex;gap:10px;justify-content:center;margin-bottom:24px}
        .otp-input{width:52px;height:60px;border-radius:12px;border:2px solid #334155;background:#0f172a;font-size:24px;font-weight:700;color:white;text-align:center;font-family:'Sora',sans-serif;outline:none;transition:all 0.2s;caret-color:#3b82f6}
        .otp-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.15)}
        .otp-input.filled{border-color:#3b82f6;color:#60a5fa}
        .otp-input.err{border-color:#ef4444;animation:shake 0.4s ease}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
        .otp-error{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;font-size:13px;font-weight:500;padding:10px 14px;border-radius:8px;display:flex;align-items:center;gap:8px;margin-bottom:16px;text-align:left}
        .otp-success-msg{background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-size:13px;padding:10px 14px;border-radius:8px;margin-bottom:16px}
        .otp-btn{width:100%;padding:14px;border-radius:12px;background:#0f172a;color:white;border:none;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px}
        .otp-btn:hover:not(:disabled){background:#1e293b;transform:translateY(-1px);box-shadow:0 8px 24px rgba(15,23,42,0.3)}
        .otp-btn:disabled{opacity:0.6;cursor:not-allowed}
        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .otp-resend-row{font-size:13px;color:#64748b;margin-bottom:24px}
        .resend-btn{background:none;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;padding:0;transition:color 0.2s}
        .resend-active{color:#3b82f6}.resend-active:hover{color:#2563eb}
        .resend-inactive{color:#475569;cursor:not-allowed}
        .resend-count{font-weight:600;color:#f59e0b}
        .otp-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#64748b;text-decoration:none;transition:color 0.2s}
        .otp-back:hover{color:#94a3b8}
        @media(max-width:480px){.otp-card{padding:36px 20px}.otp-input{width:44px;height:54px;font-size:20px}.otp-inputs{gap:8px}}
      `}</style>

      <div className="otp-glow1"/><div className="otp-glow2"/>

      <div className="otp-card">
        <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none",marginBottom:28}}>
          <div style={{width:32,height:32,background:"white",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏥</div>
          <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:17,color:"white"}}>AI Clinic</span>
        </Link>

        <div className="otp-icon">📬</div>
        <h1 className="otp-title">Check your email</h1>
        <p className="otp-sub">We sent a 6-digit OTP to</p>
        <div className="otp-email-pill">{email || "your email"}</div>

        {error     && <div className="otp-error"><span>⚠️</span>{error}</div>}
        {resendMsg && <div className="otp-success-msg">✅ {resendMsg}</div>}

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={el=>{inputRefs.current[i]=el}}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              className={`otp-input${digit?" filled":""}${error?" err":""}`}
              onChange={e=>handleChange(i,e.target.value)}
              onKeyDown={e=>handleKeyDown(i,e)}
            />
          ))}
        </div>

        <button className="otp-btn" onClick={()=>handleVerify()} disabled={loading||otp.some(d=>d==="")}>
          {loading ? <><div className="spinner"/>Verifying...</> : "Verify OTP →"}
        </button>

        <div className="otp-resend-row">
          Didn't receive it?{" "}
          {canResend
            ? <button className="resend-btn resend-active" onClick={handleResend} disabled={resending}>{resending?"Resending...":"Resend OTP"}</button>
            : <span>Resend in <span className="resend-count">{countdown}s</span></span>
          }
        </div>

        <Link href="/login" className="otp-back">← Back to login</Link>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",background:"#0f172a"}}/>}>
      <OTPContent />
    </Suspense>
  );
}