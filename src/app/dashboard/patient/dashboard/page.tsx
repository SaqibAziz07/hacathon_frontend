'use client'
import { useEffect, useState } from 'react'
import { appointmentAPI, prescriptionAPI } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { format, isFuture } from 'date-fns'
import { Calendar, FileText, CheckCircle, Clock, MoreHorizontal, Bell, Search } from 'lucide-react'

type Appointment = {
  _id: string
  patientId: string | { _id: string; name: string }
  doctorId: string | { _id: string; name: string }
  date: string
  time?: string
  status: string
  [key: string]: any
}

type Prescription = {
  _id: string
  doctorId: string | { _id: string; name: string }
  diagnosis: string
  medicines: { name: string; dosage: string; frequency: string; duration: string }[]
  instructions?: string
  createdAt: string
  [key: string]: any
}

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
  const map: Record<string, { bg: string; color: string }> = {
    confirmed:    { bg: '#f0fdf4', color: '#16a34a' },
    pending:      { bg: '#fefce8', color: '#ca8a04' },
    cancelled:    { bg: '#fef2f2', color: '#dc2626' },
    completed:    { bg: '#f0fdf4', color: '#16a34a' },
    'checked-in': { bg: '#eff6ff', color: '#2563eb' },
  }
  const s = map[status] ?? { bg: '#f8fafc', color: '#64748b' }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{status}</span>
  )
}

function StatCard({ title, value, icon: Icon, iconBg, iconColor, tag, tagColor }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={iconColor} />
        </div>
        <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal size={16} /></button>
      </div>
      <p className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{title}</p>
      {tag && <p className="text-xs font-semibold" style={{ color: tagColor }}>{tag}</p>}
    </div>
  )
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [apts, setApts]       = useState<Appointment[]>([])
  const [rxs, setRxs]         = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  useEffect(() => {
    Promise.all([
      appointmentAPI.getAll().then(r => setApts(r.data?.appointments ?? r.data ?? [])),
      prescriptionAPI.getAll().then(r => setRxs(r.data?.prescriptions ?? r.data ?? [])),
    ]).finally(() => setLoading(false))
  }, [])

  const upcoming  = apts.filter(a => a.status !== 'cancelled' && a.status !== 'completed' && isFuture(new Date(a.date)))
  const completed = apts.filter(a => a.status === 'completed')

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f5f6fa]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4 md:p-7 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {greeting}, <span className="text-gray-700">{user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Here's your health summary.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400 shadow-sm w-52">
            <Search size={14} />
            <span>Search…</span>
            <span className="ml-auto bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </div>
          <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <Bell size={16} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Appointments" value={apts.length}       icon={Calendar}     iconBg="#eff6ff" iconColor="#3b82f6" tag={`+${upcoming.length} upcoming`} tagColor="#16a34a" />
        <StatCard title="Upcoming"           value={upcoming.length}   icon={Clock}        iconBg="#fefce8" iconColor="#ca8a04" tag="Scheduled"                        tagColor="#ca8a04" />
        <StatCard title="Completed"          value={completed.length}  icon={CheckCircle}  iconBg="#f0fdf4" iconColor="#16a34a" tag="All done ✓"                       tagColor="#16a34a" />
        <StatCard title="Prescriptions"      value={rxs.length}        icon={FileText}     iconBg="#fef2f2" iconColor="#ef4444" tag="On file"                          tagColor="#94a3b8" />
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Upcoming Appointments</h2>
            <span className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline">View all →</span>
          </div>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Calendar size={40} className="mb-3 opacity-20" />
              <p className="text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.slice(0, 5).map(a => {
                const docName = typeof a.doctorId === 'object' ? (a.doctorId as any).name : 'Doctor'
                return (
                  <div key={a._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <Avatar name={docName} size={38} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">Dr. {docName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {a.date ? format(new Date(a.date), 'MMM dd, yyyy') : '—'} • {(a as any).timeSlot || a.time || '—'}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                    <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="font-bold text-gray-900 mb-1">Health Insights</h2>
          {[
            { icon: '📅', title: 'Next Appointment', desc: upcoming[0] ? format(new Date(upcoming[0].date), 'MMM dd, yyyy') : 'None scheduled' },
            { icon: '💊', title: 'Active Prescriptions', desc: `${rxs.length} prescription${rxs.length !== 1 ? 's' : ''} on file` },
            { icon: '✅', title: 'Visit History', desc: `${completed.length} completed visit${completed.length !== 1 ? 's' : ''}` },
            { icon: '🏥', title: 'Total Appointments', desc: `${apts.length} appointments overall` },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-lg">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-opacity">
                <MoreHorizontal size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Prescriptions */}
      {rxs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Prescriptions</h2>
            <span className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline">View all →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Doctor', 'Diagnosis', 'Medicines', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rxs.slice(0, 4).map(rx => (
                  <tr key={rx._id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={typeof rx.doctorId === 'object' ? (rx.doctorId as any).name : 'D'} size={28} />
                        <span className="font-medium text-gray-900 text-sm">Dr. {typeof rx.doctorId === 'object' ? (rx.doctorId as any).name : '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{rx.diagnosis}</td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-1 flex-wrap">
                        {rx.medicines.slice(0, 2).map((m: any, i: number) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{m.name}</span>
                        ))}
                        {rx.medicines.length > 2 && <span className="text-xs text-gray-400">+{rx.medicines.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">{format(new Date(rx.createdAt), 'MMM dd, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}