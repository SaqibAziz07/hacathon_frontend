"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Activity, ShieldCheck, Stethoscope, ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-50">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">Smart Clinic SaaS</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden md:block">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden md:block">Pricing</Link>
          
          {user ? (
            <Link 
              href={`/dashboard/${user.role === 'admin' ? 'admin' : user.role === 'doctor' ? 'doctor' : user.role === 'receptionist' ? 'receptionist' : 'patient'}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <div className="flex space-x-3">
              <Link 
                href="/login" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                Sign In
              </Link>
              <Link 
                href="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          The Future of <span className="text-blue-600">Clinical Management</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto mb-10">
          An all-in-one AI-powered SaaS platform for modern medical practices. Streamline your workflow from appointment booking to intelligent diagnosis.
        </p>
        
        <div className="flex justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
           {!user && (
             <Link 
               href="/login" 
               className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition shadow-lg"
             >
               Start Free Trial
             </Link>
           )}
           <a 
             href="#features" 
             className="inline-flex justify-center items-center px-8 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition"
           >
             View Demo
           </a>
        </div>
      </main>

      {/* Features Showcase */}
      <section id="features" className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">AI-Powered Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A smarter way to manage patients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Symptom Checker</h3>
              <p className="text-gray-500">Intelligent differential diagnosis assisting doctors. Predicts risk factors before they become emergencies.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Analytics</h3>
              <p className="text-gray-500">Track clinic performance, patient intake, and revenue predictions in one cohesive dashboard interface.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">RBAC Security</h3>
              <p className="text-gray-500">Strict Role-Based Access Control ensuring receptionist, doctor, patient, and admin portals are completely securely segregated.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 md:px-12 text-center text-sm text-gray-500">
        <p>&copy; 2026 Smart Clinic SaaS. Final Hackathon Submission.</p>
      </footer>
    </div>
  );
}
