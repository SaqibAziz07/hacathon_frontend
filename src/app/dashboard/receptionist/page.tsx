'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import {
  Users, Calendar, PlusCircle, Search, X, Check, Clock,
  AlertCircle, CheckCircle2, XCircle, UserPlus, ChevronRight,
  Stethoscope, Filter, RefreshCw, Bell
} from 'lucide-react'
import { format, isToday, isFuture } from 'date-fns'

type Appointment = {
  _id: string
  patientId: { _id: string; name: string; age: number; contact: string; mrNumber?: string } | null
  doctorId: { _id: string; name: string; specialization?: string } | null
  date: string
  timeSlot: string
  symptoms?: string
  appointmentType?: string
  status: string
}

type Patient = { _id: string; name: string; mrNumber?: string; gender?: string; age?: number; contact?: string }
type Doctor = { _id: string; name: string; specialization?: string }

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:        { label: 'Pending',        color: '#d97706', bg: '#fef3c7' },
  confirmed:      { label: 'Confirmed',      color: '#2563eb', bg: '#dbeafe' },
  'checked-in':   { label: 'Checked In',     color: '#7c3aed', bg: '#ede9fe' },
  'in-consultation': { label: 'In Consult',  color: '#0891b2', bg: '#cffafe' },
  completed:      { label: 'Completed',      color: '#16a34a', bg: '#dcfce7' },
  cancelled:      { label: 'Cancelled',      color: '#dc2626', bg: '#fee2e2' },
}

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] ?? { label: status, color: '#6b7280', bg: '#f3f4f6' }
  return (
    <span style={{ color: cfg.color, background: cfg.bg, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'today' | 'all'>('pending')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Modals
  const [bookingOpen, setBookingOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const [newAppt, setNewAppt] = useState({
    patientId: '', doctorId: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00', symptoms: '', appointmentType: 'new'
  })

  const [newPatient, setNewPatient] = useState({
    name: '', age: '', gender: 'Male', contact: '', address: '',
    bloodGroup: 'O+', emergencyContact: ''
  })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [aptRes, ptRes, docRes] = await Promise.all([
        api.get('/appointments?limit=100'),
        api.get('/patients'),
        api.get('/users/doctors'),
      ])
      if (aptRes.data.success) setAppointments(aptRes.data.appointments)
      if (ptRes.data.success) setPatients(ptRes.data.patients)
      if (docRes.data.success) setDoctors(docRes.data.doctors)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id + status)
    try {
      await api.put(`/appointments/${id}/status`, { status })
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a))
    } catch (e) {
      alert('Status update failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/appointments', newAppt)
      if (res.data.success) {
        setBookingOpen(false)
        setNewAppt({ patientId: '', doctorId: '', date: new Date().toISOString().split('T')[0], timeSlot: '09:00', symptoms: '', appointmentType: 'new' })
        fetchAll()
      }
    } catch { alert('Booking failed') }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/patients', newPatient)
      if (res.data.success) {
        setRegisterOpen(false)
        setNewPatient({ name: '', age: '', gender: 'Male', contact: '', address: '', bloodGroup: 'O+', emergencyContact: '' })
        fetchAll()
      }
    } catch { alert('Registration failed') }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const pendingApts = appointments.filter(a => a.status === 'pending')
  const todayApts   = appointments.filter(a => a.date?.startsWith(todayStr))

  const shown = (tab === 'pending' ? pendingApts : tab === 'today' ? todayApts : appointments)
    .filter(a => {
      const q = search.toLowerCase()
      return !q ||
        (a.patientId?.name ?? '').toLowerCase().includes(q) ||
        (a.doctorId?.name ?? '').toLowerCase().includes(q) ||
        a.status.includes(q)
    })

  // Stats
  const confirmedToday = todayApts.filter(a => a.status === 'confirmed').length
  const checkedIn      = todayApts.filter(a => a.status === 'checked-in').length
  const completed      = todayApts.filter(a => a.status === 'completed').length

  const inputStyle = {
    width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 12px',
    fontSize: 14, outline: 'none', background: '#f8fafc', color: '#0f172a',
    transition: 'border-color .15s'
  }
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, display: 'block' as const }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Reception Desk</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => fetchAll()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#64748b', cursor: 'pointer' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setRegisterOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
            <UserPlus size={14} /> Register Patient
          </button>
          <button onClick={() => setBookingOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>
            <Calendar size={14} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Pending Requests', value: pendingApts.length, icon: AlertCircle, color: '#d97706', bg: '#fef3c7' },
          { label: "Today's Total",    value: todayApts.length,   icon: Calendar,    color: '#2563eb', bg: '#dbeafe' },
          { label: 'Checked In',       value: checkedIn,          icon: CheckCircle2,color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Completed Today',  value: completed,          icon: Stethoscope, color: '#16a34a', bg: '#dcfce7' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* Appointments Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>

        {/* Table Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#f8fafc', borderRadius: 10, padding: 4 }}>
            {([
              ['pending', `Pending (${pendingApts.length})`],
              ['today',   `Today (${todayApts.length})`],
              ['all',     'All Appointments'],
            ] as const).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '6px 14px', borderRadius: 7, border: 'none', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#0f172a' : '#64748b',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,.08)' : 'none', transition: 'all .15s'
              }}>{label}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or doctor…"
              style={{ ...inputStyle, paddingLeft: 32, width: '100%' }} />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 32, height: 32, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
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
                {['Patient', 'Doctor', 'Date & Time', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((apt, i) => (
                <tr key={apt._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  {/* Patient */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#4338ca', flexShrink: 0 }}>
                        {apt.patientId?.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{apt.patientId?.name ?? '—'}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.patientId?.contact ?? ''}</div>
                      </div>
                    </div>
                  </td>
                  {/* Doctor */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Dr. {apt.doctorId?.name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{apt.doctorId?.specialization ?? ''}</div>
                  </td>
                  {/* Date */}
                  <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{apt.date ? format(new Date(apt.date), 'MMM dd, yyyy') : '—'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}><Clock size={10} />{apt.timeSlot}</div>
                  </td>
                  {/* Type */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{apt.appointmentType ?? 'new'}</span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: '14px 20px' }}>
                    <StatusBadge status={apt.status} />
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {apt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(apt._id, 'confirmed')}
                            disabled={!!actionLoading}
                            title="Approve"
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: '#dcfce7', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#16a34a', cursor: 'pointer' }}>
                            <Check size={13} /> Approve
                          </button>
                          <button
                            onClick={() => updateStatus(apt._id, 'cancelled')}
                            disabled={!!actionLoading}
                            title="Reject"
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: '#fee2e2', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#dc2626', cursor: 'pointer' }}>
                            <X size={13} /> Reject
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(apt._id, 'checked-in')}
                          disabled={!!actionLoading}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: '#ede9fe', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#7c3aed', cursor: 'pointer' }}>
                          <CheckCircle2 size={13} /> Check In
                        </button>
                      )}
                      {apt.status === 'checked-in' && (
                        <button
                          onClick={() => updateStatus(apt._id, 'completed')}
                          disabled={!!actionLoading}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: '#dcfce7', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#16a34a', cursor: 'pointer' }}>
                          <CheckCircle2 size={13} /> Complete
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

      {/* ── BOOKING MODAL ── */}
      {bookingOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>Book Appointment</h2>
              <button onClick={() => setBookingOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleBook} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Patient</label>
                <select required value={newAppt.patientId} onChange={e => setNewAppt({ ...newAppt, patientId: e.target.value })} style={inputStyle}>
                  <option value="">Select patient…</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}{p.mrNumber ? ` (${p.mrNumber})` : ''}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Doctor</label>
                <select required value={newAppt.doctorId} onChange={e => setNewAppt({ ...newAppt, doctorId: e.target.value })} style={inputStyle}>
                  <option value="">Select doctor…</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}{d.specialization ? ` — ${d.specialization}` : ''}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" required value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Time</label>
                  <input type="time" required value={newAppt.timeSlot} onChange={e => setNewAppt({ ...newAppt, timeSlot: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select value={newAppt.appointmentType} onChange={e => setNewAppt({ ...newAppt, appointmentType: e.target.value })} style={inputStyle}>
                  {['new', 'follow-up', 'emergency', 'lab-test'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Symptoms (optional)</label>
                <input value={newAppt.symptoms} onChange={e => setNewAppt({ ...newAppt, symptoms: e.target.value })} placeholder="e.g. fever, cough" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" onClick={() => setBookingOpen(false)} style={{ padding: '9px 18px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>Cancel</button>
                <button type="submit" style={{ padding: '9px 22px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>Book</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REGISTER MODAL ── */}
      {registerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>Register New Patient</h2>
              <button onClick={() => setRegisterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleRegister} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input required value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input type="number" required value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select value={newPatient.gender} onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })} style={inputStyle}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Contact</label>
                  <input required value={newPatient.contact} onChange={e => setNewPatient({ ...newPatient, contact: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Blood Group</label>
                  <select value={newPatient.bloodGroup} onChange={e => setNewPatient({ ...newPatient, bloodGroup: e.target.value })} style={inputStyle}>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Emergency Contact</label>
                  <input value={newPatient.emergencyContact} onChange={e => setNewPatient({ ...newPatient, emergencyContact: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Address</label>
                  <textarea value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" onClick={() => setRegisterOpen(false)} style={{ padding: '9px 18px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>Cancel</button>
                <button type="submit" style={{ padding: '9px 22px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}