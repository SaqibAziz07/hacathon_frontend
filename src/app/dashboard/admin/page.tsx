'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Users, Stethoscope, Calendar, DollarSign, TrendingUp, Activity, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/admin').then(r => {
      if (r.data.success) setStats(r.data.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const topDoctors = stats?.topDoctors?.map((d: any) => ({ name: d.name, appointments: d.count })) ?? []
  const regTrends  = stats?.registrationTrends?.map((t: any) => ({ month: t._id, patients: t.count })).reverse() ?? []
  const peakHours  = stats?.peakHours?.map((h: any) => ({ time: h._id, count: h.count })) ?? []
  const COLORS = ['#0f172a','#2563eb','#7c3aed','#0891b2','#16a34a']

  const statCards = [
    { label: 'Total Patients',        value: stats?.totalPatients ?? 0,       icon: Users,       color: '#2563eb', bg: '#dbeafe' },
    { label: 'Total Doctors',         value: stats?.totalDoctors ?? 0,        icon: Stethoscope, color: '#16a34a', bg: '#dcfce7' },
    { label: 'Monthly Appointments',  value: stats?.monthlyAppointments ?? 0, icon: Calendar,    color: '#d97706', bg: '#fef3c7' },
    { label: 'Simulated Revenue',     value: `$${stats?.simulatedRevenue ?? 0}`, icon: DollarSign, color: '#7c3aed', bg: '#ede9fe' },
  ]

  const quickLinks = [
    { label: 'Manage Doctors',      href: '/dashboard/admin/doctors',      color: '#16a34a' },
    { label: 'Manage Patients',     href: '/dashboard/admin/patients',     color: '#2563eb' },
    { label: 'All Appointments',    href: '/dashboard/admin/appointments', color: '#d97706' },
    { label: 'View Audit Logs',     href: '/dashboard/admin/audit-logs',   color: '#7c3aed' },
  ]

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Admin Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{loading ? '—' : value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Registration Trends */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Patient Registration Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={regTrends}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 12 }} />
              <Line type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Doctors */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Top Doctors by Appointments</h3>
          {topDoctors.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topDoctors} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={90} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 12 }} />
                <Bar dataKey="appointments" fill="#0f172a" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Peak Hours Pie */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Peak Appointment Hours</h3>
          {peakHours.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={peakHours} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count" nameKey="time" paddingAngle={3}>
                  {peakHours.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Links */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickLinks.map(({ label, href, color }) => (
              <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #f1f5f9', textDecoration: 'none', background: '#fafafa' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{label}</span>
                <ChevronRight size={14} color="#94a3b8" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}