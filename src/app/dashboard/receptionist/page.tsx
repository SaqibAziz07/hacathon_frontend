"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Calendar, PlusCircle, Search, X, Check, Clock } from "lucide-react";

export default function ReceptionistDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form States
  const [newPatient, setNewPatient] = useState({
    name: "", age: "", gender: "Male", contact: "", address: "", 
    bloodGroup: "O+", emergencyContact: "", insuranceProvider: "", 
    medicalHistory: "", allergies: ""
  });

  const [newAppointment, setNewAppointment] = useState({
    patientId: "", doctorId: "", date: new Date().toISOString().split('T')[0], 
    timeSlot: "09:00", symptoms: "", appointmentType: "New"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ptRes, aptRes, docRes] = await Promise.all([
        api.get("/patients"),
        api.get("/appointments"),
        api.get("/admin/users?role=doctor&status=active")
      ]);
      if (ptRes.data.success) setPatients(ptRes.data.patients);
      if (aptRes.data.success) setAppointments(aptRes.data.appointments);
      if (docRes.data.success) setDoctors(docRes.data.users);
    } catch (error) {
      console.error("Error fetching receptionist data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/patients", newPatient);
      if (res.data.success) {
        setIsRegisterModalOpen(false);
        setNewPatient({
          name: "", age: "", gender: "Male", contact: "", address: "", 
          bloodGroup: "O+", emergencyContact: "", insuranceProvider: "", 
          medicalHistory: "", allergies: ""
        });
        fetchData();
      }
    } catch (error) {
      alert("Error registering patient");
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/appointments", newAppointment);
      if (res.data.success) {
        setIsBookingModalOpen(false);
        setNewAppointment({
          patientId: "", doctorId: "", date: new Date().toISOString().split('T')[0], 
          timeSlot: "09:00", symptoms: "", appointmentType: "New"
        });
        fetchData();
      }
    } catch (error) {
      alert("Error booking appointment");
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      const res = await api.put(`/appointments/${appointmentId}/status`, { status: 'checked-in' });
      if (res.data.success) {
        fetchData();
      }
    } catch (error) {
      alert("Error checking in");
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.contact.includes(searchQuery) ||
    p.mrNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium shadow-sm transition-colors flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Register Patient
          </button>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
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
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {apt.timeSlot} • Dr. {apt.doctorId?.name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      Patient: <span className="text-gray-900 font-medium">{apt.patientId?.name}</span>
                    </p>
                    <p className="text-xs text-gray-400">MR#: {apt.patientId?.mrNumber || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        apt.status === 'checked-in' ? 'bg-purple-100 text-purple-800' :
                        apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {apt.status}
                    </span>
                    {apt.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCheckIn(apt._id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded border border-green-200"
                        title="Check In"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
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
            <div className="mt-2 relative">
              <input 
                type="text" 
                placeholder="Search Name / Phone / MR#" 
                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="px-4 py-2 sm:p-0 h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {filteredPatients.map((pt: any) => (
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

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Register New Patient</h2>
              <button onClick={() => setIsRegisterModalOpen(false)}><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleRegisterPatient} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" required value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input type="number" required value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input type="text" required value={newPatient.contact} onChange={e => setNewPatient({...newPatient, contact: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <select value={newPatient.bloodGroup} onChange={e => setNewPatient({...newPatient, bloodGroup: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" rows={2}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input type="text" value={newPatient.emergencyContact} onChange={e => setNewPatient({...newPatient, emergencyContact: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
                  <input type="text" value={newPatient.insuranceProvider} onChange={e => setNewPatient({...newPatient, insuranceProvider: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Register Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Book Appointment</h2>
              <button onClick={() => setIsBookingModalOpen(false)}><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Patient</label>
                <select required value={newAppointment.patientId} onChange={e => setNewAppointment({...newAppointment, patientId: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2">
                  <option value="">Choose Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.mrNumber})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                <select required value={newAppointment.doctorId} onChange={e => setNewAppointment({...newAppointment, doctorId: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2">
                  <option value="">Choose Doctor</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" required value={newAppointment.date} onChange={e => setNewAppointment({...newAppointment, date: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                  <input type="time" required value={newAppointment.timeSlot} onChange={e => setNewAppointment({...newAppointment, timeSlot: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                <input type="text" value={newAppointment.symptoms} onChange={e => setNewAppointment({...newAppointment, symptoms: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2" placeholder="Cough, fever, etc." />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsBookingModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Book Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
