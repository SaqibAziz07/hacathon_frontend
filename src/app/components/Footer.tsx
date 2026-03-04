// src/app/components/Footer.tsx
import Link from "next/link";
import React from 'react';
import { Home, LayoutDashboard, Info, HelpCircle, Mail, Shield, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export default function Footer(): React.ReactElement {

  const socialLinks: SocialLink[] = [
    { icon: <Facebook className="h-5 w-5" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { href: '/',         label: 'Home',      icon: <Home className="h-4 w-4" /> },
    { href: '/dashboard',label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '#about',    label: 'About',     icon: <Info className="h-4 w-4" /> },
  ];

  const supportLinks = [
    { href: '#',        label: 'FAQ',            icon: <HelpCircle className="h-4 w-4" /> },
    { href: '#contact', label: 'Contact',         icon: <Mail className="h-4 w-4" /> },
    { href: '#',        label: 'Privacy Policy',  icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <footer className="relative bg-linear-to-br from-gray-900 via-[#0f172a] to-gray-900 text-white mt-auto border-t border-gray-800">

      {/* Animated top divider — matches CTA banner */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent" />

      {/* Glow blobs — same as CTA banner */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* ── Company Info ── */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-xl">
                🏥
              </div>
              <span className="font-bold text-xl bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                AI Clinic
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              The all-in-one AI-powered platform for modern clinics — patient management, smart scheduling, billing, and clinical insights in one place.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <div className="px-3 py-1 rounded-full bg-linear-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30">
                <span className="text-xs text-blue-400">🔒 HIPAA Compliant</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-linear-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30">
                <span className="text-xs text-indigo-400">⭐ SOC 2 Certified</span>
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <span className="text-blue-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span>{link.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Support ── */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300">
                    <span className="text-indigo-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span>{link.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect ── */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Connect
            </h4>

            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                  aria-label={link.label}
                  className="group relative w-10 h-10 rounded-xl bg-white/5 border border-gray-700 hover:border-blue-500/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <span className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition" />
                  {link.icon}
                </a>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-400">Stay updated with clinic news</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-l-xl focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-500"
                />
                <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-r-xl hover:from-blue-700 hover:to-indigo-700 transition text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} AI Clinic. All rights reserved.
              <span className="block sm:inline sm:ml-2 text-gray-500">
                Made with ❤️ by Saqib Aziz
              </span>
            </p>

            <div className="flex gap-6 text-sm">
              {["Terms", "Privacy", "Security", "Cookies"].map(l => (
                <Link key={l} href="#" className="text-gray-400 hover:text-white transition">{l}</Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">🌐</span>
              <select className="bg-white/5 border border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="ar">Arabic</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}