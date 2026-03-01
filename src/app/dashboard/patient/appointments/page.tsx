"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Calendar, Clock, User as UserIcon, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function BookAppointmentPage() {
  const router = useRouter();
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    timeSlot: "",
    symptoms: ""
  });
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // When doctor or date changes, fetch available slots
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableSlots(formData.doctorId, formData.date);
    } else {
      setAvailableSlots([]);
    }
  }, [formData.doctorId, formData.date]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/users/doctors");
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err: any) {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (doctorId: string, date: string) => {
    setSlotsLoading(true);
    setFormData(prev => ({ ...prev, timeSlot: "" })); // reset slot
    try {
      const res = await api.get(`/appointments/available-slots/${doctorId}/${date}`);
      if (res.data.success) {
        setAvailableSlots(res.data.availableSlots);
      }
    } catch (err) {
      console.error("Failed to load slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date || !formData.timeSlot || !formData.symptoms) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitLoading(true);
    setError("");

    try {
      const res = await api.post("/appointments", {
        doctorId: formData.doctorId,
        date: formData.date,
        timeSlot: formData.timeSlot,
        symptoms: formData.symptoms
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/patient");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  // Get minimum date (today) for date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
        <button 
          onClick={() => router.push("/dashboard/patient")}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6 md:p-8">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Appointment Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your appointment has been successfully booked. Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Select Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                required
              >
                <option value="" disabled>Choose a specialist...</option>
                {doctors.map((doc: any) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} - {doc.specialization || "General"}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Select Date
              </label>
              <input
                type="date"
                name="date"
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Time Slot Selection */}
            {formData.doctorId && formData.date && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Available Time Slots
                </label>
                
                {slotsLoading ? (
                  <div className="flex items-center text-sm text-gray-500 py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Loading slots...
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableSlots.map((slot: string) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                        className={`py-2 px-3 text-sm rounded-lg border font-medium transition
                          ${formData.timeSlot === slot 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
                    No available slots for this date. Please select another date.
                  </div>
                )}
              </div>
            )}

            {/* Symptoms / Reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Reason for Visit / Symptoms
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Briefly describe your symptoms or reason for the appointment..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitLoading || !formData.timeSlot}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Booking...</span>
                </>
              ) : (
                <span>Confirm Appointment</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
