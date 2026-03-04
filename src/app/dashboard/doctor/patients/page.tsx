'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Search, User, Phone, Eye, X, Calendar, FileText } from 'lucide-react'
import { format } from 'date-fns'

type Patient = {
  _id: string; name: string; age: number; gender: string; contact: string
  email?: string; bloodGroup?: string; mrNumber?: string; medicalHistory?: string
  address?: string; allergies?: string[]
}

export default function DoctorPatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)
  const [history, setHistory] = useState<any>(null)
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => { fetchPatients() }, [search])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const params = search ? `?search=${encodeURIComponent(search)}&limit=50` : '?limit=50'
      const res = await api.get(`/patients${params}`)
      if (res.data.success) { setPatients(res.data.patients); setTotal(res.data.total) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const viewHistory = async (p: Patient) => {
    setViewPatient(p)
    setHistoryLoading(true)
    try {
      const res = await api.get(`/patients/${p._id}/history`)
      if (res.data.success) setHistory(res.data.history)
    } catch (e) { console.error(e) }
    finally { setHistoryLoading(false) }
  }

  const bloodColors: Record<string, string> = {
    'A+': '#ef4444', 'A-': '#f97316', 'B+': '#3b82f6', 'B-': '#6366f1',
    'AB+': '#8b5cf6', 'AB-': '#ec4899', 'O+': '#10b981', 'O-': '#14b8a6',
  }

  const inputSt = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Patients</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>{total} patients in system</p>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, MR#…"
          style={{ ...inputSt, paddingLeft: 36 }} />
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : patients.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
            <User size={32} style={{ margin: '0 auto 10px', opacity: .4 }} />
            <p style={{ fontSize: 14 }}>No patients found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Patient', 'MR#', 'Age / Gender', 'Contact', 'Blood', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#4338ca', flexShrink: 0 }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.email ?? '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>{p.mrNumber ?? '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#0f172a' }}>{p.age} yrs · {p.gender}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#0f172a' }}>
                      <Phone size={12} color="#94a3b8" />{p.contact}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {p.bloodGroup ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: bloodColors[p.bloodGroup] ?? '#64748b', background: '#f8fafc', padding: '3px 9px', borderRadius: 8, border: `1.5px solid ${bloodColors[p.bloodGroup] ?? '#e2e8f0'}` }}>{p.bloodGroup}</span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => viewHistory(p)}
                      style={{ padding: '5px 12px', background: '#f1f5f9', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}>
                      <Eye size={12} /> History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Patient History Modal */}
      {viewPatient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white' }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>{viewPatient.name}</h2>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>MR# {viewPatient.mrNumber ?? '—'} · {viewPatient.age} yrs · {viewPatient.gender}</p>
              </div>
              <button onClick={() => { setViewPatient(null); setHistory(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <div style={{ padding: 24 }}>
              {historyLoading ? (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <div style={{ width: 24, height: 24, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
                </div>
              ) : history ? (
                <>
                  {/* Appointments */}
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} /> Appointment History ({history.appointments?.length ?? 0})
                  </h3>
                  {history.appointments?.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>No appointments</p>
                  ) : (
                    <div style={{ marginBottom: 20 }}>
                      {history.appointments?.slice(0, 5).map((a: any) => (
                        <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc', fontSize: 13 }}>
                          <span style={{ color: '#0f172a' }}>{a.date ? format(new Date(a.date), 'MMM dd, yyyy') : '—'} · {a.timeSlot}</span>
                          <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{a.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Prescriptions */}
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={14} /> Prescriptions ({history.prescriptions?.length ?? 0})
                  </h3>
                  {history.prescriptions?.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#94a3b8' }}>No prescriptions</p>
                  ) : (
                    history.prescriptions?.slice(0, 5).map((rx: any) => (
                      <div key={rx._id} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 10, marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{rx.diagnosis}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{rx.createdAt ? format(new Date(rx.createdAt), 'MMM dd, yyyy') : '—'} · {rx.medicines?.length ?? 0} medicines</div>
                      </div>
                    ))
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}