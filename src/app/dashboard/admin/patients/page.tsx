'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Search, Eye, User, Phone, X } from 'lucide-react'
import { format } from 'date-fns'

type Patient = { _id: string; name: string; age: number; gender: string; contact: string; email?: string; bloodGroup?: string; mrNumber?: string; address?: string; medicalHistory?: string; createdAt?: string }

const bloodColors: Record<string, string> = { 'A+': '#ef4444','A-': '#f97316','B+': '#3b82f6','B-': '#6366f1','AB+': '#8b5cf6','AB-': '#ec4899','O+': '#10b981','O-': '#14b8a6' }

export default function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)

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

  const inputSt = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Patients</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>{total} total patients registered</p>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, MR#…" style={{ ...inputSt, paddingLeft: 36, width: '100%' }} />
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
                {['Patient', 'MR#', 'Age / Gender', 'Contact', 'Blood', 'Registered', 'Actions'].map(h => (
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
                    {p.bloodGroup ? <span style={{ fontSize: 12, fontWeight: 700, color: bloodColors[p.bloodGroup] ?? '#64748b', background: '#f8fafc', padding: '3px 9px', borderRadius: 8, border: `1.5px solid ${bloodColors[p.bloodGroup] ?? '#e2e8f0'}` }}>{p.bloodGroup}</span> : '—'}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {p.createdAt ? format(new Date(p.createdAt), 'MMM dd, yyyy') : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => setViewPatient(p)} style={{ padding: '5px 12px', background: '#f1f5f9', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}>
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewPatient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>Patient Details</h2>
              <button onClick={() => setViewPatient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#4338ca' }}>
                  {viewPatient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{viewPatient.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>MR# {viewPatient.mrNumber ?? '—'}</div>
                </div>
              </div>
              {[['Age', `${viewPatient.age} years`],['Gender', viewPatient.gender],['Contact', viewPatient.contact],['Email', viewPatient.email ?? '—'],['Blood Group', viewPatient.bloodGroup ?? '—'],['Address', viewPatient.address ?? '—'],['Medical History', viewPatient.medicalHistory ?? '—']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{l}</span>
                  <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, maxWidth: 260, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}