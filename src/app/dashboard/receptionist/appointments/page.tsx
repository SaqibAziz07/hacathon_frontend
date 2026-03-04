'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Search, Calendar, Check, X, CheckCircle2, Clock, Filter } from 'lucide-react'
import { format } from 'date-fns'

type Appointment = {
  _id: string
  patientId: { _id: string; name: string; contact: string; mrNumber?: string } | null
  doctorId: { _id: string; name: string; specialization?: string } | null
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

const StatusBadge = ({ status }: { status: string }) => {
  const c = statusConfig[status] ?? { label: status, color: '#6b7280', bg: '#f3f4f6' }
  return <span style={{ color: c.color, background: c.bg, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{c.label}</span>
}

export default function ReceptionistAppointments() {
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
    setActionLoading(id + status)
    try {
      await api.put(`/appointments/${id}/status`, { status })
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a))
    } catch { alert('Update failed') }
    finally { setActionLoading(null) }
  }

  const shown = appointments.filter(a => {
    const q = search.toLowerCase()
    return !q || (a.patientId?.name ?? '').toLowerCase().includes(q) || (a.doctorId?.name ?? '').toLowerCase().includes(q)
  })

  const inputStyle = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Appointments</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>Manage and update all appointment statuses</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or doctor…"
            style={{ ...inputStyle, paddingLeft: 32, width: 240 }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 160 }}>
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          style={{ ...inputStyle, width: 160 }} />
        {(statusFilter !== 'all' || dateFilter) && (
          <button onClick={() => { setStatusFilter('all'); setDateFilter('') }}
            style={{ padding: '8px 14px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
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
                {['Patient', 'Doctor', 'Date & Time', 'Type', 'Symptoms', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((apt, i) => (
                <tr key={apt._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{apt.patientId?.name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.patientId?.contact ?? ''}</div>
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Dr. {apt.doctorId?.name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.doctorId?.specialization ?? ''}</div>
                  </td>
                  <td style={{ padding: '13px 18px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 13, color: '#0f172a' }}>{apt.date ? format(new Date(apt.date), 'MMM dd, yyyy') : '—'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{apt.timeSlot}</div>
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{apt.appointmentType ?? 'new'}</td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: '#64748b', maxWidth: 160 }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{apt.symptoms || '—'}</span>
                  </td>
                  <td style={{ padding: '13px 18px' }}><StatusBadge status={apt.status} /></td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {apt.status === 'pending' && <>
                        <button onClick={() => updateStatus(apt._id, 'confirmed')} disabled={!!actionLoading}
                          style={{ padding: '4px 10px', background: '#dcfce7', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Check size={11} /> Approve
                        </button>
                        <button onClick={() => updateStatus(apt._id, 'cancelled')} disabled={!!actionLoading}
                          style={{ padding: '4px 10px', background: '#fee2e2', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <X size={11} /> Reject
                        </button>
                      </>}
                      {apt.status === 'confirmed' && (
                        <button onClick={() => updateStatus(apt._id, 'checked-in')} disabled={!!actionLoading}
                          style={{ padding: '4px 10px', background: '#ede9fe', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CheckCircle2 size={11} /> Check In
                        </button>
                      )}
                      {apt.status === 'checked-in' && (
                        <button onClick={() => updateStatus(apt._id, 'completed')} disabled={!!actionLoading}
                          style={{ padding: '4px 10px', background: '#dcfce7', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CheckCircle2 size={11} /> Complete
                        </button>
                      )}
                      {['completed', 'cancelled', 'in-consultation'].includes(apt.status) && (
                        <span style={{ fontSize: 12, color: '#cbd5e1' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}