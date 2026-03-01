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
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
  ];

  const supportLinks = [
    { href: '/faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4" /> },
    { href: '/contact', label: 'Contact', icon: <Mail className="h-4 w-4" /> },
    { href: '/privacy', label: 'Privacy Policy', icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900 text-white mt-auto border-t border-gray-800">
      {/* Animated gradient border at top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🤖 AI
              </span>
              <span className="text-white font-semibold text-lg">Assistant</span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Your intelligent companion for all your questions and tasks. 
              Powered by cutting-edge AI technology to help you work smarter.
            </p>
            
            {/* Stats Badge */}
            <div className="flex items-center gap-2 pt-2">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                <span className="text-xs text-blue-400">✨ 10k+ Users</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                <span className="text-xs text-purple-400">🚀 24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <span className="text-blue-400 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <span className="text-purple-400 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Connect
            </h4>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-xl bg-white/5 border border-gray-700 hover:border-blue-500/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={link.label}
                >
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition"></span>
                  {link.icon}
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Subscribe to our newsletter</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-l-xl focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-xl hover:from-blue-700 hover:to-purple-700 transition text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} AI Assistant. All rights reserved.
              <span className="block sm:inline sm:ml-2 text-gray-500">
                Made with ❤️ by Saqib
              </span>
            </p>

            {/* Bottom Links */}
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-gray-400 hover:text-white transition">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition">
                Cookies
              </Link>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">🌐</span>
              <select className="bg-white/5 border border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}