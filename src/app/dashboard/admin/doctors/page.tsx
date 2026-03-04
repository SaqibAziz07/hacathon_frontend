'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Search, Check, X, Stethoscope, Phone, Mail } from 'lucide-react'
import { format } from 'date-fns'

type User = { _id: string; name: string; email: string; phone?: string; role: string; status: string; specialization?: string; subscriptionPlan?: string; createdAt: string }

const statusBadge = (status: string) => {
  const map: Record<string, { color: string; bg: string }> = {
    active:  { color: '#16a34a', bg: '#dcfce7' },
    blocked: { color: '#dc2626', bg: '#fee2e2' },
    pending: { color: '#d97706', bg: '#fef3c7' },
  }
  const s = map[status] ?? { color: '#6b7280', bg: '#f3f4f6' }
  return <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, padding: '3px 10px', borderRadius: 20 }}>{status}</span>
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { fetchDoctors() }, [statusFilter])

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      let url = '/admin/users?role=doctor'
      if (statusFilter !== 'all') url += `&status=${statusFilter}`
      const res = await api.get(url)
      if (res.data.success) setDoctors(res.data.users.filter((u: User) => u.role === 'doctor'))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      await api.put(`/admin/users/${id}`, { status })
      setDoctors(prev => prev.map(d => d._id === id ? { ...d, status } : d))
    } catch { alert('Update failed') }
    finally { setActionLoading(null) }
  }

  const shown = doctors.filter(d => {
    const q = search.toLowerCase()
    return !q || d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || (d.specialization ?? '').toLowerCase().includes(q)
  })

  const inputSt = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Doctors</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>Manage doctor accounts — approve or block access</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, specialization…"
            style={{ ...inputSt, paddingLeft: 32, width: 280 }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputSt, width: 140 }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : shown.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
            <Stethoscope size={32} style={{ margin: '0 auto 10px', opacity: .4 }} />
            <p style={{ fontSize: 14 }}>No doctors found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Doctor', 'Specialization', 'Contact', 'Plan', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((doc, i) => (
                <tr key={doc._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#16a34a', flexShrink: 0 }}>
                        {doc.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Dr. {doc.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{doc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{doc.specialization ?? '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: '#64748b' }}>{doc.phone ?? '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: doc.subscriptionPlan === 'pro' ? '#d97706' : '#64748b', background: doc.subscriptionPlan === 'pro' ? '#fef3c7' : '#f1f5f9', padding: '3px 9px', borderRadius: 20, textTransform: 'capitalize' }}>
                      {doc.subscriptionPlan ?? 'free'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {doc.createdAt ? format(new Date(doc.createdAt), 'MMM dd, yyyy') : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>{statusBadge(doc.status)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {doc.status !== 'active' && (
                        <button onClick={() => updateStatus(doc._id, 'active')} disabled={actionLoading === doc._id}
                          style={{ padding: '5px 12px', background: '#dcfce7', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={12} /> Approve
                        </button>
                      )}
                      {doc.status !== 'blocked' && (
                        <button onClick={() => updateStatus(doc._id, 'blocked')} disabled={actionLoading === doc._id}
                          style={{ padding: '5px 12px', background: '#fee2e2', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <X size={12} /> Block
                        </button>
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