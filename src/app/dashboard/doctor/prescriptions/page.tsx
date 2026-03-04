'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import { Search, Plus, X, Eye, Trash2, FileText, Pill } from 'lucide-react'
import { format } from 'date-fns'

type Medicine = { name: string; dosage: string; form: string; frequency: string; duration: string; instructions: string; beforeFood: boolean }
type Prescription = {
  _id: string
  patientId: { name: string; age?: number } | null
  diagnosis: string; symptoms: string
  medicines: Medicine[]; createdAt: string; followUpDate?: string
}
type Patient = { _id: string; name: string; mrNumber?: string }

const emptyMed = (): Medicine => ({ name: '', dosage: '', form: 'Tablet', frequency: '', duration: '', instructions: '', beforeFood: false })

const inputSt: React.CSSProperties = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0f172a' }
const labelSt: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' }

function PrescriptionsInner() {
  const searchParams = useSearchParams()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [viewRx, setViewRx] = useState<Prescription | null>(null)

  const [form, setForm] = useState({
    patientId: searchParams.get('patientId') ?? '',
    appointmentId: searchParams.get('aptId') ?? '',
    diagnosis: '', symptoms: '', advice: '', followUpDate: '',
    medicines: [emptyMed()],
  })

  useEffect(() => {
    fetchAll()
    if (searchParams.get('aptId')) setCreateOpen(true)
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [rxRes, ptRes] = await Promise.all([api.get('/prescriptions?limit=50'), api.get('/patients?limit=100')])
      if (rxRes.data.success) setPrescriptions(rxRes.data.prescriptions)
      if (ptRes.data.success) setPatients(ptRes.data.patients)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { ...form, medicines: form.medicines.filter(m => m.name.trim()) }
      const res = await api.post('/prescriptions', payload)
      if (res.data.success) { setCreateOpen(false); fetchAll() }
    } catch { alert('Failed to create prescription') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this prescription?')) return
    try {
      await api.delete(`/prescriptions/${id}`)
      setPrescriptions(prev => prev.filter(p => p._id !== id))
    } catch { alert('Delete failed') }
  }

  const addMed = () => setForm(f => ({ ...f, medicines: [...f.medicines, emptyMed()] }))
  const removeMed = (i: number) => setForm(f => ({ ...f, medicines: f.medicines.filter((_, idx) => idx !== i) }))
  const updateMed = (i: number, field: keyof Medicine, val: any) =>
    setForm(f => ({ ...f, medicines: f.medicines.map((m, idx) => idx === i ? { ...m, [field]: val } : m) }))

  const shown = prescriptions.filter(p => {
    const q = search.toLowerCase()
    return !q || (p.patientId?.name ?? '').toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q)
  })

  return (
    <div style={{ padding: 28, background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Prescriptions</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>Create and manage patient prescriptions</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>
          <Plus size={14} /> New Prescription
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or diagnosis…"
          style={{ ...inputSt, paddingLeft: 36, width: '100%' }} />
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : shown.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
            <FileText size={32} style={{ margin: '0 auto 10px', opacity: .4 }} />
            <p style={{ fontSize: 14 }}>No prescriptions found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Patient', 'Diagnosis', 'Medicines', 'Date', 'Follow-up', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((rx, i) => (
                <tr key={rx._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{rx.patientId?.name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{rx.patientId?.age ? `${rx.patientId.age} yrs` : ''}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#0f172a', maxWidth: 180 }}>{rx.diagnosis}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {rx.medicines?.slice(0, 2).map((m, j) => (
                        <span key={j} style={{ fontSize: 11, background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Pill size={9} />{m.name}
                        </span>
                      ))}
                      {(rx.medicines?.length ?? 0) > 2 && <span style={{ fontSize: 11, color: '#94a3b8' }}>+{rx.medicines.length - 2}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {rx.createdAt ? format(new Date(rx.createdAt), 'MMM dd, yyyy') : '—'}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {rx.followUpDate ? format(new Date(rx.followUpDate), 'MMM dd, yyyy') : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setViewRx(rx)} style={{ padding: '5px 10px', background: '#f1f5f9', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}>
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => handleDelete(rx._id)} style={{ padding: '5px 10px', background: '#fee2e2', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#dc2626' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {createOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 680, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>New Prescription</h2>
              <button onClick={() => setCreateOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelSt}>Patient</label>
                  <select required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} style={inputSt}>
                    <option value="">Select patient…</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Diagnosis</label>
                  <input required value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} style={inputSt} placeholder="e.g. Viral fever" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelSt}>Symptoms</label>
                  <input required value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} style={inputSt} placeholder="e.g. Fever, cough, fatigue" />
                </div>
              </div>

              {/* Medicines */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ ...labelSt, marginBottom: 0 }}>Medicines</label>
                  <button type="button" onClick={addMed} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#f1f5f9', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', color: '#0f172a' }}>
                    <Plus size={12} /> Add
                  </button>
                </div>
                {form.medicines.map((med, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 10, border: '1.5px solid #f1f5f9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={labelSt}>Name</label>
                        <input required value={med.name} onChange={e => updateMed(i, 'name', e.target.value)} style={inputSt} placeholder="e.g. Paracetamol" />
                      </div>
                      <div>
                        <label style={labelSt}>Dosage</label>
                        <input required value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} style={inputSt} placeholder="e.g. 500mg" />
                      </div>
                      <div>
                        <label style={labelSt}>Form</label>
                        <select value={med.form} onChange={e => updateMed(i, 'form', e.target.value)} style={inputSt}>
                          {['Tablet','Capsule','Syrup','Injection','Cream','Drops','Other'].map(f => <option key={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelSt}>Frequency</label>
                        <input required value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} style={inputSt} placeholder="e.g. Twice daily" />
                      </div>
                      <div>
                        <label style={labelSt}>Duration</label>
                        <input required value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)} style={inputSt} placeholder="e.g. 5 days" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
                          <input type="checkbox" checked={med.beforeFood} onChange={e => updateMed(i, 'beforeFood', e.target.checked)} />
                          Before food
                        </label>
                        {form.medicines.length > 1 && (
                          <button type="button" onClick={() => removeMed(i)} style={{ padding: '6px 8px', background: '#fee2e2', border: 'none', borderRadius: 7, cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label style={labelSt}>Instructions</label>
                      <input value={med.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)} style={inputSt} placeholder="Additional instructions…" />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelSt}>Advice</label>
                  <textarea value={form.advice} onChange={e => setForm({ ...form, advice: e.target.value })} rows={2} style={{ ...inputSt, resize: 'vertical' }} placeholder="Rest, diet, etc." />
                </div>
                <div>
                  <label style={labelSt}>Follow-up Date</label>
                  <input type="date" value={form.followUpDate} onChange={e => setForm({ ...form, followUpDate: e.target.value })} style={inputSt} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button type="button" onClick={() => setCreateOpen(false)} style={{ padding: '9px 18px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>Cancel</button>
                <button type="submit" style={{ padding: '9px 22px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>Save Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewRx && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 18, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>Prescription Details</h2>
              <button onClick={() => setViewRx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{viewRx.patientId?.name ?? '—'}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{viewRx.createdAt ? format(new Date(viewRx.createdAt), 'MMM dd, yyyy') : '—'}</div>
              </div>
              {[['Diagnosis', viewRx.diagnosis], ['Symptoms', viewRx.symptoms]].map(([l, v]) => (
                <div key={l} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 13, color: '#0f172a' }}>{v}</div>
                </div>
              ))}
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, marginTop: 16 }}>Medicines</div>
              {viewRx.medicines?.map((m, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{m.name} — {m.dosage} ({m.form})</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{m.frequency} · {m.duration}{m.beforeFood ? ' · Before food' : ''}</div>
                  {m.instructions && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{m.instructions}</div>}
                </div>
              ))}
              {viewRx.followUpDate && (
                <div style={{ marginTop: 12, fontSize: 13, color: '#0f172a' }}>
                  <span style={{ fontWeight: 600 }}>Follow-up:</span> {format(new Date(viewRx.followUpDate), 'MMM dd, yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DoctorPrescriptions() {
  return <Suspense><PrescriptionsInner /></Suspense>
}