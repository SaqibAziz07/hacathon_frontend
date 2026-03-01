"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, Calendar, FileText, Download } from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // First get user profile to ensure patient record exists
      const userRes = await api.get("/auth/me");
      if (userRes.data.success && userRes.data.user.role === 'patient') {
        // Patients can see their appointments history
        const aptRes = await api.get("/appointments/patient/history");
        // Patients can see their prescriptions
        const presRes = await api.get("/prescriptions");

        setHistory({
          appointments: aptRes.data.appointments || [],
          prescriptions: presRes.data.prescriptions || []
        });
      }
    } catch (error) {
      console.error("Error fetching patient history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  const { appointments, prescriptions } = history || { appointments: [], prescriptions: [] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
        <button 
          onClick={() => router.push("/dashboard/patient/appointments")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors"
        >
          Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appointments Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gray-400" />
              Appointment History
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-0">
            {appointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {appointments.map((apt: any) => (
                  <li key={apt._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">
                          Dr. {apt.doctorId?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          Reason: {apt.symptoms}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                        {apt.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No appointment history found.
              </div>
            )}
          </div>
        </div>

        {/* Prescriptions Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-gray-400" />
              My Prescriptions
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-0">
            {prescriptions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {prescriptions.map((px: any) => (
                  <li key={px._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(px.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Dr. {px.doctorId?.name} • {px.diagnosis}
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          {px.medicines.length} Medicine(s) prescribed
                        </div>
                      </div>
                      {px.pdfUrl && (
                        <a 
                          href={`http://localhost:5000${px.pdfUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 flex-shrink-0 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          <Download className="mr-1.5 h-4 w-4 text-gray-400" />
                          Download PDF
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No prescriptions found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
