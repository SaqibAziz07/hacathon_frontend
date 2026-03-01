"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Calendar, PlusCircle } from "lucide-react";

export default function ReceptionistDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ptRes, aptRes] = await Promise.all([
        api.get("/patients"),
        api.get("/appointments")
      ]);
      if (ptRes.data.success) setPatients(ptRes.data.patients);
      if (aptRes.data.success) setAppointments(aptRes.data.appointments);
    } catch (error) {
      console.error("Error fetching receptionist data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  // Get Today's Appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((apt: any) => apt.date.startsWith(todayStr));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Receptionist Desk</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => alert("Registration system is connected to the backend API but the UI is marked for v2.0 update!")}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium shadow-sm transition-colors flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Register Patient
          </button>
          <button 
            onClick={() => alert("Centralized booking calendar unlocking in v2.0 update!")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors flex items-center"
          >
            <Calendar className="mr-2 h-4 w-4" /> Book Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Schedule */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              Today's Schedule
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {todayApts.length}
              </span>
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-0">
            <ul className="divide-y divide-gray-200">
              {todayApts.length > 0 ? todayApts.map((apt: any) => (
                <li key={apt._id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {apt.timeSlot} • Dr. {apt.doctorId?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Patient: {apt.patientId?.name} ({apt.patientId?.contact})
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {apt.status}
                  </span>
                </li>
              )) : (
                <li className="p-6 text-center text-sm text-gray-500">No appointments today.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Recently Registered Patients */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5 text-gray-400" />
              Patient Directory
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-0 h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {patients.map((pt: any) => (
                <li key={pt._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 relative rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                        {pt.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pt.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        ID: {pt._id.substring(pt._id.length - 6)} • {pt.gender}, {pt.age} yrs
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {pt.contact}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
