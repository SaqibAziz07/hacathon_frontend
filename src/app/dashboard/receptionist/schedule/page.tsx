'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay, isToday, addWeeks, subWeeks } from 'date-fns'

type Appointment = {
  _id: string
  patientId: { name: string } | null
  doctorId: { name: string } | null
  date: string; timeSlot: string; status: string
}

const statusColors: Record<string, { color: string; bg: string; border: string }> = {
  pending:           { color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
  confirmed:         { color: '#2563eb', bg: '#eff6ff', border: '#93c5fd' },
  'checked-in':      { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  'in-consultation': { color: '#0891b2', bg: '#ecfeff', border: '#67e8f9' },
  completed:         { color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
  cancelled:         { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
}

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00']

export default function ReceptionistSchedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekEnd  = addDays(weekStart, 6)

  useEffect(() => { fetchWeek() }, [weekStart])

  const fetchWeek = async () => {
    setLoading(true)
    try {
      const start = format(weekStart, 'yyyy-MM-dd')
      const end   = format(weekEnd,   'yyyy-MM-dd')
      const res = await api.get(`/appointments?limit=200`)
      if (res.data.success) setAppointments(res.data.appointments)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const getApts = (day: Date, slot: string) =>
    appointments.filter(a => {
      const aptDate = new Date(a.date)
      return isSameDay(aptDate, day) && a.timeSlot?.startsWith(slot.slice(0,5))
    })

  const dayTotals = weekDays.map(d => appointments.filter(a => isSameDay(new Date(a.date), d)).length)

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Weekly Schedule</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>
            {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setWeekStart(w => subWeeks(w, 1))}
            style={{ width: 36, height: 36, border: '1.5px solid #e2e8f0', borderRadius: 9, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            style={{ padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
            Today
          </button>
          <button onClick={() => setWeekStart(w => addWeeks(w, 1))}
            style={{ width: 36, height: 36, border: '1.5px solid #e2e8f0', borderRadius: 9, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'auto' }}>
        {/* Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(7, 1fr)', borderBottom: '1.5px solid #f1f5f9' }}>
          <div style={{ padding: '12px 0', borderRight: '1px solid #f1f5f9' }} />
          {weekDays.map((day, i) => (
            <div key={i} style={{
              padding: '14px 10px', textAlign: 'center', borderRight: i < 6 ? '1px solid #f1f5f9' : 'none',
              background: isToday(day) ? '#f0f9ff' : 'white'
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {format(day, 'EEE')}
              </div>
              <div style={{
                fontSize: 18, fontWeight: 700, marginTop: 2,
                color: isToday(day) ? '#0284c7' : '#0f172a',
                width: 34, height: 34, borderRadius: '50%',
                background: isToday(day) ? '#e0f2fe' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 0'
              }}>
                {format(day, 'd')}
              </div>
              {dayTotals[i] > 0 && (
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{dayTotals[i]} apt{dayTotals[i] > 1 ? 's' : ''}</div>
              )}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          TIME_SLOTS.map(slot => (
            <div key={slot} style={{ display: 'grid', gridTemplateColumns: '72px repeat(7, 1fr)', borderBottom: '1px solid #f8fafc', minHeight: 60 }}>
              {/* Time label */}
              <div style={{ padding: '8px 10px', borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{slot}</span>
              </div>
              {weekDays.map((day, i) => {
                const apts = getApts(day, slot)
                return (
                  <div key={i} style={{
                    padding: '4px 6px', borderRight: i < 6 ? '1px solid #f1f5f9' : 'none',
                    background: isToday(day) ? '#fafeff' : 'white', minHeight: 60
                  }}>
                    {apts.map(apt => {
                      const sc = statusColors[apt.status] ?? { color: '#6b7280', bg: '#f3f4f6', border: '#e2e8f0' }
                      return (
                        <div key={apt._id} style={{
                          background: sc.bg, border: `1.5px solid ${sc.border}`, borderRadius: 7,
                          padding: '4px 7px', marginBottom: 3, cursor: 'default'
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: sc.color, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <User size={9} /> {apt.patientId?.name ?? '?'}
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
                            Dr. {apt.doctorId?.name ?? '—'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {Object.entries(statusColors).map(([status, sc]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: sc.bg, border: `1.5px solid ${sc.border}` }} />
            <span style={{ fontSize: 11, color: '#64748b', textTransform: 'capitalize' }}>{status.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}