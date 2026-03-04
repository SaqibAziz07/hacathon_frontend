"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const FEATURES = [
  { icon: "🧠", title: "AI Diagnosis Support", desc: "Smart clinical suggestions based on patient history, symptoms, and lab results in real time." },
  { icon: "📅", title: "Smart Scheduling", desc: "Auto-optimize slots, reduce no-shows with reminders, and manage waitlists effortlessly." },
  { icon: "💳", title: "Billing & Invoicing", desc: "One-click invoice generation, insurance tracking, and real-time revenue analytics." },
  { icon: "📊", title: "Live Analytics", desc: "Track patient flow, revenue trends, and staff KPIs on a beautiful live dashboard." },
  { icon: "🔒", title: "HIPAA Compliant", desc: "End-to-end encryption, role-based access control, and full audit logs." },
  { icon: "🔗", title: "EHR Integrations", desc: "Connect with existing EHR systems, labs, pharmacies, and third-party tools." },
];

const STATS = [
  { value: "1K+", label: "Patients Managed" },
  { value: "300+", label: "Clinics Onboarded" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.5★", label: "Average Rating" },
];

const TESTIMONIALS = [
  { name: "Dr. Sarah", role: "Chief of Medicine, DOW", initials: "SR", color: "#10b981", text: "Medoria transformed how we manage 300+ daily patients. AI insights alone save us hours every week." },
  { name: "Dr. Tahseen Pasha", role: "Clinic Owner, Pasha Clinic", initials: "TP", color: "#6366f1", text: "Billing collections are up 34% and invoices go out automatically. Incredible ROI." },
  { name: "Dr. Saqib", role: "Psychologist Specialist", initials: "SA", color: "#f59e0b", text: "No-shows dropped 60% after automated reminders. The scheduling is pure magic." },
];

const PLANS = [
  { name: "Starter", price: "$49", period: "/mo", desc: "For solo practitioners", features: ["200 patients", "Basic scheduling", "Invoicing", "Email support"], highlight: false },
  { name: "Professional", price: "$129", period: "/mo", desc: "For growing clinics", features: ["Unlimited patients", "AI diagnosis support", "Advanced analytics", "EHR integration", "Priority support"], highlight: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For hospital networks", features: ["Multi-branch", "Custom integrations", "Dedicated manager", "SLA guarantee", "Training"], highlight: false },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTesti, setActiveTesti] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="landing-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        .landing-root { font-family: 'DM Sans', sans-serif; background: #f8fafc; color: #0f172a; overflow-x: hidden; }
        * { box-sizing: border-box; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 40px; transition: all 0.3s; }
        .nav.scrolled { background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-bottom: 1px solid #f1f5f9; box-shadow: 0 1px 20px rgba(0,0,0,0.06); }
        .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 70px; }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-icon { width: 38px; height: 38px; background: #0f172a; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .logo-text { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 21px; color: #0f172a; }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a { color: #475569; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: #0f172a; }
        .nav-btns { display: flex; gap: 10px; }
        .btn-outline { background: transparent; color: #0f172a; border: 1.5px solid #e2e8f0; padding: 9px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-outline:hover { border-color: #94a3b8; background: white; }
        .btn-dark { background: #0f172a; color: white; border: none; padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-dark:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,23,42,0.2); }
        .hero { padding: 150px 40px 100px; max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 72px; flex-wrap: wrap; }
        .hero-left { flex: 1 1 460px; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; color: #059669; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 20px; margin-bottom: 22px; border: 1px solid #bbf7d0; }
        .hero-title { font-family: 'Sora', sans-serif; font-size: clamp(38px, 5vw, 62px); font-weight: 800; line-height: 1.1; margin-bottom: 22px; }
        .gradient-text { background: linear-gradient(135deg, #0f172a 30%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: 18px; color: #64748b; line-height: 1.75; margin-bottom: 36px; max-width: 480px; }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
        .btn-blue { background: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-blue:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(37,99,235,0.3); }
        .hero-trust { display: flex; gap: 24px; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #94a3b8; font-weight: 500; }
        .hero-right { flex: 1 1 380px; }
        .dashboard-card { background: white; border-radius: 24px; padding: 28px; box-shadow: 0 32px 80px rgba(0,0,0,0.11); border: 1px solid #f1f5f9; animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .dc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
        .dc-greeting { font-size: 12px; color: #94a3b8; margin-bottom: 3px; }
        .dc-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 17px; }
        .dc-badge { background: #f0fdf4; color: #16a34a; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 8px; }
        .dc-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
        .dc-stat { background: #f8fafc; border-radius: 12px; padding: 14px; border: 1px solid #f1f5f9; }
        .dc-stat-label { font-size: 11px; color: #94a3b8; font-weight: 500; margin-bottom: 4px; }
        .dc-stat-val { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 22px; margin-bottom: 2px; }
        .dc-stat-sub { font-size: 11px; font-weight: 600; }
        .dc-appts { background: #f8fafc; border-radius: 12px; padding: 14px; border: 1px solid #f1f5f9; }
        .dc-appts-title { font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 12px; }
        .appt-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
        .appt-row:not(:last-child) { border-bottom: 1px solid #f1f5f9; }
        .appt-info { display: flex; align-items: center; gap: 10px; }
        .appt-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #475569; }
        .appt-name { font-size: 13px; font-weight: 600; }
        .appt-meta { font-size: 11px; color: #94a3b8; }
        .appt-status { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px; }
        .stats-bar { background: #0f172a; padding: 60px 40px; }
        .stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 40px; text-align: center; }
        .stat-val { font-family: 'Sora', sans-serif; font-size: 42px; font-weight: 800; color: white; margin-bottom: 6px; }
        .stat-lbl { font-size: 14px; color: #475569; font-weight: 500; }
        .section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
        .section-label { display: inline-block; background: #f0f9ff; color: #0369a1; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 16px; }
        .section-title { font-family: 'Sora', sans-serif; font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .section-sub { font-size: 17px; color: #64748b; max-width: 500px; line-height: 1.7; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px; margin-top: 56px; }
        .feat-card { background: white; border-radius: 16px; padding: 28px; border: 1px solid #f1f5f9; transition: all 0.25s; }
        .feat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.07); border-color: #e2e8f0; }
        .feat-icon { font-size: 32px; margin-bottom: 16px; }
        .feat-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 8px; }
        .feat-desc { font-size: 14px; color: #64748b; line-height: 1.7; }
        .testi-section { background: #f8fafc; padding: 100px 40px; }
        .testi-grid { max-width: 1200px; margin: 56px auto 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px; }
        .testi-card { background: white; border-radius: 20px; padding: 28px; border: 1.5px solid #f1f5f9; transition: all 0.4s; }
        .testi-text { font-size: 15px; color: #334155; line-height: 1.75; margin-bottom: 22px; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; flex-shrink: 0; }
        .testi-name { font-weight: 700; font-size: 14px; }
        .testi-role { font-size: 12px; color: #94a3b8; }
        .pricing-section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
        .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; align-items: start; margin-top: 56px; }
        .plan-card { background: white; border-radius: 20px; padding: 32px; border: 1.5px solid #f1f5f9; transition: all 0.25s; }
        .plan-card:hover:not(.plan-highlight) { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.07); }
        .plan-highlight { background: #0f172a; color: white; border-color: #0f172a; transform: scale(1.04); box-shadow: 0 24px 48px rgba(15,23,42,0.25); }
        .plan-popular { background: #3b82f6; color: white; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; display: inline-block; margin-bottom: 16px; }
        .plan-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 6px; }
        .plan-desc { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .plan-highlight .plan-desc { color: #94a3b8; }
        .plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 28px; }
        .plan-amount { font-family: 'Sora', sans-serif; font-size: 42px; font-weight: 800; }
        .plan-period { font-size: 14px; color: #94a3b8; }
        .plan-highlight .plan-period { color: #64748b; }
        .plan-features { margin-bottom: 28px; }
        .plan-feat { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #475569; padding: 5px 0; }
        .plan-highlight .plan-feat { color: #cbd5e1; }
        .plan-check { color: #16a34a; font-weight: 700; }
        .plan-highlight .plan-check { color: #93c5fd; }
        .plan-btn { width: 100%; padding: 13px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; transition: all 0.2s; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #0f172a; }
        .plan-btn-blue { background: #3b82f6; color: white; border: none; }
        .plan-btn-blue:hover { background: #2563eb; }
        .cta-banner { margin: 0 40px 80px; background: #0f172a; border-radius: 28px; padding: 80px 56px; text-align: center; position: relative; overflow: hidden; }
        .cta-glow1 { position: absolute; top: -80px; right: -80px; width: 320px; height: 320px; background: radial-gradient(circle, rgba(59,130,246,0.15), transparent); border-radius: 50%; pointer-events: none; }
        .cta-glow2 { position: absolute; bottom: -60px; left: -60px; width: 240px; height: 240px; background: radial-gradient(circle, rgba(99,102,241,0.12), transparent); border-radius: 50%; pointer-events: none; }
        .cta-title { font-family: 'Sora', sans-serif; font-size: clamp(28px, 4vw, 48px); font-weight: 800; color: white; margin-bottom: 18px; position: relative; }
        .cta-sub { font-size: 17px; color: #64748b; margin-bottom: 36px; max-width: 480px; margin-left: auto; margin-right: auto; position: relative; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; }
        .btn-ghost-white { background: transparent; color: #94a3b8; border: 1.5px solid #334155; padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .footer { border-top: 1px solid #f1f5f9; padding: 40px; background: white; }
        .footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .footer-links { display: flex; gap: 28px; }
        .footer-links a { color: #64748b; text-decoration: none; font-size: 13px; font-weight: 500; transition: color 0.2s; }
        .footer-links a:hover { color: #0f172a; }
        .footer-copy { font-size: 13px; color: #94a3b8; }
        @media (max-width: 768px) {
          .nav-links, .nav-btns { display: none; }
          .hero { padding: 120px 20px 80px; gap: 40px; }
          .stats-bar, .section, .pricing-section, .testi-section { padding-left: 20px; padding-right: 20px; }
          .cta-banner { margin: 0 20px 60px; padding: 56px 28px; }
          .footer { padding: 32px 20px; }
          .footer-inner { flex-direction: column; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* NAVBAR */}
      <Navbar/>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="badge">✨ AI-Powered Clinic Management</div>
          <h1 className="hero-title">
            The Smarter Way to{" "}
            <span className="gradient-text">Run Your Clinic</span>
          </h1>
          <p className="hero-sub">
            AI Clinic brings AI intelligence to patient management, scheduling, billing, and insights — so you can focus on what matters most: your patients.
          </p>
          <div className="hero-btns">
            <Link href="/signup" className="btn-blue">Start Free Trial →</Link>
            <button className="btn-outline" style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}>Watch Demo ▶</button>
          </div>
          <div className="hero-trust">
            {["No credit card required", "14-day free trial", "Cancel anytime"].map(t => (
              <span key={t} className="trust-item">
                <span style={{ color: "#10b981", fontSize: 15 }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div className="dashboard-card">
            <div className="dc-header">
              <div>
                <div className="dc-greeting">Good Morning,</div>
                <div className="dc-name">Dr. Abdul Qadir👋</div>
              </div>
              <div className="dc-badge">Today: 24 Appts</div>
            </div>
            <div className="dc-stats">
              {[
                { label: "Total Patients", val: "128", sub: "+12% this week", color: "#10b981" },
                { label: "Revenue", val: "$4,501", sub: "90% of target", color: "#6366f1" },
                { label: "Pending", val: "5", sub: "appointments", color: "#f59e0b" },
                { label: "Invoices", val: "7", sub: "$720 unpaid", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} className="dc-stat">
                  <div className="dc-stat-label">{s.label}</div>
                  <div className="dc-stat-val">{s.val}</div>
                  <div className="dc-stat-sub" style={{ color: s.color }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="dc-appts">
              <div className="dc-appts-title">Next Appointments</div>
              {[
                { name: "Hamid Raza", time: "10:00 AM", doc: "Dr. Sarah", status: "Pending", sc: "#f59e0b" },
                { name: "Salman Khan", time: "11:00 AM", doc: "Dr. Budok", status: "Confirmed", sc: "#10b981" },
              ].map(a => (
                <div key={a.name} className="appt-row">
                  <div className="appt-info">
                    <div className="appt-avatar">{a.name[0]}</div>
                    <div>
                      <div className="appt-name">{a.name}</div>
                      <div className="appt-meta">{a.time} · {a.doc}</div>
                    </div>
                  </div>
                  <span className="appt-status" style={{ color: a.sc, background: a.sc + "18" }}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-inner">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <div style={{ textAlign: "center" }}>
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything Your Clinic Needs</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>From AI-assisted clinical decisions to automated billing — one platform, complete control.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <div className="testi-section">
        <div style={{ textAlign: "center", maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">Trusted by Clinicians Worldwide</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="testi-card" style={{
              borderColor: activeTesti === i ? t.color + "55" : "#f1f5f9",
              boxShadow: activeTesti === i ? `0 16px 40px ${t.color}18` : "none"
            }}>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.color }}>{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div style={{ textAlign: "center" }}>
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>No hidden fees. No surprises. Cancel anytime.</p>
        </div>
        <div className="plans-grid">
          {PLANS.map(p => (
            <div key={p.name} className={`plan-card ${p.highlight ? "plan-highlight" : ""}`}>
              {p.highlight && <div className="plan-popular">MOST POPULAR</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-desc">{p.desc}</div>
              <div className="plan-price">
                <span className="plan-amount">{p.price}</span>
                <span className="plan-period">{p.period}</span>
              </div>
              <div className="plan-features">
                {p.features.map(f => (
                  <div key={f} className="plan-feat">
                    <span className="plan-check">✓</span> {f}
                  </div>
                ))}
              </div>
              <button className={`plan-btn ${p.highlight ? "plan-btn-blue" : ""}`}>
                {p.highlight ? "Start Free Trial" : p.price === "Custom" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <div className="cta-glow1" />
        <div className="cta-glow2" />
        <h2 className="cta-title">Ready to Transform Your Clinic?</h2>
        <p className="cta-sub">Join 2,400+ healthcare professionals who trust Medoria to run their practice smarter.</p>
        <div className="cta-btns">
          <Link href="/signup" className="btn-blue" style={{ padding: "15px 36px", fontSize: 15, borderRadius: 12 }}>Start Free Trial →</Link>
          <button className="btn-ghost-white">Schedule a Demo</button>
        </div>
      </div>

      {/* FOOTER */}
      <Footer/>
    </div>
  );
}