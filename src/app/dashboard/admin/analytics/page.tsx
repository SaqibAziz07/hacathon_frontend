'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Users, Stethoscope, Calendar, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/admin').then(r => { if (r.data.success) setStats(r.data.data) }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const topDoctors  = stats?.topDoctors?.map((d: any) => ({ name: d.name, appointments: d.count })) ?? []
  const regTrends   = stats?.registrationTrends?.map((t: any) => ({ month: t._id, patients: t.count })).reverse() ?? []
  const peakHours   = stats?.peakHours?.map((h: any) => ({ time: h._id, count: h.count })) ?? []
  const COLORS = ['#0f172a','#2563eb','#7c3aed','#0891b2','#16a34a']

  const statCards = [
    { label: 'Total Patients',       value: stats?.totalPatients ?? 0,        icon: Users,       color: '#2563eb', bg: '#dbeafe' },
    { label: 'Total Doctors',        value: stats?.totalDoctors ?? 0,         icon: Stethoscope, color: '#16a34a', bg: '#dcfce7' },
    { label: 'Monthly Appointments', value: stats?.monthlyAppointments ?? 0,  icon: Calendar,    color: '#d97706', bg: '#fef3c7' },
    { label: 'Pro Users',            value: stats?.proUsers ?? 0,             icon: DollarSign,  color: '#7c3aed', bg: '#ede9fe' },
  ]

  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Analytics</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>Platform-wide statistics and trends</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Patient Registration Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={regTrends}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 12 }} />
              <Line type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Top Doctors by Appointments</h3>
          {topDoctors.length === 0 ? <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No data yet</div> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topDoctors} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={90} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 12 }} />
                <Bar dataKey="appointments" fill="#0f172a" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Peak Appointment Hours</h3>
        {peakHours.length === 0 ? <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No data yet</div> : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakHours}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 12 }} />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}