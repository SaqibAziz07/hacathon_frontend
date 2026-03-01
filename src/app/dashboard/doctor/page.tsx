"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Calendar, Activity, CheckCircle } from "lucide-react";

export default function DoctorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, scheduleRes] = await Promise.all([
        api.get("/analytics/doctor"),
        api.get("/appointments/doctor/schedule")
      ]);
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (scheduleRes.data.success) {
        setSchedule(scheduleRes.data.schedule);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTodaySchedule = (): any[] => {
    const today = new Date().toISOString().split('T')[0];
    return schedule[today] || [];
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/appointments/${id}/status`, { status });
      if (res.data.success) {
        fetchData(); // Refresh list
      }
    } catch (error) {
      alert("Error updating status");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  const todayAppointments = getTodaySchedule();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <button 
          onClick={() => alert("Direct prescription writing will be available in the next release! For now, use the AI Symptoms tool.")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors"
        >
          Write Prescription
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Appointments</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.dailyAppointments || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Total</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.monthlyAppointments || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Prescriptions Written</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.prescriptionCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">AI Diagnoses Used</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.aiDiagnosisCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Schedule</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your upcoming appointments for today.</p>
        </div>
        <div className="border-t border-gray-200">
          {todayAppointments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {todayAppointments.map((apt) => (
                <li key={apt._id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {apt.timeSlot}
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        Patient: <span className="font-medium text-gray-900">{apt.patientId?.name || "Unknown"}</span>
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        Symptoms: {apt.symptoms}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                       {apt.status === 'pending' && (
                         <button 
                           onClick={() => handleUpdateStatus(apt._id, 'confirmed')}
                           className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                         >
                           Confirm
                         </button>
                       )}
                       {apt.status === 'confirmed' && (
                         <button 
                           onClick={() => handleUpdateStatus(apt._id, 'completed')}
                           className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                         >
                           Mark Complete
                         </button>
                       )}
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {apt.status}
                        </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No appointments scheduled for today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
