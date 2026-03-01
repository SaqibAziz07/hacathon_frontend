"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User, LogIn, UserPlus, Home, LayoutDashboard, Info } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    setIsLoggedIn(!!token);
    
    if (userData) {
      try {
        setUser(JSON.parse(userData) as User);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const isActive = (path: string): boolean => {
    if (!mounted) return false;
    return pathname === path;
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900 border-b border-gray-800">
      {/* Animated gradient border effect */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2 group relative" onClick={closeMobileMenu}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/30 transition"></div>
              <span className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🤖 AI
              </span>
            </div>
            <span className="text-gray-300 font-semibold text-sm md:text-base group-hover:text-white transition">
              Assistant
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              href="/" 
              className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/') 
                  ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </span>
              {isActive('/') && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              )}
            </Link>
            
            <Link 
              href="/dashboard" 
              className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/dashboard') 
                  ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </span>
              {isActive('/dashboard') && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              )}
            </Link>
            
            <Link 
              href="/about" 
              className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/about') 
                  ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>About</span>
              </span>
              {isActive('/about') && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              )}
            </Link>
          </div>

          {/* Auth Buttons - Right */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">
                    {user?.username || 'User'}
                  </span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all duration-300 group"
                >
                  <LogOut className="h-4 w-4 group-hover:rotate-12 transition" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                
                <Link 
                  href="/signup" 
                  className="relative group px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-600/25"
                >
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition"></span>
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 border border-gray-700 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute left-0 right-0 bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900 border-t border-gray-800 shadow-2xl transition-all duration-300 transform ${
        mobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-2 opacity-0 invisible pointer-events-none'
      }`}>
        <div className="p-4 space-y-3">
          {/* User Info for Mobile */}
          {isLoggedIn && user && (
            <div className="p-4 rounded-xl bg-white/5 border border-gray-700 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <Link 
            href="/" 
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive('/') 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Home</span>
            {isActive('/') && (
              <span className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
            )}
          </Link>

          <Link 
            href="/dashboard" 
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive('/dashboard') 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
            {isActive('/dashboard') && (
              <span className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
            )}
          </Link>

          <Link 
            href="/about" 
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive('/about') 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="h-5 w-5" />
            <span className="font-medium">About</span>
            {isActive('/about') && (
              <span className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
            )}
          </Link>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"></div>

          {/* Auth Buttons for Mobile */}
          {isLoggedIn ? (
            <button 
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/login" 
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              
              <Link 
                href="/signup" 
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <UserPlus className="h-5 w-5" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}