'use client'
import { useEffect, useState } from 'react'
import { appointmentAPI } from '@/lib/api'
import { format, isFuture } from 'date-fns'
import { Calendar, Clock, MoreHorizontal, Search } from 'lucide-react'
import type { Appointment } from '@/types'

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b']
  const c = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    confirmed:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    pending:      { bg: '#fefce8', color: '#ca8a04', border: '#fde68a' },
    cancelled:    { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    completed:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    'checked-in': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  }
  const s = map[status] ?? { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 12, fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  )
}

export default function PatientAppointments() {
  const [apts, setApts]       = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<'upcoming' | 'past'>('upcoming')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    appointmentAPI.getAll()
      .then(r => setApts(r.data?.appointments ?? r.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = apts.filter(a => a.status !== 'cancelled' && a.status !== 'completed' && isFuture(new Date(a.date)))
  const past     = apts.filter(a => a.status === 'completed' || a.status === 'cancelled' || !isFuture(new Date(a.date)))
  const shown    = (tab === 'upcoming' ? upcoming : past).filter(a => {
    const doc = typeof a.doctorId === 'object' ? (a.doctorId as any).name : ''
    return doc.toLowerCase().includes(search.toLowerCase()) || a.status.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f5f6fa]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4 md:p-7 space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Patient Portal</p>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Appointments</h1>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',     value: apts.length,     color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Upcoming',  value: upcoming.length, color: '#ca8a04', bg: '#fefce8' },
          { label: 'Completed', value: past.filter(a => a.status === 'completed').length, color: '#16a34a', bg: '#f0fdf4' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={18} color={s.color} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label} Appointments</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card Header */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {([['upcoming', `Upcoming (${upcoming.length})`], ['past', `Past (${past.length})`]] as const).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}>
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-[200px]">
            <Search size={14} className="text-gray-400" />
            <input type="text" placeholder="Search doctor, status..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-900 outline-none w-full placeholder-gray-400" />
          </div>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {['Doctor', 'Date', 'Time', 'Type', 'Status'].map(h => (
            <p key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Calendar size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-medium text-gray-500">No appointments found</p>
            <p className="text-xs mt-1">Try switching tabs or clearing search</p>
          </div>
        ) : (
          shown.map((a, i) => {
            const docName = typeof a.doctorId === 'object' ? (a.doctorId as any).name : 'Doctor'
            return (
              <div key={a._id}
                className={`grid grid-cols-5 gap-4 px-5 py-4 items-center hover:bg-gray-50/80 transition-colors group ${i < shown.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <Avatar name={docName} size={34} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Dr. {docName}</p>
                    <p className="text-xs text-gray-400">{(a as any).specialization || 'Physician'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar size={12} className="text-gray-400" />
                  {a.date ? format(new Date(a.date), 'MMM dd, yyyy') : '—'}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Clock size={12} className="text-gray-400" />
                  {(a as any).timeSlot || a.time || '—'}
                </div>
                <p className="text-sm text-gray-500">{(a as any).appointmentType || 'New'}</p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={a.status} />
                  <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}