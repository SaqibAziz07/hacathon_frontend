"use client";

import { useAuth } from "@/context/AuthContext";
import {
  LogOut, Activity, Calendar, FileText,
  BarChart2, Users, CreditCard, Shield, Link2, Settings,
  LayoutDashboard, Bell, UserPlus, ClipboardList, Brain, User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getNavigation = (role: string) => {
  if (role === "admin") return [
    { name: "Dashboard",    href: "/dashboard/admin",        icon: LayoutDashboard },
    { name: "Doctors",      href: "/dashboard/admin/doctors",     icon: Users       },
    { name: "Patients",     href: "/dashboard/admin/patients",    icon: UserPlus    },
    { name: "Appointments", href: "/dashboard/admin/appointments",icon: Calendar    },
    { name: "Analytics",    href: "/dashboard/admin/analytics",   icon: BarChart2   },
    { name: "Sttings",    href: "/dashboard/admin/settings",   icon: Settings   },
    { name: "Subscription", href: "/dashboard/admin/subscription",icon: CreditCard  },
  ];
  if (role === "doctor") return [
    { name: "Dashboard",    href: "/dashboard/doctor",             icon: LayoutDashboard },
    { name: "Appointments", href: "/dashboard/doctor/appointments",icon: Calendar        },
    { name: "Patients",     href: "/dashboard/doctor/patients",    icon: Users           },
    { name: "Prescriptions",href: "/dashboard/doctor/prescriptions",icon: FileText       },
    { name: "AI Tools",     href: "/dashboard/doctor/ai",         icon: Brain           },
    { name: "Analytics",    href: "/dashboard/doctor/analytics",  icon: BarChart2       },
  ];
  if (role === "receptionist") return [
    { name: "Dashboard",    href: "/dashboard/receptionist",             icon: LayoutDashboard },
    { name: "Patients",     href: "/dashboard/receptionist/patients",    icon: UserPlus        },
    { name: "Appointments", href: "/dashboard/receptionist/appointments",icon: Calendar        },
    { name: "Schedule",     href: "/dashboard/receptionist/schedule",    icon: ClipboardList   },
  ];
  if (role === "patient") return [
    { name: "Dashboard",     href: "/dashboard/patient/dashboard",     icon: LayoutDashboard },
    { name: "Appointments",  href: "/dashboard/patient/appointments",  icon: Calendar        },
    { name: "Prescriptions", href: "/dashboard/patient/prescriptions", icon: FileText        },
    { name: "Profile",       href: "/dashboard/patient/profile",       icon: User            },
  ];
  return [];
};

const SETTING_NAV = [
  { name: "Security",     href: "#", icon: Shield   },
  { name: "Integrations", href: "#", icon: Link2    },
  { name: "General",      href: "#", icon: Settings },
];

const roleColors: Record<string, string> = {
  admin:        'bg-violet-500',
  doctor:       'bg-cyan-500',
  receptionist: 'bg-emerald-500',
  patient:      'bg-blue-500',
}

function NavItem({ href, icon: Icon, label, active, onClick }: {
  href: string; icon: any; label: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}>
      <Icon size={17} />
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading, getDashboardPath } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && user && pathname.startsWith("/dashboard")) {
      const correctRoot = getDashboardPath(user.role);
      const onOwnArea =
        pathname === "/dashboard" ||
        pathname === correctRoot ||
        pathname.startsWith(`${correctRoot}/`);
      if (!onOwnArea) router.replace(correctRoot);
    }
  }, [getDashboardPath, loading, pathname, router, user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <p className="text-sm text-gray-500">Redirecting to login…</p>
    </div>
  );

  const navigation = getNavigation(user.role);
  const initials   = user.name?.charAt(0).toUpperCase() ?? "U";
  const avatarColor = roleColors[user.role] ?? 'bg-gray-500';

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`flex flex-col h-full bg-white border-r border-gray-100 ${mobile ? "w-full" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
          <Activity size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">CliniqAI</span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Menu</p>
          <div className="space-y-0.5">
            {navigation.map((item) => (
              <NavItem key={item.name} href={item.href} icon={item.icon} label={item.name}
                active={pathname === item.href || pathname.startsWith(item.href + '/')}
                onClick={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Setting</p>
          <div className="space-y-0.5">
            {SETTING_NAV.map((item) => (
              <NavItem key={item.name} href={item.href} icon={item.icon} label={item.name}
                active={pathname === item.href} />
            ))}
          </div>
        </div>
      </div>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
          {user.subscriptionPlan === "pro" && (
            <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">PRO</span>
          )}
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all">
          <LogOut size={17} /> Log Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 z-30">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 flex flex-col shadow-xl"><SidebarContent mobile /></div>
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <Activity size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">CliniqAI</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <Bell size={16} />
            </button>
            <button onClick={() => setMobileOpen(true)}
              className={`w-9 h-9 rounded-xl ${avatarColor} flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{initials}</span>
            </button>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}