'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Calendar, FileText, Brain, Activity, Clock, Check, ChevronRight, User } from 'lucide-react'
import { format, isToday } from 'date-fns'
import Link from 'next/link'

type Appointment = {
  _id: string
  patientId: { name: string; age?: number } | null
  date: string; timeSlot: string; status: string; symptoms?: string
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  pending:           { color: '#d97706', bg: '#fef3c7' },
  confirmed:         { color: '#2563eb', bg: '#dbeafe' },
  'checked-in':      { color: '#7c3aed', bg: '#ede9fe' },
  'in-consultation': { color: '#0891b2', bg: '#cffafe' },
  completed:         { color: '#16a34a', bg: '#dcfce7' },
  cancelled:         { color: '#dc2626', bg: '#fee2e2' },
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ dailyAppointments: 0, monthlyAppointments: 0, prescriptionCount: 0, aiDiagnosisCount: 0 })
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/analytics/doctor'),
      api.get('/appointments?limit=20'),
    ]).then(([statsRes, aptRes]) => {
      if (statsRes.data.success) setStats(statsRes.data.data)
      if (aptRes.data.success) setAppointments(aptRes.data.appointments)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const todayApts = appointments.filter(a => a.date && isToday(new Date(a.date)))
  const upcoming  = appointments.filter(a => a.status === 'confirmed' || a.status === 'checked-in').slice(0, 5)

  const statCards = [
    { label: "Today's Appointments", value: stats.dailyAppointments,   icon: Calendar,  color: '#2563eb', bg: '#dbeafe' },
    { label: 'This Month',           value: stats.monthlyAppointments,  icon: Activity,  color: '#0891b2', bg: '#cffafe' },
    { label: 'Prescriptions',        value: stats.prescriptionCount,    icon: FileText,  color: '#16a34a', bg: '#dcfce7' },
    { label: 'AI Diagnoses',         value: stats.aiDiagnosisCount,     icon: Brain,     color: '#7c3aed', bg: '#ede9fe' },
  ]

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Dr. {user?.name} 👋
        </h1>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Today's Schedule */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Today's Schedule</h3>
            <span style={{ fontSize: 12, background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{todayApts.length} appointments</span>
          </div>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ width: 24, height: 24, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : todayApts.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>
              <Calendar size={28} style={{ margin: '0 auto 8px', opacity: .4 }} />
              <p style={{ fontSize: 13 }}>No appointments today</p>
            </div>
          ) : (
            <div>
              {todayApts.map((apt, i) => {
                const sc = statusConfig[apt.status] ?? { color: '#6b7280', bg: '#f3f4f6' }
                return (
                  <div key={apt._id} style={{ padding: '14px 20px', borderBottom: i < todayApts.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#4338ca', flexShrink: 0 }}>
                      {apt.patientId?.name?.charAt(0) ?? '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{apt.patientId?.name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={10} /> {apt.timeSlot}
                        {apt.symptoms && <span>· {apt.symptoms.slice(0, 30)}{apt.symptoms.length > 30 ? '…' : ''}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, padding: '3px 9px', borderRadius: 20 }}>{apt.status}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '16px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 14px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'View Appointments', href: '/dashboard/doctor/appointments', icon: Calendar, color: '#2563eb' },
                { label: 'Write Prescription', href: '/dashboard/doctor/prescriptions', icon: FileText, color: '#16a34a' },
                { label: 'AI Symptom Checker', href: '/dashboard/doctor/ai', icon: Brain, color: '#7c3aed' },
                { label: 'View Patients', href: '/dashboard/doctor/patients', icon: User, color: '#0891b2' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #f1f5f9', textDecoration: 'none', background: '#fafafa', transition: 'all .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fafafa')}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color={color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', flex: 1 }}>{label}</span>
                  <ChevronRight size={14} color="#94a3b8" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}