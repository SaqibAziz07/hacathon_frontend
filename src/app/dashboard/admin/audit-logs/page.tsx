'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Shield, Clock, Search } from 'lucide-react'
import { format } from 'date-fns'

type Log = { _id: string; userId?: { name: string; role: string }; action: string; module: string; details: any; createdAt: string }

const moduleColors: Record<string, { color: string; bg: string }> = {
  ADMIN:        { color: '#7c3aed', bg: '#ede9fe' },
  AUTH:         { color: '#2563eb', bg: '#dbeafe' },
  APPOINTMENT:  { color: '#d97706', bg: '#fef3c7' },
  PRESCRIPTION: { color: '#16a34a', bg: '#dcfce7' },
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/audit-logs').then(r => { if (r.data.success) setLogs(r.data.logs) }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const shown = logs.filter(l => {
    const q = search.toLowerCase()
    return !q || l.action.toLowerCase().includes(q) || l.module.toLowerCase().includes(q) || (l.userId?.name ?? '').toLowerCase().includes(q)
  })

  const inputSt = { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={22} /> Audit Logs
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>All system activity and admin actions</p>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search action, module, user…" style={{ ...inputSt, paddingLeft: 36, width: '100%' }} />
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : shown.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
            <Shield size={32} style={{ margin: '0 auto 10px', opacity: .4 }} />
            <p style={{ fontSize: 14 }}>No logs found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Timestamp', 'Actor', 'Action', 'Module', 'Details'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((log, i) => {
                const mc = moduleColors[log.module] ?? { color: '#64748b', bg: '#f1f5f9' }
                return (
                  <tr key={log._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '13px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
                        <Clock size={11} color="#94a3b8" />
                        {log.createdAt ? format(new Date(log.createdAt), 'MMM dd, HH:mm') : '—'}
                      </div>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{log.userId?.name ?? 'System'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{log.userId?.role ?? ''}</div>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, background: '#f8fafc', color: '#0f172a', padding: '3px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}>{log.action}</span>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: mc.color, background: mc.bg, padding: '3px 10px', borderRadius: 20 }}>{log.module}</span>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 12, color: '#94a3b8', maxWidth: 240 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {JSON.stringify(log.details)}
                      </span>
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