"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, Activity, User, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // AuthContext redirect handles this
  }

  const getNavigation = (role: string) => {
    const baseNav = [];
    
    if (role === 'admin') {
      baseNav.push(
        { name: 'Analytics Setup', href: '/dashboard/admin', icon: Activity }
      );
    } else if (role === 'doctor') {
      baseNav.push(
        { name: 'My Schedule', href: '/dashboard/doctor', icon: Calendar },
        { name: 'AI Tools', href: '/dashboard/doctor/ai', icon: Activity }
      );
    } else if (role === 'receptionist') {
      baseNav.push(
        { name: 'Overview', href: '/dashboard/receptionist', icon: Activity }
      );
    } else if (role === 'patient') {
      baseNav.push(
        { name: 'My Overview', href: '/dashboard/patient', icon: User },
        { name: 'Book Appointment', href: '/dashboard/patient/appointments', icon: Calendar }
      );
    }
    
    return baseNav;
  };

  const navigation = getNavigation(user.role);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 text-white bg-slate-900 border-r border-gray-800">
        <div className="flex px-4 py-5 items-center justify-center border-b border-gray-800">
          <Activity className="h-8 w-8 text-blue-500 mr-2" />
          <span className="text-xl font-bold font-sans tracking-tight">Smart Clinic</span>
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 relative rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                {user.subscriptionPlan === 'pro' && (
                  <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-300 text-yellow-900">
                    PRO
                  </span>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
          <button
            onClick={logout}
            className="flex-shrink-0 w-full group block flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="text-gray-400 group-hover:text-white mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        {/* Mobile Header (simplified for brevity) */}
        <div className="md:hidden flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-gray-800">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-lg font-bold text-white tracking-tight">Smart Clinic</span>
          </div>
          <button onClick={logout} className="text-gray-300 hover:text-white">
            <LogOut className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
