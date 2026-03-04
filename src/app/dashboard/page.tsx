"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, Search, Plus, ChevronLeft, ChevronRight,
  Stethoscope, Clock, MoreHorizontal, TrendingUp,
  Lightbulb, BarChart2, Calendar,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Stats {
  totalPatients:    number;
  appointments:     number;
  pendingAppt:      number;
  cancelledAppt:    number;
  revenue:          string;
  targetPercent:    number;
  pendingInvoices:  number;
  unpaidAmount:     string;
}

interface Appointment {
  id:       number;
  name:     string;
  initials: string;
  color:    string;
  doctor:   string;
  time:     string;
  status:   "Pending" | "Confirmed" | "Cancelled";
}

interface Patient {
  id:      string;
  name:    string;
  initials:string;
  color:   string;
  dob:     string;
  age:     number;
  contact: string;
  status:  "Active" | "Inactive";
}

// ─── Static Data ───────────────────────────────────────────────────────────
const APPOINTMENTS: Appointment[] = [
  { id: 1, name: "Lila Maris",      initials: "LM", color: "#a29bfe", doctor: "Dr. Sarah Saraswati", time: "10:00 AM", status: "Pending"   },
  { id: 2, name: "Ridan Syahputra", initials: "RS", color: "#74b9ff", doctor: "Dr. Budok Baiq",      time: "11:00 AM", status: "Confirmed" },
  { id: 3, name: "Lara Amira",      initials: "LA", color: "#fd79a8", doctor: "Dr. Budi Santoso",    time: "01:30 PM", status: "Confirmed" },
  { id: 4, name: "Ole Romeny",      initials: "OR", color: "#55efc4", doctor: "Dr. Tom Haye",        time: "01:00 PM", status: "Cancelled" },
];

const PATIENTS: Patient[] = [
  { id: "#PP00123D", name: "Mira Alviana", initials: "MA", color: "#fd79a8", dob: "03/15/2006", age: 19, contact: "(738)-331-345", status: "Active"   },
  { id: "#PP00124D", name: "Sari Indah",   initials: "SI", color: "#a29bfe", dob: "07/22/2003", age: 22, contact: "(738)-333-246", status: "Active"   },
  { id: "#PP00125D", name: "Budi Santoso", initials: "BS", color: "#74b9ff", dob: "01/10/1990", age: 34, contact: "(738)-444-111", status: "Active"   },
  { id: "#PP00126D", name: "Rina Marlina", initials: "RM", color: "#55efc4", dob: "05/30/1998", age: 26, contact: "(738)-555-222", status: "Inactive" },
];

const DATES = [1, 2, 3, 4, 5, 6, 7];

const STATUS_MAP = {
  Pending:   { text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200"  },
  Confirmed: { text: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200"},
  Cancelled: { text: "text-red-500",    bg: "bg-red-50",    border: "border-red-200"    },
  Active:    { text: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200"},
  Inactive:  { text: "text-gray-500",   bg: "bg-gray-100",  border: "border-gray-200"  },
};

// ─── Small components ──────────────────────────────────────────────────────
function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function Badge({ label }: { label: keyof typeof STATUS_MAP }) {
  const s = STATUS_MAP[label];
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${s.text} ${s.bg} ${s.border}`}>
      {label}
    </span>
  );
}

function StatCard({
  title, main, mainLabel, tag1, tag1Color, tag2, tag2Color,
}: {
  title: string; main: string; mainLabel?: string;
  tag1?: string; tag1Color?: string; tag2?: string; tag2Color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 flex-1 min-w-0 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</span>
        <button className="text-gray-300 hover:text-gray-500">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{main}</span>
        {mainLabel && <span className="text-sm font-medium text-gray-400">{mainLabel}</span>}
      </div>
      <div className="flex items-center gap-3 text-xs">
        {tag1 && <span style={{ color: tag1Color ?? "#aaa" }}>{tag1}</span>}
        {tag2 && <span className="font-semibold" style={{ color: tag2Color ?? "#aaa" }}>{tag2}</span>}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeDate, setActiveDate] = useState(3);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    // Replace with real API calls
    setTimeout(() => {
      setStats({
        totalPatients:   128,
        appointments:    24,
        pendingAppt:     5,
        cancelledAppt:   2,
        revenue:         "$4,501.80",
        targetPercent:   90,
        pendingInvoices: 7,
        unpaidAmount:    "$720.29",
      });
      setLoading(false);
    }, 600);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f6fa]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4 md:p-7 space-y-6">

      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {greeting}, <span className="text-gray-700">Admin!</span>
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400 shadow-sm w-52">
            <Search size={14} />
            <span>Search…</span>
            <span className="ml-auto bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </div>
          {/* Bell */}
          <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <Bell size={16} />
          </button>
          {/* Add Patient */}
          <Link
            href="/dashboard/patient/new"
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus size={15} />
            Add Patient
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          main={String(stats!.totalPatients)}
          mainLabel="Patients"
          tag1="Last Week"
          tag2="+12%"
          tag2Color="#00b894"
        />
        <StatCard
          title="Appointments Today"
          main={String(stats!.appointments)}
          mainLabel="Appointments"
          tag1={`${stats!.pendingAppt} pending`}
          tag1Color="#f39c12"
          tag2={`${stats!.cancelledAppt} cancelled`}
          tag2Color="#e17055"
        />
        <StatCard
          title="Revenue This Month"
          main={stats!.revenue}
          tag1="Target Achieved"
          tag2={`${stats!.targetPercent}%`}
          tag2Color="#00b894"
        />
        <StatCard
          title="Pending Invoices"
          main={String(stats!.pendingInvoices)}
          mainLabel="Invoices"
          tag1={stats!.unpaidAmount}
          tag1Color="#e17055"
          tag2="Unpaid"
          tag2Color="#e17055"
        />
      </div>

      {/* ── Middle: Calendar + Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Calendar Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Calendar Appointment</h2>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors">
              <Calendar size={14} />
              October 2025
            </button>
          </div>

          {/* Date strip */}
          <div className="flex items-center gap-1 mb-5">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
              <ChevronLeft size={16} />
            </button>
            {DATES.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDate(d)}
                className={`flex-1 h-9 rounded-xl text-sm font-semibold transition-all ${
                  activeDate === d
                    ? "bg-gray-900 text-white shadow"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {String(d).padStart(2, "0")}
              </button>
            ))}
            <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Appointment rows */}
          <div className="space-y-2">
            {APPOINTMENTS.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <Avatar initials={appt.initials} color={appt.color} size={38} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{appt.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Stethoscope size={11} /> {appt.doctor}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} /> {appt.time}
                    </span>
                  </div>
                </div>
                <Badge label={appt.status} />
                <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-opacity">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900">Insights Box</h2>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
              <TrendingUp size={14} />
            </button>
          </div>

          {[
            {
              icon: <Lightbulb size={16} className="text-amber-500" />,
              iconBg: "bg-amber-50",
              title: "Follow-up reminder",
              desc: "3 Patients Pending Follow-up need to schedule their next visit",
            },
            {
              icon: <Calendar size={16} className="text-rose-500" />,
              iconBg: "bg-rose-50",
              title: "Busiest Day",
              desc: "Tuesday is the busiest day — 12 patient appointments scheduled today",
            },
            {
              icon: <BarChart2 size={16} className="text-blue-500" />,
              iconBg: "bg-blue-50",
              title: "Revenue Insight",
              desc: "+18% Revenue increase compared to last month's performance",
            },
            {
              icon: <TrendingUp size={16} className="text-emerald-500" />,
              iconBg: "bg-emerald-50",
              title: "Growth Trend",
              desc: "New patient registrations up 22% compared to last quarter",
            },
          ].map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className={`w-8 h-8 rounded-xl ${insight.iconBg} flex items-center justify-center flex-shrink-0`}>
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{insight.desc}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-opacity">
                <MoreHorizontal size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Patient List ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="font-bold text-gray-900">Patient List</h2>
            <p className="text-xs text-gray-400 mt-0.5">Check patient information and update</p>
          </div>
          <button className="text-gray-300 hover:text-gray-500">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Patient ID", "Patient Name", "Date of Birth", "Age", "Contact", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATIENTS.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
                  <td className="py-3.5 pr-4 text-xs text-gray-400 font-mono">{p.id}</td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={p.initials} color={p.color} size={32} />
                      <span className="font-semibold text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-gray-500">{p.dob}</td>
                  <td className="py-3.5 pr-4 text-gray-500">{p.age}</td>
                  <td className="py-3.5 pr-4 text-gray-500">{p.contact}</td>
                  <td className="py-3.5 pr-4">
                    <Badge label={p.status} />
                  </td>
                  <td className="py-3.5">
                    <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-600 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}