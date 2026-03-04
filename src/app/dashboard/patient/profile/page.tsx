'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Shield, Key, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-blue-500" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900 capitalize">{value}</p>
      </div>
    </div>
  )
}

export default function PatientProfile() {
  const { user } = useAuth()
  const [tab, setTab]         = useState<'info' | 'password'>('info')
  const [loading, setLoading] = useState(false)
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match')
    if (pwForm.newPassword.length < 8) return toast.error('Minimum 8 characters required')
    setLoading(true)
    try {
      // replace with actual API call
      await new Promise(r => setTimeout(r, 1000))
      toast.success('Password changed successfully')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4 md:p-7 space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Patient Portal</p>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

        {/* Left — Avatar Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 shadow-lg shadow-blue-100">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-lg font-bold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">{user.email}</p>

          {/* Role badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 capitalize">
            {user.role}
          </span>

          {/* Plan badge */}
          <div className="mt-3 pt-4 border-t border-gray-100">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              user.subscriptionPlan === 'pro'
                ? 'bg-violet-50 text-violet-600 border border-violet-100'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}>
              {user.subscriptionPlan === 'pro' ? '⭐' : '🔹'} {user.subscriptionPlan?.toUpperCase()} Plan
            </span>
          </div>

          {/* Note */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-left">
            <p className="text-xs text-amber-700 leading-relaxed">
              ℹ️ To update your name or email, contact the clinic receptionist.
            </p>
          </div>
        </div>

        {/* Right — Tabs Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
            {([['info', 'Account Info'], ['password', 'Change Password']] as const).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Account Info */}
          {tab === 'info' && (
            <div className="space-y-3">
              <InfoRow icon={User}   label="Full Name"      value={user.name} />
              <InfoRow icon={Mail}   label="Email Address"  value={user.email} />
              <InfoRow icon={Shield} label="Role"           value={user.role} />
              {user.phone && <InfoRow icon={User} label="Phone" value={user.phone} />}
            </div>
          )}

          {/* Change Password */}
          {tab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              {([
                ['currentPassword', 'Current Password'],
                ['newPassword',     'New Password'],
                ['confirmPassword', 'Confirm New Password'],
              ] as const).map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input type="password" required
                    value={pwForm[field]}
                    onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Updating...</>
                  : <><Key size={15} /> Update Password</>
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}