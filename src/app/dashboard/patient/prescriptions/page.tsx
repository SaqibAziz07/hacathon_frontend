'use client'
import { useEffect, useState } from 'react'
import { prescriptionAPI } from '@/lib/api'
import { format } from 'date-fns'
import { FileText, Download, Eye, Pill, X, Search, MoreHorizontal } from 'lucide-react'
import type { Prescription, Medicine } from '@/types'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import toast from 'react-hot-toast'

function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const colors = ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b']
  const c = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default function PatientPrescriptions() {
  const [prescriptions, setP] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Prescription | null>(null)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    prescriptionAPI.getAll()
      .then(r => setP(r.data?.prescriptions ?? r.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const shown = prescriptions.filter(p => {
    const doc = typeof p.doctorId === 'object' ? (p.doctorId as any).name : ''
    return doc.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase())
  })

  const downloadPDF = (p: Prescription) => {
    const doc = new jsPDF()
    const doctorName = typeof p.doctorId === 'object' ? (p.doctorId as any).name : 'Doctor'
    doc.setFontSize(20); doc.setTextColor(59, 130, 246)
    doc.text('CliniqAI — Prescription', 14, 20)
    doc.setFontSize(11); doc.setTextColor(80)
    doc.text(`Doctor: Dr. ${doctorName}`, 14, 32)
    doc.text(`Date: ${format(new Date(p.createdAt), 'PPP')}`, 14, 39)
    doc.text(`Diagnosis: ${p.diagnosis}`, 14, 46)
    autoTable(doc, {
      startY: 55,
      head: [['Medicine', 'Dosage', 'Frequency', 'Duration']],
      body: p.medicines.map(m => [m.name, m.dosage, m.frequency, m.duration]),
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    })
    if (p.instructions) {
      const y = (doc as any).lastAutoTable.finalY + 10
      doc.setFontSize(11); doc.setTextColor(60)
      doc.text(`Instructions: ${p.instructions}`, 14, y)
    }
    doc.save(`prescription-${format(new Date(p.createdAt), 'yyyy-MM-dd')}.pdf`)
    toast.success('PDF downloaded!')
  }

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
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Prescriptions</h1>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card Header */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-900">All Prescriptions</h2>
            <p className="text-xs text-gray-400 mt-0.5">{prescriptions.length} total records</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-[220px]">
            <Search size={14} className="text-gray-400" />
            <input type="text" placeholder="Search doctor, diagnosis..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-900 outline-none w-full placeholder-gray-400" />
          </div>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {['Doctor', 'Diagnosis', 'Medicines', 'Date', 'Actions'].map(h => (
            <p key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-medium text-gray-500">No prescriptions found</p>
            <p className="text-xs mt-1">Your prescriptions will appear here</p>
          </div>
        ) : (
          shown.map((p, i) => {
            const docName = typeof p.doctorId === 'object' ? (p.doctorId as any).name : 'Doctor'
            return (
              <div key={p._id}
                className={`grid grid-cols-5 gap-4 px-5 py-4 items-center hover:bg-gray-50/80 transition-colors group ${i < shown.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <Avatar name={docName} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Dr. {docName}</p>
                    <p className="text-xs text-gray-400">Physician</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">{p.diagnosis}</p>
                <div className="flex flex-wrap gap-1">
                  {p.medicines.slice(0, 2).map((m, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{m.name}</span>
                  ))}
                  {p.medicines.length > 2 && <span className="text-xs text-gray-400">+{p.medicines.length - 2}</span>}
                </div>
                <p className="text-sm text-gray-400">{format(new Date(p.createdAt), 'MMM dd, yyyy')}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelected(p)}
                    className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => downloadPDF(p)}
                    className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                    <Download size={14} />
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg text-gray-300 hover:text-gray-500 flex items-center justify-center transition-opacity">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText size={17} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Prescription Details</p>
                  <p className="text-xs text-gray-400">{format(new Date(selected.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={15} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Doctor', value: `Dr. ${typeof selected.doctorId === 'object' ? (selected.doctorId as any).name : '—'}` },
                  { label: 'Diagnosis', value: selected.diagnosis },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Medicines */}
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  {['Medicine', 'Dosage', 'Frequency', 'Duration'].map(h => (
                    <p key={h} className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{h}</p>
                  ))}
                </div>
                {selected.medicines.map((m: Medicine, i: number) => (
                  <div key={i} className={`grid grid-cols-4 gap-2 px-4 py-3 ${i < selected.medicines.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <Pill size={12} className="text-blue-500" />
                      <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{m.dosage}</span>
                    <span className="text-sm text-gray-500">{m.frequency}</span>
                    <span className="text-sm text-gray-500">{m.duration}</span>
                  </div>
                ))}
              </div>

              {selected.instructions && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">Instructions</p>
                  <p className="text-sm text-amber-800">{selected.instructions}</p>
                </div>
              )}

              {selected.aiExplanation && (
                <div className="bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 mb-1">🧠 AI Explanation</p>
                  <p className="text-sm text-blue-900 leading-relaxed">{selected.aiExplanation}</p>
                </div>
              )}

              <button onClick={() => downloadPDF(selected)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                <Download size={15} /> Download PDF
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}