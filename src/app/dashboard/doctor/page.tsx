"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Calendar, Activity, CheckCircle, FileText, Brain, Clock, X, Plus, Trash2, AlertCircle, XCircle, Search } from "lucide-react";

export default function DoctorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  // Modal & Selection States
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Prescription Form State
  const [prescription, setPrescription] = useState({
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    instructions: "",
    followUpDate: "",
    aiSummary: ""
  });

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

  const handleViewAI = async (appointment: any) => {
    setSelectedAppointment(appointment);
    try {
      // Fetch the latest diagnosis log for this patient
      const res = await api.get(`/ai/history/${appointment.patientId._id}`);
      if (res.data.success && res.data.history.length > 0) {
        setAiResult(res.data.history[0].aiResponse);
        setIsAIModalOpen(true);
      } else {
        alert("No AI diagnosis found for this patient.");
      }
    } catch (error) {
      console.error("Error fetching AI result:", error);
    }
  };

  const openPrescriptionForm = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsPrescriptionModalOpen(true);
  };

  const handleAddMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [...prescription.medicines, { name: "", dosage: "", frequency: "", duration: "" }]
    });
  };

  const handleRemoveMedicine = (index: number) => {
    const newMedicines = prescription.medicines.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medicines: newMedicines });
  };

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/prescriptions", {
        patientId: selectedAppointment.patientId._id,
        appointmentId: selectedAppointment._id,
        ...prescription
      });
      if (res.data.success) {
        await handleUpdateStatus(selectedAppointment._id, 'completed');
        setIsPrescriptionModalOpen(false);
        setPrescription({
          medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
          instructions: "",
          followUpDate: "",
          aiSummary: ""
        });
      }
    } catch (error) {
      alert("Error saving prescription");
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
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
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
                       {apt.status === 'checked-in' && (
                         <button 
                           onClick={() => handleUpdateStatus(apt._id, 'in-consultation')}
                           className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 shadow-sm text-xs font-medium rounded bg-white hover:bg-blue-50 focus:outline-none"
                         >
                           Start Consultation
                         </button>
                       )}
                       {apt.status === 'in-consultation' && (
                         <>
                           <button 
                             onClick={() => handleViewAI(apt)}
                             className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-purple-600 shadow-sm text-xs font-medium rounded bg-white hover:bg-purple-50"
                           >
                             <Brain className="h-3 w-3 mr-1" /> AI Asst
                           </button>
                           <button 
                             onClick={() => openPrescriptionForm(apt)}
                             className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                           >
                             <FileText className="h-3 w-3 mr-1" /> Prescribe
                           </button>
                         </>
                       )}
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            apt.status === 'in-consultation' ? 'bg-blue-100 text-blue-800' :
                            apt.status === 'checked-in' ? 'bg-purple-100 text-purple-800' :
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

      {/* Prescription Modal */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold">Write Prescription</h2>
                <p className="text-sm text-gray-500">Patient: {selectedAppointment?.patientId?.name}</p>
              </div>
              <button onClick={() => setIsPrescriptionModalOpen(false)}><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handlePrescriptionSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Medicines</h3>
                  <button type="button" onClick={handleAddMedicine} className="text-sm text-blue-600 flex items-center hover:underline">
                    <Plus className="h-4 w-4 mr-1" /> Add Medicine
                  </button>
                </div>
                {prescription.medicines.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 pb-4 border-b border-gray-50 last:border-0 relative">
                    <input placeholder="Medicine Name" required value={med.name} onChange={e => {
                      const newMeds = [...prescription.medicines];
                      newMeds[idx].name = e.target.value;
                      setPrescription({...prescription, medicines: newMeds});
                    }} className="border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={e => {
                      const newMeds = [...prescription.medicines];
                      newMeds[idx].dosage = e.target.value;
                      setPrescription({...prescription, medicines: newMeds});
                    }} className="border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Freq (e.g. 1-0-1)" value={med.frequency} onChange={e => {
                      const newMeds = [...prescription.medicines];
                      newMeds[idx].frequency = e.target.value;
                      setPrescription({...prescription, medicines: newMeds});
                    }} className="border rounded px-2 py-1.5 text-sm" />
                    <div className="flex space-x-2">
                       <input placeholder="Duration" value={med.duration} onChange={e => {
                        const newMeds = [...prescription.medicines];
                        newMeds[idx].duration = e.target.value;
                        setPrescription({...prescription, medicines: newMeds});
                      }} className="border rounded px-2 py-1.5 text-sm flex-1" />
                      {prescription.medicines.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMedicine(idx)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                <textarea value={prescription.instructions} onChange={e => setPrescription({...prescription, instructions: e.target.value})} className="w-full border rounded-md p-2 text-sm" rows={3} placeholder="Dietary advice, rest, etc."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                  <input type="date" value={prescription.followUpDate} onChange={e => setPrescription({...prescription, followUpDate: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">AI Summary (Optional)</label>
                  <input type="text" value={prescription.aiSummary} onChange={e => setPrescription({...prescription, aiSummary: e.target.value})} className="mt-1 block w-full border rounded-md px-3 py-2 text-sm" placeholder="AI insights for patient" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={() => setIsPrescriptionModalOpen(false)} className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-4">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition-all font-bold">Complete & Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold">AI Diagnostic Assistant</h2>
              </div>
              <button onClick={() => setIsAIModalOpen(false)}><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Risk Assessment */}
              <div className={`p-4 rounded-lg flex items-start space-x-3 ${
                (aiResult?.riskAssessment?.level || aiResult?.riskLevel) === 'high' ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'
              }`}>
                <AlertCircle className={`h-5 w-5 mt-0.5 ${(aiResult?.riskAssessment?.level || aiResult?.riskLevel) === 'high' ? 'text-red-600' : 'text-blue-600'}`} />
                <div>
                  <h3 className={`font-bold ${(aiResult?.riskAssessment?.level || aiResult?.riskLevel) === 'high' ? 'text-red-800' : 'text-blue-800'}`}>
                    Risk Level: {aiResult?.riskAssessment?.level || aiResult?.riskLevel} ({aiResult?.riskAssessment?.confidence || aiResult?.aiConfidence || '0'}%)
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{aiResult?.summary}</p>
                </div>
              </div>

              {/* Possible Conditions */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Possible Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiResult?.possibleConditions?.map((cond: any, idx: number) => (
                    <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{cond.name || cond.condition}</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{cond.match || cond.matchScale}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{cond.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags & Care Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="font-bold text-red-800 mb-2 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" /> Red Flags
                  </h3>
                  <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                    {aiResult?.redFlags?.map((flag: string, idx: number) => <li key={idx}>{flag}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Suggested Care
                  </h3>
                  <ul className="list-disc list-inside text-xs text-green-700 space-y-1">
                    {aiResult?.carePlan?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="text-xs text-gray-400 italic text-center">
                Note: This is an AI-generated analysis. Please verify all clinical decisions independently.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
