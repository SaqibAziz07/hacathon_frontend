'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Search, Calendar, Clock, Check, X, FileText } from 'lucide-react'
import { format, isToday } from 'date-fns'
import Link from 'next/link'

type Appointment = {
  _id: string
  patientId: { _id: string; name: string; age?: number; contact?: string } | null
  date: string; timeSlot: string; symptoms?: string
  appointmentType?: string; status: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:           { label: 'Pending',     color: '#d97706', bg: '#fef3c7' },
  confirmed:         { label: 'Confirmed',   color: '#2563eb', bg: '#dbeafe' },
  'checked-in':      { label: 'Checked In',  color: '#7c3aed', bg: '#ede9fe' },
  'in-consultation': { label: 'In Consult',  color: '#0891b2', bg: '#cffafe' },
  completed:         { label: 'Completed',   color: '#16a34a', bg: '#dcfce7' },
  cancelled:         { label: 'Cancelled',   color: '#dc2626', bg: '#fee2e2' },
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      await api.put(`/appointments/${id}/status`, { status })
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a))
    } catch { alert('Update failed') }
    finally { setActionLoading(null) }
  }

  const shown = appointments.filter(a => {
    const q = search.toLowerCase()
    return !q || (a.patientId?.name ?? '').toLowerCase().includes(q)
  })

  const inputSt = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>My Appointments</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>View and manage your appointments</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient…"
            style={{ ...inputSt, paddingLeft: 32, width: 220 }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputSt, width: 150 }}>
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ ...inputSt, width: 150 }} />
        {(statusFilter !== 'all' || dateFilter) && (
          <button onClick={() => { setStatusFilter('all'); setDateFilter('') }}
            style={{ padding: '8px 12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
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
                {['Patient', 'Date & Time', 'Type', 'Symptoms', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((apt, i) => {
                const sc = statusConfig[apt.status] ?? { label: apt.status, color: '#6b7280', bg: '#f3f4f6' }
                return (
                  <tr key={apt._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#4338ca', flexShrink: 0 }}>
                          {apt.patientId?.name?.charAt(0) ?? '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{apt.patientId?.name ?? '—'}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.patientId?.age ? `${apt.patientId.age} yrs` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 13, color: '#0f172a' }}>{apt.date ? format(new Date(apt.date), 'MMM dd, yyyy') : '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}><Clock size={10} />{apt.timeSlot}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{apt.appointmentType ?? 'new'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#64748b', maxWidth: 180 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{apt.symptoms || '—'}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 20 }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {apt.status === 'checked-in' && (
                          <button onClick={() => updateStatus(apt._id, 'in-consultation')} disabled={actionLoading === apt._id}
                            style={{ padding: '5px 10px', background: '#cffafe', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600, color: '#0891b2', cursor: 'pointer' }}>
                            Start
                          </button>
                        )}
                        {apt.status === 'in-consultation' && (
                          <Link href={`/dashboard/doctor/prescriptions?aptId=${apt._id}&patientId=${apt.patientId?._id}`}
                            style={{ padding: '5px 10px', background: '#dcfce7', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600, color: '#16a34a', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FileText size={11} /> Prescribe
                          </Link>
                        )}
                        {['completed', 'cancelled', 'confirmed', 'pending'].includes(apt.status) && (
                          <span style={{ fontSize: 12, color: '#cbd5e1' }}>—</span>
                        )}
                      </div>
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