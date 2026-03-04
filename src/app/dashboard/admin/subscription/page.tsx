'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { CreditCard, Search, Check, Crown } from 'lucide-react'
import { format } from 'date-fns'

type User = { _id: string; name: string; email: string; role: string; status: string; subscriptionPlan?: string; createdAt: string }

export default function AdminSubscription() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/users')
      if (res.data.success) setUsers(res.data.users)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const upgradePlan = async (id: string, plan: string) => {
    setActionLoading(id)
    try {
      await api.put(`/admin/users/${id}`, { subscriptionPlan: plan })
      setUsers(prev => prev.map(u => u._id === id ? { ...u, subscriptionPlan: plan } : u))
    } catch { alert('Update failed') }
    finally { setActionLoading(null) }
  }

  const shown = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchPlan = planFilter === 'all' || (u.subscriptionPlan ?? 'free') === planFilter
    return matchSearch && matchPlan
  })

  const proCount  = users.filter(u => u.subscriptionPlan === 'pro').length
  const freeCount = users.filter(u => (u.subscriptionPlan ?? 'free') === 'free').length

  const inputSt = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CreditCard size={22} /> Subscription Plans
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>Manage user subscription plans</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: users.length,  color: '#2563eb', bg: '#dbeafe' },
          { label: 'Pro Users',   value: proCount,       color: '#d97706', bg: '#fef3c7' },
          { label: 'Free Users',  value: freeCount,      color: '#64748b', bg: '#f1f5f9' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreditCard size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user…" style={{ ...inputSt, paddingLeft: 32, width: 240 }} />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} style={{ ...inputSt, width: 140 }}>
          <option value="all">All Plans</option>
          <option value="pro">Pro</option>
          <option value="free">Free</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['User', 'Role', 'Current Plan', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((u, i) => {
                const isPro = u.subscriptionPlan === 'pro'
                return (
                  <tr key={u._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#4338ca', flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '3px 9px', borderRadius: 20, textTransform: 'capitalize' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: isPro ? '#d97706' : '#64748b', background: isPro ? '#fef3c7' : '#f1f5f9', padding: '4px 10px', borderRadius: 20, width: 'fit-content' }}>
                        {isPro && <Crown size={11} />} {isPro ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {u.createdAt ? format(new Date(u.createdAt), 'MMM dd, yyyy') : '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {isPro ? (
                        <button onClick={() => upgradePlan(u._id, 'free')} disabled={actionLoading === u._id}
                          style={{ padding: '5px 12px', background: '#f1f5f9', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                          Downgrade
                        </button>
                      ) : (
                        <button onClick={() => upgradePlan(u._id, 'pro')} disabled={actionLoading === u._id}
                          style={{ padding: '5px 12px', background: '#fef3c7', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#d97706', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Crown size={11} /> Upgrade to Pro
                        </button>
                      )}
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