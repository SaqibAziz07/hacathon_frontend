'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
    if (!loading && user && user.role !== 'patient') {
      router.replace(`/dashboard/${user.role}`)
    }
  }, [user, loading])

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
    </div>
  )

  return <>{children}</>
}