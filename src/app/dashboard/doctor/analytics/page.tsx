'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Calendar, FileText, Brain, Activity, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function DoctorAnalytics() {
  const [data, setData] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/analytics/doctor'),
      api.get('/appointments?limit=100'),
    ]).then(([statsRes, aptRes]) => {
      if (statsRes.data.success) setData(statsRes.data.data)
      if (aptRes.data.success) setAppointments(aptRes.data.appointments)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  // Status breakdown for pie chart
  const statusCounts = appointments.reduce((acc: Record<string, number>, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  const pieColors: Record<string, string> = {
    pending: '#f59e0b', confirmed: '#3b82f6', 'checked-in': '#8b5cf6',
    'in-consultation': '#06b6d4', completed: '#10b981', cancelled: '#ef4444'
  }

  // Monthly appointment counts (last 6 months)
  const monthlyData = (() => {
    const months: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0
    }
    appointments.forEach(a => {
      if (!a.date) return
      const key = a.date.slice(0, 7)
      if (key in months) months[key]++
    })
    return Object.entries(months).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
      count
    }))
  })()

  const statCards = [
    { label: "Today's Appointments", value: data?.dailyAppointments ?? 0,   icon: Calendar,  color: '#2563eb', bg: '#dbeafe' },
    { label: 'This Month',           value: data?.monthlyAppointments ?? 0,  icon: TrendingUp,color: '#0891b2', bg: '#cffafe' },
    { label: 'Total Prescriptions',  value: data?.prescriptionCount ?? 0,    icon: FileText,  color: '#16a34a', bg: '#dcfce7' },
    { label: 'AI Diagnoses',         value: data?.aiDiagnosisCount ?? 0,     icon: Brain,     color: '#7c3aed', bg: '#ede9fe' },
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>My Analytics</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>Your performance overview</p>
      </div>

      {/* Stat Cards */}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Monthly Bar Chart */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={28}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 13 }} />
              <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Appointment Status</h3>
          {pieData.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
              <Activity size={28} style={{ margin: '0 auto 8px', opacity: .4 }} />
              <p style={{ fontSize: 13 }}>No data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={pieColors[entry.name] ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f1f5f9', fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8, justifyContent: 'center' }}>
                {pieData.map(({ name, value }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: pieColors[name] ?? '#94a3b8' }} />
                    <span style={{ fontSize: 11, color: '#64748b', textTransform: 'capitalize' }}>{name.replace('-', ' ')} ({value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}