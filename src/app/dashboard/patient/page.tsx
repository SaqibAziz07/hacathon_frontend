import { redirect } from 'next/navigation'

export default function PatientRoot() {
  redirect('/dashboard/patient/dashboard')
}