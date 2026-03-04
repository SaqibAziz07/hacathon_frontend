// ═══════════════════════════════════════════
// FILE 1: admin/appointments/page.tsx
// ═══════════════════════════════════════════
'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Search, Calendar, Clock, X, Check, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'

type Appointment = {
  _id: string
  patientId: { name: string; contact?: string } | null
  doctorId: { name: string; specialization?: string } | null
  date: string; timeSlot: string; symptoms?: string; appointmentType?: string; status: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:           { label: 'Pending',     color: '#d97706', bg: '#fef3c7' },
  confirmed:         { label: 'Confirmed',   color: '#2563eb', bg: '#dbeafe' },
  'checked-in':      { label: 'Checked In',  color: '#7c3aed', bg: '#ede9fe' },
  'in-consultation': { label: 'In Consult',  color: '#0891b2', bg: '#cffafe' },
  completed:         { label: 'Completed',   color: '#16a34a', bg: '#dcfce7' },
  cancelled:         { label: 'Cancelled',   color: '#dc2626', bg: '#fee2e2' },
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => { fetchAll() }, [statusFilter, dateFilter])

  const fetchAll = async () => {
    setLoading(true)
    try {
      let url = '/appointments?limit=100'
      if (statusFilter !== 'all') url += `&status=${statusFilter}`
      if (dateFilter) url += `&date=${dateFilter}`
      const res = await api.get(url)
      if (res.data.success) setAppointments(res.data.appointments)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const shown = appointments.filter(a => {
    const q = search.toLowerCase()
    return !q || (a.patientId?.name ?? '').toLowerCase().includes(q) || (a.doctorId?.name ?? '').toLowerCase().includes(q)
  })

  const inputSt = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>All Appointments</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>View and monitor all clinic appointments</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or doctor…" style={{ ...inputSt, paddingLeft: 32, width: 240 }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputSt, width: 150 }}>
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ ...inputSt, width: 150 }} />
        {(statusFilter !== 'all' || dateFilter) && (
          <button onClick={() => { setStatusFilter('all'); setDateFilter('') }} style={{ padding: '8px 12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : shown.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
            <Calendar size={32} style={{ margin: '0 auto 10px', opacity: .4 }} />
            <p style={{ fontSize: 14 }}>No appointments found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Patient', 'Doctor', 'Date & Time', 'Type', 'Status'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((apt, i) => {
                const sc = statusConfig[apt.status] ?? { label: apt.status, color: '#6b7280', bg: '#f3f4f6' }
                return (
                  <tr key={apt._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{apt.patientId?.name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.patientId?.contact ?? ''}</div>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Dr. {apt.doctorId?.name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.doctorId?.specialization ?? ''}</div>
                    </td>
                    <td style={{ padding: '13px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 13, color: '#0f172a' }}>{apt.date ? format(new Date(apt.date), 'MMM dd, yyyy') : '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{apt.timeSlot}</div>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{apt.appointmentType ?? 'new'}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 20 }}>{sc.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}