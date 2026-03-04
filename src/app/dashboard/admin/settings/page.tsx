'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Settings, Plus, X, Save } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/admin/settings').then(r => { if (r.data.success) setSettings(r.data.settings) }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { alert('Failed to save') }
    finally { setSaving(false) }
  }

  const inputSt: React.CSSProperties = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }
  const labelSt: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, display: 'block' }

  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Settings size={22} /> System Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>Configure clinic-wide settings</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
        {/* Consultation Fees */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '.05em', fontSize: 11, color: '#94a3b8' }}>Consultation Fees</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelSt}>General Consultation ($)</label>
              <input type="number" value={settings?.consultationFees?.general ?? 0}
                onChange={e => setSettings({ ...settings, consultationFees: { ...settings.consultationFees, general: Number(e.target.value) } })}
                style={inputSt} />
            </div>
            <div>
              <label style={labelSt}>Specialist Consultation ($)</label>
              <input type="number" value={settings?.consultationFees?.specialist ?? 0}
                onChange={e => setSettings({ ...settings, consultationFees: { ...settings.consultationFees, specialist: Number(e.target.value) } })}
                style={inputSt} />
            </div>
          </div>
        </div>

        {/* Appointment Settings */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Appointment Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelSt}>Slot Duration (min)</label>
              <input type="number" value={settings?.appointmentSlots?.duration ?? 30}
                onChange={e => setSettings({ ...settings, appointmentSlots: { ...settings.appointmentSlots, duration: Number(e.target.value) } })}
                style={inputSt} />
            </div>
            <div>
              <label style={labelSt}>Start Time</label>
              <input type="time" value={settings?.appointmentSlots?.startTime ?? '09:00'}
                onChange={e => setSettings({ ...settings, appointmentSlots: { ...settings.appointmentSlots, startTime: e.target.value } })}
                style={inputSt} />
            </div>
            <div>
              <label style={labelSt}>End Time</label>
              <input type="time" value={settings?.appointmentSlots?.endTime ?? '18:00'}
                onChange={e => setSettings({ ...settings, appointmentSlots: { ...settings.appointmentSlots, endTime: e.target.value } })}
                style={inputSt} />
            </div>
          </div>
        </div>

        {/* Departments */}
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Departments</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {(settings?.departments ?? []).map((dept: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', borderRadius: 20, padding: '5px 12px', border: '1.5px solid #e2e8f0' }}>
                <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{dept.name}</span>
                <button type="button" onClick={() => setSettings({ ...settings, departments: settings.departments.filter((_: any, i: number) => i !== idx) })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
                  <X size={13} />
                </button>
              </div>
            ))}
            <button type="button"
              onClick={() => { const name = prompt('Department name:'); if (name) setSettings({ ...settings, departments: [...(settings.departments ?? []), { name, isActive: true }] }) }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f8fafc', border: '1.5px dashed #e2e8f0', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
              <Plus size={13} /> Add Department
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 24px', background: saved ? '#16a34a' : '#0f172a', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer', transition: 'background .3s' }}>
            <Save size={14} /> {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}