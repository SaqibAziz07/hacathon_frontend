"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "About",    href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Pricing",  href: "#pricing" },
  { label: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 40px;
          transition: all 0.3s;
          font-family: 'DM Sans', sans-serif;
        }
        .navbar.scrolled {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid #f1f5f9;
          box-shadow: 0 1px 24px rgba(0,0,0,0.06);
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        /* LOGO */
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon {
          width: 38px; height: 38px; background: #0f172a; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
          transition: transform 0.2s;
        }
        .nav-logo:hover .nav-logo-icon { transform: rotate(-6deg) scale(1.05); }
        .nav-logo-text {
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 21px; color: #0f172a;
        }

        /* DESKTOP LINKS */
        .nav-links { display: flex; gap: 4px; list-style: none; }
        .nav-links a {
          color: #475569; text-decoration: none; font-size: 14px; font-weight: 500;
          padding: 7px 14px; border-radius: 8px; transition: all 0.2s;
        }
        .nav-links a:hover { color: #0f172a; background: #f1f5f9; }

        /* BUTTONS */
        .nav-actions { display: flex; gap: 10px; align-items: center; }
        .nav-btn-outline {
          background: transparent; color: #0f172a; border: 1.5px solid #e2e8f0;
          padding: 9px 20px; border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none;
          display: inline-flex; align-items: center;
        }
        .nav-btn-outline:hover { border-color: #94a3b8; background: white; }
        .nav-btn-dark {
          background: #0f172a; color: white; border: none;
          padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .nav-btn-dark:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }

        /* HAMBURGER */
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 6px;
        }
        .ham-line {
          width: 24px; height: 2px; background: #0f172a; border-radius: 2px; transition: all 0.3s;
        }
        .nav-hamburger.open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* MOBILE MENU */
        .mobile-menu {
          display: none;
          position: fixed; top: 70px; left: 0; right: 0; z-index: 99;
          background: white; border-bottom: 1px solid #f1f5f9;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          padding: 20px 24px 24px;
          flex-direction: column; gap: 6px;
          animation: slideDown 0.25s ease;
        }
        .mobile-menu.open { display: flex; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu a {
          color: #334155; text-decoration: none; font-size: 15px; font-weight: 500;
          padding: 11px 14px; border-radius: 10px; transition: background 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .mobile-menu a:hover { background: #f8fafc; }
        .mobile-divider { height: 1px; background: #f1f5f9; margin: 8px 0; }
        .mobile-auth { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
        .mobile-btn-outline {
          text-align: center; padding: 12px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          font-size: 14px; font-weight: 600; color: #0f172a; text-decoration: none;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .mobile-btn-outline:hover { background: #f8fafc; }
        .mobile-btn-dark {
          text-align: center; padding: 12px; border-radius: 10px; background: #0f172a;
          font-size: 14px; font-weight: 600; color: white; text-decoration: none;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .mobile-btn-dark:hover { background: #1e293b; }

        @media (max-width: 768px) {
          .navbar { padding: 0 20px; }
          .nav-links, .nav-actions { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          {/* LOGO */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">🏥</div>
            <span className="nav-logo-text">AI Clinic</span>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          {/* DESKTOP BUTTONS */}
          <div className="nav-actions">
            <Link href="/login"  className="nav-btn-outline">Log In</Link>
            <Link href="/signup" className="nav-btn-dark">Get Started →</Link>
          </div>

          {/* HAMBURGER */}
          <button
            className={`nav-hamburger${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}>
            {l.label}
          </a>
        ))}
        <div className="mobile-divider" />
        <div className="mobile-auth">
          <Link href="/login"  className="mobile-btn-outline">Log In</Link>
          <Link href="/signup" className="mobile-btn-dark">Get Started →</Link>
        </div>
      </div>
    </>
  );
}